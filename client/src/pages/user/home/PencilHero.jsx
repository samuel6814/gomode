import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Pencil, ArrowRight, Palette, PenLine } from 'lucide-react';
import { gsap } from '../../../utils/gsap';
import Navbar from '../../../components/Navbar';
import HeroAbstractArt from '../../../components/HeroAbstractArt';
import apiClient from '../../../api/axios';
import {
  PAPER_BG,
  GRAPHITE_DARK,
  GRAPHITE_MID,
  ACCENT_COLOR,
  FONT_FAMILY,
  ART_CORAL,
  ART_SAGE,
  ART_LAVENDER,
} from '../../../theme/brand';
import { media } from '../../../theme/breakpoints';

const CanvasIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="4" y="3" width="16" height="16" rx="1.5" />
    <path d="M8 19 L12 22 L16 19" />
    <line x1="12" y1="19" x2="12" y2="22" />
  </svg>
);

const Section = styled.section`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: ${FONT_FAMILY};
  color: ${GRAPHITE_DARK};
  background-color: ${PAPER_BG};
  padding-top: 6rem;

  @media ${media.mobile} {
    min-height: auto;
    padding-top: 5rem;
  }
`;

const PaperTexture = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.03;
  pointer-events: none;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
`;

const Grid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.25rem 3rem;
  position: relative;
  z-index: 1;
  width: 100%;

  @media ${media.tabletUp} {
    padding: 2rem 1.5rem 4rem;
    gap: 2.5rem;
  }

  @media ${media.desktop} {
    grid-template-columns: 4fr 8fr;
    gap: 2.5rem;
    padding: 3rem 3rem 4rem;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 36rem;
  order: 2;

  @media ${media.desktop} {
    order: 1;
    gap: 2rem;
  }
`;

const VisualCol = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  order: 1;
  position: relative;

  @media ${media.desktop} {
    order: 2;
    justify-content: flex-end;
  }
`;

const ArtGlow = styled.div`
  position: absolute;
  inset: 5% 0;
  background: radial-gradient(
    circle at 50% 45%,
    ${ART_CORAL}22 0%,
    ${ART_SAGE}18 35%,
    ${ART_LAVENDER}10 55%,
    transparent 75%
  );
  filter: blur(32px);
  pointer-events: none;
  z-index: 0;
`;

const ArtFrame = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: min(620px, 100%);
  padding: 0.5rem;

  @media ${media.desktop} {
    max-width: min(680px, 100%);
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    border: 1px solid ${ACCENT_COLOR};
    opacity: 0.25;
    pointer-events: none;
  }

  &::before {
    top: 0;
    left: 0;
    border-right: none;
    border-bottom: none;
  }

  &::after {
    bottom: 0;
    right: 0;
    border-left: none;
    border-top: none;
  }
`;

const DustRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;

  span {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${GRAPHITE_MID};
    opacity: 0.35;
  }
`;

const BrushIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M4 20 L8 16 L14 10 L18 14 L12 20 Z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 6 L18 2 L22 6 L18 10 Z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Eyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${GRAPHITE_MID};
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 600;
  font-size: 0.75rem;

  @media ${media.tabletUp} {
    font-size: 0.875rem;
  }
`;

const Headline = styled.h1`
  font-size: clamp(2rem, 8vw, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
  margin: 0;
  color: ${GRAPHITE_DARK};

  em {
    display: block;
    opacity: 0.45;
    font-style: italic;
    font-family: inherit;
    font-size: 0.65em;
    letter-spacing: -0.01em;
    font-weight: 500;
    margin-top: 0.15em;
  }
`;

const Description = styled.p`
  font-size: clamp(0.95rem, 2vw, 1.25rem);
  line-height: 1.7;
  font-weight: 500;
  color: ${GRAPHITE_MID};
  margin: 0;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-top: 0.25rem;

  @media ${media.tabletUp} {
    gap: 1rem;
    padding-top: 0.5rem;
  }
`;

const PrimaryBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.5rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  font-size: 0.85rem;
  text-decoration: none;
  background: ${ACCENT_COLOR};
  color: ${PAPER_BG};
  border-radius: 4px;
  transition: opacity 0.2s;

  @media ${media.tabletUp} {
    padding: 1rem 2rem;
  }

  &:hover {
    opacity: 0.85;
  }
