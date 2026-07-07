"use client";

import { FormEvent, useEffect, useState } from "react";

type UpdateResult = {
  ok?: boolean;
  updatedAtKst?: string;
  count?: number;
  error?: string;
  message?: string;
};

const STORAGE_KEY = "naver-blog-player-cron-secret";

export function ManualUpdateForm() {
  const [secret, setSecret] = useState("");
  const [remember, setRemember] = useState(false);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<UpdateResult | null>(null);

  useEffect(() => {
    const savedSecret = window.localStorage.getItem(STORAGE_KEY);

    if (savedSecret) {
      setSecret(savedSecret);
      setRemember(true);
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setResult(null);

    if (remember) {
      window.localStorage.setItem(STORAGE_KEY, secret);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }

    try {
      const response = await fetch("/api/cron/update-top-tracks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`
        }
      });
      const payload = (await response.json()) as UpdateResult;
      setResult(payload);
    } catch (error) {
      setResult({
        ok: false,
        error: "REQUEST_FAILED",
        message: error instanceof Error ? error.message : "Request failed."
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
      <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 700 }}>
        CRON_SECRET
        <input
          autoComplete="current-password"
          onChange={(event) => setSecret(event.target.value)}
          placeholder="Vercel에 저장한 CRON_SECRET"
          required
          style={{
            border: "1px solid #cfcfcf",
            fontSize: 14,
            height: 40,
            padding: "0 10px"
          }}
          type="password"
          value={secret}
        />
      </label>

      <label style={{ alignItems: "center", color: "#555", display: "flex", gap: 8, fontSize: 13 }}>
        <input checked={remember} onChange={(event) => setRemember(event.target.checked)} type="checkbox" />
        이 브라우저에 저장
      </label>

      <button
        disabled={pending}
        style={{
          background: pending ? "#8fd8aa" : "#1db954",
          border: 0,
          color: "#07130b",
          cursor: pending ? "wait" : "pointer",
          fontSize: 14,
          fontWeight: 700,
          height: 42
        }}
        type="submit"
      >
        {pending ? "갱신 중..." : "지금 순위 갱신"}
      </button>

      {result ? (
        <pre
          style={{
            background: result.ok ? "#eefaf2" : "#fff0f0",
            border: `1px solid ${result.ok ? "#bce7c9" : "#f0b8b8"}`,
            color: "#202020",
            fontSize: 12,
            lineHeight: "18px",
            margin: 0,
            overflow: "auto",
            padding: 12,
            whiteSpace: "pre-wrap"
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      ) : null}
    </form>
  );
}
