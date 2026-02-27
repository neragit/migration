import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/app/lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("[API] /api/summary hit");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userSlider = Number(req.query.userSlider || 0);
    console.log("[API] userSlider:", userSlider);

    const { data, error } = await supabase
      .from("odg_migranti")
      .select("slider_value, uses_meta");

    console.log("[API] Supabase response:", { error, length: data?.length });

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(200).json({
        sliderAverage: 0,
        sliderPercent: 0,
        yesPercent: 0,
        noPercent: 0,
      });
    }

    const sliderValues = data
      .map((r) => Number(r.slider_value))
      .filter((v) => !isNaN(v));

    const sliderTotal = sliderValues.length;

    const sliderAverage = sliderTotal
      ? sliderValues.reduce((sum, val) => sum + val, 0) / sliderTotal
      : 0;

    const sliderPercent = sliderTotal
      ? (sliderValues.filter((val) => val <= userSlider).length /
          sliderTotal) *
        100
      : 0;

    const usesMetaData = data
      .map((r) => r.uses_meta)
      .filter((v) => v === "da" || v === "ne");

    const usesMetaTotal = usesMetaData.length;

    const yesPercent = usesMetaTotal
      ? (usesMetaData.filter((r) => r === "da").length /
          usesMetaTotal) *
        100
      : 0;

    const noPercent = usesMetaTotal
      ? (usesMetaData.filter((r) => r === "ne").length /
          usesMetaTotal) *
        100
      : 0;

    const result = {
      sliderAverage,
      sliderPercent,
      yesPercent,
      noPercent,
    };

    console.log("[API] returning:", result);

    return res.status(200).json(result);
  } catch (err: any) {
    console.error("[API] ERROR:", err);
    return res.status(500).json({
      error: err.message || "Server error",
    });
  }
}