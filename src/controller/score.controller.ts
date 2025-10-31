import { Request, Response } from "express";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { geminiLLM, openaiLLM } from "../utils/llmClients";
import prisma from "../utils/prismaClient";


/**
 * POST /score
 * Runs rule-based + AI-based scoring for all leads.
 */
export const scoreCalculator = async (req: Request, res: Response) => {
  console.log(`>> [API]: /api/v1/score`)
  const { llmClient } = req?.body;
  try {
    const offer = await prisma.offer.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!offer) return res.status(400).json({ error: "No offer found." });

    const leads = await prisma.lead.findMany({ where: { intent: null } });
    if (leads.length === 0)
      return res.status(400).json({ error: "No unscored leads found." });

    const results = [];

    for (const lead of leads) {
      // -------- Rule-based Scoring -------- //
      let ruleScore = 0;

      const role = lead.role.toLowerCase();
      if (role.includes("head") || role.includes("chief") || role.includes("founder"))
        ruleScore += 20;
      else if (role.includes("manager") || role.includes("lead") || role.includes("executive"))
        ruleScore += 10;

      const industry = lead.industry?.toLowerCase() || "";
      const ideal = offer.ideal_use_cases.map((i) => i.toLowerCase());
      if (ideal.some((i) => industry.includes(i))) ruleScore += 20;
      else if (ideal.some((i) => industry.split(" ").some((w) => i.includes(w))))
        ruleScore += 10;

      if (lead.name && lead.role && lead.company && lead.industry && lead.location && lead.linkedin_bio) {
        ruleScore += 10;
      }

      // -------- AI-based Scoring -------- //
      const prompt = ChatPromptTemplate.fromTemplate(`
        You are a sales assistant. Given the product details and lead profile, 
        classify the lead's buying intent as High, Medium, or Low and explain why in 1-2 sentences.

        Offer:
        Name: {offer_name}
        Value Props: {offer_props}
        Ideal Use Cases: {offer_uses}

        Lead:
        Name: {lead_name}
        Role: {lead_role}
        Company: {lead_company}
        Industry: {lead_industry}
        Location: {lead_location}
        Bio: {lead_bio}

        Respond ONLY in JSON format:
        {{
          "intent": "High" | "Medium" | "Low",
          "reasoning": "short explanation"
        }}
      `);

      const LLM = ["openAI", "OpenAI", "openai"].includes(llmClient) ? openaiLLM : geminiLLM;
      const chain = prompt.pipe(LLM);

      const aiResponse = await chain.invoke({
        offer_name: offer.name,
        offer_props: offer.value_props.join(", "),
        offer_uses: offer.ideal_use_cases.join(", "),
        lead_name: lead.name,
        lead_role: lead.role,
        lead_company: lead.company,
        lead_industry: lead.industry,
        lead_location: lead.location,
        lead_bio: lead.linkedin_bio,
      });

      let intent = "Medium";
      let reasoning = "Not classified.";
      let aiPoints = 30;

      try {
        // ✅ Extract text content safely from LangChain response
        let rawText = "";

        if (typeof aiResponse.content === "string") {
          rawText = aiResponse.content;
        } else if (Array.isArray(aiResponse.content)) {
          // when content is an array of text blocks
          rawText = aiResponse.content
            .map((block: any) => (block?.text ? block.text : block?.toString?.() || ""))
            .join(" ");
        } else {
          rawText = aiResponse?.toString?.() || "";
        }

        // ✅ Remove Markdown-style code block formatting
        rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

        // ✅ Parse cleaned JSON
        const parsed = JSON.parse(rawText);

        intent = parsed.intent ?? intent;
        reasoning = parsed.reasoning ?? reasoning;

        if (intent === "High") aiPoints = 50;
        else if (intent === "Low") aiPoints = 10;

      } catch (e) {
        console.warn("⚠️ AI response parsing failed:", aiResponse.content);
      }

      const finalScore = ruleScore + aiPoints;

      const updated = await prisma.lead.update({
        where: { id: lead.id },
        data: { intent, score: finalScore, reasoning },
      });

      results.push(updated);
    }

    console.log(`>> [API]: /api/v1/score | [STATUS]: Leads scored: ${JSON.stringify(results)}`);
    return res.json({ message: "Leads scored successfully ✅", results });
  } catch (error) {
    console.error("❌ Error scoring leads:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
