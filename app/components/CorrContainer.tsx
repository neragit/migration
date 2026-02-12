'use client';

import { useState, useEffect } from 'react';
import CorrelationPlot from './CorrelationPlot';

interface LangData {
  lang: string;
  fbReach: number;
  residents: number;
}

// Initial data with correct spelling
const initialData: LangData[] = [
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

export default function CorrelationPlotContainer() {
  const [data, setData] = useState<LangData[]>(initialData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/fb-reach');
        const fbData: LangData[] = await res.json();

        console.log('Raw FB data returned from API:', fbData);

        // Map API results to initial data
        const newData = initialData.map(d => {
          const match = fbData.find(f => f.lang === d.lang);
          const fbReach = match?.fbReach ?? 0; // fallback to 0 if missing
          console.log(`${d.lang}: fbReach = ${fbReach}, residents = ${d.residents}`);
          return { ...d, fbReach };
        });

        console.log('Mapped data for D3 chart:', newData);

        setData(newData);
      } catch (err) {
        console.error('Error fetching FB reach:', err);
      }
    };

    fetchData();

    // Refresh hourly
    const interval = setInterval(fetchData, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, []);

  return <CorrelationPlot data={data} />;
}
