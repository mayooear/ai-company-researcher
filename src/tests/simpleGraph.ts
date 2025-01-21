import {
  StateGraph,
  MessagesAnnotation,
  START,
  END,
} from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

// Initialize the LLM
const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0,
});

// Define a simple tool
const calculator = tool(
  (input) => {
    const { a, b } = input;
    return (a + b).toString();
  },
  {
    name: "calculator",
    description: "Add two numbers together",
    schema: z.object({
      a: z.number().describe("First number to add"),
      b: z.number().describe("Second number to add"),
    }),
  },
);

// Create tool node with calculator
const tools = [calculator];
const modelWithTools = model.bindTools(tools);
const toolNode = new ToolNode(tools);

// Define workflow logic
const shouldContinue = (state: typeof MessagesAnnotation.State) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1];
  if (
    "tool_calls" in lastMessage &&
    Array.isArray(lastMessage.tool_calls) &&
    lastMessage.tool_calls?.length
  ) {
    return "tools";
  }
  return END;
};

// Define model call handler
const callModel = async (state: typeof MessagesAnnotation.State) => {
  const { messages } = state;
  const response = await modelWithTools.invoke(messages);
  return { messages: response };
};

// Create and compile the graph
export const simpleGraph = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge(START, "agent")
  .addConditionalEdges("agent", shouldContinue, ["tools", END])
  .addEdge("tools", "agent")
  .compile();

simpleGraph.name = "simple-graph";
