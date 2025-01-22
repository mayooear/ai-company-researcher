import { CompanyResearchState } from "../state.js";
import { Command, END } from "@langchain/langgraph";

export function validateUrlNode(
  state: CompanyResearchState,
): Partial<CompanyResearchState> {
  let urlInput = state.userUrl;
  if (!urlInput || typeof urlInput !== "string") {
    throw new Error("URL is required and must be a string.");
  }

  urlInput = urlInput.trim();

  // Auto-prepend 'https://' if missing
  if (!/^https?:\/\//i.test(urlInput)) {
    urlInput = `https://${urlInput}`;
  }

  let url: URL;

  try {
    url = new URL(urlInput);
  } catch (error) {
    throw new Error("URL is not well-formed.");
  }

  if (url.protocol !== "https:") {
    throw new Error("URL must use the HTTPS protocol.");
  }

  // Normalize hostname by removing 'www.' if present for consistent validation
  const hostname = url.hostname.replace(/^www\./i, "");

  const blockedDomains = [
    "linkedin.com",
    "facebook.com",
    "youtube.com",
    "twitter.com",
    "instagram.com",
    "wikipedia.org",
    "amazon.com",
    "apple.com",
    "google.com",
    "microsoft.com",
    "github.com",
    "stackoverflow.com",
    "reddit.com",
    "quora.com",
    "medium.com",
    "pinterest.com",
    "tiktok.com",
    "snapchat.com",
    // Add more blocked domains as needed
  ];

  if (
    blockedDomains.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    )
  ) {
    throw new Error("URL domain is not allowed.");
  }

  // Optionally, perform a HEAD request to verify the URL is live
  // This requires making the function asynchronous
  /*
  try {
    const response = await fetch(url.toString(), { method: "HEAD" });
    if (!response.ok) {
      throw new Error(`URL responded with status ${response.status}.`);
    }
  } catch (error) {
    throw new Error("Unable to reach the provided URL.");
  }
  */

  return {
    validUrl: true,
    userUrl: url.toString(),
  };
}
