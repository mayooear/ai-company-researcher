import { Annotation } from "@langchain/langgraph";
import {
  CompleteExtractedCompanyInfo,
  ExtractedKeyPerson,
  FallbackSearchResult,
  UserAction,
} from "./types.js";

export const CompanyResearchAnnotation = Annotation.Root({
  userUrl: Annotation<string>(),

  validUrl: Annotation<boolean>(),

  // The extracted data from Firecrawl
  crawledData: Annotation<CompleteExtractedCompanyInfo>(),

  // Whether we used the fallback search
  fallbackSearchUsed: Annotation<boolean>(),

  // Whether we validated the key persons
  validatedKeyPersons: Annotation<boolean>(),

  // The fallback discovered key persons from the Firecrawl /search approach
  fallbackSearchKeyPersons: Annotation<FallbackSearchResult>(),

  // The final merged key persons
  finalKeyPersons: Annotation<ExtractedKeyPerson[]>(),

  // The final JSON-based summary about the company
  finalReport: Annotation<string>(),

  // We'll store the user's action from the human review step
  userAction: Annotation<UserAction | null>(),

  // If user chooses "edit," they provide a short text describing how to modify finalReport
  userPrompt: Annotation<string | null>(),

  /**
   * The number of times the post has been revised..
   */
  reportRevisionsCount: Annotation<number>({
    reducer: (state, update) => state + update,
    default: () => 0,
  }),

  // Array of generated report revisions
  reportRevisions: Annotation<string[]>({
    reducer: (state, update) => state.concat(update),
    default: () => [],
  }),
});

export type CompanyResearchState = typeof CompanyResearchAnnotation.State;
