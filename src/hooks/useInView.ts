import { useEffect, useRef, useState, RefObject } from 'react';

const callbacks = new WeakMap<Element, () => void>();
let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cb = callbacks.get(entry.target);
          if (cb) {
            cb();
            observer?.unobserve(entry.target);
            callbacks.delete(entry.target);
          }
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  );
  return observer;
}

export function useInView(): [RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setInView(true); // Fail-open: never hide content permanently
      return;
    }

    callbacks.set(el, () => setInView(true));
    getObserver().observe(el);

    return () => {
      observer?.unobserve(el);
      callbacks.delete(el);
    };
  }, []);

  return [ref, inView];
}
