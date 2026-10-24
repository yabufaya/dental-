import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const positions = new Map<string, number>();

export const ScrollManager: React.FC = () => {
  const { pathname, hash, key } = useLocation();
  const navType = useNavigationType();
  const prevKey = useRef(key);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const save = () => {
      positions.set(prevKey.current, window.scrollY);
    };
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, []);

  useLayoutEffect(() => {
    if (hash) {
      // Allow DOM and lazy components to mount, then smoothly scroll
      const scrollToHash = () => {
        if (hash === '#top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      requestAnimationFrame(scrollToHash);
      const timer = setTimeout(scrollToHash, 120);
      return () => clearTimeout(timer);
    } else if (navType === 'POP') {
      const savedPos = positions.get(key) ?? 0;
      window.scrollTo(0, savedPos);
    } else {
      window.scrollTo(0, 0);
    }
    prevKey.current = key;
  }, [pathname, hash, key, navType]);

  return null;
};

export default ScrollManager;
