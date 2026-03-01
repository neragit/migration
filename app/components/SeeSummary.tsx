//app/components/SeeSummary.tsx

"use client";

import { useEffect, useState, useRef } from "react";
import type { AnswersState } from "@/types/answers";

interface AllResponsesStats {
  sliderAverage: number;
  sliderPercent: number;
  foreignWorkersPercentAverage: number;
  foreignWorkersCounts: Record<string, number>;
  topNationalities: string[];
  nativeLanguageYesPercent: number;
  nativeLanguageNoPercent: number;
  usesMetaYesPercent: number;
  usesMetaNoPercent: number;
  metaAccuracyYesPercent: number;
  metaAccuracyNoPercent: number;
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

const MUP_TOP_10 = [
  "Bosna i Hercegovina",
  "Nepal",
  "Srbija",
  "Filipini",
  "Indija",
  "Sj. Makedonija",
  "Kosovo",
  "Uzbekistan",
  "Egipat",
  "Bangladeš",
];

const SECTION_LABEL: React.CSSProperties = {
  fontSize: "0.8rem",
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#9ca3af",
  margin: "0 0 1.25rem",
  padding: "20px 0",
  textAlign: "center",

};

const DIVIDER = <div style={{ width: "100%", height: 1, background: "#f3f4f6", margin: "2rem 0 1.5rem" }} />;

// ── Animated gauge (half-circle) ──
function Gauge({
  percent,
  color,
  label,
  sublabel,
  displayValue,
  size = 150,
  delay = 0,
  isAbsolute = false,
}: {
  percent: number;
  color: string;
  label: string;
  sublabel?: string;
  displayValue?: string;
  size?: number;
  delay?: number;
  isAbsolute?: boolean;
}) {
  const [animated, setAnimated] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimated(percent), delay);
    return () => clearTimeout(timeout);
  }, [percent, delay]);

  const strokeWidth = 14;
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = Math.PI * r;
  const offset = circumference - (circumference * Math.min(animated, 100)) / 100;

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ position: "relative", width: size, height: size / 2 + strokeWidth / 2 }}>
        <svg width={size} height={size / 2 + strokeWidth} viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`} style={{ overflow: "visible" }}>
          <path d={`M ${strokeWidth / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`} fill="none" stroke="#f3f4f6" strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d={`M ${strokeWidth / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: `stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms` }} />
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = -180 + (tick / 100) * 180;
            const rad = (angle * Math.PI) / 180;
            const x1 = cx + (r - strokeWidth / 2 - 1) * Math.cos(rad);
            const y1 = cy + (r - strokeWidth / 2 - 1) * Math.sin(rad);
            const x2 = cx + (r + strokeWidth / 2 + 1) * Math.cos(rad);
            const y2 = cy + (r + strokeWidth / 2 + 1) * Math.sin(rad);
            return <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e5e7eb" strokeWidth={1} />;
          })}
        </svg>
        <div style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", textAlign: "center", whiteSpace: "nowrap" }}>
          <span style={{ fontSize: isAbsolute ? "0.9rem" : "1.6rem", fontWeight: 700, color, lineHeight: 1 }}>
            {displayValue ?? `${animated.toFixed(0)}%`}
          </span>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9ca3af", margin: 0 }}>
          {label}
        </p>
        {sublabel && (
          <p style={{ fontSize: "0.68rem", color: "#6b7280", margin: "2px 0 0" }}>
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Opinion horizontal bar ──
function OpinionBar({ label, count, total, delay, userAnswer }: { label: string; count: number; total: number; delay: number; userAnswer?: string }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const pct = total > 0 ? (count / total) * 100 : 0;
  const isChosen = userAnswer === label;

  return (
    <div style={{ marginBottom: "0.92rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ fontSize: "0.75rem", color: isChosen ? "#c51b8a" : "#374151", fontWeight: isChosen ? 700 : 400 }}>
          {label}
        </span>
        <span style={{ fontSize: "0.72rem", fontWeight: 600, color: isChosen ? "#c51b8a" : "#9ca3af" }}>
          {pct.toFixed(0)}%
        </span>
      </div>
      <div style={{ width: "100%", height: 6, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: animated ? `${pct}%` : "0%", background: isChosen ? "linear-gradient(90deg, #c51b8a, #e879b0)" : "#d1d5db", borderRadius: 4, transition: "width 1.1s cubic-bezier(0.4, 0, 0.2, 1)" }} />
      </div>
    </div>
  );
}
// ── Yes/No question with centered question + highlighted bar ──
function YesNoQuestion({
  question,
  userAnswer,
  yesPercent,
  noPercent,
  index,
}: {
  question: string;
  userAnswer: string | null | undefined;
  yesPercent: number;
  noPercent: number;
  index: number;
}) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300 + index * 150);
    return () => clearTimeout(t);
  }, [index]);

  const norm = (userAnswer ?? "").toLowerCase();
  const userSaidYes = norm === "da";
  const userSaidNo = norm === "ne";

  const daWidth = animated ? `${yesPercent}%` : "0%";
  const neWidth = animated ? `${noPercent}%` : "0%";

  const pinkGradient = "linear-gradient(90deg, #c51b8a, #e879b0)";
  const grayBg = "#eee";

  return (
    <div
      style={{
        marginBottom: "1.75rem",
        animation: `fadeSlideIn 0.4s ease both`,
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Centered question */}
      <p style={{ ...SECTION_LABEL, textAlign: "center", margin: "0" }}>
        {question}
      </p>

      {/* Labels row — positioned above each segment */}
      <div style={{ position: "relative", height: "1rem", marginBottom: 4 }}>
        {/* Da label — left side */}
        <span
          style={{
            position: "absolute",
            left: 0,
            fontSize: "0.58rem",

            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: userSaidYes ? "#c51b8a" : "#9ca3af",
          }}
        >
          Da
        </span>
        {/* Ne label — right side */}
        <span
          style={{
            position: "absolute",
            right: 0,
            fontSize: "0.58rem",

            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: userSaidNo ? "#c51b8a" : "#9ca3af",
          }}
        >
          Ne
        </span>
      </div>

      {/* Bar */}
      <div style={{ position: "relative", width: "100%", height: 18, background: "#e5e7eb", borderRadius: 4, overflow: "hidden" }}>

        {/* Da segment — grows from the left */}
        <div style={{
          position: "absolute", left: 0, top: 0, height: "100%",
          width: daWidth,
          background: userSaidYes ? pinkGradient : grayBg,
          borderRadius: "4px 0 0 4px",
          transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
        }} />

        {/* Ne segment — grows from the right */}
        <div style={{
          position: "absolute", right: 0, top: 0, height: "100%",
          width: neWidth,
          background: userSaidNo ? "linear-gradient(270deg, #c51b8a, #e879b0)" : grayBg,
          borderRadius: "0 4px 4px 0",
          transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
        }} />

        {/* Da % — pinned to left edge, always visible */}
        <span style={{
          position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)",
          fontSize: "0.55rem", fontWeight: 700,
          color: userSaidYes ? "#fff" : "#6b7280",
          whiteSpace: "nowrap", zIndex: 1,
        }}>
          {yesPercent.toFixed(0)}%
        </span>

        {/* Ne % — pinned to right edge, always visible */}
        <span style={{
          position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
          fontSize: "0.55rem", fontWeight: 700,
          color: userSaidNo ? "#fff" : "#6b7280",
          whiteSpace: "nowrap", zIndex: 1,
        }}>
          {noPercent.toFixed(0)}%
        </span>

      </div>
    </div>

  );
}

