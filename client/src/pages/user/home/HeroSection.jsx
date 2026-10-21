import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import {
  NAVY_ACCENT,
  INK,
  MUTED,
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
  padding: 2.5rem 1.25rem 3.5rem;

  @media ${media.tabletUp} {
    padding: 3.5rem 2.5rem 4rem;
  }

  @media ${media.desktop} {
    padding: 4.5rem 3.5rem 4.5rem;
  }
`;

const Container = styled.div`
  max-width: 1560px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.75rem;

  @media ${media.desktop} {
    gap: 3.5rem;
  }
`;

const TopMetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
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

const EditionTag = styled.div`
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${MUTED};
`;

/**
 * Main Layout Container:
 * On Mobile (< 1024px): Flex column where the right-side hero image comes FIRST (order: 1)
 * and the left-side text copy follows SECOND (order: 2).
 * On Desktop (>= 1024px): 2-Column Grid where text copy is on the left (order: 1)
 * and hero image is on the right (order: 2).
 */
const MainGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.25rem;

  @media ${media.desktop} {
    display: grid;
    grid-template-columns: 1.12fr 0.88fr;
    gap: 3.5rem;
    align-items: center;
  }
`;

const HeroImageColumn = styled.div`
  order: 1;
  width: 100%;
  position: relative;
  animation: ${slideUp} 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  @media ${media.desktop} {
    order: 2;
  }
`;

const ImageCard = styled.div`
  position: relative;
  width: 100%;
  background: ${WHITE};
  border: 1px solid ${LINE};
  overflow: hidden;
  box-shadow: 0 14px 34px rgba(17, 20, 24, 0.08);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease;

  &:hover {
    border-color: ${NAVY_ACCENT};
    box-shadow: 0 18px 40px rgba(102, 138, 83, 0.16);

    img {
      transform: scale(1.02);
    }
  }

  img {
    display: block;
    width: 100%;
    height: auto;
    max-height: clamp(300px, 46vh, 560px);
    object-fit: cover;
    object-position: center;
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
`;

const ImageBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(17, 20, 24, 0.88);
  backdrop-filter: blur(8px);
  color: ${WHITE};
  font-family: ${FONT_HERO};
  font-size: 0.65625rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 0.45rem 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.22);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  pointer-events: none;
  z-index: 2;

  .accent-circle {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${NAVY_ACCENT};
    box-shadow: 0 0 6px rgba(102, 138, 83, 0.8);
  }
`;

const TitleColumn = styled.div`
  order: 2;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  animation: ${slideUp} 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;

  @media ${media.desktop} {
    order: 1;
    gap: 1.25rem;
  }
`;

const SubtitleTag = styled.span`
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${NAVY_ACCENT};
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
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

const HeroSpecsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${LINE};

  @media ${media.tabletUp} {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
`;

const SpecItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;

  .spec-icon {
    color: ${NAVY_ACCENT};
    margin-top: 2px;
    flex-shrink: 0;
  }

  .spec-label {
    font-size: 0.6875rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${INK};
    margin: 0 0 0.2rem;
  }

  .spec-sub {
    font-size: 0.75rem;
    color: ${MUTED};
    margin: 0;
    line-height: 1.4;
  }
`;

const HeroSection = () => {
  return (
    <HeroWrapper>
      <Container>
        {/* Top Ticker / Status Bar */}
        <TopMetaRow>
          <LiveBadge>
            <span className="pulse-dot" />
            <span>GoMode Studio // Release 01 Live</span>
          </LiveBadge>
          <EditionTag>
            Strict Small-Batch Archive • 15 Curated Pieces
          </EditionTag>
        </TopMetaRow>

        {/* Main Content Grid: Image First on Mobile, Right on Desktop */}
        <MainGrid>
          {/* Visual Hero Campaign Image */}
          <HeroImageColumn>
            <ImageCard>
              <ImageBadge>
                <span className="accent-circle" />
                <span>ARCHIVE // RELEASE 01</span>
              </ImageBadge>
              <img
                src="/gomode-hero.png"
                alt="GoMode Apparel Campaign"
                loading="eager"
              />
            </ImageCard>
          </HeroImageColumn>

          {/* Text Title & Call-To-Action Column */}
          <TitleColumn>
            <SubtitleTag>
              <Sparkles size={14} />
              <span>Uncompromising Modern Apparel</span>
            </SubtitleTag>

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

        {/* Specs & Assurance Bar */}
        <HeroSpecsBar>
          <SpecItem>
            <div className="spec-icon">
              <Layers size={18} />
            </div>
            <div>
              <h5 className="spec-label">Artisanal Curation</h5>
              <p className="spec-sub">Eco-friendly TENCEL™, rigid denim, and wool blends.</p>
            </div>
          </SpecItem>

          <SpecItem>
            <div className="spec-icon">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h5 className="spec-label">Verified Sizing & Fit</h5>
              <p className="spec-sub">Complimentary size exchanges across Greater Accra.</p>
            </div>
          </SpecItem>

          <SpecItem>
            <div className="spec-icon">
              <Sparkles size={18} />
            </div>
            <div>
              <h5 className="spec-label">Nationwide Fulfillment</h5>
              <p className="spec-sub">Same-day dispatch and door-to-door delivery in Ghana.</p>
            </div>
          </SpecItem>
        </HeroSpecsBar>
      </Container>
    </HeroWrapper>
  );
};

export default HeroSection;
