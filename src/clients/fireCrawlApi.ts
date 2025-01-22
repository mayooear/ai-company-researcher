import FirecrawlApp from "@mendable/firecrawl-js";
import dotenv from "dotenv";

dotenv.config();
if (
  !process.env.FIRECRAWL_API_KEY ||
  process.env.FIRECRAWL_API_KEY.trim() === ""
) {
  throw new Error(
    "FIRECRAWL_API_KEY environment variable is required and cannot be empty",
  );
}

export const firecrawlClient = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});
