const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── authenticated fetch helper ───────────────────────────────────────────────

export async function apiFetch(path: string, token: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers as Record<string, string>),
    },
  });
}

// ── Claude via backend prompt ─────────────────────────────────────────────────

interface ClaudeOptions {
  promptName: string;
  userContent?: unknown;
  vars?: Record<string, unknown>;
  maxTokens?: number;
  token?: string;
}

export async function callClaude<T = unknown>({
  promptName,
  userContent,
  vars = {},
  maxTokens = 4000,
  token,
}: ClaudeOptions): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/claude`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      prompt_name: promptName,
      user_content: userContent ?? null,
      max_tokens: maxTokens,
      vars,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const raw: string = data.content?.map((c: { text?: string }) => c.text || "").join("") || "";
  return JSON.parse(raw.replace(/```json|```/g, "").trim()) as T;
}
