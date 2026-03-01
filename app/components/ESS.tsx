"use client";

import React, { useEffect, useRef, useState } from "react";

// ── DATA ────────────────────────────────────────────────────────────────────

const SCALE_MAX_IMMIGRATION = 4;
const SCALE_MAX_TRUST = 10;
const SCALE_MAX_SAFETY = 10;

const ALLOW_LABELS: Record<number, string> = { 1: "Mnogo", 2: "Dozvoli neke", 3: "Malo", 4: "Nitko" };
const NEUTRAL_LABELS: Record<number, string> = { 0: "Loše", 1: "1", 2: "2", 3: "3", 4: "4", 5: "Neutralno", 6: "6", 7: "7", 8: "8", 9: "9", 10: "Dobro" };
const INFLUENCE_LABELS: Record<number, string> = { 1: "Nimalo", 2: "Vrlo malo", 3: "Donekle", 4: "Prilično", 5: "U potpunosti" };

const POLITICIANS_LABELS: Record<number, string> = { 2: "Izrazito nisko" };
const LEGAL_LABELS: Record<number, string> = { 3: "Vrlo nisko" };
const EU_PARLIAMENT_LABELS: Record<number, string> = { 4: "Umjereno nisko" };
const POLICE_LABELS: Record<number, string> = { 5: "Umjereno visoko" };
const SAFETY_LABELS: Record<number, string> = { 7: "Sigurno" };

const immigrationItems = [
    { id: "better_place", label: "Imigranti čine državu lošijim ili boljim mjesto za život", mean: 4.86, p25: 3, p75: 7, scale: 10, labelMap: NEUTRAL_LABELS },
    { id: "economy", label: "Imigracija loša ili dobra za gospodarstvo", mean: 4.91, p25: 3, p75: 7, scale: 10, labelMap: NEUTRAL_LABELS },
    { id: "culture", label: "Kulturni život: oslabljen ili obogaćen", mean: 4.92, p25: 3, p75: 7, scale: 10, labelMap: NEUTRAL_LABELS },
    { id: "same_race", label: "Imigranti iste rase/etničke skupne", mean: 2.04, p25: 1, p75: 3, scale: SCALE_MAX_IMMIGRATION, labelMap: ALLOW_LABELS },
    { id: "diff_race", label: "Imigranti drugačije rase/etničke skupne", mean: 2.33, p25: 2, p75: 3, scale: SCALE_MAX_IMMIGRATION, labelMap: ALLOW_LABELS },
    { id: "poor_countries", label: "Imigranti iz siromašnijih zemalja izvan Europe", mean: 2.31, p25: 2, p75: 3, scale: SCALE_MAX_IMMIGRATION, labelMap: ALLOW_LABELS },
];

const trustItems = [
    { id: "politicians", label: "Povjerenje u političare", mean: 1.99, p25: 0, p75: 3, scale: SCALE_MAX_TRUST, labelMap: POLITICIANS_LABELS },
    { id: "legal", label: "Povjerenje u pravni sustav", mean: 3.14, p25: 1, p75: 5, scale: SCALE_MAX_TRUST, labelMap: LEGAL_LABELS },
    { id: "political_influence", label: "Politički sustav omogućuje utjecaj na politiku", mean: 1.66, p25: 1, p75: 2, scale: 5, labelMap: INFLUENCE_LABELS },
    { id: "eu_parliament", label: "Povjerenje u Europski parlament", mean: 4.31, p25: 2, p75: 6, scale: SCALE_MAX_TRUST, labelMap: EU_PARLIAMENT_LABELS },
    { id: "police", label: "Povjerenje u policiju", mean: 5.46, p25: 4, p75: 8, scale: SCALE_MAX_TRUST, labelMap: POLICE_LABELS },
    { id: "safety", label: "Sigurnost pri noćnoj šetnji", mean: 7.03, p25: 5, p75: 9, scale: SCALE_MAX_SAFETY, labelMap: SAFETY_LABELS },
];

// ── ANIMATED BAR ─────────────────────────────────────────────────────────────

