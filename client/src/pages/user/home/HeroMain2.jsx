import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar'; 
import apiClient from '../../../api/axios'; 

// --- Animations ---
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const imageReveal = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

// --- Styled Components ---
const HeroWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #FAFAFA;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const NavOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
`;

const MainContent = styled.div`
  flex: 1;
  width: 100%;
  max-width: 1700px; 
  margin: 0 auto;
  padding: 160px 4rem 4rem 4rem; 
  display: grid;
  
  /* 🚨 FIXED: Changed from 1.3fr to 1.4fr to make the image grid wider and bigger! */
  grid-template-columns: 1.4fr 1fr; 
  
  /* 🚨 FIXED: Brought the text section slightly closer to the grid */
  gap: 4.5rem; 
  
  align-items: center;

  @media (max-width: 1280px) {
    gap: 3rem;
    padding: 140px 3rem 4rem 3rem;
  }
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    padding: 140px 1.5rem 3rem 1.5rem;
    gap: 3rem;
  }
  @media (max-width: 768px) {
    padding: 120px 1.5rem 2rem 1.5rem;
    gap: 2.5rem;
  }
`;

/* --- LEFT SIDE: RESPONSIVE IMAGE DISPLAY --- */
const BentoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  
  /* 🚨 FIXED: Increased row height from 220px to 260px to make images much bigger */
  grid-template-rows: repeat(3, 220px);
  
  gap: ${props => props.$gridSpacing === '1.5rem' ? '0.75rem' : (props.$gridSpacing || '0.75rem')}; 
  
  width: 100%;
  
  @media (max-width: 1400px) {
    /* Also scaled up the tablet/small-desktop sizes proportionately */
    grid-template-rows: repeat(3, 220px);
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 400px 240px; /* Scaled up */
    order: 2; 
  }

  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-left: 1.5rem;
    margin-left: -1.5rem;
    width: calc(100% + 3rem);
    padding: 0 1.5rem 1rem 1.5rem; 
    gap: 0.75rem; /* Tighter gap on mobile too */
    &::-webkit-scrollbar { display: none; }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const GridItem = styled.div`
  border-radius: 16px;
  overflow: hidden;
  background: #E5E7EB;
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  animation: ${imageReveal} 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  opacity: 0;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  &:hover img { transform: scale(1.04); }

  @media (min-width: 1025px) {
    &:nth-child(1) { grid-area: 1 / 1 / 3 / 3; animation-delay: 0.1s; }
    &:nth-child(2) { grid-area: 1 / 3 / 3 / 4; animation-delay: 0.2s; }
    &:nth-child(3) { grid-area: 1 / 4 / 2 / 5; animation-delay: 0.3s; }
    &:nth-child(4) { grid-area: 2 / 4 / 3 / 5; animation-delay: 0.4s; }
    &:nth-child(5) { grid-area: 3 / 1 / 4 / 3; animation-delay: 0.5s; }
    &:nth-child(6) { grid-area: 3 / 3 / 4 / 5; animation-delay: 0.6s; }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    &:nth-child(1) { grid-area: 1 / 1 / 2 / 3; animation-delay: 0.1s; } 
    &:nth-child(2) { grid-area: 2 / 1 / 3 / 2; animation-delay: 0.2s; } 
    &:nth-child(3) { grid-area: 2 / 2 / 3 / 3; animation-delay: 0.3s; } 
    &:nth-child(n+4) { display: none; } 
  }

  @media (max-width: 768px) {
    flex: 0 0 78%; 
    height: 420px;
    scroll-snap-align: center;
    display: block; 
    &:nth-child(1) { animation-delay: 0.1s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.3s; }
    &:nth-child(4) { animation-delay: 0.4s; }
    &:nth-child(5) { animation-delay: 0.5s; }
    &:nth-child(6) { animation-delay: 0.6s; }
  }

  @media (max-width: 400px) { height: 380px; }
`;

/* --- RIGHT SIDE: TEXT CONTENT --- */
const TextSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 700px;

  @media (max-width: 1024px) {
    order: 1;
    max-width: 100%;
    text-align: center;
    align-items: center;
  }
`;

const Badge = styled.span`
  color: #1A1A1A; 
  font-size: 1rem; 
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: ${fadeUp} 0.6s ease forwards 0.2s;

  @media (max-width: 768px) { font-size: 0.85rem; margin-bottom: 1rem; }
`;

