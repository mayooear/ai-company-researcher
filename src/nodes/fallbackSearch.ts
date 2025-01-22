import { firecrawlClient } from "../clients/fireCrawlApi.js";
import { CompanyResearchState } from "../state.js";
import { validateSearchForKeyPersons } from "../tests/utils.js";

export async function fallbackSearchNode(
  state: CompanyResearchState,
): Promise<Partial<CompanyResearchState>> {
  const companyName = state.crawledData?.company?.name;
  if (!companyName) {
    // TODO: enable fallback search for company info
    throw new Error("No company name found, skipping fallback search");
  }
  const query = `CEO of ${companyName}`;
  const competitorQuery = `Competitors of ${state.userUrl}`;
  console.log("Search fallback with queries = " + [query, competitorQuery]);
  const searchPromises = [
    firecrawlClient.search(query, {
      limit: 5,
      timeout: 60000,
    }),
    firecrawlClient.search(competitorQuery, {
      limit: 3,
      timeout: 60000,
    }),
  ];

  const results = await Promise.allSettled(searchPromises);
  const successfulResults = results
    .filter(
      (
        result,
      ): result is PromiseFulfilledResult<{ success: boolean; data: any }> =>
        result.status === "fulfilled" &&
        Boolean(result.value.success) &&
        Boolean(result.value.data),
    )
    .map((result) => result.value.data)
    .flat();

  if (successfulResults.length > 0) {
    // Transform FirecrawlDocument to expected format
    const searchResults = successfulResults.map((doc) => ({
      url: doc.url || "",
      title: doc.title || "",
      description: doc.description || "",
    }));
    console.log("Search results = " + searchResults);
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
