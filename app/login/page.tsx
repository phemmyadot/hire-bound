"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [mode, setMode]         = useState<"login" | "register">("login");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const res = await fetch(`${apiUrl}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.detail ?? "Registration failed");
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0f1117",
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 400,
        padding: "2.5rem",
        background: "#1a1d27",
        borderRadius: 12,
        border: "1px solid #2a2d3a",
      }}>
        <h1 style={{ margin: "0 0 0.25rem", fontSize: "1.5rem", fontWeight: 700, color: "#fff" }}>
          HireBound
        </h1>
        <p style={{ margin: "0 0 2rem", fontSize: "0.875rem", color: "#8b8fa8" }}>
          {mode === "login" ? "Sign in to your account" : "Create a new account"}
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label style={{ fontSize: "0.8125rem", color: "#c4c7d4", fontWeight: 500 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{
                padding: "0.625rem 0.75rem",
                background: "#0f1117",
                border: "1px solid #2a2d3a",
                borderRadius: 6,
                color: "#fff",
                fontSize: "0.9375rem",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label style={{ fontSize: "0.8125rem", color: "#c4c7d4", fontWeight: 500 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              style={{
                padding: "0.625rem 0.75rem",
                background: "#0f1117",
                border: "1px solid #2a2d3a",
                borderRadius: 6,
                color: "#fff",
                fontSize: "0.9375rem",
                outline: "none",
              }}
            />
          </div>

          {error && (
            <p style={{ margin: 0, fontSize: "0.8125rem", color: "#f87171" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.6875rem",
              background: loading ? "#2a2d3a" : "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontSize: "0.9375rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "0.25rem",
            }}
          >
            {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "#8b8fa8" }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            style={{
              background: "none",
              border: "none",
              color: "#3b82f6",
              cursor: "pointer",
              fontSize: "0.875rem",
              padding: 0,
            }}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
