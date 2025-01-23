import {
  extractedCompanyInfoSchema,
  fallbackSearchResultSchema,
  generatedReportSchema,
} from "./schema.js";

import { extractedKeyPersonSchema } from "./schema.js";

import { completeExtractedCompanyInfoSchema } from "./schema.js";

import { z } from "zod";

export type UserAction = "accept" | "edit";

export type HumanInterrupt = {
  question: string;
};
export type HumanResponse = {
  userAction: UserAction;
  userPrompt: string | null;
};

type ExtractedCompanyInfo = z.infer<typeof extractedCompanyInfoSchema>;
type ExtractedKeyPerson = z.infer<typeof extractedKeyPersonSchema>;
type CompleteExtractedCompanyInfo = z.infer<
  typeof completeExtractedCompanyInfoSchema
>;
type FallbackSearchResult = z.infer<typeof fallbackSearchResultSchema>;
type GeneratedReport = z.infer<typeof generatedReportSchema>;

export {
  ExtractedCompanyInfo,
  ExtractedKeyPerson,
  CompleteExtractedCompanyInfo,
  FallbackSearchResult,
  GeneratedReport
};
