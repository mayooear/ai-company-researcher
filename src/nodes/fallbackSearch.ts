import { firecrawlClient } from "../clients/FireCrawlApi.js";
import { CompanyResearchState } from "../state.js";
import { validateSearchForKeyPersons } from "../tests/utils.js";
import { FallbackSearchResult } from "../types.js";

export async function fallbackSearchNode(
  state: CompanyResearchState,
): Promise<Partial<CompanyResearchState>> {
  const companyName = state.crawledData?.company?.name;
  if (!companyName) {
    // TODO: enable fallback search for company info
    throw new Error("No company name found, skipping fallback search");
  }
  const query = `CEO of ${companyName}`;
  console.log("Search fallback with query = " + query);
  const result = await firecrawlClient.search(query, {
    limit: 5,
    timeout: 60000,
  });
  if (result.success && result.data) {
    // Transform FirecrawlDocument to expected format
    const searchResults = result.data.map((doc) => ({
      url: doc.url || "",
      title: doc.title || "",
      description: doc.description || "",
    }));
    console.log("Search result = " + searchResults);
    const validatedKeyPersons =
      await validateSearchForKeyPersons(searchResults);
    return {
      fallbackSearchUsed: true,
      fallbackSearchKeyPersons: searchResults,
      validatedKeyPersons,
    };
  }
  return {
    fallbackSearchUsed: false,
  };
}
