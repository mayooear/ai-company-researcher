import { completeExtractedCompanyInfoSchema } from "../../schema.js";
import { CompanyResearchState } from "../../state.js";
import { validateFirecrawlExtraction } from "../../tests/utils.js";
import { CompleteExtractedCompanyInfo } from "../../types.js";

export async function firecrawlExtractNode(
  state: CompanyResearchState,
): Promise<Partial<CompanyResearchState>> {
  const url = state.userUrl;
  const result = await callFirecrawlExtract(
    url,
    completeExtractedCompanyInfoSchema,
  );

  if (result.success && result.data) {
    //validate key persons
    const validatedKeyPersons = await validateFirecrawlExtraction(result.data);
    return {
      crawledData: result.data as CompanyResearchState["crawledData"],
      validatedKeyPersons,
    };
  }
  return {
    crawledData: undefined,
    validatedKeyPersons: false,
  };
}

/** Firecrawl: extract with a schema */
async function callFirecrawlExtract(
  url: string,
  schema: object,
): Promise<{
  success: boolean;
  data?: CompleteExtractedCompanyInfo;
}> {
  // Dummy result (missing a CEO)
  return {
    success: true,
    data: {
      company: {
        name: "SomeCo, Inc.",
        mission_statement: "Build best AI solutions.",
        products: [
          { name: "AI Widget", features: "Fancy features", pricing: "$5000" },
        ],
        target_market: "Enterprise",
        logo: "https://someco.com/logo.png",
        notable_clients: ["BigTech", "AlphaCorp"],
        case_studies: ["Case Study 1", "Case Study 2"],
        recent_articles: ["Article 1", "Article 2"],
      },
      key_persons: [
        // No CEO => fallback needed
        {
          name: "James R",
          role: "CTO",
          description: "James is the CTO at SomeCo, Inc.",
        },
      ],
    },
  };
}
