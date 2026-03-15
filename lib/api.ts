interface ClaudeOptions {
  system: string;
  userContent: unknown;
  maxTokens?: number;
}

export async function callClaude<T = unknown>({
  system,
  userContent,
  maxTokens = 4000,
}: ClaudeOptions): Promise<T> {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, userContent, maxTokens }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const raw: string = data.content?.map((c: { text?: string }) => c.text || "").join("") || "";
  return JSON.parse(raw.replace(/```json|```/g, "").trim()) as T;
}
