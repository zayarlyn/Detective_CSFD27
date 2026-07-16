"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HintCard } from "@/components/hints/hint-card";
import { HOUSE_META } from "@/lib/constants/houses";
import type { Hint, MenteeCase } from "@/types";

export function HintsSection() {
  const [hints, setHints] = useState<Hint[]>([]);
  const [cases, setCases] = useState<MenteeCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/hints").then((r) => r.json()),
      fetch("/api/auth/me").then((r) => r.json()),
    ])
      .then(([hintsData, meData]) => {
        setHints(hintsData.hints ?? []);
        setCases(meData.cases ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        style={{
          padding: "20px 0",
          textAlign: "center",
          fontSize: 9,
          color: "#A0907E",
          letterSpacing: 2,
          fontFamily: "'Special Elite', monospace",
        }}
      >
        LOADING...
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* ── ASSIGNED CASE(S) ── */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <div
            style={{
              fontSize: 8,
              color: "#8b2020",
              letterSpacing: 3,
              fontFamily: "'Special Elite', monospace",
            }}
          >
            {cases.length > 1 ? "ASSIGNED CASES" : "ASSIGNED CASE"}
          </div>
          <div
            style={{
              transform: "rotate(-3deg)",
              border: "1px solid rgba(139,32,32,0.4)",
            }}
            className="grid place-items-center px-2 py-1.5"
          >
            <span
              style={{
                fontSize: 7,
                color: "rgba(139,32,32,0.6)",
                letterSpacing: 2,
                fontFamily: "'Special Elite', monospace",
                lineHeight: 1
              }}
            >
              SENIOR ONLY
            </span>
          </div>
        </div>

        {cases.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cases.map(({ mentee }) => {
              const houseMeta = HOUSE_META[mentee.house];
              return (
                <Link
                  key={mentee.id}
                  href={`/agent/${mentee.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="torn-edges"
                    style={{
                      background: "#E5E0CF",
                      border: "1px solid rgba(47,36,31,0.12)",
                      padding: "12px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        border: "1px solid rgba(47,36,31,0.15)",
                        flexShrink: 0,
                        overflow: "hidden",
                        background: "#D6CEBF",
                        backgroundImage: `url("${mentee.profileUrl ?? '/detective-conan-pfp.png'}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          color: "#1C1A17",
                          marginBottom: 4,
                          fontFamily: "'Cinzel Decorative', serif",
                          lineHeight: 1.3,
                        }}
                      >
                        {mentee.displayName}
                      </div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {houseMeta && (
                          <span
                            style={{
                              fontSize: 7,
                              padding: "1px 6px",
                              border: `1px solid ${houseMeta.color}4D`,
                              color: houseMeta.color,
                              background: `${houseMeta.color}1A`,
                              letterSpacing: 1,
                              fontFamily: "'Special Elite', monospace",
                            }}
                          >
                            {houseMeta.name.toUpperCase()}
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: 7,
                            padding: "1px 6px",
                            border: "1px solid rgba(139,32,32,0.25)",
                            color: "#8b2020",
                            background: "rgba(139,32,32,0.06)",
                            letterSpacing: 1,
                            fontFamily: "'Special Elite', monospace",
                          }}
                        >
                          JUNIOR
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              background: "#E5E0CF",
              border: "1px solid rgba(47,36,31,0.1)",
              padding: "16px 14px",
              textAlign: "center",
              fontSize: 9,
              color: "#A0907E",
              letterSpacing: 1,
              fontFamily: "'Special Elite', monospace",
            }}
          >
            NO MENTEE ASSIGNED
          </div>
        )}
      </div>

      {/* ── EVIDENCE HINTS ── */}
      {hints.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 8,
              color: "#A0907E",
              letterSpacing: 3,
              marginBottom: 10,
              fontFamily: "'Special Elite', monospace",
            }}
          >
            EVIDENCE HINTS
          </div>
          {cases.length > 1
            ? cases.map(({ pcodeId, mentee }) => {
                const caseHints = hints.filter((h) => h.pcodeId === pcodeId);
                if (caseHints.length === 0) return null;
                return (
                  <div key={pcodeId} style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        fontSize: 7,
                        color: "#A0907E",
                        letterSpacing: 1,
                        marginBottom: 6,
                        fontFamily: "'Special Elite', monospace",
                      }}
                    >
                      RE: {mentee.displayName.toUpperCase()}
                    </div>
                    {caseHints.map((hint, i) => (
                      <HintCard
                        key={hint.id}
                        hint={hint}
                        index={i + 1}
                        variant="senior"
                      />
                    ))}
                  </div>
                );
              })
            : hints.map((hint, i) => (
                <HintCard
                  key={hint.id}
                  hint={hint}
                  index={i + 1}
                  variant="senior"
                />
              ))}
        </div>
      )}
    </div>
  );
}
