// pages/api/api-expats.tsx
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js'


interface expatData {
    code: string;
    lang: string;
    expat: string;
    residents: number;
    apiReachMin: number;
    apiReachMax: number;
    apiReachAvg: number;
}


const TOKEN = process.env.MARKETING_API_TOKEN!;
const AD_ACCOUNT_ID = process.env.AD_ACCOUNT_ID!;

const croatiaCounties: { [key: string]: string } = {
    "1592": "Brod-Posavina County",
    "1603": "Šibenik-Knin County",
    "1599": "Međimurje County",
    "1591": "Bjelovar-Bilogora County",
    "1597": "Krapina-Zagorje County",
    "1608": "Vukovar-Syrmia County",
    "1593": "Dubrovnik-Neretva County",
    "1595": "Karlovac County",
    "1594": "Istria County",
    "1600": "Osijek-Baranja County",
    "1607": "Virovitica-Podravina County",
    "1596": "Koprivnica-Križevci County",
    "1606": "Varaždin County",
    "1605": "Split-Dalmatia County",
    "1610": "Zagreb County",
    "1601": "Požega-Slavonia County",
    "1609": "Zadar County",
    "1598": "Lika-Senj County",
    "1604": "Sisak-Moslavina County",
    "1602": "Primorje-Gorski Kotar County",
    "1611": "Zagreb"
};



