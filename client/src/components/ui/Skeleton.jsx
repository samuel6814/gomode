import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
`;

export const SkeletonBase = styled.div`
  background-color: #e6e6e6;
  border-radius: 0;
  width: ${(props) => props.$width || '100%'};
  height: ${(props) => props.$height || '20px'};
  animation: ${pulse} 1.6s ease-in-out infinite;
`;

export const ProductSkeleton = () => (
  <div>
    <SkeletonBase style={{ width: '100%', height: 'auto', aspectRatio: '3 / 4' }} />
    <SkeletonBase $height="12px" $width="70%" style={{ marginTop: '0.7rem' }} />
    <SkeletonBase $height="12px" $width="36%" style={{ marginTop: '0.35rem' }} />
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem 0.75rem', width: '100%' }}>
    {Array.from({ length: count }, (_, index) => (
      <ProductSkeleton key={index} />
    ))}
  </div>
);

export const TextStackSkeleton = () => (
  <div style={{ width: '100%' }}>
    <SkeletonBase $height="28px" $width="40%" style={{ marginBottom: '1rem' }} />
    <SkeletonBase $height="16px" $width="100%" style={{ marginBottom: '0.6rem' }} />
    <SkeletonBase $height="16px" $width="92%" style={{ marginBottom: '0.6rem' }} />
    <SkeletonBase $height="16px" $width="70%" />
  </div>
);
