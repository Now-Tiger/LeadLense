import { config } from "dotenv";
import prisma from "./utils/prismaClient";

config();

const offers = [
  {
    name: "AI Outreach Automation",
    value_props: ["24/7 outreach", "6x more meetings"],
    ideal_use_cases: ["B2B SaaS mid-market"],
  },
  {
    name: "Lead Scoring Optimizer",
    value_props: ["Intent-based ranking", "Faster conversions"],
    ideal_use_cases: ["Growth-stage startups", "B2B SaaS sales teams"],
  },
];

const leads = [
  {
    name: "Ava Patel",
    role: "Head of Growth",
    company: "FlowMetrics",
    industry: "B2B SaaS",
    location: "New York",
    linkedin_bio: "Experienced growth leader scaling mid-market SaaS products.",
    intent: "High",
    score: 90,
    reasoning: "Decision-maker in a SaaS mid-market firm matching ICP.",
  },
  {
    name: "Rahul Mehta",
    role: "Marketing Executive",
    company: "AdSpark",
    industry: "Advertising",
    location: "Delhi",
    linkedin_bio: "Focused on digital campaigns for consumer brands.",
    intent: "Medium",
    score: 65,
    reasoning:
      "Influencer role; industry partially aligned with offer use cases.",
  },
  {
    name: "Sophia Zhang",
    role: "CTO",
    company: "DataLytix",
    industry: "B2B SaaS",
    location: "San Francisco",
    linkedin_bio: "Driving AI adoption for SaaS automation tools.",
    intent: "High",
    score: 95,
    reasoning:
      "CTO and strong ICP match; clear technical alignment with offer.",
  },
  {
    name: "Lucas Silva",
    role: "Sales Associate",
    company: "CloudEdge",
    industry: "Cloud Computing",
    location: "São Paulo",
    linkedin_bio: "Helps SMBs adopt scalable cloud solutions.",
    intent: "Low",
    score: 40,
    reasoning:
      "Entry-level role; not a direct decision-maker despite tech overlap.",
  },
  {
    name: "Emily Carter",
    role: "Founder",
    company: "GreenPulse",
    industry: "CleanTech",
    location: "London",
    linkedin_bio: "Building sustainable tech ventures in energy efficiency.",
    intent: "Medium",
    score: 70,
    reasoning: "Decision-maker but industry slightly outside primary ICP.",
  },
];

async function main() {
  console.log("🌱 Starting database seeding...");
  for (const offer of offers) {
    // insert all offers in the offer table
    await prisma.offer.create({ data: offer });
  }

  console.log(`📦 Seeded ${offers.length} offers.`);

  for (const lead of leads) {
    // Insert all leads
    await prisma.lead.create({ data: lead });
  }

  console.log(`📦 Seeded ${leads.length} leads successfully.`);
  console.log("🎉 Database seeding completed successfully!\n");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
