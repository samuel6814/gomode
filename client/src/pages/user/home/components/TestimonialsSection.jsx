import React from 'react';
import styled from 'styled-components';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
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

const Section = styled.section`
  max-width: 1600px;
  margin: 0 auto;
  padding: 5rem 1.5rem;

  @media ${media.tabletUp} {
    padding: 7rem 2.5rem;
  }

  @media ${media.desktop} {
    padding: 8rem 3.5rem;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 760px;
  margin: 0 auto 3.5rem;

  @media ${media.tabletUp} {
    margin-bottom: 4.5rem;
  }

  .eyebrow {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${NAVY_ACCENT};
    margin-bottom: 0.75rem;
    display: block;
  }

  h2 {
    font-family: ${FONT_HERO};
    font-size: clamp(2rem, 4.2vw, 3.2rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: ${INK};
    line-height: 1.1;
    margin: 0 0 1rem;
    text-transform: uppercase;
  }

  p {
    font-size: 0.9375rem;
    line-height: 1.6;
    color: #555e6b;
    margin: 0;
  }
`;

const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media ${media.tabletOnly} {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.75rem;
  }

  @media ${media.desktop} {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
`;

const ReviewCard = styled.div`
  background: ${WHITE};
  border: 1px solid ${LINE};
  padding: 2.25rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: ${NAVY_ACCENT};
    box-shadow: 0 16px 36px rgba(37, 60, 90, 0.08);
  }
`;

const StarsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: ${NAVY_ACCENT};
  margin-bottom: 1.25rem;
`;

const QuoteText = styled.blockquote`
  font-size: 0.9375rem;
  line-height: 1.65;
  color: ${INK};
  margin: 0 0 1.75rem;
  font-style: italic;
  font-weight: 500;
  position: relative;

  &::before {
    content: '“';
    font-family: ${FONT_HERO};
    font-size: 2.5rem;
    line-height: 0;
    color: ${NAVY_ACCENT};
    opacity: 0.3;
    display: inline-block;
    margin-right: 0.25rem;
    vertical-align: -0.4rem;
  }
`;

const ReviewerMeta = styled.div`
  padding-top: 1.25rem;
  border-top: 1px solid ${LINE};
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  .author-row {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h4 {
      font-family: ${FONT_HERO};
      font-size: 0.875rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: ${INK};
      margin: 0;
    }

    .verified {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #2E7D32;
    }
  }

  .location {
    font-size: 0.75rem;
    color: ${MUTED};
    letter-spacing: 0.04em;
    margin: 0;
  }

  .purchased {
    font-size: 0.71875rem;
    font-weight: 600;
    color: ${NAVY_ACCENT};
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-top: 0.25rem;
  }
`;

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      'The craftsmanship is breathtaking. Wore the Gel-Kayano 14 for an entire 12-hour summit in Accra with zero fatigue. The leather detailing and finish rival European fashion houses.',
    author: 'Kofi Mensah',
    location: 'East Legon, Accra',
    product: 'ASICS Gel-Kayano 14',
  },
  {
    id: 2,
    quote:
      'I was hesitant about ordering online in Ghana, but delivery arrived in Cantonments the following afternoon. The suede on the Boston clogs is super plush and fits true to size.',
    author: 'Naa Adjeley Kpakpo',
    location: 'Cantonments, Accra',
    product: 'Birkenstock Boston Soft Footbed Suede Clog',
  },
  {
    id: 3,
    quote:
      'GoMode brings real elevated aesthetics to our local footwear landscape. The packaging, delivery speed, and personal WhatsApp concierge were top notch. Already eyeing my next pair.',
    author: 'Kwame Boateng',
    location: 'Ahodwo, Kumasi',
    product: 'Nike Shox R4',
  },
];

const TestimonialsSection = () => {
  return (
    <Section>
      <SectionHeader>
        <span className="eyebrow">Collector Reviews</span>
        <h2>Endorsed by True Enthusiasts</h2>
        <p>
          Discover why discerning collectors across Ghana and beyond trust GoMode for their daily footwear rotation.
        </p>
      </SectionHeader>

      <ReviewsGrid>
        {TESTIMONIALS.map((t) => (
          <ReviewCard key={t.id}>
            <div>
              <StarsRow>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill={NAVY_ACCENT} color={NAVY_ACCENT} />
                ))}
              </StarsRow>
              <QuoteText>{t.quote}</QuoteText>
            </div>

            <ReviewerMeta>
              <div className="author-row">
                <h4>{t.author}</h4>
                <span className="verified">
                  <CheckCircle size={12} />
                  <span>Verified</span>
                </span>
              </div>
              <p className="location">{t.location}</p>
              <span className="purchased">Acquired: {t.product}</span>
            </ReviewerMeta>
          </ReviewCard>
        ))}
      </ReviewsGrid>
    </Section>
  );
};

export default TestimonialsSection;
