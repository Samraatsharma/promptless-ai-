import { z } from "zod";

const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("Must be a valid Supabase project URL")
    .optional()
    .default("https://your-project.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(10, "Anon key too short")
    .optional()
    .default("your-supabase-anon-key"),
  GEMINI_API_KEY: z.string().optional().default("your-google-gemini-api-key"),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .default("http://localhost:3000"),
});

export type EnvConfig = z.infer<typeof EnvSchema>;

/**
 * Validates essential environment variables at runtime and returns typed keys.
 * Does not throw during static builds, allowing zero-config local development.
 */
export function validateEnvironmentVariables(): {
  isValid: boolean;
  config: EnvConfig;
  warnings: string[];
} {
  const result = EnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  const warnings: string[] = [];
  if (
    !process.env.GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY === "your-google-gemini-api-key"
  ) {
    warnings.push(
      "GEMINI_API_KEY is not configured. Falling back to high-fidelity AI mocks."
    );
  }
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL === "https://your-project.supabase.co"
  ) {
    warnings.push(
      "NEXT_PUBLIC_SUPABASE_URL is using default placeholder. Supabase authentication will run in development mode."
    );
  }

  return {
    isValid: result.success,
    config: result.success ? result.data : EnvSchema.parse({}),
    warnings,
  };
}
