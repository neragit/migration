'use client';

import { useState, useEffect } from 'react';

//these components need this data but in page when i call MetaContainer.tsx only MetaPlot if fetched
import MetaPlot from './MetaPlot';
import MetaBarsAPI from './MetaBarsAPI';

interface LangData {
  lang: string;
  code: string;
  residents: number;
  apiReachMin: number;
  apiReachMax: number;
  apiReachAvg: number;
  country: 'N/A',
}

export default function MetaPlotContainer() {

  const [data, setData] = useState<LangData[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/api-reach');
        const apiData: LangData[] = await res.json();

        console.log('api API data:', apiData);

        setData(apiData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching api reach:', err);
        setData([]);
        setLoading(false);
      }
    };

    fetchData();

    // Optional: refresh once per day
    const interval = setInterval(fetchData, 1000 * 60 * 60 * 24);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading chart...</div>;
  if (!data || data.length === 0) return <div>No data available</div>;

  return <MetaPlot data={data} />;
}