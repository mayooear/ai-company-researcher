import { HumanMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
import { simpleGraph } from "../simpleGraph.js";

describe("simpleGraph", () => {
  it("should return END when there are no tool calls", async () => {
    const input = {
      messages: [new HumanMessage("Hello, how are you?")],
    };

    const response = await simpleGraph.invoke(input);

    console.log(response.messages);

    expect(response).toHaveProperty("messages");
    expect(response.messages.length).toBe(2);
    expect(response.messages.some((msg) => msg instanceof ToolMessage)).toBe(
      false,
    );
  });

  it("should handle tool calls and invoke tools", async () => {
    const input = {
      messages: [
        new HumanMessage("Add 2 and 3."),
        new AIMessage("", { calculator: { a: 2, b: 3 } }),
      ],
    };

    const response = await simpleGraph.invoke(input);

    expect(response).toHaveProperty("messages");
    expect(response.messages.length).toBe(5);
    expect(response.messages.some((msg) => msg instanceof ToolMessage)).toBe(
      true,
    );
  });
});
