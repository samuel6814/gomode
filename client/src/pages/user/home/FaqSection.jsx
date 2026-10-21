import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import {
  PAPER_BG,
  ACCENT_COLOR,
  GRAPHITE_DARK,
  GRAPHITE_MID,
  FONT_FAMILY,
} from '../../../theme/brand';

import { media } from '../../../theme/breakpoints';
import ScrollReveal from '../../../components/ScrollReveal';

const Section = styled.section`
  padding: 3.5rem 1.25rem;
  background: ${PAPER_BG};
  font-family: ${FONT_FAMILY};

  @media ${media.tabletUp} {
    padding: 5rem 1.5rem;
  }
`;

const Inner = styled.div`
  max-width: 760px;
  margin: 0 auto;
`;

const Eyebrow = styled.p`
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: ${GRAPHITE_MID};
`;

const Title = styled.h2`
  margin: 0 0 2.5rem;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${GRAPHITE_DARK};
`;

const AccordionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const AccordionItem = styled.div`
  background: #fff;
  border: 1px solid #e5e1d8;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  }
`;

const AccordionHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.15rem 1.25rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  color: ${GRAPHITE_DARK};
  transition: color 0.2s;

  &:hover {
    color: ${ACCENT_COLOR};
  }
`;

const ChevronIcon = styled(ChevronDown)`
  flex-shrink: 0;
  color: ${ACCENT_COLOR};
  transition: transform 0.3s ease;
  transform: ${(p) => (p.$open ? 'rotate(180deg)' : 'rotate(0)')};
`;

const AccordionBody = styled.div`
  max-height: ${(p) => (p.$open ? '400px' : '0')};
  overflow: hidden;
  transition: max-height 0.35s ease;
`;

const AccordionContent = styled.div`
  padding: 0 1.25rem 1.25rem;
  color: ${GRAPHITE_MID};
  line-height: 1.7;
  font-size: 0.95rem;
`;

const CtaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2.5rem;
`;

const PrimaryBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 0.85rem 1.5rem;
  background: ${ACCENT_COLOR};
  color: ${PAPER_BG};
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 4px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
`;

const SecondaryBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 0.85rem 1.5rem;
  border: 1px solid ${GRAPHITE_DARK};
  color: ${GRAPHITE_DARK};
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 4px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.75;
  }
`;

const FAQ_ITEMS = [
  {
    question: 'How do commissions work?',
    answer:
      'Share your vision: reference photos, size, and any special details. I will confirm timeline and pricing, then begin with graphite sketches before building layers of cross-hatching and tone until the portrait is complete.',
  },
  {
    question: 'What mediums do you work in?',
    answer:
      'My primary medium is graphite pencil on archival paper. I work in layered strokes, blending, and cross-hatching to achieve depth, texture, and lifelike detail in every portrait.',
  },
  {
    question: 'How long does a portrait take?',
    answer:
      'Most single-subject portraits take two to four weeks depending on size and complexity. Rush requests may be accommodated. Reach out early and we can discuss your deadline.',
  },
  {
    question: 'Do you ship original artwork internationally?',
    answer:
      'Yes. Finished originals are carefully packaged and shipped worldwide. Shipping costs and delivery times depend on your location and will be confirmed before you place a commission.',
  },
  {
    question: 'Can I request a two-sided portrait?',
    answer:
      'Absolutely. Two-sided portraits are a signature part of my practice. One side captures refined realism, the other reveals a more expressive counterpart. Mention this when you enquire.',
  },
  {
    question: 'How do I get in touch?',
    answer:
      'Use the contact form, email me directly, or message on WhatsApp. I respond to all commission enquiries within one to two business days.',
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <Section>
      <Inner>
        <ScrollReveal>
          <Eyebrow>Questions</Eyebrow>
          <Title>Frequently Asked</Title>
        </ScrollReveal>

        <ScrollReveal stagger={0.08} as={AccordionList}>
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <AccordionItem key={item.question}>
                <AccordionHeader
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <ChevronIcon size={20} $open={isOpen} />
                </AccordionHeader>
                <AccordionBody $open={isOpen}>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionBody>
              </AccordionItem>
            );
          })}
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <CtaRow>
            <PrimaryBtn to="/commissions">Start a Commission</PrimaryBtn>
            <SecondaryBtn to="/contact">Contact Us</SecondaryBtn>
          </CtaRow>
        </ScrollReveal>
      </Inner>
    </Section>
  );
};

export default FaqSection;
