import React from 'react';
import Reveal from '../motion/Reveal';
import WaveDivider from './WaveDivider';

export type SectionTone =
  | 'services'
  | 'about'
  | 'experts'
  | 'steps'
  | 'stories'
  | 'blog'
  | 'ask'
  | 'contact';

interface SectionOpenerProps {
  id?: string;
  tone: SectionTone;
  label: string;
  title: string;
  titleSoft?: string;
  promise?: string;
  from?: string;
  dark?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const SectionOpener: React.FC<SectionOpenerProps> = ({
  id,
  tone,
  label,
  title,
  titleSoft,
  promise,
  from = '#ffffff',
  dark = false,
  children,
  className = '',
}) => {
  const headerId = id ? `h-${id}` : `h-${tone}`;

  return (
    <section
      id={id}
      className={`sec sec--${tone} ${dark ? 'sec--dark' : ''} ${className}`}
      aria-labelledby={headerId}
    >
      <WaveDivider from={from} />
      <div className="sec__inner">
        <div className="max-w-3xl mb-8">
          <Reveal variant="drop">
            <span className="sec__label shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900/60 inline-block" />
              {label}
            </span>
          </Reveal>

          <Reveal variant="up" delay={80}>
            <h2 id={headerId} className="sec__title">
              {title} {titleSoft && <span className="sec__soft">{titleSoft}</span>}
            </h2>
          </Reveal>

          {promise && (
            <Reveal variant="up" delay={160}>
              <p className="sec__promise">{promise}</p>
            </Reveal>
          )}
        </div>

        <div className="sec__body relative z-10">{children}</div>
      </div>
    </section>
  );
};

export default SectionOpener;