// ── Corner decoration ──
function CornerMarks() {
  return (
    <>
      {(["tl", "tr", "bl", "br"] as const).map((pos) => (
        <div key={pos} style={{ position: "absolute", width: 12, height: 12, borderColor: "#c51b8a", borderStyle: "solid", opacity: 0.4, zIndex: 10, ...(pos === "tl" ? { top: 10, left: 10, borderWidth: "2px 0 0 2px" } : pos === "tr" ? { top: 10, right: 10, borderWidth: "2px 2px 0 0" } : pos === "bl" ? { bottom: 10, left: 10, borderWidth: "0 0 2px 2px" } : { bottom: 10, right: 10, borderWidth: "0 2px 2px 0" }) }} />
      ))}
    </>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 2, boxShadow: "0 1px 3px 0 rgba(0,0,0,0.06), 0 4px 24px 0 rgba(0,0,0,0.04)", padding: "2rem 2.5rem 2.5rem", marginBottom: "1.5rem", flex: "1" }}>
      <CornerMarks />
      {children}
    </div>
  );
}

export default function SeeSummary({ answers, sessionId, isLoading, hasSubmitted, onSubmit }: SeeSummaryProps) {
  const [stats, setStats] = useState<AllResponsesStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const FIXED_FW_PERCENT = 4.4;
  const META_MIN = 2_400_000;
  const META_MAX = 2_800_000;
  const SLIDER_MAX = 4_000_000;

  useEffect(() => {
    if (hasSubmitted) {
      setLoadingStats(true);
      fetch(`/api/summary?userSlider=${answers.sliderValue ?? 0}&userForeignWorkersPercent=${answers.foreignWorkersPercent ?? 0}`)
        .then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
        .then(setStats)
        .catch(console.error)
        .finally(() => setLoadingStats(false));
    }
  }, [hasSubmitted, answers.sliderValue, answers.foreignWorkersPercent]);

  const clamp = (v: number) => Math.max(0, Math.min(100, v));
  const clampSlider = (v: number) => clamp((v / SLIDER_MAX) * 100);
  const fmt = (n: number) => n.toLocaleString("fr-FR");

  if (!hasSubmitted) {
    return (
      <div className="mt-20 text-center">
        <button onClick={onSubmit} disabled={!sessionId || isLoading} className="card-btn active">
          {isLoading ? "Učitavanje..." : "Usporedi odgovore"}
        </button>
      </div>
    );
  }

  const userFWP = clamp(answers.foreignWorkersPercent ?? 0);
  const avgFWP = stats ? clamp(stats.foreignWorkersPercentAverage) : 0;
  const userSlider = answers.sliderValue ?? 0;
  const avgSlider = stats?.sliderAverage ?? 0;
  const metaMid = (META_MIN + META_MAX) / 2;

  const opinionOptions = [
    "Previše, ne trebamo ih toliko",
    "Dovoljno, ne treba više",
    "Dosta, vjerojatno trebamo još",
    "Malo, trebamo još stranih radnika",
  ];
  const opinionTotal = stats ? Object.values(stats.foreignWorkersCounts ?? {}).reduce((a, b) => a + b, 0) : 0;
  const userNats: string[] = Array.isArray(answers.topNationalities) ? answers.topNationalities : [];

  return (
    <div style={{ marginTop: "5rem" }}>
      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <p style={{ color: "#c51b8a", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", margin: 0 }}>
          Usporedba odgovora
        </p>
      </div>

      {loadingStats && (
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <div style={{ display: "inline-block", width: 28, height: 28, border: "3px solid #f3f4f6", borderTopColor: "#c51b8a", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      )}

      {stats && (
        <div style={{ animation: "fadeIn 0.6s ease both", maxWidth: 1400, margin: "0 auto" }}>

          <style>{`
    @media (max-width: 768px) {
      .cards-row { flex-direction: column !important; }
    }
  `}</style>

          <div className="cards-row" style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>

            {/* ── CARD 1: Foreign workers % + opinion ── */}
            <Card>
              <p style={SECTION_LABEL}>Udio stranih radnika u ukupnom stanovništvu Hrvatske</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", justifyItems: "center" }}>
                <Gauge percent={FIXED_FW_PERCENT} color="#f59e0b" label="Službeni podatak" sublabel="MUP" delay={0} />
                <Gauge percent={avgFWP} color="#93c5fd" label="Prosjek posjetitelja" sublabel="Svi odgovori" delay={200} />
                <Gauge percent={userFWP} color="#c51b8a" label="Vaša procjena" sublabel="Vaš unos" delay={400} />
              </div>

              {DIVIDER}

              <p style={SECTION_LABEL}>Vaše mišljenje</p>
              {opinionOptions.map((opt, i) => (
                <OpinionBar key={opt} label={opt} count={stats.foreignWorkersCounts?.[opt] ?? 0} total={opinionTotal} delay={300 + i * 120} userAnswer={answers.foreignWorkers} />
              ))}
            </Card>


            {/* ── CARD 2: Nationalities ── 
          <Card>
            <p style={SECTION_LABEL} >Top 10 državljanstava stranih radnika</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem 3rem" }}>
              <div>
                <p style={{ ...SECTION_LABEL, marginBottom: "0.75rem" }}>MUP 2025</p>
                <div style={{ maxWidth: 150, margin: "0 auto" }}>
                {MUP_TOP_10.map((nat, i) => (
                  <div key={nat} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: "1px solid #f9fafb", animation: `fadeSlideIn 0.3s ease both`, animationDelay: `${i * 50}ms` }}>
                    <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#f59e0b", minWidth: 18 }}>{i + 1}.</span>
                    <span style={{ fontSize: "0.78rem", color: "#374151" }}>{nat}</span>
                  </div>
                ))}
                </div>
              </div>
              

              <div>
                <p style={{ ...SECTION_LABEL, marginBottom: "0.75rem" }}>Vaša procjena</p>
                <div style={{ maxWidth: 150, margin: "0 auto" }}>
                {userNats.length === 0 ? (
                  <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>—</p>
                ) : (
                  userNats.slice(0, 10).map((nat, i) => (
                    <div key={nat} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: "1px solid #f9fafb", animation: `fadeSlideIn 0.3s ease both`, animationDelay: `${i * 50}ms` }}>
                      <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#c51b8a", minWidth: 20 }}>{i + 1}.</span>
                      <span style={{ fontSize: "0.78rem", color: "#374151" }}>{nat}</span>
                    </div>
                  ))
                )}
                </div>
              </div>
              
            </div>
          </Card> 
        */}

            {/* ── CARD 3: App users slider gauges ── */}
            <Card>
              <p style={SECTION_LABEL}>Koliko osoba u Hrvatskoj koristi Meta aplikacije?</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", justifyItems: "center" }}>
                <Gauge
                  percent={clampSlider(metaMid)}
                  color="#1877F2"
                  label="Meta procjena"
                  sublabel={`${fmt(META_MIN)} – ${fmt(META_MAX)}`}
                  displayValue={`~${fmt(metaMid)}`}
                  isAbsolute
                  delay={0}
                />
                <Gauge
                  percent={clampSlider(avgSlider)}
                  color="#93c5fd"
                  label="Prosjek posjetitelja"
                  sublabel="Svi odgovori"
                  displayValue={`${fmt(Math.round(avgSlider / 10000) * 10000)}`}
                  isAbsolute
                  delay={200}
                />
                <Gauge
                  percent={clampSlider(userSlider)}
                  color="#c51b8a"
                  label="Vaša procjena"
                  sublabel="Vaš unos"
                  displayValue={fmt(userSlider)}
                  isAbsolute
                  delay={400}
                />
              </div>

              {DIVIDER}

              <YesNoQuestion
                question="Koriste li ljudi na društvenim mrežama uglavnom svoj materinski jezik?"
                userAnswer={answers.nativeLanguage}
                yesPercent={stats.nativeLanguageYesPercent}
                noPercent={stats.nativeLanguageNoPercent}
                index={0}
              />
              <YesNoQuestion
                question="Mislite li da većina migranata u Hrvatskoj koristi ove aplikacije?"
                userAnswer={answers.usesMeta}
                yesPercent={stats.usesMetaYesPercent}
                noPercent={stats.usesMetaNoPercent}
                index={1}
              />
     
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}