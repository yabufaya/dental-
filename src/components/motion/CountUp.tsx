import React, { useEffect, useState } from 'react';
import { useInView } from '../../hooks/useInView';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// Smooth cubic ease-out curve
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

interface CountUpProps {
  to: number;
  decimals?: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  to,
  decimals = 0,
  duration = 1800,
  delay = 0,
  prefix = '',
  suffix = '',
  separator = ',',
  className = '',
}) => {
  const [ref, inView] = useInView();
  const reduced = useReducedMotion();

  const factor = 10 ** decimals;
  const goal = Math.round(to * factor);

  const format = (n: number) => {
    const v = decimals ? (n / factor).toFixed(decimals) : String(n);
    const [int, dec] = v.split('.');
    return int.replace(/\B(?=(\d{3})+(?!\d))/g, separator) + (dec ? '.' + dec : '');
  };

  const [text, setText] = useState<string>(reduced ? format(goal) : format(0));

  useEffect(() => {
    if (reduced) {
      setText(format(goal));
      return;
    }
    if (!inView) return;

    let raf: number;
    let start: number | null = null;
    const timer = setTimeout(() => {
      const tick = (now: number) => {
        if (start === null) start = now;
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const easedValue = Math.round(easeOutCubic(progress) * goal);

        setText(format(easedValue));

        if (progress < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          setText(format(goal));
        }
      };
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [inView, reduced, goal, duration, delay]);

  return (
    <span ref={ref} className={`inline-block tabular-nums font-extrabold text-slate-900 ${className}`}>
      {/* Screen readers get clean final value */}
      <span className="sr-only">
        {prefix}{format(goal)}{suffix}
      </span>
      <span aria-hidden="true">
        {prefix}{text}{suffix}
      </span>
    </span>
  );
};

export default CountUp;
