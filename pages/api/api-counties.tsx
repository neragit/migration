// pages/api/api-counties.tsx
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js'


interface LangData {
    code: string;
    lang: string;
    residents: number;
    countyKey: string;
    apiReachMin: number;
    apiReachMax: number;
    apiReachAvg: number;
}


const TOKEN = process.env.MARKETING_API_TOKEN!;
const AD_ACCOUNT_ID = process.env.AD_ACCOUNT_ID!;

const languages: LangData[] = [
    { lang: 'Bosanski', code: 'Bosnian', countyKey: "0", residents: 32225, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
    { lang: 'Makedonski', code: 'Macedonian', countyKey: "0", residents: 11856, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
    { lang: 'Srpski', code: 'Serbian', countyKey: "0", residents: 24278, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
    { lang: 'Nepalski', code: 'Nepali', countyKey: "0", residents: 31708, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
    { lang: 'Ruski', code: 'Russian', countyKey: "0", residents: 0, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 }, // nema podataka za 2025.
    { lang: 'Filipinski', code: 'Filipino', countyKey: "0", residents: 17629, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
    { lang: 'Albanski', code: 'Albanian', countyKey: "0", residents: 6355, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 }, // KOSOVO
    { lang: 'Ukrajinski', code: 'Ukrainian', countyKey: "0", residents: 0, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },// nema podataka za 2025.
    { lang: 'Arapski', code: 'Arabic', countyKey: "0", residents: 5504, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
    { lang: 'Hindski', code: 'Hindi', countyKey: "0", residents: 15400, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
    { lang: 'Turski', code: 'Turkish', countyKey: "0", residents: 0, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 }, // nema podataka za 2025.
    { lang: 'Bengalski', code: 'Bengali', countyKey: "0", residents: 3404, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
    { lang: 'Uzbečki', code: 'Uzbek', countyKey: "0", residents: 5521, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
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

const croatiaCountyKeys = [
    "1592", "1603", "1599", "1591", "1597", "1608", "1593",
    "1595", "1594", "1600", "1607", "1596", "1606", "1605",
    "1610", "1601", "1609", "1598", "1604", "1602", "1611"
];

export default async function handler(req: NextApiRequest, res: NextApiResponse<LangData[]>) {
    // Auth check
    const token = req.headers['authorization']?.split(' ')[1] || req.query.token;
    if (token !== process.env.CRON_SECRET) return res.status(401).end('Unauthorized');

    const results: LangData[] = [];
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

    try {
        const selectedLanguages = languages.filter(lang =>
            ["Bosnian", "Serbian", "Macedonian", "Albanian"].includes(lang.code)
        );

        for (const lang of selectedLanguages) {
            const locale = localeMap[lang.code];

            for (const countyKey of croatiaCountyKeys) {
                const targetingSpec = {
                    geo_locations: { regions: [{ key: countyKey }] },
                    locales: [locale],
                };

                const encodedSpec = encodeURIComponent(JSON.stringify(targetingSpec));
                const url = `https://graph.facebook.com/v19.0/act_${AD_ACCOUNT_ID}/reachestimate?targeting_spec=${encodedSpec}`;

                try {
                    const response = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
                    const data = await response.json();

                    if (!response.ok) {
                        console.error(`FB API error for ${lang.lang} county ${countyKey}:`, data);
                        throw new Error(`FB API returned error`);
                    }

                    const lower = data.users_lower_bound ?? data.data?.users_lower_bound ?? 0;
                    const upper = data.users_upper_bound ?? data.data?.users_upper_bound ?? 0;

                    let avgReach = (lower + upper) / 2;
                    if (upper <= 1000 || lower >= 2400000) avgReach = 0;

                    results.push({
                        code: lang.code,
                        lang: lang.lang,
                        countyKey,
                        residents: lang.residents,
                        apiReachMin: lower,
                        apiReachMax: upper,
                        apiReachAvg: avgReach,
                    });
                } catch (err) {
                    console.error(`Failed FB request for ${lang.lang} county ${countyKey}:`, err);
                    // push fallback zeros so you still have a record
                    results.push({
                        code: lang.code,
                        lang: lang.lang,
                        countyKey,
                        residents: lang.residents,
                        apiReachMin: 0,
                        apiReachMax: 0,
                        apiReachAvg: 0,
                    });
                }
            }
        }

        // insert once after loops
        const { error } = await supabase.from('cro_lang_counties').insert(
            results.map(l => ({
                code: l.code,
                lang: l.lang,
                county_key: l.countyKey,
                residents: l.residents,
                api_reach_min: l.apiReachMin,
                api_reach_max: l.apiReachMax,
                api_reach_avg: l.apiReachAvg,
                snapshot_time: new Date(),
            }))
        );

        if (error) console.error('Supabase insert error:', error);

        res.status(200).json(results);

    } catch (err) {
        console.error('api API error:', err);
        // fallback to safe empty values
        res.status(500).json(languages.map(l => ({ ...l, apiReachMin: 0, apiReachMax: 0, apiReachAvg: 0 })));
    }
}