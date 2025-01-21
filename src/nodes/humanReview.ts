import { Command, END, interrupt } from "@langchain/langgraph";
import { CompanyResearchState } from "../state.js";
import { HumanInterrupt, HumanResponse } from "../types.js";

export async function humanReviewNode(
  state: CompanyResearchState,
): Promise<Command> {
  // We can pass an object to `interrupt`. The user picks "accept" or "edit"
  const userDecision = await interrupt<HumanInterrupt, HumanResponse>({
    question:
      "Please review the generated report and decide if you want to accept it or make edits by providing a short prompt.",
  });

  if (!userDecision.userAction) {
    throw new Error("No user action or user edit prompt provided");
  }

  console.log("userDecision", userDecision);

  const userAction = userDecision.userAction;

  // Check if userAction is either 'accept' or 'edit'
  if (!userAction || !["accept", "edit"].includes(userAction)) {
    throw new Error(
      'Invalid user action provided. Must be either "accept" or "edit".',
    );
  }

  if (userAction === "edit") {
    if (
      !userDecision.userPrompt ||
      typeof userDecision.userPrompt !== "string"
    ) {
      throw new Error(
        "Invalid user edit prompt provided. Must be a non-empty string.",
      );
    }

    return new Command<CompanyResearchState>({
      goto: "generate_report",
      update: {
        userPrompt: userDecision.userPrompt,
      },
    });
  } else if (userAction === "accept") {
    return new Command({
      goto: END,
    });
  }

  return new Command({
    goto: END,
  });
}
