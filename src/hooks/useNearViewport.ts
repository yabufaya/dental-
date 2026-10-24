import { useEffect, useRef, useState, RefObject } from 'react';

export function useNearViewport(margin = '400px'): [RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setNear(true); // Fail-open
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: `0px 0px ${margin} 0px` }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return [ref, near];
}