`;

const SecondaryBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.5rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  font-size: 0.85rem;
  text-decoration: none;
  color: ${GRAPHITE_DARK};
  border: 1px solid ${GRAPHITE_DARK};
  border-radius: 4px;
  transition: opacity 0.2s;

  @media ${media.tabletUp} {
    padding: 1rem 2rem;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const StatsStrip = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(26, 26, 26, 0.1);
  margin-top: 0.5rem;

  @media ${media.tabletUp} {
    gap: 1.5rem 2rem;
    margin-top: 1rem;
  }
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${GRAPHITE_MID};
  text-transform: uppercase;
  letter-spacing: 0.06em;

  svg {
    color: ${ACCENT_COLOR};
    flex-shrink: 0;
  }

  @media ${media.tabletUp} {
    font-size: 0.85rem;
  }
`;

const ScrollCue = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 1.5rem 0 0.5rem;
  color: ${GRAPHITE_MID};
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;

  svg {
    color: ${ACCENT_COLOR};
  }
`;

export const HERO_DEFAULTS = {
  eyebrow: 'The Masterpiece Experience',
  headline: 'Fine Art',
  headlineItalic: 'drawn in',
  headlineEnd: 'Graphite',
  description:
    'Nortey George Okwei is a classically trained pencil artist. Every portrait begins as graphite on paper, with layered strokes, cross-hatching, and patience until the subject breathes on the page.',
  ctaPrimary: { text: 'Commission Yours', href: '/commissions' },
  ctaSecondary: { text: 'View Gallery', href: '/gallery' },
};

const STATS = [
  { icon: PenLine, label: 'Commissions' },
  { icon: Palette, label: 'Graphite on Paper' },
];

const PencilHero = () => {
  const sectionRef = useRef(null);
  const scrollCueRef = useRef(null);

  const { data: response } = useQuery({
    queryKey: ['heroConfigFront'],
    queryFn: async () => {
      const res = await apiClient.get('/hero');
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const config = { ...HERO_DEFAULTS, ...(response?.data || {}) };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!prefersReduced) {
        gsap.fromTo(
          '.hero-eyebrow, .hero-headline, .hero-desc, .hero-buttons, .hero-stats',
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
          }
        );

        gsap.fromTo(
          '.hero-visual',
          { opacity: 0, scale: 0.92 },
          { opacity: 1, scale: 1, duration: 1, delay: 0.2, ease: 'power3.out' }
        );
      }

      if (scrollCueRef.current && !prefersReduced) {
        gsap.to(scrollCueRef.current, {
          y: 8,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <Section ref={sectionRef}>
      <Navbar />
      <PaperTexture />
      <Grid>
        <VisualCol className="hero-visual">
          <ArtGlow />
          <ArtFrame>
            <HeroAbstractArt />
          </ArtFrame>
        </VisualCol>

        <Content>
          <Eyebrow className="hero-eyebrow">
            <CanvasIcon size={16} />
            <span>{config.eyebrow}</span>
          </Eyebrow>

          <Headline className="hero-headline">
            {config.headline}{' '}
            <em>{config.headlineItalic || 'drawn in'}</em>{' '}
            {config.headlineEnd || 'Graphite'}
          </Headline>

          <Description className="hero-desc">{config.description}</Description>

          <ButtonRow className="hero-buttons">
            <PrimaryBtn to={config.ctaPrimary?.href || '/commissions'}>
              {config.ctaPrimary?.text || 'Commission Yours'}
              <ArrowRight size={18} />
            </PrimaryBtn>
            <SecondaryBtn to={config.ctaSecondary?.href || '/gallery'}>
              <Pencil size={16} />
              {config.ctaSecondary?.text || 'View Gallery'}
            </SecondaryBtn>
          </ButtonRow>

          <StatsStrip className="hero-stats">
            {STATS.map(({ icon: Icon, label }) => (
              <StatItem key={label}>
                <Icon size={16} />
                <span>{label}</span>
              </StatItem>
            ))}
          </StatsStrip>
          <DustRow aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <span key={i} />
            ))}
          </DustRow>
        </Content>
      </Grid>

      <ScrollCue ref={scrollCueRef}>
        <span>Scroll</span>
        <BrushIcon size={18} />
      </ScrollCue>
    </Section>
  );
};

export default PencilHero;
