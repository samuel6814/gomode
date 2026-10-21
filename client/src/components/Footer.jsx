import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../api/axios';
import BuyyLogo from './BuyyLogo';
import {
  CLIENT_TAGLINE,
  FONT_FAMILY,
  INK,
  LINE,
  MUTED,
} from '../theme/brand';
import { media } from '../theme/breakpoints';

const FooterWrap = styled.footer`
  margin-top: 4rem;
  padding: 3rem 1.25rem 6rem;
  border-top: 1px solid ${LINE};
  color: ${MUTED};
  font-family: ${FONT_FAMILY};
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;

  @media ${media.tabletUp} {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const BrandCol = styled.div`
  max-width: 16rem;
`;

const Blurb = styled.p`
  margin: 0.75rem 0 0;
  font-size: 14px;
  letter-spacing: -0.014em;
  line-height: 1.4;
`;

const Columns = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  font-size: 14px;
  letter-spacing: -0.014em;

  @media ${media.tablet} {
    grid-template-columns: 1fr 1fr;
  }

  @media ${media.desktop} {
    grid-template-columns: repeat(3, minmax(8rem, 1fr));
  }
`;

const ColTitle = styled.h4`
  margin: 0 0 0.75rem;
  color: ${INK};
  font-size: 14px;
  font-weight: 600;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

const FooterLink = styled(Link)`
  color: ${MUTED};
  text-decoration: none;

  &:hover {
    color: ${INK};
  }
`;

const Subscribe = styled.form`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  background: #fff;
  border: 1px solid ${LINE};
  border-radius: 9999px;
  overflow: hidden;
  max-width: 16rem;
`;

const Email = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 0.7rem 0.9rem;
  font: inherit;
  font-size: 14px;
  color: ${INK};

  &::placeholder {
    color: ${MUTED};
  }
`;

const Send = styled.button`
  border: none;
  background: transparent;
  padding: 0.65rem 0.8rem;
  cursor: pointer;
  color: ${INK};
`;

const Note = styled.p`
  margin: 0.5rem 0 0;
  font-size: 12px;
`;

const Footer = () => {
  const [email, setEmail] = useState('');
  const mutation = useMutation({
    mutationFn: async (value) => {
      const res = await apiClient.post('/newsletter/subscribe', { email: value });
      return res.data;
    },
    onSuccess: () => setEmail(''),
  });

  return (
    <FooterWrap>
      <Inner>
        <BrandCol>
          <BuyyLogo size={58} />
          <Blurb>{CLIENT_TAGLINE}</Blurb>
          <Subscribe
            onSubmit={(event) => {
              event.preventDefault();
              if (email) mutation.mutate(email);
            }}
          >
            <Email
              type="email"
              required
              placeholder="Email address"
              aria-label="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Send type="submit" aria-label="Subscribe" disabled={mutation.isPending}>
              <ChevronRight size={18} />
            </Send>
          </Subscribe>
          {mutation.isSuccess && <Note>You are on the list.</Note>}
          {mutation.isError && <Note>Could not subscribe. Try again.</Note>}
        </BrandCol>

        <Columns>
          <div>
            <ColTitle>Shop</ColTitle>
            <List>
              <FooterLink to="/shop">All products</FooterLink>
              <FooterLink to="/shop/categories">Categories</FooterLink>
              <FooterLink to="/cart">Cart</FooterLink>
            </List>
          </div>
          <div>
            <ColTitle>Information</ColTitle>
            <List>
              <FooterLink to="/about">About</FooterLink>
              <FooterLink to="/contact">Help center</FooterLink>
              <FooterLink to="/shipping">Shipping</FooterLink>
              <FooterLink to="/policies">Policies</FooterLink>
              <FooterLink to="/track">Track an order</FooterLink>
            </List>
          </div>
          <div>
            <ColTitle>Legal</ColTitle>
            <List>
              <FooterLink to="/terms">Terms of Service</FooterLink>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/refunds">Returns</FooterLink>
            </List>
          </div>
        </Columns>
      </Inner>
    </FooterWrap>
  );
};

export default Footer;
