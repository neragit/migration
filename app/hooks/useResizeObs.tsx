import { useEffect, useState } from "react";

export default function useResizeObserver<T extends Element>(
  ref: React.RefObject<T | null>
) {
  const [size, setSize] = useState<{
    width: number;
    height: number;
    vw: number;
    vh: number;
    isPortrait: boolean;
  } | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const updateWindow = () => {
      setSize(prev =>
        prev
          ? {
              ...prev,
              vw: window.innerWidth,
              vh: window.innerHeight,
              isPortrait: window.innerWidth < window.innerHeight
            }
          : {
              width: element.clientWidth,
              height: element.clientHeight,
              vw: window.innerWidth,
              vh: window.innerHeight,
              isPortrait: window.innerWidth < window.innerHeight
            }
      );
    };

    updateWindow();

    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (!entry) return;

      setSize(prev => ({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
        vw: prev?.vw ?? window.innerWidth,
        vh: prev?.vh ?? window.innerHeight,
        isPortrait: window.innerWidth < window.innerHeight
      }));
    });

    observer.observe(element);
    window.addEventListener("resize", updateWindow);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWindow);
    };
  }, [ref]);

  return size;
}
