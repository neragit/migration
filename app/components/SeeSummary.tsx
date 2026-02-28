//app/components/SeeSummary.tsx

"use client";

import { useEffect, useState, useRef } from "react";
import type { AnswersState } from "@/types/answers";

interface AllResponsesStats {
  sliderAverage: number;
  sliderPercent: number;
  yesPercent: number;
  noPercent: number;
  expectMoreCounts: Record<string, number>;
  nativeLanguageCounts: Record<string, number>;
}

interface SeeSummaryProps {
  answers: AnswersState;
  sessionId: string | null;
  isLoading: boolean;
  hasSubmitted: boolean;
  onSubmit: () => Promise<void>;
}

// ── Animated gauge (half-circle) ──
function Gauge({
  percent,
  color,
  label,
  sublabel,
  size = 160,
  delay = 0,
}: {
  percent: number;
  color: string;
  label: string;
  sublabel?: string;
  size?: number;
  delay?: number;
}) {
  const [animated, setAnimated] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimated(percent);
    }, delay);
    return () => clearTimeout(timeout);
  }, [percent, delay]);

  const strokeWidth = 14;
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = Math.PI * r; // half circle
  const offset = circumference - (circumference * Math.min(animated, 100)) / 100;

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div style={{ position: "relative", width: size, height: size / 2 + strokeWidth / 2 }}>
        <svg
          width={size}
          height={size / 2 + strokeWidth}
          viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}
          style={{ overflow: "visible" }}
        >
          {/* Track */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Fill */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: `stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
            }}
          />
          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = -180 + (tick / 100) * 180;
            const rad = (angle * Math.PI) / 180;
            const x1 = cx + (r - strokeWidth / 2 - 4) * Math.cos(rad);
            const y1 = cy + (r - strokeWidth / 2 - 4) * Math.sin(rad);
            const x2 = cx + (r + strokeWidth / 2 + 4) * Math.cos(rad);
            const y2 = cy + (r + strokeWidth / 2 + 4) * Math.sin(rad);
            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#e5e7eb"
                strokeWidth={1}
              />
            );
          })}
        </svg>
        {/* Value */}
        <div
          style={{
            position: "absolute",
            bottom: 4,
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              fontFamily: "Mukta, sans-serif",
              color: color,
              lineHeight: 1,
            }}
          >
            {animated.toFixed(0)}%
          </span>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontSize: "0.6rem",
            fontFamily: "Mukta, sans-serif",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#9ca3af",
            margin: 0,
          }}
        >
          {label}
        </p>
        {sublabel && (
          <p
            style={{
              fontSize: "0.72rem",
              fontFamily: "Mukta, sans-serif",
              color: "#6b7280",
              margin: "2px 0 0",
            }}
          >
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Yes/No bar ──
function YesNoBar({
  yesPercent,
  noPercent,
}: {
  yesPercent: number;
  noPercent: number;
}) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: "0.6rem",
            fontFamily: "Mukta, sans-serif",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#9ca3af",
          }}
        >
          Da — {yesPercent.toFixed(0)}%
        </span>
        <span
          style={{
            fontSize: "0.6rem",
            fontFamily: "Mukta, sans-serif",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#9ca3af",
          }}
        >
          {noPercent.toFixed(0)}% — Ne
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: 8,
          background: "#f3f4f6",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: animated ? `${yesPercent}%` : "0%",
            background: "linear-gradient(90deg, #c51b8a, #e879b0)",
            borderRadius: 4,
            transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1) 600ms",
          }}
        />
      </div>
    </div>
  );
}

// ── Answer pill ──
function AnswerRow({
  question,
  answer,
  index,
  context,
  options,
}: {
  question: string;
  answer: string | number | null | undefined;
  index: number;
  context?: string | null;
  options?: string[];
}) {
  return (
    <div
      style={{
        padding: "12px 0",
        borderBottom: "1px solid #f3f4f6",
        animation: `fadeSlideIn 0.4s ease both`,
        animationDelay: `${index * 80}ms`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <span style={{
            fontSize: "0.6rem",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#9ca3af",
            margin: "2rem 0 0.25rem",
          }}>
            {question}
          </span>
          {context && (
            <p style={{ fontSize: "0.68rem", fontFamily: "Mukta, sans-serif", color: "#c51b8a", margin: "2px 0 0" }}>
              {context}
            </p>
          )}
        </div>

        {options ? (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {options.map((opt) => {
              const chosen = String(answer) === opt;
              return (
                <span
                  key={opt}
                  style={{
                    fontSize: "0.72rem",
                    fontFamily: "Mukta, sans-serif",
                    fontWeight: chosen ? 700 : 400,
                    color: chosen ? "#c51b8a" : "#9ca3af",
                    background: chosen ? "#fdf2f8" : "transparent",
                    border: `1px solid ${chosen ? "#c51b8a" : "#e5e7eb"}`,
                    borderRadius: 4,
                    padding: "2px 10px",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s",
                  }}
                >
                  {opt}
                </span>
              );
            })}
          </div>
        ) : (
          <span
            style={{
              fontSize: "0.78rem",
              fontFamily: "Mukta, sans-serif",
              fontWeight: 600,
              color: "#374151",
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: 4,
              padding: "2px 10px",
              whiteSpace: "nowrap",
            }}
          >
            {answer != null ? String(answer) : "—"}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Corner decoration (from BiggerPicture) ──
function CornerMarks() {
  return (
    <>
      {(["tl", "tr", "bl", "br"] as const).map((pos) => (
        <div
          key={pos}
          style={{
            position: "absolute",
            width: 12,
            height: 12,
            borderColor: "#c51b8a",
            borderStyle: "solid",
            opacity: 0.4,
            zIndex: 10,
            ...(pos === "tl"
              ? { top: 10, left: 10, borderWidth: "2px 0 0 2px" }
              : pos === "tr"
                ? { top: 10, right: 10, borderWidth: "2px 2px 0 0" }
                : pos === "bl"
                  ? { bottom: 10, left: 10, borderWidth: "0 0 2px 2px" }
                  : { bottom: 10, right: 10, borderWidth: "0 2px 2px 0" }),
          }}
        />
      ))}
    </>
  );
}

export default function SeeSummary({
  answers,
  sessionId,
  isLoading,
  hasSubmitted,
  onSubmit,
}: SeeSummaryProps) {
  const [allResponsesStats, setAllResponsesStats] =
    useState<AllResponsesStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const fixedOuterPercent = 4.4;

  useEffect(() => {
    if (hasSubmitted && answers.sliderValue != null) {
      setLoadingStats(true);
      fetch(`/api/summary?userSlider=${answers.sliderValue}`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error ${res.status}`);
          return res.json();
        })
        .then((data) => setAllResponsesStats(data))
        .catch(console.error)
        .finally(() => setLoadingStats(false));
    }
  }, [hasSubmitted, answers.sliderValue]);

  const clamp = (val: number) => Math.max(0, Math.min(100, val));

  // ── Pre-submit CTA ──
  if (!hasSubmitted) {
    return (
      <div className="mt-20 text-center">
        <button
          onClick={onSubmit}
          disabled={!sessionId || isLoading}
          className="card-btn active"
        >
          {isLoading ? "Spremanje..." : "Usporedi odgovore"}
        </button>
      </div>
    );
  }

  const userPercent = answers.sliderValue != null ? clamp(answers.sliderValue) : 0;
  const avgPercent = allResponsesStats ? clamp(allResponsesStats.sliderAverage) : 0;

  const topAnswer = (counts: Record<string, number>) => {
    if (!counts || Object.keys(counts).length === 0) return null;
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  };

  const answerRows = [
    {
      question: "Ljudi koriste uglavnom materinski jezik na društvenim mrežama",
      answer: answers.nativeLanguage,
      options: ["Da", "Ne", "Ovisi"],  // match your actual button values
      context: allResponsesStats
        ? `Većina: ${topAnswer(allResponsesStats.nativeLanguageCounts)}`
        : null,
    },
    {
      question: "Migranti koriste Meta platforme",
      answer: answers.usesMeta,
      options: ["Da", "Ne", "Ne znam"],
      context: null,
    },
    {
      question: "Očekivali ste višu procjenu za",
      answer: answers.expectMore,
      options: ["EU migrante", "Ne-EU migrante", "Podjednako"],
      context: allResponsesStats
        ? `Većina: ${topAnswer(allResponsesStats.expectMoreCounts)}`
        : null,
    },
    {
      question: "Digitalni tragovi su važan izvor podataka",
      answer: answers.considerMeta,
      options: ["Da, svakako", "Da, ali uz oprez", "Ne, nikako"],
      context: null,
    },
  ];

  return (
    <div
      style={{
        marginTop: "5rem",
        fontFamily: "Mukta, sans-serif",
      }}
    >
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <p
          style={{
            color: "#c51b8a",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            margin: "0 0 0.75rem",
          }}
        >
          Usporedba odgovora
        </p>


      </div>

      {/* Loading */}
      {loadingStats && (
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <div
            style={{
              display: "inline-block",
              width: 28,
              height: 28,
              border: "3px solid #f3f4f6",
              borderTopColor: "#c51b8a",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {allResponsesStats && (
        <div
          style={{
            animation: "fadeIn 0.6s ease both",
            maxWidth: 820,
            margin: "0 auto",
          }}
        >
          {/* ── Gauges card ── */}
          <div
            style={{
              position: "relative",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 2,
              boxShadow:
                "0 1px 3px 0 rgba(0,0,0,0.06), 0 4px 24px 0 rgba(0,0,0,0.04)",
              padding: "2rem 2.5rem 2.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <CornerMarks />

            <p
              style={{
                fontSize: "0.6rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#9ca3af",
                margin: "0 0 1.75rem",
                textAlign: "center",
              }}
            >
              Udio stranih radnika u Hrvatskoj
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "2rem",
                justifyItems: "center",
              }}
            >
              <Gauge
                percent={fixedOuterPercent}
                color="#f59e0b"
                label="Službeni podatak"
                sublabel="MUP"
                size={150}
                delay={0}
              />
              <Gauge
                percent={avgPercent}
                color="#93c5fd"
                label="Prosjek posjetitelja"
                sublabel="Svi odgovori"
                size={150}
                delay={200}
              />
              <Gauge
                percent={userPercent}
                color="#c51b8a"
                label="Vaša procjena"
                sublabel="Vaš unos"
                size={150}
                delay={400}
              />
            </div>

            {/* Divider */}
            <div
              style={{
                width: "100%",
                height: 1,
                background: "#f3f4f6",
                margin: "2rem 0 1.5rem",
              }}
            />

            {/* Yes/No bar */}
            <p
              style={{
                fontSize: "0.6rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#9ca3af",
                margin: "0 0 1rem",
                textAlign: "center",
              }}
            >
              Koriste li migranti Meta platforme?
            </p>
            <YesNoBar
              yesPercent={allResponsesStats.yesPercent}
              noPercent={allResponsesStats.noPercent}
            />

            <div
              style={{
                width: "100%",
                height: 1,
                background: "#f3f4f6",
                margin: "2rem 0 1.5rem",
              }}
            />

            {answerRows.map((row, i) => (
              <AnswerRow
                key={row.question}
                question={row.question}
                answer={row.answer}
                index={i}
                context={row.context}
              />
            ))}

          </div>
        </div>
      )}
    </div>
  );
}