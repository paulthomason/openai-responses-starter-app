"use client";
import React from "react";
import { Button } from "./ui/button";
import { GameOptionsItem } from "@/lib/assistant";

interface Props {
  item: GameOptionsItem;
  onSelect: (option: string) => void;
}

export default function GameOptions({ item, onSelect }: Props) {
  return (
    <div className="flex flex-col">
      <div className="flex">
        <div className="mr-4 rounded-[16px] p-4 md:mr-24 text-black bg-gray-100 font-light space-y-2">
          {item.options.map((opt, idx) => (
            <Button key={idx} size="sm" className="w-full text-left" onClick={() => onSelect(opt)}>
              {opt}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
