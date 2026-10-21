import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  NAVY_ACCENT,
  INK,
  CANVAS,
  WHITE,
  LINE,
  FONT_HERO,
} from '../../../theme/brand';
import { media } from '../../../theme/breakpoints';

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(28px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.45;
    transform: scale(0.85);
  }
`;

const HeroWrapper = styled.section`
  position: relative;
  width: 100%;
  background: ${CANVAS};
  border-bottom: 1px solid ${LINE};
  overflow: hidden;
  padding: 2rem 1.25rem 3.5rem;

  @media ${media.tabletUp} {
    padding: 3rem 2.5rem 4rem;
  }

  @media ${media.desktop} {
    padding: 3.5rem 3.5rem 4.5rem;
  }
`;

const Container = styled.div`
  max-width: 1560px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media ${media.desktop} {
    gap: 3rem;
  }
`;

const TopMetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid ${LINE};
  animation: ${slideUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

const LiveBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${INK};

  .pulse-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${NAVY_ACCENT};
    box-shadow: 0 0 10px rgba(102, 138, 83, 0.65);
    animation: ${pulse} 2s infinite ease-in-out;
  }
`;

/**
 * Main Layout Container:
 * Mobile (< 1024px): Hero image comes FIRST (order: 1), text copy follows SECOND (order: 2).
 * Desktop (>= 1024px): 2-Column Grid where text is on the left (order: 1) and image on the right (order: 2).
 */
const MainGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;

  @media ${media.desktop} {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 4rem;
    align-items: center;
  }
`;

const HeroImageColumn = styled.div`
  order: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${slideUp} 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  @media ${media.desktop} {
    order: 2;
    justify-content: flex-end;
  }
`;

const HeroImage = styled.img`
  display: block;
  width: 100%;
  max-width: 620px;
  height: auto;
  max-height: clamp(280px, 50vh, 620px);
  object-fit: contain;
  filter: drop-shadow(0 14px 28px rgba(17, 20, 24, 0.12));
  transition: transform 0.4s ease;

  &:hover {
    transform: scale(1.02);
  }

  @media ${media.tabletUp} {
    max-height: clamp(340px, 56vh, 640px);
  }
`;

const TitleColumn = styled.div`
  order: 2;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  width: 100%;
  animation: ${slideUp} 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;

  @media ${media.desktop} {
    order: 1;
    gap: 1.25rem;
  }
`;

const DisplayHeading = styled.h1`
  font-family: ${FONT_HERO};
  font-size: clamp(2.6rem, 7.5vw, 6.8rem);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.04em;
  color: ${INK};
  text-transform: uppercase;
  margin: 0;

  .accent-line {
    color: ${NAVY_ACCENT};
    display: block;
    text-shadow: 0 4px 30px rgba(102, 138, 83, 0.18);
  }
`;

const NarrativeText = styled.p`
  font-size: clamp(0.9375rem, 1.2vw, 1.125rem);
  line-height: 1.6;
  color: #3b424a;
  max-width: 620px;
  margin: 0.25rem 0 0.85rem;
`;

const ActionButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  padding-top: 0.25rem;
`;

const PrimaryCta = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: ${INK};
  color: ${WHITE};
  font-size: 0.8125rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 1.1rem 2.4rem;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 6px 18px rgba(17, 20, 24, 0.16);

  &:hover {
    background: ${NAVY_ACCENT};
    box-shadow: 0 8px 26px rgba(102, 138, 83, 0.35);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SecondaryCta = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  color: ${INK};
  font-size: 0.8125rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 1.1rem 2rem;
  border: 1px solid ${INK};
  transition: all 0.25s ease;

  &:hover {
    border-color: ${NAVY_ACCENT};
    color: ${NAVY_ACCENT};
    background: rgba(102, 138, 83, 0.05);
    transform: translateY(-2px);
  }
`;

const HeroSection = () => {
  return (
    <HeroWrapper>
      <Container>
        {/* Top Status Bar */}
        <TopMetaRow>
          <LiveBadge>
            <span className="pulse-dot" />
            <span>GoMode Studio // Release 01 Live</span>
          </LiveBadge>
        </TopMetaRow>

        {/* Main Content Grid: Image First on Mobile, Right on Desktop */}
        <MainGrid>
          {/* Visual Hero Campaign Image: Pure Image, Optimized AVIF/WebP */}
          <HeroImageColumn>
            <picture style={{ display: 'contents' }}>
              <source type="image/avif" srcSet="/gomode-hero.avif" />
              <source type="image/webp" srcSet="/gomode-hero.webp" />
              <HeroImage
                src="/gomode-hero.png"
                alt="GoMode Apparel Campaign"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width="1280"
                height="955"
              />
            </picture>
          </HeroImageColumn>

          {/* Text Title & Call-To-Action Column */}
          <TitleColumn>
            <DisplayHeading>
              OWN YOUR
              <span className="accent-line">MODE.</span>
            </DisplayHeading>

            <NarrativeText>
              Engineered corduroy overshirts, heavyweight relaxed denim, tactile wool-blend polos, and structured aviator outerwear. Designed for deliberate movement and timeless presence.
            </NarrativeText>

            <ActionButtonGroup>
              <PrimaryCta to="/shop">
                <span>Explore The Archive</span>
                <ArrowRight size={15} />
              </PrimaryCta>
              <SecondaryCta to="/shop?category=Outerwear%20%26%20Jackets">
                <span>Outerwear & Denim</span>
              </SecondaryCta>
            </ActionButtonGroup>
          </TitleColumn>
        </MainGrid>
      </Container>
    </HeroWrapper>
  );
};

export default HeroSection;
