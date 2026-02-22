"use client";

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import MetaBars from './MetaBars';

export default function MetaChart() {
  const [data, setData] = useState<any[] | null>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,       // fetch data only once
    rootMargin: '100px',     // fetch slightly before scrolling into view
  });

  useEffect(() => {
    if (!inView) return;      // do nothing until visible

    async function fetchData() {
      try {
        const res = await fetch('/api/meta');
        if (!res.ok) throw new Error('Failed to fetch data');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setData([]);           // treat errors as no data
      }
    }

    fetchData();
  }, [inView]);

  return (
    <div ref={ref}>
      {data === null && <div>Loading chart...</div>}
      {data?.length === 0 && <div>No data available</div>}
      {data && <MetaBars data={data} />}
    </div>
  );
}