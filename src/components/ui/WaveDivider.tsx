import React from 'react';

interface WaveDividerProps {
  from?: string;
  className?: string;
}

export const WaveDivider: React.FC<WaveDividerProps> = ({ from = '#ffffff', className = '' }) => {
  return (
    <div className={`sec__wave ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        className="w-full h-full block"
        focusable="false"
      >
        <path
          d="M0 0 H1440 V24 C1200 48 960 0 720 24 S240 48 0 24 Z"
          fill={from}
        />
      </svg>
    </div>
  );
};

export default WaveDivider;
