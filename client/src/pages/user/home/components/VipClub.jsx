import React, { useState } from 'react';
import styled from 'styled-components';
import { ArrowRight, Check } from 'lucide-react';
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
  max-width: 1600px;
  margin: 0 auto;
  padding: 4rem 1.5rem 6rem;

  @media ${media.tabletUp} {
    padding: 5.5rem 2.5rem 7.5rem;
  }
`;

const Box = styled.div`
  background: ${WHITE};
  border: 1px solid ${LINE};
  padding: 3.5rem 2rem;
  text-align: center;
  position: relative;
  box-shadow: 0 16px 40px rgba(37, 60, 90, 0.04);
  max-width: 920px;
  margin: 0 auto;

  @media ${media.tabletUp} {
    padding: 5rem 4rem;
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
    font-size: clamp(1.8rem, 3.8vw, 2.8rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: ${INK};
    line-height: 1.15;
    margin: 0 0 1rem;
  }

  p {
    font-size: 0.9375rem;
    line-height: 1.6;
    color: #555e6b;
    max-width: 580px;
    margin: 0 auto 2.25rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 520px;
  margin: 0 auto;

  @media (min-width: 600px) {
    flex-direction: row;
    gap: 0;
  }

  input {
    flex: 1;
    height: 52px;
    padding: 0 1.25rem;
    font-size: 0.875rem;
    color: ${INK};
    background: ${CANVAS};
    border: 1px solid ${LINE};
    outline: none;
    transition: border-color 0.2s ease;

    &:focus {
      border-color: ${NAVY_ACCENT};
    }

    &::placeholder {
      color: ${MUTED};
    }

    @media (min-width: 600px) {
      border-right: none;
    }
  }

  button {
    height: 52px;
    padding: 0 1.75rem;
    background: ${NAVY_ACCENT};
    color: ${WHITE};
    border: none;
    font-size: 0.78125rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: background-color 0.2s ease;

    &:hover {
      background: ${INK};
    }
  }
`;

const SuccessMsg = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #E8F5E9;
  color: #2E7D32;
  border: 1px solid #C8E6C9;
  padding: 0.75rem 1.5rem;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const VipClub = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <SectionWrapper>
      <Box>
        <span className="eyebrow">The Collectors Registry</span>
        <h2>Join the GoMode Circle</h2>
        <p>
          Receive privileged access to private trunk shows, limited-edition footwear drops, and bespoke styling dispatches.
        </p>

        {subscribed ? (
          <SuccessMsg>
            <Check size={16} strokeWidth={2.5} />
            <span>Welcome to the registry. Confirmation dispatched.</span>
          </SuccessMsg>
        ) : (
          <Form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              aria-label="Email Address for VIP Registry"
            />
            <button type="submit">
              <span>Subscribe</span>
              <ArrowRight size={14} />
            </button>
          </Form>
        )}
      </Box>
    </SectionWrapper>
  );
};

export default VipClub;
