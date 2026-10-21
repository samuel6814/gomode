import React from 'react';
import styled from 'styled-components';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Styled Components ---

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%; /* Uses 100% instead of 100vw to prevent scrollbar-induced horizontal overflow */
  background-color: #FAFAFA;
  display: flex;
  align-items: stretch;
  overflow-x: hidden; /* Strict no horizontal scrolling */
  box-sizing: border-box;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

// --- LEFT CONTENT SECTION ---
const LeftSection = styled.div`
  flex: 1;
  padding: 6rem 4rem 4rem 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;

  @media (max-width: 1280px) { 
    padding: 4rem 3rem 4rem 6%; 
  }
  
  @media (max-width: 1024px) { 
    padding: 6rem 2rem 4rem 2rem; 
    text-align: center; 
    align-items: center; 
  }
  
  @media (max-width: 480px) { 
    padding: 5rem 1.5rem 3rem 1.5rem; 
  }
`;

const Overline = styled.span`
  font-family: sans-serif;
  font-size: 0.65rem;
  font-weight: 800;
  color: #1A1A1A;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 2rem;
  display: block;
`;

const Giant404 = styled.h1`
  font-family: 'Times New Roman', Times, serif;
  font-size: clamp(6rem, 12vw, 14rem); /* Fluid typography scales perfectly */
  font-weight: 400;
  color: #1F2937;
  margin: 0 0 1rem 0;
  line-height: 0.8;
  letter-spacing: -2px;

  @media (max-width: 1024px) { margin-bottom: 2rem; }
`;

const Heading = styled.h2`
  font-family: 'Times New Roman', Times, serif;
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 400;
  color: #111827;
  margin: 0 0 1.5rem 0;
  line-height: 1.2;
  max-width: 400px;
  
  @media (max-width: 1024px) { max-width: 100%; }
`;

const Subtext = styled.p`
  font-family: sans-serif;
  font-size: 0.95rem;
  font-weight: 400;
  color: #6B7280;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 0 3rem 0;

  @media (max-width: 1024px) { max-width: 600px; }
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #1A1A1A;
  color: white;
  padding: 1.25rem 2.5rem;
  border-radius: 50px;
  font-family: sans-serif;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-decoration: none;
  width: fit-content;
  margin-bottom: 4rem;
  box-shadow: 0 10px 20px -5px rgba(75, 118, 252, 0.4);
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:hover {
    background: #333333;
    transform: translateY(-2px);
    box-shadow: 0 15px 25px -5px rgba(75, 118, 252, 0.5);
  }

  @media (max-width: 1024px) { margin-bottom: 3rem; }
  @media (max-width: 480px) { 
    width: 100%; 
    padding: 1.25rem; 
  }
`;

const Divider = styled.div`
  width: 100%;
  max-width: 500px;
  height: 1px;
  background: #E5E7EB;
  margin-bottom: 3rem;

  @media (max-width: 1024px) { display: none; }
`;

const FooterNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 500px;

  span.label {
    font-family: sans-serif;
    font-size: 0.65rem;
    font-weight: 800;
    color: #9CA3AF;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 0.5rem;
  }
`;

const LinkGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem 2rem;
  width: 100%;

  @media (max-width: 1024px) {
    max-width: 400px;
    margin: 0 auto;
    text-align: left;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1.25rem;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  color: #111827;
  font-family: sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: color 0.2s;

  svg { color: #9CA3AF; transition: color 0.2s, transform 0.2s; }

  &:hover {
    color: #1A1A1A;
    svg { color: #1A1A1A; transform: translate(2px, -2px); }
  }

  @media (max-width: 480px) { 
    justify-content: center; 
    gap: 0.5rem; 
  }
`;

// --- RIGHT IMAGE SECTION ---
const RightSection = styled.div`
  flex: 1;
  position: relative;
  padding: 4rem 4rem 4rem 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 0;
    width: 100%;
    min-height: 500px;
    justify-content: center;
  }
`;

const ImageBox = styled.div`
  width: 100%;
  max-width: 600px;
  height: 85%;
  min-height: 400px;
  background-image: url('https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1200&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  position: relative;
  filter: grayscale(100%);
  box-sizing: border-box;

  @media (max-width: 1024px) {
    max-width: 100%;
    height: 500px;
  }
`;

const QuoteBox = styled.div`
  position: absolute;
  bottom: 15%;
  left: -100px; 
  background: #FAFAFA;
  padding: 2.5rem 3rem;
  width: 280px;
  z-index: 10;
  box-shadow: 0 20px 40px rgba(0,0,0,0.05);
  box-sizing: border-box;

  p {
    font-family: 'Times New Roman', Times, serif;
    font-size: 1rem;
    font-style: italic;
    color: #4B5563;
    line-height: 1.8;
    margin: 0;
  }

  @media (max-width: 1024px) {
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    width: 85%; /* Using % prevents it from breaking the viewport width */
    max-width: 350px;
    padding: 2rem;
    text-align: center;
  }
`;

const ErrorPage = () => {
  return (
    <PageContainer>
      
      {/* Left Text Content */}
      <LeftSection>
        <Overline>ERROR CODE</Overline>
        <Giant404>404</Giant404>
        
        <Heading>THE ARCHIVE COULD NOT LOCATE THIS PIECE.</Heading>
        <Subtext>
          The requested URL may have been moved, deleted, or never existed within our seasonal curations.
        </Subtext>
        
        <PrimaryButton to="/home">
          RETURN TO HOME
        </PrimaryButton>

        <Divider />

        <FooterNav>
          <span className="label">YOU MIGHT ALSO BE LOOKING FOR</span>
          <LinkGrid>
            <NavLink to="/collections">COLLECTIONS <ArrowUpRight size={14} /></NavLink>
            <NavLink to="/new">NEW ARRIVALS <ArrowUpRight size={14} /></NavLink>
            <NavLink to="/editorial">EDITORIAL <ArrowUpRight size={14} /></NavLink>
            <NavLink to="/archive">ARCHIVE <ArrowUpRight size={14} /></NavLink>
          </LinkGrid>
        </FooterNav>
      </LeftSection>

      {/* Right Image Content */}
      <RightSection>
        <ImageBox>
          <QuoteBox>
            <p>"Design is the silent ambassador of your brand."</p>
          </QuoteBox>
        </ImageBox>
      </RightSection>

    </PageContainer>
  );
};

export default ErrorPage;