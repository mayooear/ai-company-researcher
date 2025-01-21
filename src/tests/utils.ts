import {
  CompleteExtractedCompanyInfo,
  FallbackSearchResult,
} from "../types.js";

/**
 * Firecrawl Extract mock
 * In real code, you would do an actual axios/fetch call or the official Firecrawl SDK here
 */
async function callFirecrawlExtract(urls: string[], schema: object) {
  return {
    success: true,
    data: {
      company: {
        name: "SomeCo, Inc.",
        mission_statement: "To build the best AI solutions possible.",
        products: [
          { name: "AI Gadget", features: "Fancy features", pricing: "$5000" },
        ],
        target_market: "enterprise",
        logo: "https://someco.com/logo.png",
        company_size: "501-1000 employees",
        notable_clients: ["BigTech", "AlphaCorp"],
      },
      key_persons: [{ name: "Jordan Blum", role: "Head of Partnerships" }],
    },
  };
}

/**
 * Firecrawl Search mock
 */
async function callFirecrawlSearch(query: string) {
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

function validateFirecrawlExtraction(
  extractedData: CompleteExtractedCompanyInfo,
): boolean {
  // Check if key_persons array exists and has entries
  if (!extractedData.key_persons || extractedData.key_persons.length === 0) {
    return false;
  }

  // Look for key leadership roles in the key_persons array
  const keyTerms = ["ceo", "chief executive officer", "founder"];
  const found = extractedData.key_persons.filter((person) => {
    const role = person.role.toLowerCase();
    return keyTerms.some((term) => role.includes(term));
  });

  if (found.length === 0) {
    return false;
  }

  return true;
}

function validateSearchForKeyPersons(
  searchData: FallbackSearchResult,
): boolean {
  // We'll do a trivial parse:
  // If any mention includes "CEO" in title or description, we glean some structured result
  const keyTerms = ["ceo", "chief executive officer", "founder"];
  const found = searchData.filter((d) => {
    const text = (d.description + " " + d.title).toLowerCase();
    return keyTerms.some((term) => text.includes(term));
  });

  if (found.length === 0) {
    return false;
  }

  return true;
}

export {
  callFirecrawlExtract,
  callFirecrawlSearch,
  validateSearchForKeyPersons,
  validateFirecrawlExtraction,
};
