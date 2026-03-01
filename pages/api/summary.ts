import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/app/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("[API] /api/summary hit");

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const userSlider = Number(req.query.userSlider || 0);

    const { data, error } = await supabase
      .from("odg_migranti")
      .select("slider_value, foreign_workers_percent, foreign_workers, uses_meta, native_language, meta_accuracy, expect_more, top_nationalities");

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(200).json({
        sliderAverage: 0, sliderPercent: 0,
        foreignWorkersPercentAverage: 0,
        foreignWorkersCounts: {}, topNationalities: [],
        nativeLanguageYesPercent: 0, nativeLanguageNoPercent: 0,
        usesMetaYesPercent: 0, usesMetaNoPercent: 0,
        metaAccuracyYesPercent: 0, metaAccuracyNoPercent: 0,
        expectMoreCounts: {}, nativeLanguageCounts: {},
      });
    }

    // ── Slider (app users absolute) ──
    const sliderValues = data.map((r) => Number(r.slider_value)).filter((v) => !isNaN(v) && v > 0);
    const sliderAverage = sliderValues.length ? sliderValues.reduce((s, v) => s + v, 0) / sliderValues.length : 0;
    const sliderPercent = sliderValues.length ? (sliderValues.filter((v) => v <= userSlider).length / sliderValues.length) * 100 : 0;

    // ── Foreign workers % ──
    const fwpValues = data.map((r) => Number(r.foreign_workers_percent)).filter((v) => !isNaN(v) && v > 0);
    const foreignWorkersPercentAverage = fwpValues.length ? fwpValues.reduce((s, v) => s + v, 0) / fwpValues.length : 0;

    // ── Foreign workers opinion counts ──
    const foreignWorkersCounts = data
      .map((r) => r.foreign_workers)
      .filter(Boolean)
      .reduce((acc: Record<string, number>, val) => { acc[val] = (acc[val] || 0) + 1; return acc; }, {});

    // ── Top nationalities (aggregate across all sessions) ──
    const natCounts: Record<string, number> = {};
    data.forEach((r) => {
      const nats = Array.isArray(r.top_nationalities) ? r.top_nationalities : [];
      nats.forEach((n: string) => { natCounts[n] = (natCounts[n] || 0) + 1; });
    });
    const topNationalities = Object.entries(natCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([n]) => n);

    // ── Yes/No helpers ──
    const yesNo = (field: string) => {
      const vals = data.map((r: any) => (r[field] ?? "").toLowerCase()).filter((v: string) => v === "da" || v === "ne");
      const total = vals.length;
      const yes = total ? (vals.filter((v: string) => v === "da").length / total) * 100 : 0;
      return { yes, no: total ? 100 - yes : 0 };
    };

    const nl = yesNo("native_language");
    const um = yesNo("uses_meta");
    const ma = yesNo("meta_accuracy");

    // ── Expect more / native language counts (legacy) ──
    const expectMoreCounts = data.map((r) => r.expect_more).filter(Boolean)
      .reduce((acc: Record<string, number>, val) => { acc[val] = (acc[val] || 0) + 1; return acc; }, {});

    const nativeLanguageCounts = data.map((r) => r.native_language).filter(Boolean)
      .reduce((acc: Record<string, number>, val) => { acc[val] = (acc[val] || 0) + 1; return acc; }, {});

    return res.status(200).json({
      sliderAverage,
      sliderPercent,
      foreignWorkersPercentAverage,
      foreignWorkersCounts,
      topNationalities,
      nativeLanguageYesPercent: nl.yes,
      nativeLanguageNoPercent: nl.no,
      usesMetaYesPercent: um.yes,
      usesMetaNoPercent: um.no,
      metaAccuracyYesPercent: ma.yes,
      metaAccuracyNoPercent: ma.no,
      expectMoreCounts,
      nativeLanguageCounts,
    });

  } catch (err: any) {
    console.error("[API] ERROR:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}