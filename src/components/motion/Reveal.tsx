import React from 'react';
import { useInView } from '../../hooks/useInView';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export type RevealVariant = 'up' | 'drop' | 'left' | 'right' | 'zoom' | 'fade';

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}

export const Reveal: React.FC<RevealProps> = ({
  variant = 'up',
  delay = 0,
  className = '',
  children,
  style,
  ...rest
}) => {
  const [ref, inView] = useInView();
  const reduced = useReducedMotion();
  const show = reduced || inView;

  return (
    <div
      ref={ref}
      className={`reveal reveal--${variant} ${show ? 'is-visible' : ''} ${className}`}
      style={{
        transitionDelay: show ? `${delay}ms` : '0ms',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Reveal;
