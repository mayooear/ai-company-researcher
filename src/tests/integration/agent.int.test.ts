import { HumanMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
import { simpleGraph } from "../simpleGraph.js";

describe("simpleGraph Integration Tests", () => {
  it("should handle multiple tool calls in a single conversation", async () => {
    const input = {
      messages: [
        new HumanMessage("Add 10 and 15."),
        new AIMessage("", { calculator: { a: 10, b: 15 } }),
        new HumanMessage("Now Add 25 to the result."),
        new AIMessage("", { calculator: { a: 25, b: 2 } }),
      ],
    };

    const response = await simpleGraph.invoke(input);

    console.log("Response Messages:", response.messages);

    expect(response).toHaveProperty("messages");

    const toolMessages = response.messages.filter(
      (msg) => msg instanceof ToolMessage,
    ) as ToolMessage[];

    expect(toolMessages.length).toBe(2);
    expect(toolMessages[0].content).toBe("25");
    expect(toolMessages[0].name).toBe("calculator");
    expect(toolMessages[1].content).toBe("50");
    expect(toolMessages[1].name).toBe("calculator");
  });
});
