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
  padding: 3rem 1.25rem 3.5rem;

  @media ${media.tabletUp} {
    padding: 4.5rem 2.5rem 4.5rem;
  }

  @media ${media.desktop} {
    padding: 5.5rem 3.5rem 5rem;
  }
`;

const Container = styled.div`
  max-width: 1560px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
`;

const TopMetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding-bottom: 1.5rem;
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

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: end;

  @media ${media.desktop} {
    grid-template-columns: 1.35fr 0.85fr;
    gap: 4rem;
  }
`;

const TitleColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  animation: ${slideUp} 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
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
  font-size: clamp(2.8rem, 8.8vw, 7.8rem);
  font-weight: 900;
  line-height: 0.88;
  letter-spacing: -0.04em;
  color: ${INK};
  text-transform: uppercase;
  margin: 0;

  .accent-line {
    color: ${NAVY_ACCENT};
    display: block;
    text-shadow: 0 4px 30px rgba(102, 138, 83, 0.18);
  }

  .italic-sub {
    font-style: italic;
    font-weight: 800;
    letter-spacing: -0.05em;
  }
`;

const NarrativeText = styled.p`
  font-size: clamp(0.9375rem, 1.25vw, 1.1875rem);
  line-height: 1.6;
  color: #3b424a;
  max-width: 640px;
  margin: 0.5rem 0 1rem;
`;

const ActionButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  padding-top: 0.5rem;
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
  padding: 1.15rem 2.6rem;
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
  padding: 1.15rem 2rem;
  border: 1px solid ${INK};
  transition: all 0.25s ease;

  &:hover {
    border-color: ${NAVY_ACCENT};
    color: ${NAVY_ACCENT};
    background: rgba(102, 138, 83, 0.05);
    transform: translateY(-2px);
  }
`;

const FeatureColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  animation: ${slideUp} 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
`;

const CategorySnippetCard = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: #EBE8E1;
  border: 1px solid ${LINE};
  text-decoration: none;
  color: ${INK};
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  .tag-num {
    font-size: 0.6875rem;
    font-weight: 800;
    letter-spacing: 0.16em;
    color: ${NAVY_ACCENT};
  }

  .tag-title {
    font-family: ${FONT_HERO};
    font-size: 0.9375rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin: 0 0 0.15rem;
  }

  .tag-desc {
    font-size: 0.75rem;
    color: #555e6b;
    margin: 0;
  }

  .arrow-box {
    width: 32px;
    height: 32px;
    border: 1px solid ${LINE};
    background: ${WHITE};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${INK};
    transition: all 0.2s ease;
  }

  &:hover {
    border-color: ${NAVY_ACCENT};
    background: ${WHITE};
    transform: translateX(4px);
    box-shadow: 0 8px 20px rgba(17, 20, 24, 0.06);

    .arrow-box {
      background: ${NAVY_ACCENT};
      color: ${WHITE};
      border-color: ${NAVY_ACCENT};
    }
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

        {/* Main Content Grid */}
        <MainGrid>
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

          <FeatureColumn>
            <CategorySnippetCard to="/shop?category=Outerwear%20%26%20Jackets">
              <div>
                <span className="tag-num">01 / DROP</span>
                <h4 className="tag-title">Outerwear & Leather</h4>
                <p className="tag-desc">Classic Shearling Aviator & Heavy Layers</p>
              </div>
              <div className="arrow-box">
                <ArrowRight size={14} />
              </div>
            </CategorySnippetCard>

            <CategorySnippetCard to="/shop?category=Denim%20%26%20Jeans">
              <div>
                <span className="tag-num">02 / DENIM</span>
                <h4 className="tag-title">90s Loose & Relaxed</h4>
                <p className="tag-desc">Rigid Light Wash & Overdyed Jet Black</p>
              </div>
              <div className="arrow-box">
                <ArrowRight size={14} />
              </div>
            </CategorySnippetCard>

            <CategorySnippetCard to="/shop?category=Sweaters%20%26%20Knits">
              <div>
                <span className="tag-num">03 / KNIT</span>
                <h4 className="tag-title">Tactile Knits & Polos</h4>
                <p className="tag-desc">Textured Wool Blends & Argyle Cardigans</p>
              </div>
              <div className="arrow-box">
                <ArrowRight size={14} />
              </div>
            </CategorySnippetCard>

            <CategorySnippetCard to="/shop?category=Bags%20%26%20Accessories">
              <div>
                <span className="tag-num">04 / CARRY</span>
                <h4 className="tag-title">Bags & Everyday Goods</h4>
                <p className="tag-desc">Canvas Commuters & Embossed Belts</p>
              </div>
              <div className="arrow-box">
                <ArrowRight size={14} />
              </div>
            </CategorySnippetCard>
          </FeatureColumn>
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
