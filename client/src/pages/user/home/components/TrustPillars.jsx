import React from 'react';
import styled from 'styled-components';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';
import {
  CANVAS,
  INK,
  LINE,
  NAVY_ACCENT,
  WHITE,
  FONT_HERO,
} from '../../../../theme/brand';
import { media } from '../../../../theme/breakpoints';

const SectionWrapper = styled.section`
  border-top: 1px solid ${LINE};
  border-bottom: 1px solid ${LINE};
  background: #EBE8E1;
  padding: 3.5rem 1.5rem;

  @media ${media.tabletUp} {
    padding: 4.5rem 2.5rem;
  }
`;

const Container = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${media.desktop} {
    grid-template-columns: repeat(4, 1fr);
    gap: 2.5rem;
  }
`;

const PillarCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;

  .icon-wrapper {
    width: 48px;
    height: 48px;
    background: ${WHITE};
    border: 1px solid ${LINE};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${NAVY_ACCENT};
    flex-shrink: 0;
    transition: transform 0.25s ease, background-color 0.25s ease, color 0.25s ease;
  }

  &:hover .icon-wrapper {
    background: ${NAVY_ACCENT};
    color: ${WHITE};
    transform: translateY(-2px);
  }

  .content {
    h3 {
      font-family: ${FONT_HERO};
      font-size: 0.875rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: ${INK};
      margin: 0 0 0.35rem;
    }

    p {
      font-size: 0.8125rem;
      line-height: 1.5;
      color: #555e6b;
      margin: 0;
    }
  }
`;

const PILLARS = [
  {
    icon: Truck,
    title: 'Express Ghana Delivery',
    desc: 'Next-day delivery in Greater Accra & Kumasi; express transit to all regions.',
  },
  {
    icon: RotateCcw,
    title: '30-Day Size Exchange',
    desc: 'Effortless, complimentary size swaps to ensure your fit is exact.',
  },
  {
    icon: ShieldCheck,
    title: 'Guaranteed Authentic',
    desc: 'Every silhouette is individually inspected with certified genuine materials.',
  },
  {
    icon: Headphones,
    title: 'Bespoke Concierge',
    desc: 'Personalized customer care and sizing support via WhatsApp & phone.',
  },
];

const TrustPillars = () => {
  return (
    <SectionWrapper>
      <Container>
        {PILLARS.map((p, idx) => {
          const Icon = p.icon;
          return (
            <PillarCard key={idx}>
              <div className="icon-wrapper">
                <Icon size={22} strokeWidth={1.75} />
              </div>
              <div className="content">
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            </PillarCard>
          );
        })}
      </Container>
    </SectionWrapper>
  );
};

export default TrustPillars;
