import { useEffect, useState } from "react";

export default function useResizeObserver<T extends HTMLElement>(
  ref: React.RefObject<T | null>
) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (!entry) return;

      const { width, height } = entry.contentRect;

      setSize({ width, height });
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return size;
}
