import React from 'react';
import styled from 'styled-components';

// --- Shared Global Components ---
import Footer from '../../components/Footer';

// --- Home Specific Components ---
import HeroSection from './HeroSection';
// --- Breakpoints (to keep padding consistent with other sections) ---
const BREAKPOINTS = {
  tablet: '1024px',
  mobile: '768px',
};

// --- Optional Wrapper for Page-level styling ---
const PageContainer = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  
  /* CRITICAL: Prevents horizontal scrolling on mobile from absolute positioned elements */
  overflow-x: hidden; 
`;

const Content = styled.div`
  flex: 1; 
  display: flex;
  flex-direction: column;
  width: 100%;
`;

// Replaced your inline styles with a proper styled component
const MaxWidthWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 3rem;
  width: 100%;

  @media (max-width: ${BREAKPOINTS.tablet}) {
    padding: 0 2rem;
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    padding: 0 1.25rem;
  }
`;

const HomeLayout = () => {
  return (
    <PageContainer>
      {/* Main Page Content */}
      <Content>
       
      </Content>

      {/* Global Footer */}
      <Footer />
    </PageContainer>
  );
};

export default HomeLayout;