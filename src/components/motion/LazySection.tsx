import React, { Suspense } from 'react';
import { useNearViewport } from '../../hooks/useNearViewport';

interface LazySectionProps {
  component: React.ComponentType<any>;
  minHeight?: number | string;
  id?: string;
  [key: string]: any;
}

export const LazySection: React.FC<LazySectionProps> = ({
  component: Component,
  minHeight = 480,
  id,
  ...props
}) => {
  const [ref, near] = useNearViewport('400px');

  return (
    <div
      ref={ref}
      id={id}
      style={{ minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }}
      className="w-full relative"
    >
      {near ? (
        <Suspense
          fallback={
            <div
              className="w-full animate-pulse bg-slate-50 flex items-center justify-center"
              style={{ minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }}
              aria-busy="true"
            >
              <div className="w-10 h-10 border-3 border-[#2ba8c9] border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <Component {...props} />
        </Suspense>
      ) : (
        <div style={{ height: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }} />
      )}
    </div>
  );
};

export default LazySection;
