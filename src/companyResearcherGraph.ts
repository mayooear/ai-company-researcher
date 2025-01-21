import { END, START } from "@langchain/langgraph";

import { MemorySaver, StateGraph } from "@langchain/langgraph";
import { CompanyResearchAnnotation, CompanyResearchState } from "./state.js";
import { validateUrlNode } from "./nodes/validateUrl.js";
import { firecrawlExtractNode } from "./nodes/extractCompanyData.js";
import { fallbackSearchNode } from "./nodes/fallbackSearch.js";
import { humanReviewNode } from "./nodes/humanReview.js";
import { generateReportNode } from "./nodes/generateReport.js";

function routeAfterValidateUrl(
  state: CompanyResearchState,
): "firecrawl_extract" | typeof END {
  if (state.validUrl) {
    return "firecrawl_extract";
  }
  return END;
}

function routeAfterExtractingData(
  state: CompanyResearchState,
): "fallback_search" | "generate_report" {
  if (!state.validatedKeyPersons) {
    return "fallback_search";
  }
  return "generate_report";
}

function routeAfterFallbackSearch(
  state: CompanyResearchState,
): "generate_report" | typeof END {
  if (!state.fallbackSearchUsed || !state.validatedKeyPersons) {
    return END;
  }
  return "generate_report";
}

// Create a graph
const companyResearcherWorkflow = new StateGraph(CompanyResearchAnnotation)
  .addNode("validate_url", validateUrlNode)
  .addNode("firecrawl_extract", firecrawlExtractNode)
  .addNode("fallback_search", fallbackSearchNode)
  .addNode("generate_report", generateReportNode)
  .addNode("human_review", humanReviewNode, {
    ends: ["generate_report", END],
  })
  .addEdge(START, "validate_url")
  .addConditionalEdges("validate_url", routeAfterValidateUrl, [
    "firecrawl_extract",
    END,
  ])
  .addConditionalEdges("firecrawl_extract", routeAfterExtractingData, [
    "fallback_search",
    "generate_report",
  ])
  .addConditionalEdges("fallback_search", routeAfterFallbackSearch, [
    "generate_report",
    END,
  ])
  .addEdge("generate_report", "human_review");

// Optional: memory saver
const memorySaver = new MemorySaver();

// Compile
export const companyResearcherGraph = companyResearcherWorkflow.compile({
  /**
   * Only use a checkpointer for local dev testing. Langgraph prod and studio already uses a checkpoint.
   */
  // checkpointer: memorySaver,
});

companyResearcherGraph.name = "company-researcher-graph";
