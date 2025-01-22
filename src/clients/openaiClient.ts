import { ChatOpenAI } from "@langchain/openai";

if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === "") {
  throw new Error("OPENAI_API_KEY is not set");
}

export const openaiClient = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o",
  temperature: 0.2,
});
