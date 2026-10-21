import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  NAVY_ACCENT,
  INK,
  MUTED,
  CANVAS,
  WHITE,
  FONT_HERO,
} from '../../../theme/brand';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SectionWrapper = styled.section`
  position: relative;
  width: 100%;
  min-height: calc(100vh - 88px);
  min-height: calc(100dvh - 88px);
  background: ${CANVAS};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
  padding: 0;
`;

const Stage = styled.div`
  position: relative;
  width: 100%;
  max-width: 1600px;
  height: calc(100vh - 92px);
  min-height: 560px;
  max-height: 900px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;

  @media (max-width: 768px) {
    height: auto;
    min-height: calc(100svh - 80px);
    overflow: visible;
  }
`;

/**
 * Layer 1: Giant Background Typography
 * "STYLE" on line 1: refined, italic, bold (weight: 700)
 * "GHANA" on line 2: italic, bold and strong/heavy (weight: 900)
 * Positioned in the upper/middle backdrop so the shoe rises up in front of it
 */
const TypographyBackground = styled.div`
  position: absolute;
  top: 6%;
  left: 0;
  right: 0;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: 1;
  pointer-events: none;
  user-select: none;
  opacity: 1;
  animation: ${fadeIn} 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
  }

  @media (min-width: 1024px) {
    top: 6%;
  }

  @media (max-width: 768px) {
    top: clamp(0.5rem, 2vh, 1.5rem);
  }

  @media (max-width: 480px) {
    top: clamp(0.25rem, 1.5vh, 1rem);
  }
`;

const HeroH1 = styled.h1`
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
`;

const FreshWord = styled.span`
  font-family: ${FONT_HERO};
  font-weight: 800;
  font-size: clamp(3.2rem, 9.5vw, 8.5rem);
  line-height: 0.88;
  letter-spacing: -0.03em;
  color: ${INK};
  text-align: center;
  text-transform: uppercase;
  opacity: 0.95;
  display: block;
  width: 100%;

  @media (max-width: 600px) {
    font-size: clamp(2.8rem, 13vw, 4.4rem);
  }
`;

const KicksWord = styled.span`
  font-family: ${FONT_HERO};
  font-weight: 900;
  font-size: clamp(3.8rem, 11.5vw, 10.5rem);
  line-height: 0.88;
  letter-spacing: -0.035em;
  color: #668A53;
  text-align: center;
  text-transform: uppercase;
  text-shadow: 0 4px 28px rgba(102, 138, 83, 0.28);
  display: block;
  width: 100%;

  @media (max-width: 768px) {
    text-shadow: none;
    font-size: clamp(3.4rem, 16vw, 5.2rem);
  }
`;

/**
 * Layer 2: Foreground Hero Asset (bg-hero.png)
 * Reliably centered across the entire stage (left: 0, right: 0, margin: 0 auto),
 * grounded at bottom: 0, and sized comfortably
 */
const HeroImageWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 2;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  pointer-events: none;
  animation: ${fadeIn} 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;

  img {
    display: block;
    height: clamp(440px, 68vh, 760px);
    max-width: min(95vw, 1100px);
    width: auto;
    object-fit: contain;
    object-position: bottom center;
    filter: drop-shadow(0 20px 42px rgba(17, 20, 24, 0.2));
    margin: 0 auto;
    transition: transform 0.4s ease;

    @media (min-width: 1200px) {
      height: clamp(480px, 72vh, 840px);
      max-width: 1250px;
    }

    @media (max-width: 768px) {
      height: clamp(300px, 50vh, 460px);
      max-width: 96vw;
      filter: none;
    }
  }

  @media (max-width: 768px) {
    position: relative;
    bottom: auto;
    margin-top: clamp(2.5rem, 6vh, 4rem);
    margin-bottom: 0.25rem;
  }
`;

/**
 * Layer 3: Editorial Flanks
 * Left: "DESIGN THAT ENDURES" + "SHOP NOW" CTA
 * Right: "COLLECTION NO. 1" + "EST. 2024"
 * Positioned cleanly above the bottom edge so it never overlaps the shoe image
 */
const EditorialBottomBar = styled.div`
  position: absolute;
  bottom: clamp(5.5rem, 11vh, 8.5rem);
  left: 2rem;
  right: 2rem;
  z-index: 3;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  pointer-events: none;

  @media (min-width: 1024px) {
    bottom: clamp(6.5rem, 13.5vh, 9.5rem);
    left: 4.5rem;
    right: 4.5rem;
  }

  @media (min-width: 1400px) {
    left: 6rem;
    right: 6rem;
  }

  @media (max-width: 768px) {
    position: relative;
    bottom: auto;
    left: auto;
    right: auto;
    width: 100%;
    padding: 0.5rem 1.5rem 2.5rem;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    text-align: center;
    z-index: 5;
    background: transparent;
  }
`;

const EditorialLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  pointer-events: auto;
  animation: ${fadeIn} 0.8s ease 0.25s both;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const Subtitle = styled.h2`
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  line-height: 1.45;
  color: ${INK};
  text-transform: uppercase;
  margin: 0;

  @media (min-width: 1024px) {
    font-size: 0.9375rem;
    letter-spacing: 0.18em;
  }
`;

const ShopNowButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: ${INK};
  color: ${WHITE};
  font-size: 0.78125rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 0.95rem 2.2rem;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 14px rgba(17, 20, 24, 0.15);

  &:hover {
    background: ${NAVY_ACCENT};
    box-shadow: 0 6px 20px rgba(102, 138, 83, 0.35);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const EditorialRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1.75rem;
  text-align: right;
  pointer-events: auto;
  animation: ${fadeIn} 0.8s ease 0.3s both;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
    gap: 0.75rem;
  }
`;

const CollectionMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  .meta-title {
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    color: ${INK};
    text-transform: uppercase;
  }

  .meta-sub {
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    color: ${INK};
    text-transform: uppercase;
  }
`;

const EstablishedMeta = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  color: ${MUTED};
  text-transform: uppercase;
`;

const HeroSection = () => {
  return (
    <SectionWrapper>
      <Stage>
        {/* Layer 1: Background Typography ("fresh kicks") */}
        <TypographyBackground>
          <HeroH1>
            <FreshWord>fresh</FreshWord>
            <KicksWord>kicks</KicksWord>
          </HeroH1>
        </TypographyBackground>

        {/* Layer 2: Centerpiece Shoe Asset - Grounded at the bottom, bigger and prominent */}
        <HeroImageWrapper>
          <img
            src="/sneaker-garden-bg.png"
            alt="GoMode - Fresh Kicks"
          />
        </HeroImageWrapper>

        {/* Layer 3: Editorial Flanks at the Bottom */}
        <EditorialBottomBar>
          <EditorialLeft>
            <Subtitle>
              DESIGN<br />
              THAT ENDURES
            </Subtitle>
            <ShopNowButton to="/shop">
              <span>SHOP NOW</span>
              <ArrowRight size={14} />
            </ShopNowButton>
          </EditorialLeft>

          <EditorialRight>
            <CollectionMeta>
              <span className="meta-title">COLLECTION</span>
              <span className="meta-sub">NO. 1</span>
            </CollectionMeta>
            <EstablishedMeta>EST. 2024</EstablishedMeta>
          </EditorialRight>
        </EditorialBottomBar>
      </Stage>
    </SectionWrapper>
  );
};

export default HeroSection;
