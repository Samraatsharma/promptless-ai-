"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Mail, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, isLoading, error } = useAuth();
  const [email, setEmail] = React.useState("");
  const [emailSent, setEmailSent] = React.useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const res = await signInWithEmail(email);
    if (res.success) {
      setEmailSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Brand Logo link back to home */}
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4F8DFF] to-[#8B5CF6] p-0.5">
            <div className="w-full h-full bg-[#09090b] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#4F8DFF]" />
            </div>
          </div>
          <span className="font-bold text-base text-white">
            Promptless<span className="text-shimmer">AI</span>
          </span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <GlassCard glowColor="primary" className="p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-2">
            <Badge variant="primary">Secure Authentication</Badge>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome to Promptless AI
            </h1>
            <p className="text-sm text-[#71717a]">
              Sign in to sync your saved LinkedIn cover letters and YouTube notes
              across your web dashboard and Chrome Extension.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-xl bg-[#ff5f56]/10 border border-[#ff5f56]/30 text-xs text-[#ff5f56] space-y-1">
              <p className="font-bold">{error.problem}</p>
              <p className="text-white/80">{error.reason}</p>
              <p className="text-[#10B981] font-medium pt-1">Fix: {error.fix}</p>
            </div>
          )}

          {/* Google OAuth Login Button */}
          <div className="space-y-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full shadow-[0_4px_24px_rgba(79,141,255,0.4)]"
              onClick={signInWithGoogle}
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue with Google
            </Button>

            <div className="relative flex items-center justify-center py-2">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#121217] px-3 text-xs text-[#71717a] absolute">
                or sign in with magic link
              </span>
            </div>

            {/* Magic Link Email Form */}
            {emailSent ? (
              <div className="p-5 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/30 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#10B981] mx-auto" />
                <h3 className="font-bold text-white text-sm">
                  Check your inbox
                </h3>
                <p className="text-xs text-[#f4f4f5]/80">
                  We sent a secure magic login link to{" "}
                  <strong className="text-white">{email}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#71717a] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full h-11 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#4F8DFF] focus:outline-none text-sm text-white placeholder:text-[#71717a] transition-colors"
                  />
                </div>
                <Button
                  type="submit"
                  variant="glass"
                  size="md"
                  className="w-full"
                  isLoading={isLoading}
                >
                  Send Magic Link
                </Button>
              </form>
            )}
          </div>

          <div className="pt-4 border-t border-white/8 text-center">
            <span className="text-xs text-[#71717a] flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#10B981]" />
              256-bit encrypted session • Zero-password security
            </span>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
