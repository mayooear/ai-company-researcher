import { CompanyResearchState } from "../state.js";
import { validateSearchForKeyPersons } from "../tests/utils.js";

export async function fallbackSearchNode(
  state: CompanyResearchState,
): Promise<Partial<CompanyResearchState>> {
  const companyName = state.crawledData?.company?.name;
  if (!companyName) {
    // TODO: enable fallback search for company info
    console.log("No company name found, skipping fallback search");
    return {
      fallbackSearchUsed: false,
    };
  }
  const query = `CEO of ${companyName}`;
  console.log("Search fallback with query = " + query);
  const result = await callFirecrawlSearch(query);
  if (result.success && result.data) {
    const validatedKeyPersons = await validateSearchForKeyPersons(result.data);
    return {
      fallbackSearchUsed: true,
      fallbackSearchKeyPersons: result.data,
      validatedKeyPersons,
    };
  }
  return {
    fallbackSearchUsed: false,
  };
}

async function callFirecrawlSearch(query: string): Promise<{
  success: boolean;
  data?: Array<{ url: string; title: string; description: string }>;
}> {
  // SIMULATED search results
  return {
    success: true,
    data: [
      {
        url: "https://www.linkedin.com/in/jane-doe-ceo",
        title: "Jane Doe - CEO at SomeCo - LinkedIn",
        description: "Jane Doe, President & CEO of SomeCo...",
      },
    ],
  };
}
