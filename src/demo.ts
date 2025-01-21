import { Command } from "@langchain/langgraph";
import { MemorySaver } from "@langchain/langgraph";
import { companyResearcherGraph } from "./companyResearcherGraph.js";

const graph = companyResearcherGraph;

graph.checkpointer = new MemorySaver();

const graphStateConfig = {
  configurable: { thread_id: "1" },
  streamMode: "values" as const,
};

const stream = await graph.stream(
  { userUrl: "https://langchain.com/*" },
  graphStateConfig,
);

for await (const value of stream) {
  console.log("\n\n----new State----");
  console.log(value);
}

console.log("interrupted first time by human review");

const currentState = await graph.getState(graphStateConfig);
console.log("Next node is:", currentState.next);

//resume from here
const firstHumanReviewStream = await graph.stream(
  new Command({
    resume: {
      userPrompt: "Please add a section on the company's culture and values.",
      userAction: "edit",
    },
  }),
  graphStateConfig,
);

for await (const value of firstHumanReviewStream) {
  console.log("\n\n----new State----");
  console.log(value);
}

console.log("interrupted second time by human review");

//resume from here
const secondHumanReviewStream = await graph.stream(
  new Command({
    resume: {
      userPrompt: "Please add a section on the company's culture and values.",
      userAction: "edit",
    },
  }),
  graphStateConfig,
);

for await (const value of secondHumanReviewStream) {
  console.log("\n\n----new State----");
  console.log(value);
}

//end the workflow
const thirdHumanReviewStream = await graph.stream(
  new Command({
    resume: {
      userPrompt: "",
      userAction: "accept",
    },
  }),
  graphStateConfig,
);

for await (const value of thirdHumanReviewStream) {
  console.log("\n\n----Updated State----");
  console.log(value);
}

const finalState = await graph.getState(graphStateConfig);
console.log("Next node is:", finalState.next);
