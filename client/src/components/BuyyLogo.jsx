import React from 'react';
import styled from 'styled-components';
import { INK, NAVY_ACCENT, FONT_HERO } from '../theme/brand';

const LogoText = styled.span`
  font-family: ${FONT_HERO};
  font-weight: 900;
  font-size: ${(props) => (props.$size ? `${props.$size}px` : '24px')};
  line-height: 1;
  letter-spacing: -0.05em;
  color: ${INK};
  text-transform: lowercase;
  display: inline-flex;
  align-items: baseline;
  user-select: none;
  transition: opacity 0.2s ease, transform 0.2s ease;

  .accent-mode {
    color: ${NAVY_ACCENT};
    font-weight: 800;
  }

  .accent-dot {
    display: inline-block;
    width: clamp(4px, 0.22em, 7px);
    height: clamp(4px, 0.22em, 7px);
    border-radius: 50%;
    background: ${NAVY_ACCENT};
    margin-left: 2px;
  }

  &:hover {
    opacity: 0.9;
    transform: scale(1.02);
  }
`;

const BuyyLogo = ({ size = 26 }) => (
  <LogoText $size={size} aria-label="gomode">
    go<span className="accent-mode">mode</span>
    <span className="accent-dot" />
  </LogoText>
);

export default BuyyLogo;

