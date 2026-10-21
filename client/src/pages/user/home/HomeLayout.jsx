import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import SEO from '../../../components/SEO';
import HeroSection from './HeroSection';
import MarqueeTicker from './components/MarqueeTicker';
import CategoryShowcase from './components/CategoryShowcase';
import FeaturedArchive from './components/FeaturedArchive';
import CraftHeritageStory from './components/CraftHeritageStory';
import TestimonialsSection from './components/TestimonialsSection';
import TrustPillars from './components/TrustPillars';
import VipClub from './components/VipClub';
import {
  BRAND_NAME,
  FONT_FAMILY,
  INK,
  CANVAS,
  SITE_URL,
  NAVY_ACCENT,
  WHITE,
} from '../../../theme/brand';
import { Link } from 'react-router-dom';

const Page = styled.div`
  font-family: ${FONT_FAMILY};
  color: ${INK};
  background: ${CANVAS};
  min-height: 100vh;
  overflow-x: hidden;
`;

const SalesBanner = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  max-width: 1600px;
  margin: 1.5rem auto;
  padding: 1rem 2rem;
  background: ${NAVY_ACCENT};
  color: ${WHITE};
  text-decoration: none;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.95;
  }
`;

const fetchProducts = async () => (await apiClient.get('/products')).data;
const fetchCategories = async () => (await apiClient.get('/categories')).data;

const HomeLayout = () => {
  const { data: productResponse } = useQuery({
    queryKey: ['storefrontProducts'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });

  const { data: categoryResponse } = useQuery({
    queryKey: ['storefrontCategories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });

  const { data: saleResponse } = useQuery({
    queryKey: ['storefrontSale'],
    queryFn: async () => (await apiClient.get('/sales')).data,
    staleTime: 60 * 1000,
  });

  const sale = saleResponse?.data;
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!sale?.active) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [sale?.active]);

  const rawProducts = productResponse?.data || [];
  const products = rawProducts.filter(
    (product) => product.isActive !== false && product.images?.[0]?.image?.url
  );

  return (
    <Page>
      <SEO
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: BRAND_NAME,
          url: SITE_URL,
        }}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Flash Sale Banner if active */}
      {sale?.active && (() => {
        const remaining = Math.max(0, new Date(sale.endsAt).getTime() - now);
        const hours = Math.floor(remaining / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        const clock = [hours, minutes, seconds].map((part) => String(part).padStart(2, '0')).join(':');
        return (
          <SalesBanner to="/shop">
            <span>Special Private Sale — {sale.discountPercent}% Off Curated Pieces</span>
            <span>Ends in {clock}</span>
          </SalesBanner>
        );
      })()}

      {/* 1. Architectural Live Ticker */}
      <MarqueeTicker />

      {/* 2. Curated Categories Grid */}
      <CategoryShowcase />

      {/* 3. Filterable Footwear Archive */}
      <FeaturedArchive products={products} />

      {/* 4. Craft & Ghanaian Heritage Story */}
      <CraftHeritageStory />

      {/* 5. Verified Testimonials Section */}
      <TestimonialsSection />

      {/* 6. Brand Assurance & Logistics Pillars */}
      <TrustPillars />

      {/* 7. Collectors Registry / VIP Club */}
      <VipClub />
    </Page>
  );
};

export default HomeLayout;
