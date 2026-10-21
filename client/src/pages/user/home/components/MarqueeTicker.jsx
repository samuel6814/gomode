import React from 'react';
import styled, { keyframes } from 'styled-components';
import { CANVAS, INK, LINE, NAVY_ACCENT, FONT_HERO } from '../../../../theme/brand';
import { media } from '../../../../theme/breakpoints';

const marqueeAnim = keyframes`
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
`;

const TickerWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  background: ${CANVAS};
  border-top: 1px solid ${LINE};
  border-bottom: 1px solid ${LINE};
  padding: 1rem 0;
  user-select: none;
  display: flex;
  position: relative;

  @media ${media.tabletUp} {
    padding: 1.25rem 0;
  }
`;

const TickerTrack = styled.div`
  display: flex;
  white-space: nowrap;
  width: max-content;
  animation: ${marqueeAnim} 28s linear infinite;

  &:hover {
    animation-play-state: paused;
  }
`;

const TickerItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0 1.5rem;
  font-family: ${FONT_HERO};
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${INK};

  @media ${media.tabletUp} {
    font-size: 0.9375rem;
    gap: 2rem;
    padding: 0 2rem;
  }

  .accent-dot {
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${NAVY_ACCENT};
  }
`;

const PHRASES = [
  'ACCRA ARTISANAL ATELIER',
  'GENUINE HANDCRAFTED LEATHERS',
  'BESPOKE ERGONOMIC SOLES',
  'NATIONWIDE GHANA DELIVERY',
  'COLLECTION NO. 1 NOW LIVE',
  'TIMELESS ARCHITECTURAL SILHOUETTES',
];

const MarqueeTicker = () => {
  return (
    <TickerWrapper aria-hidden="true">
      <TickerTrack>
        {PHRASES.concat(PHRASES).map((phrase, idx) => (
          <TickerItem key={idx}>
            <span>{phrase}</span>
            <span className="accent-dot" />
          </TickerItem>
        ))}
      </TickerTrack>
    </TickerWrapper>
  );
};

export default MarqueeTicker;
