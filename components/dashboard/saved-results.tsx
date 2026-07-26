"use client";

import * as React from "react";
import { Bookmark, ExternalLink, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { GeneratedContentItem } from "@/types";
import { DashboardEmptyState } from "./empty-state";

interface SavedResultsProps {
  items: GeneratedContentItem[];
  onToggleSave: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SavedResults({
  items,
  onToggleSave,
  onDelete,
}: SavedResultsProps) {
  const savedItems = items.filter((item) => item.is_saved);

  if (savedItems.length === 0) {
    return (
      <DashboardEmptyState
        title="No saved bookmarks yet"
        description="When you click the bookmark icon on any cover letter, tailored resume, or structured YouTube notes in your Recent Outputs, they will be archived permanently here."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#71717a] uppercase tracking-wider font-semibold">
          Showing {savedItems.length} bookmarked AI result
          {savedItems.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savedItems.map((item) => {
          const isLinkedin = item.platform === "linkedin";
          return (
            <GlassCard
              key={item.id}
              glowColor={isLinkedin ? "primary" : "accent"}
              className="p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={isLinkedin ? "primary" : "accent"}>
                    {isLinkedin ? "LinkedIn Bookmark" : "YouTube Bookmark"}
                  </Badge>
                  <span className="text-xs text-[#71717a]">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onToggleSave(item.id)}
                    className="p-1.5 rounded-lg bg-[#4F8DFF]/20 border border-[#4F8DFF] text-[#4F8DFF] hover:bg-white/5 transition-colors"
                    title="Remove from bookmarks"
                  >
                    <Bookmark className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/8 text-[#71717a] hover:text-[#ff5f56] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-white text-lg mb-1">
                  {item.title}
                </h3>
                <a
                  href={item.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#4F8DFF] hover:underline flex items-center gap-1 truncate mb-3"
                >
                  <span>{item.source_url}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/8 text-xs text-[#f4f4f5]/90 max-h-48 overflow-y-auto whitespace-pre-wrap font-sans">
                  {item.content_markdown}
                </div>
              </div>

              <div className="flex items-center justify-end pt-2 border-t border-white/8">
                <CopyButton
                  text={item.content_markdown}
                  label="Copy Saved Output"
                />
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
