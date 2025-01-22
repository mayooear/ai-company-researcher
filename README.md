# AI Agent Company Researcher

It can take several human hours to research the key information about a company and their key persons/decision makers. This app is built to automate this process and reduce this research and propsecting time to less than a minute using the power of AI agents.

The user simply provides a valid `url` of the company, and within a minute, the agent will generate a concise company research report.

Here's an image of the agent workflow:

![Workflow](./workflow.png)

The app is powered by:

### Techstack:

**LangGraph**: An open-source framework for building LLM agents. LangGraph enables granular control over the agent's decision making and actions, including built in human-in-the-loop, state management, and streaming support.

**FireCrawl**: An AI-powered web scraping tool that can crawl websites and extract structured data from web pages in a format that is easy to use for LLM's.

Together, these technologies enable this app to have the following features:

### Features:

- **Web page structured data extraction**: Using FireCrawl APIs, the agent can extract accurate information from a given web page.
- **Conditional routes**: LangGraph enables the agent to take different routes depending on the state of the agent.
- **Fallback Web Search**: The agent has the option to fallback to a search if it cannot find sufficient information from the web crawl extract.
- **Human Review and Refinement**: The workflow enables a human to review the generated report, make edits/recommendations, and re-generate the report again until they are satisfied to accept it.
- **Effective state management**: LangGraph enables the agent to effectively manage and update the state of the agent. For example, the agent can keep track of the number of revisions made by the human reviewer.

## Table of contents

- [Quickstart](#quickstart)
- [Demo](#demo)
- [Customization](#customization)

## Quickstart

> [!NOTE]
> 🎥 For a visual guide, you can watch the full tutorial here [step-by-step video tutorial](TBA) that walks you through the account setup process and project configuration.

This quickstart covers how to setup the Social Media Agent in a basic setup mode. This is the quickest way to get up and running, however it will lack some of the features of the full setup mode.

To get started, you'll need the following API keys/software:

- [OpenAI API](https://platform.openai.com/api-keys) - General LLM
- [LangSmith](https://smith.langchain.com/) - LangSmith API key required to run the LangGraph server locally (free)
- [FireCrawl API](https://www.firecrawl.dev/) - Web scraping. New users get 500 credits for free

### Clone the repository:

```bash
git clone https://github.com/mayooear/ai-company-researcher.git
```

```bash
cd ai-company-researcher
```

### Install dependencies:

```bash
yarn install
```

### Set environment variables.

Copy the values of the quickstart `.env.example` to `.env`, then add the values:

```bash
cp .env.example .env
```

Once done, ensure you have the following environment variables set:

```bash
# For LangSmith tracing (optional)
LANGCHAIN_API_KEY=
LANGCHAIN_TRACING_V2=true

# For LLM generations
OPENAI_API_KEY=

# For web scraping and extraction of data
FIRECRAWL_API_KEY=

```

### Local Development: How to Visualize and Debug the LangGraph Agent in Local Development

After installing dependencies, you can run a LangGraph API server in development mode with hot reloading capabilities without docker installation. Run the following command:

```bash
npx @langchain/langgraph-cli dev
```

After a few seconds, you should see a pop up in the browser with the langsmith url and in your terminal you should API url, studio UI, and API docs. Once you login, you should see the UI of your agent workflow.

The LangGraph Studio UI offers a new way to develop LLM applications by providing a specialized agent IDE that enables visualization, interaction, and debugging of complex agentic applications.

You can read more about how it works [here].(https://langchain-ai.github.io/langgraph/concepts/langgraph_studio/)

## Demo

In addition to visualizing your workflow in the LangGraph Studio UI, you can also run the demo of the langgraph workflow using the API directly.

To run the demo, you can run the following command:

```bash
yarn demo
```

This will run the `demo.ts` file, which will start the workflow and stream the output to the console.

## Customization

You can customize the prompts used in the workflow.

[TO DO]