const Title = styled.h1`
  font-size: 5.5rem; 
  font-weight: 900;
  color: #0B132B; 
  line-height: 0.95; 
  letter-spacing: -2px;
  margin: 0 0 2rem 0;
  text-transform: uppercase;
  opacity: 0;
  animation: ${fadeUp} 0.6s ease forwards 0.4s;
  white-space: pre-line; 

  @media (max-width: 1600px) { font-size: 4.5rem; }
  @media (max-width: 1280px) { font-size: 4rem; }
  @media (max-width: 768px) { font-size: 3.2rem; margin-bottom: 1.5rem; }
  @media (max-width: 400px) { font-size: 2.8rem; }
`;

const Description = styled.p`
  font-size: 1.25rem; 
  color: #4B5563;
  line-height: 1.7;
  margin: 0 0 3rem 0;
  max-width: 550px;
  opacity: 0;
  animation: ${fadeUp} 0.6s ease forwards 0.6s;
  white-space: pre-line;

  @media (max-width: 1024px) { margin-left: auto; margin-right: auto; }
  @media (max-width: 768px) { font-size: 1.05rem; margin-bottom: 2rem; padding: 0 1rem; }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.25rem;
  opacity: 0;
  animation: ${fadeUp} 0.6s ease forwards 0.8s;
  flex-wrap: wrap; 

  @media (max-width: 500px) {
    flex-direction: column;
    width: 100%;
    padding: 0 1rem;
    button { width: 100%; }
  }
`;

const PrimaryBtn = styled.button`
  background: #1A1A1A; 
  color: white;
  border: none;
  padding: 1.2rem 3rem; 
  text-decoration: none;
  border-radius: 50px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(75, 118, 252, 0.3);

  &:hover { background: #333333; transform: translateY(-2px); box-shadow: 0 8px 25px rgba(75, 118, 252, 0.4); }
  @media (max-width: 768px) { padding: 1rem 2rem; font-size: 1rem; }
`;

const SecondaryBtn = styled.button`
  background: transparent;
  color: #111827;
  border: 1px solid #E5E7EB;
  padding: 1.2rem 3rem; 
  border-radius: 50px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover { border-color: #111827; background: #F3F4F6; }
  @media (max-width: 768px) { padding: 1rem 2rem; font-size: 1rem; }
`;

const HeroMain2 = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ['heroConfigFront'],
    queryFn: async () => {
      const res = await apiClient.get('/hero'); 
      return res.data;
    }
  });

  const config = response?.data;

  if (isLoading || !config) {
    return <HeroWrapper style={{background: '#FAFAFA'}} />; 
  }

  const activeLinks = config.featuredLinks?.filter(link => link.isActive) || [];
  const headlineText = config.mainHeadline || "The New\nStandard\nOf Style";

  const defaultImages = [
    '/h7.jpg', 
    '/h2.jpg', 
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80',
    '/h9.jpg',
    '/h3.jpg'
  ];

  return (
    <HeroWrapper>
      <NavOverlay>
        <Navbar />
      </NavOverlay>

      <MainContent>
        <BentoGrid $gridSpacing={config.gridSpacing}>
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const dbImage = config.images?.[index]?.url;
            const finalImage = dbImage || defaultImages[index];

            return (
              <GridItem key={index}>
                <img src={finalImage} alt={`Hero Item ${index + 1}`} />
              </GridItem>
            );
          })}
        </BentoGrid>

        <TextSection>
          <Badge>{config.subHeadline || 'Editorial Collection'}</Badge>
          <Title>{headlineText}</Title>
          <Description>{config.description}</Description>
          
          <ButtonGroup>
            {activeLinks.map((link, index) => (
              index === 0 
                ? <PrimaryBtn key={index}>{link.label}</PrimaryBtn>
                : <SecondaryBtn key={index}>{link.label}</SecondaryBtn>
            ))}
            
            {activeLinks.length === 0 && (
               <PrimaryBtn as={Link} to="/shop">Shop Collection</PrimaryBtn>
            )}
          </ButtonGroup>
        </TextSection>
      </MainContent>
    </HeroWrapper>
  );
};

export default HeroMain2;