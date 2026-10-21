import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { gsap } from '../utils/gsap';
import {
  ART_CORAL,
  ART_SAGE,
  ART_INK,
  ART_GOLD,
  ART_LAVENDER,
  PAPER_DARK,
  GRAPHITE_DARK,
  GRAPHITE_MID,
  GRAPHITE_LIGHT,
} from '../theme/brand';
import { media } from '../theme/breakpoints';

const ArtWrapper = styled.div`
  width: 100%;
  max-width: min(620px, 100%);
  aspect-ratio: 5/6;
  position: relative;

  @media ${media.tabletUp} {
    max-width: min(560px, 100%);
  }

  @media ${media.desktop} {
    max-width: min(680px, 100%);
  }

  @media ${media.mobile} {
    max-width: 100%;
    aspect-ratio: 4/5;
  }

  @media ${media.small} {
    aspect-ratio: 5/6;
  }

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

const COLOR_CYCLE = [ART_CORAL, ART_SAGE, ART_INK, ART_LAVENDER, ART_GOLD];

const HATCH_LINES = [
  { x1: 148, y1: 248, x2: 188, y2: 288, opacity: 0.35 },
  { x1: 155, y1: 255, x2: 195, y2: 295, opacity: 0.28 },
  { x1: 162, y1: 262, x2: 202, y2: 302, opacity: 0.32 },
  { x1: 168, y1: 268, x2: 208, y2: 308, opacity: 0.25 },
  { x1: 175, y1: 275, x2: 215, y2: 315, opacity: 0.3 },
  { x1: 140, y1: 265, x2: 180, y2: 305, opacity: 0.22 },
  { x1: 182, y1: 278, x2: 222, y2: 318, opacity: 0.26 },
  { x1: 195, y1: 290, x2: 235, y2: 330, opacity: 0.3 },
  { x1: 200, y1: 298, x2: 240, y2: 338, opacity: 0.24 },
  { x1: 158, y1: 310, x2: 198, y2: 350, opacity: 0.28 },
  { x1: 165, y1: 318, x2: 205, y2: 358, opacity: 0.22 },
  { x1: 172, y1: 325, x2: 212, y2: 365, opacity: 0.26 },
  { x1: 218, y1: 255, x2: 258, y2: 295, opacity: 0.2 },
  { x1: 225, y1: 262, x2: 265, y2: 302, opacity: 0.18 },
  { x1: 188, y1: 340, x2: 228, y2: 380, opacity: 0.25 },
  { x1: 195, y1: 348, x2: 235, y2: 388, opacity: 0.2 },
  { x1: 175, y1: 355, x2: 215, y2: 395, opacity: 0.22 },
  { x1: 182, y1: 362, x2: 222, y2: 402, opacity: 0.18 },
  { x1: 168, y1: 370, x2: 198, y2: 420, opacity: 0.24 },
  { x1: 175, y1: 378, x2: 205, y2: 428, opacity: 0.2 },
  { x1: 182, y1: 385, x2: 212, y2: 435, opacity: 0.16 },
  { x1: 230, y1: 320, x2: 270, y2: 360, opacity: 0.18 },
  { x1: 235, y1: 328, x2: 275, y2: 368, opacity: 0.15 },
];

const HeroAbstractArt = ({ className }) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (prefersReduced || isMobile) return undefined;

    let removeMove = () => {};
    const ctx = gsap.context(() => {
      const hatchLines = wrapper.querySelectorAll('.hero-hatch line');
      hatchLines.forEach((line) => {
        const length = line.getTotalLength?.() ?? 60;
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
      });

      gsap.to('.hero-hatch line', {
        strokeDashoffset: 0,
        duration: 1.8,
        stagger: 0.06,
        ease: 'power2.inOut',
        delay: 0.3,
      });

      gsap.to('.hero-portrait', {
        scale: 1.015,
        transformOrigin: '200px 260px',
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('.hero-hatch', {
        opacity: 0.55,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2.2,
      });

      const washTl = gsap.timeline({ repeat: -1 });
      COLOR_CYCLE.forEach((color) => {
        washTl.to('.hero-wash-a', { fill: color, duration: 3, ease: 'sine.inOut' });
      });
      COLOR_CYCLE.forEach((color) => {
        washTl.to('.hero-wash-b', { fill: color, duration: 3, ease: 'sine.inOut' }, '-=2');
      });

      const highlightTl = gsap.timeline({ repeat: -1 });
      [ART_LAVENDER, ART_GOLD, ART_SAGE, ART_CORAL, ART_LAVENDER].forEach((color) => {
        highlightTl.to('.hero-highlight', { fill: color, duration: 3.5, ease: 'sine.inOut' });
      });
      [ART_GOLD, ART_CORAL, ART_INK, ART_GOLD].forEach((color) => {
        highlightTl.to('.hero-hair-light', { fill: color, duration: 3.5, ease: 'sine.inOut' }, '-=1.8');
      });

      gsap.to('.hero-graphite-dust circle', {
        y: -12,
        opacity: 0.15,
        duration: 3,
        stagger: { each: 0.4, from: 'random' },
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('.hero-sketch-accent', {
        opacity: 0.45,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      const onMove = (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 14;
        gsap.to('.hero-parallax', { x, y, duration: 0.6, ease: 'power2.out' });
      };

      if (!('ontouchstart' in window)) {
        wrapper.addEventListener('mousemove', onMove);
        removeMove = () => wrapper.removeEventListener('mousemove', onMove);
      }
    }, wrapper);

    return () => {
      removeMove();
      ctx.revert();
    };
  }, []);

  return (
    <ArtWrapper ref={wrapperRef} className={className}>
      <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="400" height="500" fill="#FAFAF8" />

        <g className="hero-parallax">
          <ellipse
            className="hero-wash-a"
            cx="130"
            cy="180"
            rx="120"
            ry="100"
            fill={ART_SAGE}
            opacity="0.12"
          />
          <ellipse
            className="hero-wash-b"
            cx="290"
            cy="320"
            rx="100"
            ry="110"
            fill={ART_LAVENDER}
            opacity="0.1"
          />

          <g className="hero-portrait">
            <path
              d="M 95 420 C 120 395, 155 385, 200 388 C 245 385, 280 395, 305 420 L 320 480 L 80 480 Z"
              fill={GRAPHITE_MID}
              opacity="0.35"
            />
            <path
              d="M 120 400 C 150 388, 250 388, 280 400 L 295 455 L 105 455 Z"
              fill={GRAPHITE_DARK}
              opacity="0.2"
            />

            <path
              d="M 172 355 C 178 390, 182 410, 188 430 L 212 430 C 218 410, 222 390, 228 355 Z"
              fill={GRAPHITE_MID}
              opacity="0.5"
            />

            <path
              className="hero-hair-light"
              d="M 115 200 C 95 160, 110 95, 165 75 C 220 60, 280 80, 300 130 C 315 170, 310 220, 295 260 C 285 290, 270 310, 255 320 L 240 280 C 260 240, 268 190, 255 145 C 240 105, 200 88, 160 95 C 130 100, 115 130, 118 170 C 120 210, 135 250, 155 280 Z"
              fill={GRAPHITE_DARK}
              opacity="0.85"
            />

            <path
              d="M 148 175 C 135 210, 132 260, 145 310 C 155 340, 172 365, 200 372 C 228 365, 245 340, 255 310 C 268 260, 265 210, 252 175 C 240 145, 220 130, 200 128 C 180 130, 160 145, 148 175 Z"
              fill="#E8E4DC"
              opacity="0.95"
            />

            <path
              d="M 155 310 C 165 350, 185 368, 200 372 C 215 368, 235 350, 245 310 C 238 330, 220 345, 200 348 C 180 345, 162 330, 155 310 Z"
              fill={GRAPHITE_MID}
              opacity="0.15"
            />

            <path
              d="M 148 240 C 142 270, 145 300, 158 325 C 168 310, 172 280, 170 250 Z"
              fill={GRAPHITE_MID}
              opacity="0.12"
            />

            <ellipse
              className="hero-highlight"
              cx="175"
              cy="255"
              rx="18"
              ry="24"
              fill={ART_LAVENDER}
              opacity="0.18"
            />

            <g className="hero-hair" fill="none" stroke={GRAPHITE_DARK} strokeLinecap="round">
              <path d="M 155 120 C 170 105, 195 98, 220 105" strokeWidth="2.5" opacity="0.7" />
              <path d="M 148 135 C 165 118, 200 112, 235 125" strokeWidth="2" opacity="0.55" />
              <path d="M 142 155 C 158 138, 195 130, 248 148" strokeWidth="1.8" opacity="0.5" />
              <path d="M 138 175 C 152 162, 180 155, 255 170" strokeWidth="1.5" opacity="0.4" />
              <path d="M 250 130 C 270 150, 280 180, 275 210" strokeWidth="2" opacity="0.45" />
              <path d="M 258 145 C 275 165, 282 195, 278 225" strokeWidth="1.5" opacity="0.35" />
            </g>

            <g className="hero-features">
              <path
                d="M 158 198 C 172 192, 188 192, 202 198"
                fill="none"
                stroke={GRAPHITE_DARK}
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.75"
              />
              <path
                d="M 210 195 C 225 190, 242 192, 255 200"
                fill="none"
                stroke={GRAPHITE_DARK}
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.6"
              />

              <ellipse cx="182" cy="218" rx="14" ry="9" fill="#FAFAF8" opacity="0.9" />
              <ellipse cx="182" cy="218" rx="7" ry="7" fill={GRAPHITE_DARK} opacity="0.85" />
              <circle cx="184" cy="216" r="2.5" fill="#FAFAF8" opacity="0.8" />
              <path
                d="M 168 215 Q 182 210, 196 215"
                fill="none"
                stroke={GRAPHITE_DARK}
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.7"
              />

              <ellipse cx="232" cy="220" rx="12" ry="8" fill="#FAFAF8" opacity="0.85" />
              <ellipse cx="233" cy="220" rx="6" ry="6" fill={GRAPHITE_DARK} opacity="0.8" />
              <circle cx="234" cy="218" r="2" fill="#FAFAF8" opacity="0.75" />
              <path
                d="M 220 218 Q 232 214, 244 218"
                fill="none"
                stroke={GRAPHITE_DARK}
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.65"
              />

              <path
                d="M 200 225 L 205 268 C 200 272, 192 270, 188 265"
                fill="none"
                stroke={GRAPHITE_MID}
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.55"
              />
              <path
                d="M 188 265 C 192 268, 198 268, 205 266"
                fill="none"
                stroke={GRAPHITE_MID}
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.4"
              />

              <path
                d="M 188 295 Q 200 302, 212 295"
                fill="none"
                stroke={GRAPHITE_DARK}
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.6"
              />
              <path
                d="M 190 298 Q 200 304, 210 298"
                fill="none"
                stroke={GRAPHITE_MID}
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.4"
              />
              <path
                d="M 192 292 Q 200 294, 208 292"
                fill="none"
                stroke={GRAPHITE_DARK}
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.35"
              />
            </g>

            <g className="hero-hatch" fill="none" stroke={GRAPHITE_MID} strokeWidth="1" strokeLinecap="round">
              {HATCH_LINES.map((line, i) => (
                <line
                  key={i}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  opacity={line.opacity}
                />
              ))}
            </g>
          </g>

          <g className="hero-sketch-accent" fill="none" stroke={ART_GOLD} strokeLinecap="round">
            <path
              d="M 130 160 C 145 120, 175 100, 200 98 C 225 100, 255 120, 270 160"
              strokeWidth="1.2"
              opacity="0.35"
            />
            <path
              d="M 140 380 C 165 400, 235 400, 260 380"
              strokeWidth="1"
              opacity="0.25"
            />
          </g>

          <g className="hero-graphite-dust" fill={GRAPHITE_LIGHT}>
            <circle cx="90" cy="200" r="2" opacity="0.4" />
            <circle cx="310" cy="250" r="1.5" opacity="0.35" />
            <circle cx="120" cy="380" r="2" opacity="0.3" />
            <circle cx="280" cy="400" r="1.8" opacity="0.35" />
            <circle cx="200" cy="90" r="1.5" opacity="0.3" />
            <circle cx="340" cy="180" r="2" opacity="0.25" />
          </g>
        </g>

        <rect
          x="24"
          y="24"
          width="352"
          height="452"
          fill="none"
          stroke={PAPER_DARK}
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>
    </ArtWrapper>
  );
};

export default HeroAbstractArt;
