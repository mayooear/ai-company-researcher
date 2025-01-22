import { ChatOpenAI } from '@langchain/openai';
import { openaiClient } from '../clients/openaiClient.js';
import { CompanyResearchState } from '../state.js';
import { SystemMessage } from '@langchain/core/messages';

const GENERATE_REPORT_PROMPT = `
  You are a helpful assistant and an expert at market research.
  Below, you are provided data extracted from the company's website: {COMPANY_URL}. Use this data to generate a useful report that provides a complete overview of the company including it's mission, key persons, products, clients, competitors, and other relevant market research info.

  At the end of your report, provide a concise overview diagram of the company's structure and market position in mermaid format.

  Your report MUST be in JSON format.

  EXTRACTED DATA:
  {EXTRACTED_DATA}

  {SEARCH_RESULTS}
`;

const REVISION_PROMPT = `
  You are a helpful assistant and an expert at market research. Below, you are provided with extracted data about a company and your recent generated report based on this data.

  Please revise and edit the generated report as per the user's instructions below:
  <REVISION INSTRUCTIONS>
   {REVISION_PROMPT}
  <REVISION INSTRUCTIONS>

  If the user's prompt is not clear or is unrelated to revising the report, please ignore the revision request and return the original report.

  Your revised report MUST be in JSON format.

  {REVISION}

  Original extracted data used to generate the report:
  {EXTRACTED_DATA}

  {SEARCH_RESULTS}
`;

export async function generateReportNode(
  state: CompanyResearchState
): Promise<Partial<CompanyResearchState>> {
  const extractedData = state.crawledData;
  const fallbackSearchResults = state.fallbackSearchKeyPersons;
  const userPrompt = state.userPrompt?.trim();
  const recentGeneratedReport = state.finalReport;

  const llm = openaiClient;

  let isRevision = false;
  let revisionIncrement = 0;
  let prompt = GENERATE_REPORT_PROMPT.replace(
    '{COMPANY_URL}',
    state.userUrl
  ).replace('{EXTRACTED_DATA}', JSON.stringify(extractedData, null, 2));
  if (userPrompt && userPrompt !== '') {
    isRevision = true;
    revisionIncrement = 1;

    prompt = REVISION_PROMPT.replace('{REVISION_PROMPT}', userPrompt)
      .replace(
        '{REVISION}',
        `Below is your most recent generated report revision the user would like to change:\n${recentGeneratedReport}`
      )
      .replace('{EXTRACTED_DATA}', JSON.stringify(extractedData, null, 2));
  }

  // If no fallback results, remove the entire SEARCH_RESULTS section
  if (fallbackSearchResults.length === 0) {
    prompt = prompt.replace('{SEARCH_RESULTS}', '');
  } else {
    prompt = prompt.replace(
      '{SEARCH_RESULTS}',
      `\n\nADDITIONAL DATA FETCHED FROM THE WEB ABOUT THE COMPANY:\n ${JSON.stringify(
        fallbackSearchResults,
        null,
        2
      )}`
    );
  }

  console.log('generation prompt', prompt);
  console.log('isRevision', isRevision);
  const finalReport = (await generateFinalReport(llm, prompt)) as string;
  console.log('finalReport', finalReport);
  return {
    finalReport,
    reportRevisionsIncrement: revisionIncrement,
    reportRevisions: isRevision ? [finalReport] : [],
  };
}

async function generateFinalReport(llm: ChatOpenAI, prompt: string) {
  const response = await llm.invoke([new SystemMessage(prompt)]);
  return response.content;
}
