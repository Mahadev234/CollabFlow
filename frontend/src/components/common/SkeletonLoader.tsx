import React from 'react';

interface SkeletonLoaderProps {
  type?: 'text' | 'circle' | 'rectangle';
  className?: string;
  count?: number;
  width?: string;
  height?: string;
}

export default function SkeletonLoader({
  type = 'text',
  className = '',
  count = 1,
  width = '100%',
  height = '1rem',
}: SkeletonLoaderProps) {
  const skeletons = Array(count).fill(0);

  const getSkeletonClass = () => {
    switch (type) {
      case 'circle':
        return 'rounded-full';
      case 'rectangle':
        return 'rounded-lg';
      default:
        return 'rounded';
    }
  };

  return (
    <>
      {skeletons.map((_, index) => (
        <div
          key={index}
          className={`animate-pulse bg-gray-200 ${getSkeletonClass()} ${className}`}
          style={{ width, height }}
        />
      ))}
    </>
  );
} 