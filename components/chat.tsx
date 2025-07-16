"use client";

import React, { useEffect, useRef, useState } from "react";
import ToolCall from "./tool-call";
import Message from "./message";
import Annotations from "./annotations";
import McpToolsList from "./mcp-tools-list";
import McpApproval from "./mcp-approval";
import GameOptions from "./game-options";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Item,
  McpApprovalRequestItem,
  GameOptionsItem,
} from "@/lib/assistant";
import LoadingMessage from "./loading-message";
import useConversationStore from "@/stores/useConversationStore";

interface ChatProps {
  items: Item[];
  onApprovalResponse: (approve: boolean, id: string) => void;
  onSelectOption: (option: string) => void;
}

const Chat: React.FC<ChatProps> = ({
  items,
  onApprovalResponse,
  onSelectOption,
}) => {
  const itemsEndRef = useRef<HTMLDivElement>(null);
  const [textInput, setTextInput] = useState("");
  const { isAssistantLoading } = useConversationStore();

  const scrollToBottom = () => {
    itemsEndRef.current?.scrollIntoView({ behavior: "instant" });
  };


  useEffect(() => {
    scrollToBottom();
  }, [items]);

  const sendMessage = () => {
    if (!textInput.trim()) return;
    onSelectOption(textInput);
    setTextInput("");
  };

  return (
    <div className="flex justify-center items-center size-full">
      <div className="flex grow flex-col h-full max-w-[750px] gap-2">
        <div className="flex-1 overflow-y-scroll px-10 flex flex-col">
          <div className="mt-auto space-y-5 pt-4">
            {items.map((item, index) => (
              <React.Fragment key={index}>
                {item.type === "tool_call" ? (
                  <ToolCall toolCall={item} />
                ) : item.type === "message" ? (
                  <div className="flex flex-col gap-1">
                    <Message message={item} />
                    {item.content &&
                      item.content[0].annotations &&
                      item.content[0].annotations.length > 0 && (
                        <Annotations
                          annotations={item.content[0].annotations}
                        />
                      )}
                  </div>
                ) : item.type === "mcp_list_tools" ? (
                  <McpToolsList item={item} />
                ) : item.type === "mcp_approval_request" ? (
                  <McpApproval
                    item={item as McpApprovalRequestItem}
                    onRespond={onApprovalResponse}
                  />
                ) : item.type === "game_options" ? (
                  <GameOptions
                    item={item as GameOptionsItem}
                    onSelect={onSelectOption}
                  />
                ) : null}
              </React.Fragment>
            ))}
            {isAssistantLoading && <LoadingMessage />}
            <div ref={itemsEndRef} />
          </div>
        </div>
        <div className="p-4 border-t flex gap-2">
          <Input
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Type your message"
            className="flex-1"
          />
          <Button onClick={sendMessage} size="sm">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
