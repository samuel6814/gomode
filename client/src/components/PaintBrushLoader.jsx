import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { gsap } from '../utils/gsap';
import { BRAND_NAME, PAPER_BG, ACCENT_COLOR, FONT_FAMILY, VIOLET } from '../theme/brand';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  overflow: hidden;
  background: ${PAPER_BG};
`;

const PaintLayer = styled.div`
  position: absolute;
  inset: 0;
  background: ${VIOLET};
  transform-origin: left center;
  transform: scaleX(0);
`;

const BrushWrap = styled.div`
  position: absolute;
  top: 50%;
  left: -10%;
  transform: translateY(-50%);
  width: 120px;
  height: 120px;
  opacity: 0;
`;

const BrandText = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${FONT_FAMILY};
  font-size: clamp(1.25rem, 4vw, 2rem);
  font-weight: 600;
  letter-spacing: -0.06em;
  text-transform: none;
  color: #fff;
  opacity: 0;
  z-index: 2;
`;

const PaintBrushLoader = ({ onComplete }) => {
  const overlayRef = useRef(null);
  const paintRef = useRef(null);
  const brushRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const paint = paintRef.current;
    const brush = brushRef.current;
    const text = textRef.current;
    if (!overlay || !paint || !brush || !text) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      gsap.set(overlay, { autoAlpha: 0 });
      onComplete?.();
      return undefined;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete?.();
        },
      });

      tl.set(overlay, { autoAlpha: 1 })
        .set(brush, { autoAlpha: 1, x: '-10%' })
        .to(brush, { x: '110%', duration: 1.1, ease: 'power2.inOut' }, 0)
        .to(paint, { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 0)
        .to(text, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' }, 0.55)
        .to(text, { autoAlpha: 0, duration: 0.25, ease: 'power2.in' }, 1.05)
        .to(overlay, { y: '-100%', duration: 0.55, ease: 'power3.inOut' }, 1.15);
    }, overlay);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <Overlay ref={overlayRef} aria-hidden="true">
      <PaintLayer ref={paintRef} />
      <BrushWrap ref={brushRef}>
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <path
            d="M8 48 C18 38, 28 28, 38 18 L46 10 L54 18 L46 26 C36 36, 26 46, 16 56 Z"
            fill={ACCENT_COLOR}
          />
          <rect x="6" y="50" width="14" height="6" rx="2" fill="#8B8B8B" transform="rotate(-35 13 53)" />
          <path d="M44 8 L52 16 L48 20 L40 12 Z" fill={PAPER_BG} opacity="0.9" />
        </svg>
      </BrushWrap>
      <BrandText ref={textRef}>{BRAND_NAME}</BrandText>
    </Overlay>
  );
};

export default PaintBrushLoader;
