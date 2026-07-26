"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: {
    problem: string;
    reason: string;
    fix: string;
    verification: string;
  } | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (mounted) {
          setState({
            user: session?.user ?? null,
            isLoading: false,
            error: null,
          });
        }
      } catch (err: unknown) {
        if (mounted) {
          setState({
            user: null,
            isLoading: false,
            error: {
              problem: "Authentication session initialization failed.",
              reason: err instanceof Error ? err.message : "Failed to communicate with Supabase Auth.",
              fix: "Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are valid in .env.local.",
              verification: "Reload the application to re-initialize the auth session.",
            },
          });
        }
      }
    }

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setState((prev) => ({
          ...prev,
          user: session?.user ?? null,
          isLoading: false,
        }));
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signInWithGoogle = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (err: unknown) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: {
          problem: "Google OAuth sign-in failed.",
          reason: err instanceof Error ? err.message : "OAuth provider rejected sign-in request.",
          fix: "Verify Google OAuth credentials are enabled in Supabase Dashboard -> Authentication -> Providers.",
          verification: "Try signing in again after checking Supabase provider settings.",
        },
      }));
    }
  };

  const signInWithEmail = async (email: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
      return { success: true };
    } catch (err: unknown) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: {
          problem: "Email OTP sign-in failed.",
          reason: err instanceof Error ? err.message : "Could not dispatch authentication email.",
          fix: "Check Supabase email provider settings and ensure the email address is formatted correctly.",
          verification: "Request a new login link and inspect your email inbox.",
        },
      }));
      return { success: false, error: err instanceof Error ? err.message : "OTP failed" };
    }
  };

  const signOut = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await supabase.auth.signOut();
      setState({
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: {
          problem: "Sign out failed.",
          reason: err instanceof Error ? err.message : "Session termination error.",
          fix: "Clear local browser cookies and storage for this origin.",
          verification: "Verify user is returned to anonymous state.",
        },
      }));
    }
  };

  return {
    ...state,
    signInWithGoogle,
    signInWithEmail,
    signOut,
  };
}
