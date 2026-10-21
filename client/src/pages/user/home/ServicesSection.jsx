import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { PAPER_BG, SERVICE_NAME, BRAND_NAME, FONT_FAMILY } from '../../../theme/brand';
import { media } from '../../../theme/breakpoints';
import ScrollReveal from '../../../components/ScrollReveal';

const Section = styled.section`
  padding: 3rem 1.25rem;
  background: #1a1a1a;
  color: #f9fafb;
  font-family: ${FONT_FAMILY};

  @media ${media.tabletUp} {
    padding: 4rem 1.5rem;
  }
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  gap: 1.5rem;
  align-items: center;

  @media (min-width: 768px) {
    grid-template-columns: 1.4fr auto;
  }
`;

const Eyebrow = styled.p`
  color: ${PAPER_BG};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.8rem;
  margin: 0 0 0.5rem;
  opacity: 0.7;
`;

const Title = styled.h2`
  margin: 0 0 0.75rem;
  font-size: clamp(1.75rem, 3vw, 2.25rem);
`;

const Text = styled.p`
  margin: 0;
  color: #d1d5db;
  max-width: 36rem;
  line-height: 1.6;
`;

const Cta = styled(Link)`
  display: inline-block;
  background: ${PAPER_BG};
  color: #1a1a1a;
  padding: 0.9rem 1.5rem;
  text-decoration: none;
  font-weight: 600;
  justify-self: start;

  @media (min-width: 768px) {
    justify-self: end;
  }
`;

const ServicesSection = () => {
  return (
    <Section>
      <ScrollReveal as={Inner}>
        <div>
          <Eyebrow>{BRAND_NAME}</Eyebrow>
          <Title>Commission a Portrait</Title>
          <Text>
            From single-sided graphite portraits to signature two-sided pieces with a hidden alter ego.
            {SERVICE_NAME.toLowerCase()} take you from concept to finished artwork.
          </Text>
        </div>
        <Cta to="/commissions">Explore {SERVICE_NAME}</Cta>
      </ScrollReveal>
    </Section>
  );
};

export default ServicesSection;
