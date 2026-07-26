import React from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  BookOpen,
  Award,
  Search,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export interface ActionCardItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  confidence: number;
  badgeText: string;
}

interface ActionCardsProps {
  actions: ActionCardItem[];
  onSelectAction: (actionId: string) => void;
  isExecuting: boolean;
}

export function ActionCards({
  actions,
  onSelectAction,
  isExecuting,
}: ActionCardsProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "FileText":
        return <FileText className="w-5 h-5 text-[#4F8DFF]" />;
      case "Briefcase":
        return <Briefcase className="w-5 h-5 text-[#8B5CF6]" />;
      case "BookOpen":
        return <BookOpen className="w-5 h-5 text-[#10B981]" />;
      case "Award":
        return <Award className="w-5 h-5 text-[#F59E0B]" />;
      default:
        return <Search className="w-5 h-5 text-[#4F8DFF]" />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Label Bar */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#4F8DFF]" />
          Ready Actions (Zero-Click)
        </span>
        <span className="text-[11px] text-[#10B981] font-mono">
          98% Confidence
        </span>
      </div>

      {/* Action Cards Grid */}
      <div className="space-y-3">
        {actions.map((action, idx) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => !isExecuting && onSelectAction(action.id)}
            className={`group p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#4F8DFF] hover:bg-gradient-to-r hover:from-[#4F8DFF]/10 hover:to-transparent transition-all cursor-pointer shadow-glass relative overflow-hidden ${
              isExecuting ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {getIcon(action.iconName)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-[#4F8DFF] transition-colors flex items-center gap-1.5">
                    {action.title}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white font-normal">
                      {action.badgeText}
                    </span>
                  </h4>
                  <p className="text-xs text-[#71717a] mt-0.5 leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </div>

              <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#71717a] group-hover:text-white group-hover:bg-[#4F8DFF] transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Strict zero-input reminder banner */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-[#4F8DFF]/5 to-[#8B5CF6]/5 border border-white/5 text-center">
        <p className="text-[11px] text-[#71717a]">
          <span className="text-[#f4f4f5] font-semibold">Zero-Input Guaranteed:</span>{" "}
          No chatbot textboxes or typing required. Click any card to handcraft
          output instantly.
        </p>
      </div>
    </div>
  );
}
