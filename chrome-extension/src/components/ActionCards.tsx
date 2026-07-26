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
  Edit3,
  MessageSquare,
  Layers,
  BarChart2,
  UserPlus,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Building2,
  CheckSquare,
  Send,
  Clock,
  Heart,
  Tv,
  Compass,
  Star,
  Users,
  Share2,
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
        return <FileText className="w-4 h-4 text-blue-400" />;
      case "Briefcase":
        return <Briefcase className="w-4 h-4 text-purple-400" />;
      case "BookOpen":
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case "Award":
        return <Award className="w-4 h-4 text-amber-400" />;
      case "Edit3":
        return <Edit3 className="w-4 h-4 text-pink-400" />;
      case "Sparkles":
        return <Sparkles className="w-4 h-4 text-yellow-400" />;
      case "MessageSquare":
      case "MessageCircle":
        return <MessageSquare className="w-4 h-4 text-cyan-400" />;
      case "Layers":
        return <Layers className="w-4 h-4 text-indigo-400" />;
      case "BarChart2":
        return <BarChart2 className="w-4 h-4 text-emerald-400" />;
      case "UserPlus":
      case "Users":
        return <Users className="w-4 h-4 text-blue-400" />;
      case "CheckCircle2":
      case "CheckSquare":
      case "FileCheck":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "HelpCircle":
        return <HelpCircle className="w-4 h-4 text-amber-400" />;
      case "TrendingUp":
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "Building2":
        return <Building2 className="w-4 h-4 text-purple-400" />;
      case "Send":
        return <Send className="w-4 h-4 text-blue-400" />;
      case "Clock":
        return <Clock className="w-4 h-4 text-orange-400" />;
      case "Heart":
        return <Heart className="w-4 h-4 text-rose-400" />;
      case "Tv":
        return <Tv className="w-4 h-4 text-red-400" />;
      case "Compass":
        return <Compass className="w-4 h-4 text-teal-400" />;
      case "Star":
        return <Star className="w-4 h-4 text-yellow-400" />;
      case "Share2":
        return <Share2 className="w-4 h-4 text-indigo-400" />;
      case "Twitter":
        return <Share2 className="w-4 h-4 text-sky-400" />;
      default:
        return <Search className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Sleek Raycast/Linear Label Bar */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          Context-Ready Actions
        </span>
        <span className="text-[11px] text-zinc-400 font-medium">
          Zero-Click AI
        </span>
      </div>

      {/* Action Cards Grid */}
      <div className="space-y-2.5">
        {actions.map((action, idx) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            onClick={() => !isExecuting && onSelectAction(action.id)}
            className={`group p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-blue-500/40 transition-all cursor-pointer shadow-md relative overflow-hidden ${
              isExecuting ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  {getIcon(action.iconName)}
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-white text-xs group-hover:text-blue-400 transition-colors flex items-center gap-1.5 truncate">
                    <span>{action.title}</span>
                  </h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                    {action.description}
                  </p>
                </div>
              </div>

              {/* Keyboard Shortcut Pill & Action Arrow */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 group-hover:text-white group-hover:border-white/20 transition-all">
                  {action.badgeText}
                </span>
                <span className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors text-zinc-500">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
