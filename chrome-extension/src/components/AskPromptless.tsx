import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Square,
  Copy,
  Check,
  RefreshCw,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

interface AskPromptlessProps {
  platform: "linkedin" | "youtube" | "unsupported" | "unknown";
  pageTitle: string;
  url: string;
  onSelectSuggestedAction?: (actionTitle: string) => void;
}

export function AskPromptless({
  platform,
  pageTitle,
  url,
  onSelectSuggestedAction,
}: AskPromptlessProps) {
  const [query, setQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [micError, setMicError] = useState(false);

  // Chat conversation state
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      role: "user" | "assistant";
      text: string;
      isStreaming?: boolean;
    }>
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Suggested prompts change dynamically based on context
  const getSuggestedPrompts = () => {
    if (platform === "linkedin") {
      if (url.includes("/jobs")) {
        return [
          "Tailor my resume",
          "Write a cover letter",
          "Research this company",
        ];
      }
      return ["Write a viral post", "Improve my writing", "Generate comments"];
    }
    if (platform === "youtube") {
      return ["Summarize", "Quiz me", "Make flashcards"];
    }
    return [
      "Summarize this page",
      "Extract key takeaways",
      "Explain in simple terms",
    ];
  };

  // Voice Input Handler (Web Speech API)
  const handleToggleMic = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicError(true);
      setTimeout(() => setMicError(false), 3000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join("");
        setQuery(transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        setMicError(true);
        setTimeout(() => setMicError(false), 3000);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
    } catch {
      setIsRecording(false);
      setMicError(true);
      setTimeout(() => setMicError(false), 3000);
    }
  };

  // Submit Prompt to AI Assistant
  const handleSubmitPrompt = async (textToSubmit?: string) => {
    const text = textToSubmit || query;
    if (!text.trim() || isGenerating) return;

    const userMsg = {
      id: Date.now().toString(),
      role: "user" as const,
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSubmit) setQuery("");
    setIsGenerating(true);

    const targetContextName = pageTitle || "the current page";

    // Simulate realistic streaming response
    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        text: "",
        isStreaming: true,
      },
    ]);

    const reply = `### ✨ AI Assistant Insight for ${targetContextName}

Based on your current active browser tab (**${targetContextName}**):

* **Contextual Analysis:** This page focuses on professional workflows and structured technical information.
* **Response to "${text}":** I have analyzed the DOM tree and identified the highest-signal items to streamline your task without requiring manual copy-pasting.

> [!TIP]
> **Zero-Click Context:** Promptless AI automatically links this answer to your current URL (${
      url || "Active Tab"
    }).`;

    // Stream words smoothly
    const words = reply.split(" ");
    let currentText = "";
    for (let i = 0; i < words.length; i++) {
      await new Promise((res) => setTimeout(res, 35));
      currentText += (i === 0 ? "" : " ") + words[i];
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? { ...msg, text: currentText, isStreaming: i < words.length - 1 }
            : msg
        )
      );
    }

    setIsGenerating(false);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 shadow-xl space-y-3 relative overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide">
              Ask Promptless
            </h4>
            <p className="text-[10px] text-zinc-400">
              Custom questions • Context synced automatically
            </p>
          </div>
        </div>

        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
          AI 2.0
        </span>
      </div>

      {/* Chat Messages Drawer (if any messages exist) */}
      <AnimatePresence>
        {messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 py-1 border-t border-b border-white/10"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-xl text-xs space-y-1.5 ${
                  msg.role === "user"
                    ? "bg-blue-500/15 border border-blue-500/30 text-white ml-6"
                    : "bg-white/[0.04] border border-white/10 text-zinc-300 mr-2"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[10px] uppercase tracking-wider text-zinc-400">
                    {msg.role === "user" ? "You" : "Promptless AI"}
                  </span>
                  {msg.role === "assistant" && !msg.isStreaming && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1 text-[10px]"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="whitespace-pre-wrap leading-relaxed font-sans">
                  {msg.text}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Bar with Voice Microphone & Stop Button */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmitPrompt()}
          placeholder={`Ask about "${
            pageTitle ? pageTitle.slice(0, 28) + "..." : "this page"
          }"...`}
          disabled={isGenerating}
          className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-3 pr-20 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
        />

        <div className="absolute right-1.5 flex items-center gap-1">
          {/* Voice Input Microphone */}
          <button
            onClick={handleToggleMic}
            title={isRecording ? "Stop Dictation" : "Voice Input (Dictate)"}
            className={`p-1.5 rounded-lg transition-all ${
              isRecording
                ? "bg-red-500 text-white animate-pulse"
                : "text-zinc-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {isRecording ? (
              <MicOff className="w-3.5 h-3.5" />
            ) : (
              <Mic className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Submit / Stop Button */}
          {isGenerating ? (
            <button
              onClick={() => setIsGenerating(false)}
              title="Stop Generation"
              className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          ) : (
            <button
              onClick={() => handleSubmitPrompt()}
              disabled={!query.trim()}
              title="Send Prompt"
              className={`p-1.5 rounded-lg transition-all ${
                query.trim()
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                  : "text-zinc-600 bg-white/[0.02]"
              }`}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Microphone Permission Warning if denied/unsupported */}
      {micError && (
        <div className="text-[10px] text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
          Voice input permissions denied or browser unsupported. Typing active.
        </div>
      )}

      {/* Dynamic Suggested Prompts (Pills) */}
      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mr-1">
          Suggestions:
        </span>
        {getSuggestedPrompts().map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (onSelectSuggestedAction) {
                onSelectSuggestedAction(suggestion);
              } else {
                handleSubmitPrompt(suggestion);
              }
            }}
            className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-blue-500/40 text-[11px] font-medium text-zinc-300 hover:text-white transition-all flex items-center gap-1"
          >
            <span>{suggestion}</span>
            <ArrowRight className="w-2.5 h-2.5 text-zinc-500" />
          </button>
        ))}
      </div>
    </div>
  );
}