const countries: expatData[] = [
    { lang: 'Bosanski', code: 'Bosnian', expat: "", residents: 32225, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
    { lang: 'Makedonski', code: 'Macedonian', expat: "", residents: 11856, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
    { lang: 'Srpski', code: 'Serbian', expat: "", residents: 24278, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
    { lang: 'Nepalski', code: 'Nepali', expat: "", residents: 31708, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
    { lang: 'Ruski', code: 'Russian', expat: "", residents: 0, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 }, // nema podataka za 2025.
    { lang: 'Filipinski', code: 'Filipino', expat: "", residents: 17629, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
    { lang: 'Albanski', code: 'Albanian', expat: "", residents: 6355, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 }, // KOSOVO
    { lang: 'Ukrajinski', code: 'Ukrainian', expat: "", residents: 0, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },// nema podataka za 2025.
    { lang: 'Arapski', code: 'Arabic', expat: "", residents: 5504, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
    { lang: 'Hindski', code: 'Hindi', expat: "", residents: 15400, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
    { lang: 'Turski', code: 'Turkish', expat: "", residents: 0, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 }, // nema podataka za 2025.
    { lang: 'Bengalski', code: 'Bengali', expat: "", residents: 3404, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
    { lang: 'Uzbečki', code: 'Uzbek', expat: "", residents: 5521, apiReachAvg: 0, apiReachMin: 0, apiReachMax: 0 },
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

const expatCountries: { [key: string]: string } = {
    "6023620475783": "United States",
    "6023675997383": "Austria",
    "6023676002183": "Cyprus",
    "6068209522983": "Finland",
    "6023676017583": "Greece",
    "6023676022783": "Hong Kong",
    "6023676028783": "Japan",
    "6068613839383": "Latvia",
    "6023676039183": "Lithuania",
    "6023676044383": "Luxembourg",
    "6023676045583": "Malta",
    "6023676048183": "Monaco",
    "6023676055383": "Slovakia",
    "6023676060183": "Slovenia",
    "6023676072183": "Mexico",
    "6025000826583": "Argentina",
    "6025000823583": "Israel",
    "6025000815983": "Russia",
    "6025000813183": "Saudi Arabia",
    "6025054896983": "Chile",
    "6025670492783": "Rwanda",
    //"6025753961783": "Family Abroad",
    "6026404871583": "Venezuela",
    "6027147160983": "Malaysia",
    "6027148962983": "Romania",
    "6027148973583": "South Korea",
    "6027149004983": "Serbia",
    "6027149006383": "Vietnam",
    "6027149008183": "Peru",
    "6043702804583": "Belgium",
    "6047219032183": "Zambia",
    "6059793664583": "Honduras",
    "6068844014183": "Lebanon",
    "6068843912183": "Jordan",
    "6071248932383": "Algeria",
    "6071248894383": "Nicaragua",
    "6071248981583": "Kuwait",
    "6071249058983": "Qatar",
    "6016916298983": "India",
    "6018796980983": "Kenya",
    "6018797004183": "Nigeria",
    "6018797036783": "Cameroon",
    "6018797091183": "Philippines",
    "6018797127383": "Cuba",
    "6018797165983": "Ethiopia",
    "6018797373783": "Haiti",
    "6019366943583": "Spain",
    "6019367014383": "France",
    "6019367052983": "Germany",
    "6019377644783": "Switzerland",
    "6019396649183": "United States",
    "6019396657183": "Poland",
    "6019396654583": "Italy",
    "6019396650783": "Ireland",
    "6019396638383": "Hungary",
    "6019396764183": "Canada",
    "6019452369983": "China",
    "6019520122583": "Puerto Rico",
    "6019564340583": "Brazil",
    "6019564344583": "Indonesia",
    "6019564383383": "South Africa",
    "6019673233983": "Zimbabwe",
    "6019673448383": "Ghana",
    "6019673501783": "Uganda",
    "6019673525983": "Colombia",
    "6019673762183": "Dominican Republic",
    "6019673777983": "El Salvador",
    "6019673808383": "Guatemala",
    "6021354152983": "UK",
    "6021354857783": "Australia",
    "6021354882783": "Portugal",
    "6023287351383": "Estonia",
    "6023287459983": "Norway",
    "6023287455983": "Denmark",
    "6023287438783": "Czech Republic",
    "6023287397383": "Sweden",
    "6023287393783": "Netherlands",
    "6023356562783": "Bangladesh",
    "6023356926183": "Tanzania",
    "6023356955383": "Nepal",
    "6023356956983": "Jamaica",
    "6023356966183": "Thailand",
    "6023356986383": "Sierra Leone",
    "6023357000583": "Senegal",
    "6023422105983": "Ivory Coast",
    "6023516315983": "Sri Lanka",
    "6023516338783": "Morocco",
    "6023516430783": "UAE",
    "6023516368383": "New Zealand",
    "6023516373983": "Congo DRC",
    "6023516403783": "Singapore"
};

const expatInterestMap: { [key: string]: string } = {
    Nepali: "6023356955383",
    Bengali: "6023356562783",
    Filipino: "6018797091183",
    Hindi: "6016916298983",
    Serbian: "6027149004983",
    Russian: "6025000815983",
    Kenian:"6018796980983"
};

/*
// REQUEST BY MAP
export default async function handler(req: NextApiRequest, res: NextApiResponse<expatData[]>) {
    const token = req.headers['authorization']?.split(' ')[1] || req.query.token;
    if (token !== process.env.CRON_SECRET) return res.status(401).end('Unauthorized');

    const results: expatData[] = [];
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

    try {
        // Filter only expats we have interest IDs for
        const selectedExpats = countries.filter(c => expatInterestMap[c.code]);

        for (const expat of selectedExpats) {

            const behaviorId = expatInterestMap[expat.code];

            const targetingSpec = {
                geo_locations: { countries: ["HR"] },
                flexible_spec: [
                    { behaviors: [{ id: behaviorId, name: expat.expat }] }
                ],
            };

            const encodedSpec = encodeURIComponent(JSON.stringify(targetingSpec));
            const url = `https://graph.facebook.com/v19.0/act_${AD_ACCOUNT_ID}/reachestimate?targeting_spec=${encodedSpec}`;

            try {
                const response = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
                const data = await response.json();

                const lower = data.users_lower_bound ?? data.data?.users_lower_bound ?? 0;
                const upper = data.users_upper_bound ?? data.data?.users_upper_bound ?? 0;

                let avgReach = (lower + upper) / 2;
                if (upper <= 1000 || lower >= 2400000) avgReach = 0;

                results.push({
                    code: expat.code,
                    lang: "",
                    expat: expatCountries[behaviorId] ?? expat.expat,
                    residents: expat.residents,
                    apiReachMin: lower,
                    apiReachMax: upper,
                    apiReachAvg: avgReach,
                });
            } catch (err) {
                console.error(`FB request failed for ${expat.expat}:`, err);
                results.push({
                    code: expat.code,
                    lang: "",
                    expat: expat.expat,
                    residents: expat.residents,
                    apiReachMin: 0,
                    apiReachMax: 0,
                    apiReachAvg: 0,
                });
            }
        }

        // Insert totals into Supabase
        const { error } = await supabase.from('cro_expat').insert(
            results.map(l => ({
                code: l.code,
                expat: l.expat,
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
        console.error('API error:', err);
        res.status(500).json(countries.map(l => ({ ...l, apiReachMin: 0, apiReachMax: 0, apiReachAvg: 0 })));
    }
}
    */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<expatData[]>
) {
  const token = req.headers['authorization']?.split(' ')[1] || req.query.token;
  if (token !== process.env.CRON_SECRET) return res.status(401).end('Unauthorized');

  const results: expatData[] = [];
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

  try {
    const allExpatIds = Object.keys(expatCountries);

    for (const behaviorId of Object.keys(expatCountries)) {
  const expatName = expatCountries[behaviorId];

  // Try to find language and residents from your countries array
  const countryMatch = countries.find(c => c.code === expatName);

  // Defaults if not found
  const lang = countryMatch?.lang || "";
  const residents = countryMatch?.residents || 0;

  const targetingSpec = {
    geo_locations: { countries: ["HR"] },
    flexible_spec: [
      { behaviors: [{ id: behaviorId, name: expatName }] }
    ],
  };

  const encodedSpec = encodeURIComponent(JSON.stringify(targetingSpec));
  const url = `https://graph.facebook.com/v19.0/act_${AD_ACCOUNT_ID}/reachestimate?targeting_spec=${encodedSpec}`;

  try {
    const response = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    const data = await response.json();

    const lower = data.users_lower_bound ?? data.data?.users_lower_bound ?? 0;
    const upper = data.users_upper_bound ?? data.data?.users_upper_bound ?? 0;

    let avgReach = (lower + upper) / 2;
    if (upper <= 1000 || lower >= 2400000) avgReach = 0;

    // Always push, even if 0 or ""
    results.push({
      code: behaviorId,
      lang,
      expat: expatName,
      residents,
      apiReachMin: lower,
      apiReachMax: upper,
      apiReachAvg: avgReach,
    });

  } catch (err) {
    console.error(`FB request failed for ${expatName}:`, err);
    // Push 0/"" on error too
    results.push({
      code: behaviorId,
      lang,
      expat: expatName,
      residents,
      apiReachMin: 0,
      apiReachMax: 0,
      apiReachAvg: 0,
    });
  }
}

    // Insert totals into Supabase
    const { error } = await supabase.from('cro_expat').insert(
      results.map(l => ({
        code: l.code,
        expat: l.expat,
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
    console.error('API error:', err);
    res.status(500).json(
      Object.keys(expatCountries).map(id => ({
        code: id,
        expat: expatCountries[id],
        lang: "",
        residents: 0,
        apiReachMin: 0,
        apiReachMax: 0,
        apiReachAvg: 0,
      }))
    );
  }
}

