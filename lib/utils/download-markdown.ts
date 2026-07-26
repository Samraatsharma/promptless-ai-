/**
 * Utility helper to trigger browser download of formatted Markdown content (.md).
 * Cleans and slugifies the title without leading or trailing hyphens.
 */
export function downloadMarkdownFile(title: string, markdownContent: string) {
  if (typeof window === "undefined") return;

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const blob = new Blob([markdownContent], {
    type: "text/markdown;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug || "promptless-ai-output"}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
