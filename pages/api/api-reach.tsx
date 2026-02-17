// pages/api/api-reach.tsx
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js'


interface LangData {
  code: string;
  lang: string;
  residents: number;
  apiReachMin: number;
  apiReachMax: number;
  apiReachAvg: number;
}


// Keep your token and ad account ID secure in Vercel environment variables
const TOKEN = process.env.MARKETING_API_TOKEN!;
const AD_ACCOUNT_ID = process.env.AD_ACCOUNT_ID!;

const languages: LangData[] = [
  { lang: 'Bosanski', code: 'Bosnian', residents: 32225, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
  { lang: 'Makedonski', code: 'Macedonian', residents: 11856, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
  { lang: 'Srpski', code: 'Serbian', residents: 24278, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
  { lang: 'Nepalski', code: 'Nepali', residents: 31708, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
  { lang: 'Ruski', code: 'Russian', residents: 0, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 }, // nema podataka za 2025.
  { lang: 'Filipinski', code: 'Filipino', residents: 17629, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
  { lang: 'Albanski', code: 'Albanian', residents: 6355, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 }, // KOSOVO
  { lang: 'Ukrajinski', code: 'Ukrainian', residents: 0, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },// nema podataka za 2025.
  { lang: 'Arapski', code: 'Arabic', residents: 5504, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
  { lang: 'Hindski', code: 'Hindi', residents: 15400, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
  { lang: 'Turski', code: 'Turkish', residents: 0, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 }, // nema podataka za 2025.
  { lang: 'Bengalski', code: 'Bengali', residents: 3404, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
  { lang: 'Uzbečki', code: 'Uzbek', residents: 5521, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
];


const localeMap: { [key: string]: number } = {
  Bosnian: 55,
  Macedonian: 79,
  Serbian: 42,
  Nepali: 82,
  Russian: 17,
  Filipino: 26,
  Cebuano: 56,
  Albanian: 87,
  Ukrainian: 52,
  Arabic: 28,
  Hindi: 46,
  Turkish: 19,
  Bengali: 45,
  Uzbek: 91,
};



export default async function handler(req: NextApiRequest, res: NextApiResponse<LangData[]>) {

  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }

  try {

    console.log("TOKEN exists:", !!process.env.MARKETING_API_TOKEN);
    console.log("AD_ACCOUNT_ID exists:", !!process.env.AD_ACCOUNT_ID);

    if (!process.env.MARKETING_API_TOKEN || !process.env.AD_ACCOUNT_ID) {
      throw new Error("Missing environment variables in Vercel");
    }

    const results: LangData[] = [];

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    )


    for (const lang of languages) {

      const locale = localeMap[lang.code];
      const targetingSpec = {
        geo_locations: { countries: ["HR"] },
        locales: [locale],
      };

      const encodedSpec = encodeURIComponent(JSON.stringify(targetingSpec));
      const url = `https://graph.facebook.com/v19.0/act_${AD_ACCOUNT_ID}/reachestimate?targeting_spec=${encodedSpec}`;

      // Log the targeting spec being sent
      console.log('Sending targeting spec for', lang.lang, JSON.stringify(targetingSpec, null, 2));
      console.log('api API URL:', url);

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });



      const data = await response.json();

      if (!response.ok) {
        console.error("Facebook API error:", data);
      }


      // Log the raw response from Facebook

      if (data && data.data && !data.data.users_lower_bound) {
        console.warn(`${lang.lang} response might not respect geo_locations`);
      }

      console.log(`api API raw response for ${lang.lang}:`, JSON.stringify(data, null, 2));

      const lower = data.users_lower_bound ?? data.data?.users_lower_bound ?? 0;
      const upper = data.users_upper_bound ?? data.data?.users_upper_bound ?? 0;

      let avgReach = (lower + upper) / 2;

      // Apply your rule: set avg to 0 if too small or too big
      if (upper <= 1000 || lower >= 2400000) {
        avgReach = 0;
      }

      console.log(`Calculated avg apiReach for ${lang.lang}: ${avgReach}`);

      results.push({
        code: lang.code,
        lang: lang.lang,
        residents: lang.residents,
        apiReachMin: lower,
        apiReachMax: upper,
        apiReachAvg: avgReach,
      });




    }

    const { error } = await supabase
      .from('cro_lang_data')
      .insert(
        results.map(lang => ({
          code: lang.code,
          lang: lang.lang,
          residents: lang.residents,
          api_reach_min: lang.apiReachMin,
          api_reach_max: lang.apiReachMax,
          api_reach_avg: lang.apiReachAvg,
          snapshot_time: new Date()
        }))
      );

    if (error) console.error('Supabase insert error:', error);

    console.log("TOKEN exists:", !!process.env.MARKETING_API_TOKEN);

    res.status(200).json(results);
  } catch (err) {
    console.error('api API error:', err);
    res.status(500).json(languages); // fallback
  }
}
