// pages/api/fb-reach.tsx
import type { NextApiRequest, NextApiResponse } from 'next';

interface LangData {
  lang: string;
  fbReach: number;
  residents: number;
}

// Keep your token and ad account ID secure in Vercel environment variables
const TOKEN = process.env.MARKETING_API_TOKEN!;
const AD_ACCOUNT_ID = process.env.AD_ACCOUNT_ID!;

// All languages with residents and a placeholder locale ID
const languages: LangData[] = [
  { lang: 'Bosnian', fbReach: 0, residents: 38100 },
  { lang: 'Macedonian', fbReach: 0, residents: 13855 },
  { lang: 'Serbian', fbReach: 0, residents: 27988 },
  { lang: 'Nepali', fbReach: 0, residents: 35635 },
  { lang: 'Russian', fbReach: 0, residents: 6959 },
  { lang: 'Filipino', fbReach: 0, residents: 14680 },
  { lang: 'Albanian', fbReach: 0, residents: 8139 },
  { lang: 'Ukrainian', fbReach: 0, residents: 2992 },
  { lang: 'Arabic', fbReach: 0, residents: 6672 },
  { lang: 'Hindi', fbReach: 0, residents: 20502 },
  { lang: 'Turkish', fbReach: 0, residents: 3653 },
  { lang: 'Bengali', fbReach: 0, residents: 13630 },
  { lang: 'Uzbek', fbReach: 0, residents: 6959 },
];

// Map languages to Facebook locale IDs (example placeholders)
const localeMap: { [key: string]: number } = {
  Bosnian: 2,
  Macedonian: 3,
  Serbian: 4,
  Nepali: 5,
  Russian: 6,
  Filipino: 12,
  Albanian: 7,
  Ukrainian: 8,
  Arabic: 9,
  Hindi: 10,
  Turkish: 11,
  Bengali: 13,
  Uzbek: 14,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<LangData[]>) {
  try {

    const results: LangData[] = [];

    for (const lang of languages) {

      const testSpec = { geo_locations: { countries: ["HR"] } };
      const testUrl = `https://graph.facebook.com/v19.0/act_${AD_ACCOUNT_ID}/reachestimate?targeting_spec=${encodeURIComponent(
        JSON.stringify(testSpec)
      )}`;

      const locale = localeMap[lang.lang];
      const targetingSpec = {
        geo_locations: { countries: ["HR"] },
        locales: [locale],
      };

      const encodedSpec = encodeURIComponent(JSON.stringify(targetingSpec));
      const url = `https://graph.facebook.com/v19.0/act_${AD_ACCOUNT_ID}/reachestimate?targeting_spec=${encodedSpec}`;

      // Log the targeting spec being sent
      console.log('Sending targeting spec for', lang.lang, JSON.stringify(targetingSpec, null, 2));
      console.log('FB API URL:', url);


      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });

      const data = await response.json();

      // Log the raw response from Facebook

      if (data && data.data && !data.data.users_lower_bound) {
        console.warn(`${lang.lang} response might not respect geo_locations`);
      }

      console.log(`FB API raw response for ${lang.lang}:`, JSON.stringify(data, null, 2));

      const lower = data.users_lower_bound ?? data.data?.users_lower_bound ?? 0;
      const upper = data.users_upper_bound ?? data.data?.users_upper_bound ?? 0;
      let avgReach = (lower + upper) / 2;

      // Apply your rule: set avg to 0 if too small or too big
      if (upper <= 1000 || lower >= 2400000) {
        avgReach = 0;
      }

      console.log(`Calculated avg fbReach for ${lang.lang}: ${avgReach}`);

      results.push({
        ...lang,
        fbReach: avgReach,
      });
    }



    res.status(200).json(results);
  } catch (err) {
    console.error('FB API error:', err);
    res.status(500).json(languages); // fallback
  }
}
