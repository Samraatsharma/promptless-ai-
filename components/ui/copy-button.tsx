"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "./button";

export interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export function CopyButton({
  text,
  label = "Copy",
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <Button
      variant="glass"
      size="sm"
      onClick={handleCopy}
      leftIcon={
        copied ? (
          <Check className="w-3.5 h-3.5 text-[#10B981]" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )
      }
      className={className}
    >
      {copied ? "Copied" : label}
    </Button>
  );
}
