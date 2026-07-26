"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  BookOpen,
  Search,
  Bookmark,
  ExternalLink,
  Eye,
  Trash2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { GeneratedContentItem } from "@/types";
import { DashboardEmptyState } from "./empty-state";
import { downloadMarkdownFile } from "@/lib/utils/download-markdown";

interface RecentOutputsProps {
  items: GeneratedContentItem[];
  onToggleSave: (id: string) => void;
  onDelete: (id: string) => void;
}

export function RecentOutputs({
  items,
  onToggleSave,
  onDelete,
}: RecentOutputsProps) {
  const [filterPlatform, setFilterPlatform] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [previewItem, setPreviewItem] =
    React.useState<GeneratedContentItem | null>(null);

  const filteredItems = items.filter((item) => {
    const matchPlatform =
      filterPlatform === "all" || item.platform === filterPlatform;
    const matchQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content_markdown.toLowerCase().includes(searchQuery.toLowerCase());
    return matchPlatform && matchQuery;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#71717a] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search generated letters, notes, summaries..."
            className="w-full h-10 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#4F8DFF] focus:outline-none text-sm text-white placeholder:text-[#71717a] transition-colors"
          />
        </div>

        {/* Platform Toggle Pills */}
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setFilterPlatform("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterPlatform === "all"
                ? "bg-[#4F8DFF] text-white"
                : "text-[#71717a] hover:text-white"
            }`}
          >
            All Platforms
          </button>
          <button
            onClick={() => setFilterPlatform("linkedin")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterPlatform === "linkedin"
                ? "bg-[#4F8DFF] text-white"
                : "text-[#71717a] hover:text-white"
            }`}
          >
            LinkedIn Jobs
          </button>
          <button
            onClick={() => setFilterPlatform("youtube")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterPlatform === "youtube"
                ? "bg-[#8B5CF6] text-white"
                : "text-[#71717a] hover:text-white"
            }`}
          >
            YouTube Learning
          </button>
        </div>
      </div>

      {/* List of Outputs or Empty State */}
      {filteredItems.length === 0 ? (
        <DashboardEmptyState
          title="No generated outputs found"
          description="We couldn't find any AI actions matching your current filter. Browse LinkedIn jobs or YouTube videos with the Promptless Side Panel to generate new content."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isLinkedin = item.platform === "linkedin";
            return (
              <GlassCard
                key={item.id}
                glowColor={isLinkedin ? "primary" : "accent"}
                className="p-6 flex flex-col justify-between h-[300px]"
              >
                <div>
                  {/* Card Top Row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isLinkedin
                            ? "bg-[#4F8DFF]/20 text-[#4F8DFF]"
                            : "bg-[#8B5CF6]/20 text-[#8B5CF6]"
                        }`}
                      >
                        {isLinkedin ? (
                          <Briefcase className="w-4 h-4" />
                        ) : (
                          <BookOpen className="w-4 h-4" />
                        )}
                      </div>
                      <Badge variant={isLinkedin ? "primary" : "accent"}>
                        {isLinkedin ? "Cover Letter" : "Smart Notes"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onToggleSave(item.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          item.is_saved
                            ? "bg-[#4F8DFF]/20 border-[#4F8DFF] text-[#4F8DFF]"
                            : "bg-white/5 border-white/8 text-[#71717a] hover:text-white"
                        }`}
                        title="Bookmark item"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 rounded-lg bg-white/5 border border-white/8 text-[#71717a] hover:text-[#ff5f56] hover:border-[#ff5f56]/40 transition-colors"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Card Title */}
                  <h3 className="font-bold text-white text-base line-clamp-1 mb-1">
                    {item.title}
                  </h3>

                  {/* Metadata source link */}
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#4F8DFF] hover:underline flex items-center gap-1 mb-3 truncate"
                  >
                    <span>{item.source_url}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>

                  {/* Markdown excerpt */}
                  <p className="text-xs text-[#71717a] line-clamp-4 leading-relaxed font-sans bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                    {item.content_markdown}
                  </p>
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-4 border-t border-white/8 flex items-center justify-between">
                  <span className="text-[11px] text-[#71717a]">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewItem(item)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Inspect
                    </Button>
                    <CopyButton text={item.content_markdown} label="Copy" />
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Inspector Modal */}
      <AnimatePresence>
        {previewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl rounded-[24px] glass-card border border-white/20 p-8 max-h-[85vh] flex flex-col justify-between overflow-hidden relative"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <div>
                    <Badge
                      variant={
                        previewItem.platform === "linkedin"
                          ? "primary"
                          : "accent"
                      }
                      className="mb-1"
                    >
                      {previewItem.platform.toUpperCase()} AI OUTPUT
                    </Badge>
                    <h2 className="text-xl font-bold text-white">
                      {previewItem.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => setPreviewItem(null)}
                    className="text-sm text-[#71717a] hover:text-white px-3 py-1.5 rounded-xl bg-white/5"
                  >
                    Close
                  </button>
                </div>

                <div className="overflow-y-auto max-h-[55vh] p-5 rounded-2xl bg-[#0c0c10] border border-white/10 text-sm text-[#f4f4f5] leading-relaxed whitespace-pre-wrap font-sans">
                  {previewItem.content_markdown}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6">
                <a
                  href={previewItem.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#4F8DFF] hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open original source webpage
                </a>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      downloadMarkdownFile(
                        previewItem.title,
                        previewItem.content_markdown
                      )
                    }
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-[#f4f4f5] hover:bg-white/10 transition-colors"
                  >
                    Download .MD
                  </button>
                  <CopyButton
                    text={previewItem.content_markdown}
                    label="Copy Full Markdown"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setPreviewItem(null)}
                  >
                    Done
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
