import { z } from 'zod';

export const productSchema = z.object({
  name: z.string(),
  features: z.string().optional(),
  pricing: z.string().optional(),
});

export const extractedCompanyInfoSchema = z.object({
  url: z.string(),
  name: z.string(),
  mission_statement: z.string(),
  products: z.array(productSchema),
  target_market: z.string(),
  industry: z.string().optional(),
  company_size: z.string().optional(),
  location: z.string().optional(),
  logo: z.string().optional(),
  notable_clients: z.array(z.string()).optional(),
  case_studies: z.array(z.string()).optional(),
  recent_articles: z.array(z.string()).optional(),
});

export const extractedKeyPersonSchema = z.object({
  name: z.string(),
  role: z.string(),
  description: z.string().optional(),
  linkedIn_url: z.string().optional(),
  email: z.string().optional(),
});

export const completeExtractedCompanyInfoSchema = z.object({
  company: extractedCompanyInfoSchema,
  key_persons: z.array(extractedKeyPersonSchema),
});

export const generatedReportSchema = z.object({
  ...completeExtractedCompanyInfoSchema.shape,
  market_position: z.string(),
  competitors: z.array(z.string()),
  mermaid_diagram: z.string(),
});

export const fallbackSearchResultSchema = z.array(
  z.object({
    url: z.string(),
    title: z.string(),
    description: z.string(),
  })
);
