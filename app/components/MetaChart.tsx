"use client";

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import MetaBars from './MetaBars';

export default function MetaChart() {
  const [data, setData] = useState<any[] | null>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,       // fetch data only once
    rootMargin: '200px',     // fetch slightly before scrolling into view
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
    <div ref={ref} className="w-full h-[500px] flex items-center justify-center">
      {data === null && <div className="text-xs tracking-[0.18em] uppercase text-gray-300 font-semibold">Učitavanje...</div>}
      {data?.length === 0 && <div className="text-xs tracking-[0.18em] uppercase text-gray-300 font-semibold">Nema podataka</div>}
      {data && <MetaBars data={data} />}
    </div>
  );
}