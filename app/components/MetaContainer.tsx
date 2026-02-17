"use client";

import { useEffect, useState } from 'react';
import MetaPlot from './MetaPlot';

export default function MetaContainer() {
  const [data, setData] = useState<any[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/meta');
      const json = await res.json();
      setData(json);
    }

    fetchData();
  }, []);

  if (data === null) return <div>Loading...</div>;
  if (data.length === 0) return <div>No data available</div>;

  return <MetaPlot data={data} />;
}
