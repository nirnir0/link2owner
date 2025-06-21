import LLM "mo:llm";
import Nat "mo:base/Nat";

persistent actor {
  // Counter for number of chat requests
  var chatCount : Nat = 0;

  public func prompt(prompt : Text) : async Text {
    if (prompt == "") {
      return "Prompt cannot be empty.";
    };
    await LLM.prompt(#Qwen3_32B, prompt);
  };

  public func chat(messages : [LLM.ChatMessage]) : async Text {
    chatCount += 1; // Increment chat counter
    let response = await LLM.chat(#Qwen3_32B).withMessages(messages).send();

    switch (response.message.content) {
      case (?text) text # "\n[Total Chat count: " # Nat.toText(chatCount) # "]";
      case null "";
    };
  };

  // Echo function as requested
  public query func echoAlways() : async Text {
    "always have a great vision always"
  };
};
