import { firecrawlClient } from "../clients/FireCrawlApi.js";
import { completeExtractedCompanyInfoSchema } from "../schema.js";
import { CompanyResearchState } from "../state.js";
import { validateFirecrawlExtraction } from "../tests/utils.js";
import { CompleteExtractedCompanyInfo } from "../types.js";

export async function firecrawlExtractNode(
  state: CompanyResearchState,
): Promise<Partial<CompanyResearchState>> {
  let url = state.userUrl.trim();
  url = url.replace(/\/\*+$/, "");
  url = url + "/*"; // crawls the entire site

  const result = await firecrawlClient.extract([url], {
    schema: completeExtractedCompanyInfoSchema,
    prompt: `Extract the following key information about the company using the data below: 
    - company name
    - mission statement
    - key persons including their name, role, social media, and email
    - products, features, and pricing
    - target market
    - company logo
    - company notable clients and customers
    - company case studies and recent articles (make sure to include the urls)
    `,
  });

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