function AnimatedBar({
    mean,
    p25,
    p75,
    scale,
    color,
    delay = 0,
    labelMap,
    active,
}: {
    mean: number;
    p25: number;
    p75: number;
    scale: number;
    color: string;
    delay?: number;
    labelMap: Record<number, string>;
    active: boolean;
}) {
    const [animated, setAnimated] = useState(false);

    // Reset animation when step becomes inactive so it replays on re-entry
    useEffect(() => {
        if (!active) {
            setAnimated(false);
            return;
        }
        const t = setTimeout(() => setAnimated(true), delay);
        return () => clearTimeout(t);
    }, [active, delay]);

    const meanPct = (mean / scale) * 100;
    const p25Pct = (p25 / scale) * 100;
    const p75Pct = (p75 / scale) * 100;
    const midPct = 50;

    return (
        <div style={{ position: "relative", paddingBottom: "18px" }}>
            {/* Bar track */}
            <div className="relative h-2 w-full rounded-full" style={{ background: "linear-gradient(to right, #fce7f3, #eee, #dcfce7)" }}>
                {/* IQR band */}
                <div
                    className="absolute top-0 h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                        left: animated ? `${p25Pct}%` : `${midPct}%`,
                        width: animated ? `${p75Pct - p25Pct}%` : "0%",
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                        opacity: 0.45,
                        mixBlendMode: "multiply",
                        transitionDelay: `${delay}ms`,
                    }}
                />
                {/* Mean tick */}
                <div
                    className="absolute transition-all duration-700 ease-out"
                    style={{
                        top: "-3px",
                        width: "2px",
                        height: "14px",
                        borderRadius: "1px",
                        left: animated ? `calc(${meanPct}% - 1px)` : `calc(${midPct}% - 1px)`,
                        backgroundColor: color,
                        transitionDelay: `${delay}ms`,
                    }}
                />
                {/* Midpoint line */}
                <div className="absolute top-0 h-full w-px bg-gray-300" style={{ left: `${midPct}%` }} />
            </div>
            {/* Value label below tick */}
            <div
                className="absolute transition-all duration-700 ease-out"
                style={{
                    top: "12px",
                    left: animated ? `calc(${meanPct}% - 1px)` : `calc(${midPct}% - 1px)`,
                    transitionDelay: `${delay}ms`,
                    fontSize: "10px",
                    whiteSpace: "nowrap",
                    transform: "translateX(-50%)",
                }}
            >
                {labelMap ? (labelMap[Math.round(mean)] ?? mean.toFixed(1)) : mean.toFixed(1)}
            </div>
        </div>
    );
}

// ── ROW ───────────────────────────────────────────────────────────────────────

function DataRow({
    label,
    mean,
    p25,
    p75,
    scale,
    color,
    delay,
    labelMap,
    active,
}: {
    label: string;
    mean: number;
    p25: number;
    p75: number;
    scale: number;
    color: string;
    delay: number;
    labelMap: Record<number, string>;
    active: boolean;
}) {
    return (
        <div style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
            <span style={{ display: "block", fontSize: "12px", color: "#6b7280", lineHeight: 1.3, marginBottom: "7px" }}>
                {label}
            </span>
            <AnimatedBar
                mean={mean}
                p25={p25}
                p75={p75}
                scale={scale}
                color={color}
                delay={delay}
                labelMap={labelMap}
                active={active}
            />
        </div>
    );
}

// ── SCALE REFERENCE ──────────────────────────────────────────────────────────

function ScaleReference() {
    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "10px", color: "#c51b8a" }}>Negativni</span>
            <span style={{ fontSize: "10px", color: "#22ba59" }}>Pozitivni</span>
        </div>
    );
}

// ── SECTION ───────────────────────────────────────────────────────────────────

function Section({
    title,
    items,
    color,
    active,
}: {
    title: string;
    items: typeof immigrationItems;
    color: string;
    active: boolean;
}) {
    return (
        <div className="flex flex-col gap-1">
            <div style={{ letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c51b8a', fontSize: '20px', fontWeight: 600, 
                borderBottom: `1px solid #eee` }}>
                <p>{title}</p>
            </div>
            <ScaleReference />
            <div>
                {items.map((item, i) => (
                    <DataRow
                        key={item.id}
                        label={item.label}
                        mean={item.mean}
                        p25={item.p25}
                        p75={item.p75}
                        scale={item.scale}
                        color={color}
                        delay={i * 80}
                        labelMap={item.labelMap}
                        active={active}
                    />
                ))}
            </div>
        </div>
    );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function ESS({ active = false }: { active?: boolean }) {
    return (
        <div className="w-full px-5 lg:px-20 py-10 overflow-y-clip ">
            <p className="text-center " style={{
                color: '#c51b8a',
                fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase'
            }}>Što kažu hrvatski građani?</p>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mb-6 pt-1 border-t border-gray-100">
                <div className="flex items-center gap-2">

                    <span className="text-[10px] text-gray-400">European Social Survey (ESS, val 11) 2023.</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">n ≈ 1500 ispitanika</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-2 rounded-full bg-gray-200" />
                    <span className="text-[10px] text-gray-400">raspon 25-75. percentila</span>
                </div>
            </div>


            <div className="text-center" style={{ display: "flex", flexDirection: "row", gap: "2.5rem", alignItems: "flex-start" }}>
                <div style={{ flex: 1, minWidth: 0, color: "#374151" }}>
                    <Section title="Stavovi prema imigraciji" items={immigrationItems} color="#6b7280" active={active} />
                </div>
                <div style={{ width: "1px", alignSelf: "stretch" }} />
                <div style={{ flex: 1, minWidth: 0, color: "#374151" }}>
                    <Section title="Povjerenje u institucije i sigurnost" items={trustItems} color="#6b7280" active={active} />
                </div>
            </div>
        </div>
    );
}