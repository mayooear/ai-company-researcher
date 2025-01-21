import { CompanyResearchState } from "../state.js";
import { Command, END } from "@langchain/langgraph";

export function validateUrlNode(
  state: CompanyResearchState,
): Partial<CompanyResearchState> {
  const url = state.userUrl;
  if (!url || typeof url !== "string") {
    return {
      validUrl: false,
    };
  }

  if (!url.startsWith("http")) {
    console.log("URL invalid: must start with http or https");
    return {
      validUrl: false,
    };
  }

  // e.g. quick checks:
  // 1. is well-formed url
  // 2. not a major domain (linkedin, facebook, youtube, etc.)
  // 3. maybe do a HEAD request or a library call

  const majorDomains = [
    "linkedin",
    "facebook",
    "youtube",
    "twitter",
    "instagram",
  ];

  if (majorDomains.some((domain) => url.includes(domain))) {
    return {
      validUrl: false,
    };
  }

  // TODO: simulate checking if "live" or "200 status" => pass
  return {
    validUrl: true,
  };
}
