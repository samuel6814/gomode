import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Compass, Sparkles } from 'lucide-react';
import {
  CANVAS,
  INK,
  LINE,
  NAVY_ACCENT,
  WHITE,
  MUTED,
  FONT_HERO,
} from '../../../../theme/brand';
import { media } from '../../../../theme/breakpoints';

const SectionWrapper = styled.section`
  background: #EBE8E1;
  border-top: 1px solid ${LINE};
  border-bottom: 1px solid ${LINE};
  padding: 3rem 1.25rem;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;

  @media ${media.tabletUp} {
    padding: 5.5rem 2rem;
  }

  @media ${media.desktop} {
    padding: 7.5rem 3.5rem;
  }
`;

const Container = styled.div`
  max-width: 1500px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2.5rem;
  align-items: center;
  box-sizing: border-box;

  @media ${media.desktop} {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: 4.5rem;
  }
`;

const ContentCol = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;

  .eyebrow {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${NAVY_ACCENT};
    margin-bottom: 0.65rem;
    display: block;
  }

  h2 {
    font-family: ${FONT_HERO};
    font-size: clamp(1.4rem, 5.2vw, 2.75rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: ${INK};
    text-transform: uppercase;
    margin: 0 0 1.15rem;
    word-break: normal;
    overflow-wrap: break-word;
  }

  .lead {
    font-size: 0.9rem;
    line-height: 1.6;
    color: #434c56;
    margin: 0 0 1.75rem;
    max-width: 620px;
    word-break: normal;
    overflow-wrap: break-word;
  }
`;

const PillarsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
  width: 100%;
  min-width: 0;
`;

const PillarItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;

  .icon-box {
    width: 38px;
    height: 38px;
    background: ${WHITE};
    border: 1px solid ${LINE};
    color: ${NAVY_ACCENT};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .text-box {
    flex: 1;
    min-width: 0;

    h4 {
      font-family: ${FONT_HERO};
      font-size: 0.8125rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: ${INK};
      margin: 0 0 0.25rem;
      line-height: 1.3;
      word-break: normal;
      overflow-wrap: break-word;
    }

    p {
      font-size: 0.8125rem;
      line-height: 1.5;
      color: #555e6b;
      margin: 0;
      word-break: normal;
      overflow-wrap: break-word;
    }
  }
`;

const LearnMoreLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${INK};
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-decoration: none;
  border-bottom: 2px solid ${INK};
  padding-bottom: 4px;
  align-self: flex-start;
  transition: all 0.2s ease;

  &:hover {
    color: ${NAVY_ACCENT};
    border-color: ${NAVY_ACCENT};
    transform: translateX(4px);
  }
`;

const VisualCol = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 0.5rem 0 0;
`;

const VisualCard = styled.div`
  position: relative;
  width: 100%;
  max-width: 440px;
  background: ${WHITE};
  border: 1px solid ${LINE};
  padding: 1.5rem 1.25rem;
  box-shadow: 0 14px 32px rgba(37, 60, 90, 0.08);
  box-sizing: border-box;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (min-width: 600px) {
    padding: 2.25rem 2rem;
    max-width: 500px;
  }

  @media ${media.tabletUp} {
    padding: 3rem 2.5rem;
    max-width: 540px;
  }

  .showcase-img {
    width: 100%;
    max-width: 280px;
    height: auto;
    max-height: 260px;
    object-fit: contain;
    filter: drop-shadow(0 12px 22px rgba(17, 20, 24, 0.14));
    transition: transform 0.4s ease;
    display: block;
    margin: 0 auto;

    @media (min-width: 600px) {
      max-width: 360px;
      max-height: 360px;
    }
  }

  &:hover .showcase-img {
    transform: scale(1.03) rotate(-1.5deg);
  }
`;

const SealBadge = styled.div`
  position: absolute;
  top: -12px;
  right: 1rem;
  background: ${NAVY_ACCENT};
  color: ${WHITE};
  padding: 0.5rem 0.875rem;
  font-family: ${FONT_HERO};
  font-size: 0.65625rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  box-shadow: 0 4px 14px rgba(37, 60, 90, 0.22);
  z-index: 5;
  white-space: nowrap;

  @media (min-width: 600px) {
    top: -16px;
    right: 1.5rem;
    padding: 0.7rem 1.2rem;
    font-size: 0.71875rem;
    letter-spacing: 0.14em;
  }

  @media ${media.tabletUp} {
    top: -20px;
    right: 2rem;
  }
`;

const CraftHeritageStory = () => {
  return (
    <SectionWrapper>
      <Container>
        <ContentCol>
          <span className="eyebrow">Artisanal Ethos</span>
          <h2>Where Accra Heritage Meets Modern Silhouettes</h2>
          <p className="lead">
            GoMode was born to bridge the gap between world-class international footwear culture and the vibrant soul of contemporary West Africa. Every silhouette is engineered for lasting elegance, dynamic comfort, and timeless presence.
          </p>

          <PillarsList>
            <PillarItem>
              <div className="icon-box">
                <ShieldCheck size={20} />
              </div>
              <div className="text-box">
                <h4>Authentic Materials & Finishes</h4>
                <p>
                  Hand-selected premium suedes, durable full-grain leathers, and breathable technical textiles treated for durability in both tropical and global climates.
                </p>
              </div>
            </PillarItem>

            <PillarItem>
              <div className="icon-box">
                <Compass size={20} />
              </div>
              <div className="text-box">
                <h4>Ergonomic Orthotic Tooling</h4>
                <p>
                  Anatomical cork-latex footbeds, EVA shock mitigation, and decoupled outsole pods engineered to ensure unmatched comfort from morning to evening.
                </p>
              </div>
            </PillarItem>

            <PillarItem>
              <div className="icon-box">
                <Sparkles size={20} />
              </div>
              <div className="text-box">
                <h4>Small-Batch Curation</h4>
                <p>
                  Strict quality over mass production. Each release is hand-curated, verified, and delivered directly to the collector.
                </p>
              </div>
            </PillarItem>
          </PillarsList>

          <LearnMoreLink to="/about">
            <span>Discover The GoMode Story</span>
            <ArrowRight size={14} />
          </LearnMoreLink>
        </ContentCol>

        <VisualCol>
          <VisualCard>
            <SealBadge>Est. 2024 • Accra</SealBadge>
            <img
              src="/items/shoe108.jpg"
              alt="GoMode Heritage Craft Footwear"
              className="showcase-img"
            />
          </VisualCard>
        </VisualCol>
      </Container>
    </SectionWrapper>
  );
};

export default CraftHeritageStory;
