import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import heroImage from '../../../assets/hero-sneaker.png';
import heroMobileImage from '../../../assets/hero-sneaker-mobile.png';
import { FONT_FAMILY, INK } from '../../../theme/brand';

const Section = styled.section`
  position: relative;
  width: 100%;
  height: 85vh;
  min-height: 500px;
  max-height: 900px;
  overflow: hidden;
  background: #e6e7e9;
`;

const Frame = styled.picture`
  display: block;
  width: 100%;
  height: 100%;
`;

const Backdrop = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;

  @media (min-width: 768px) {
    object-position: center 40%;
  }
`;

const Copy = styled.div`
  position: absolute;
  left: 1.5rem;
  right: 1.5rem;
  bottom: 6.5rem;
  color: #ffffff;
  font-family: ${FONT_FAMILY};

  @media (min-width: 768px) {
    left: 3rem;
    right: auto;
    width: min(40rem, calc(100% - 6rem));
    bottom: 5.5rem;
  }
`;

const Eyebrow = styled.p`
  margin: 0 0 0.75rem;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin: 0;
  max-width: 11em;
  font-size: clamp(2.25rem, 9vw, 4.375rem);
  font-weight: 900;
  line-height: 1;
  overflow-wrap: anywhere;
`;

const ShopLink = styled(Link)`
  display: inline-flex;
  margin-top: 2rem;
  border-radius: 30px;
  padding: 0.75rem 1.5rem;
  background: #ffffff;
  color: ${INK};
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;

  &:hover {
    background: #f4f4f4;
  }
`;

const StoreHero = () => (
  <Section>
    <Frame>
      <source media="(max-width: 767px)" srcSet={heroMobileImage} />
      <Backdrop src={heroImage} alt="Sneaker in low light" />
    </Frame>
    <Copy>
      <Eyebrow>Sustainable Basics</Eyebrow>
      <Title>Made for the streets.</Title>
      <ShopLink to="/shop">Shop Collection</ShopLink>
    </Copy>
  </Section>
);

export default StoreHero;
