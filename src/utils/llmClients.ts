import * as dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";

// Load environment variables `.env` file
dotenv.config();
const geminiKey = process.env.GEMINI_API_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

// Initialize the Gemini 2.5 Flash model
export const geminiLLM = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0.6, // I want my llm to be lil creative/critic (only used in dev)
  maxRetries: 2,
  apiKey: geminiKey,
});

// Initialize OpenAI model
export const openaiLLM = new ChatOpenAI({
  model: "gpt-5-mini",
  temperature: 0,
  maxRetries: 2,
  apiKey: openaiKey,
});
