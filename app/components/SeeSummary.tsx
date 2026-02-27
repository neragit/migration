"use client";

import { useEffect, useState } from "react";
import type { AnswersState } from "@/types/answers";

interface AllResponsesStats {
  sliderAverage: number;
  sliderPercent: number;
  yesPercent: number;
  noPercent: number;
}

interface SeeSummaryProps {
  answers: AnswersState;
  sessionId: string | null;
  isLoading: boolean;
  hasSubmitted: boolean;
  onSubmit: () => Promise<void>;
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

  if (!hasSubmitted) {
    return (
      <div className="card">
        <div className="card-inner">
          <button
            onClick={onSubmit}
            disabled={!sessionId || isLoading}
            className="card-btn active"
          >
            {isLoading ? "Spremanje..." : "Usporedi odgovore"}
          </button>
        </div>
      </div>
    );
  }

  const userPercent = allResponsesStats
    ? clamp(allResponsesStats.sliderPercent)
    : 0;
  const avgPercent = allResponsesStats
    ? clamp(allResponsesStats.sliderAverage)
    : 0;

  // Convert percent to stroke offset
  const percentToOffset = (percent: number, radius: number) =>
    Math.PI * radius - (Math.PI * radius * percent) / 100;

  const strokeWidth = 20;

  return (
    <div className="card">
      <div className="card-inner">
        <h2>Usporedite odgovore</h2>

        <p>Procjena korisnika: {answers.sliderValue?.toLocaleString("fr-FR")}</p>
        <p>Koristi materinski jezik: {answers.nativeLanguage}</p>
        <p>Migranti koriste Meta: {answers.usesMeta}</p>
        <p>Meta je točna: {answers.metaAccuracy}</p>
        <p>Očekuje više: {answers.expectMore}</p>
        <p>Smatra Meta važnim: {answers.considerMeta}</p>

        {loadingStats && <p>Dohvaćanje statistike...</p>}

        {allResponsesStats && (
          <div className="mt-10 flex flex-col items-center relative">

            <svg
              width={2 * (120 + strokeWidth)}
              height={120 + strokeWidth}
              viewBox={`0 0 ${2 * (120 + strokeWidth)} ${120 + strokeWidth}`}
            >
              <g transform={`rotate(-180 ${120 + strokeWidth} ${120 + strokeWidth / 2})`}>

                {/* OUTER — fixed 4.4% */}
                <circle
                  cx={120 + strokeWidth}
                  cy={120 + strokeWidth / 2}
                  r={120}
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth={strokeWidth}
                  strokeDasharray={Math.PI * 120}
                  strokeDashoffset={percentToOffset(fixedOuterPercent, 120)}
                  
                />

                {/* MIDDLE — average */}
                <circle
                  cx={120 + strokeWidth}
                  cy={120 + strokeWidth / 2}
                  r={100}
                  fill="transparent"
                  stroke="#93c5fd"
                  strokeWidth={strokeWidth}
                  strokeDasharray={Math.PI * 100}
                  strokeDashoffset={percentToOffset(avgPercent, 100)}
                  
                />

                {/* INNER — user */}
                <circle
                  cx={120 + strokeWidth}
                  cy={120 + strokeWidth / 2}
                  r={80}
                  fill="transparent"
                  stroke="#2563eb"
                  strokeWidth={strokeWidth}
                  strokeDasharray={Math.PI * 80}
                  strokeDashoffset={percentToOffset(userPercent, 80)}
                  
                />

              </g>
            </svg>

            {/* Center User % */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="text-3xl font-bold text-blue-700">
                {userPercent.toFixed(0)}%
              </span>
            </div>

            {/* Stats */}
            <div className="text-sm text-gray-600 mt-8 text-center space-y-1">
              <p>Vanjski sloj (fiksno): {fixedOuterPercent}%</p>
              <p>Prosjek svih korisnika: {avgPercent.toFixed(0)}%</p>
              <p>Vaša procjena u odnosu na druge: {userPercent.toFixed(0)}</p>
              <p>% koji su rekli "da": {allResponsesStats.yesPercent.toFixed(0)}</p>
              <p>% koji su rekli "ne": {allResponsesStats.noPercent.toFixed(0)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}