// System prompts are stored in the backend database (prompts table).
// Use callClaude({ promptName: "resume" | "jobs", vars, userContent }) — the backend
// fetches the active prompt, substitutes template variables, and calls Anthropic.
//
// To view or edit prompts: GET/PATCH /prompts via the API (authenticated).
