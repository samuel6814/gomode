import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { ArrowRight, ArrowUpRight, Mail, ArrowDown, Plus } from 'lucide-react';
import gsap from 'gsap';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import apiClient from '../../../api/axios';
import Navbar from '../../../components/Navbar';

// --- Animations ---
const slowZoom = keyframes`
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
`;

// --- Styled Components ---
const HeroWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #FAFAFA;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NavContainer = styled.div`
  width: 100%;
  position: relative;
  z-index: 50;
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1600px;
  padding: 100px 2rem 4rem 2rem;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 90px 1rem 3rem 1rem;
  }
`;

const BentoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 400px);
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 1280px) {
    grid-template-rows: repeat(2, 350px);
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 500px 350px 350px; 
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const BaseCard = styled.div`
  border-radius: 32px;
  overflow: hidden;
  position: relative;
  background: #fff;
  visibility: hidden; 
`;

const BackgroundImg = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: url(${props => props.$src});
  background-size: cover;
  background-position: center;
  z-index: 1;
  opacity: ${props => (props.$active ? 1 : 0)};
  transition: opacity 1.2s ease-in-out;
  animation: ${props => props.$active ? css`${slowZoom} 15s linear forwards` : 'none'};

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props => props.$overlay || 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.2) 100%)'};
  }
`;

/* --- Card 1: Left Main Card --- */
const LeftCard = styled(BaseCard)`
  grid-column: span 2;
  grid-row: span 2;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2.5rem;

  @media (max-width: 1024px) { grid-column: span 2; grid-row: span 1; }
  @media (max-width: 768px) { height: 500px; padding: 1.5rem; }
`;

const TopBadges = styled.div` position: relative; z-index: 10; display: flex; gap: 1rem; `;
const PillBadge = styled.span` border: 1px solid rgba(255, 255, 255, 0.4); backdrop-filter: blur(10px); padding: 0.5rem 1.2rem; border-radius: 50px; font-size: 0.8rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; `;
const BottomContent = styled.div` position: relative; z-index: 10; display: flex; justify-content: space-between; align-items: flex-end; @media (max-width: 768px) { flex-direction: column; align-items: flex-start; gap: 1.5rem; } `;
const MainTitle = styled.h1` font-size: 4.5rem; font-weight: 700; line-height: 1.1; margin: 0; font-family: 'Playfair Display', serif; @media (max-width: 1280px) { font-size: 3.5rem; } @media (max-width: 768px) { font-size: 2.8rem; } `;
const NextUpButton = styled(Link)` background: #d8f3e5; color: #111; border: none; border-radius: 50px; padding: 1rem 1.5rem; display: flex; align-items: center; gap: 3rem; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: transform 0.3s ease; text-decoration: none; &:hover { transform: translateX(5px); } `;

/* --- Card 2: Top Right Banner --- */
const TopRightCard = styled(BaseCard)`
  grid-column: span 2; grid-row: span 1; padding: 2.5rem; display: flex; flex-direction: column; justify-content: space-between; background: #1A1A1A; @media (max-width: 768px) { height: 350px; padding: 1.5rem; }
`;
const BannerContent = styled.div` position: relative; z-index: 10; height: 100%; display: flex; flex-direction: column; justify-content: space-between; `;
const BannerText = styled.h2` font-size: 2.8rem; font-weight: 900; color: white; line-height: 1.1; text-transform: uppercase; max-width: 90%; margin: 0; @media (max-width: 1280px) { font-size: 2.2rem; } @media (max-width: 768px) { font-size: 1.8rem; } `;
const ButtonRow = styled.div` display: flex; gap: 1rem; `;
const ActionPill = styled.button` background: ${props => props.$dark ? '#1a1a1a' : 'white'}; color: ${props => props.$dark ? 'white' : '#1a1a1a'}; border: ${props => props.$dark ? 'none' : '1px solid #1a1a1a'}; border-radius: 50px; padding: 0.8rem 1.2rem; display: flex; align-items: center; gap: 1rem; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; .icon-wrapper { background: ${props => props.$dark ? 'white' : '#1a1a1a'}; color: ${props => props.$dark ? '#1a1a1a' : 'white'}; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; } &:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); } `;

/* --- Card 3: Bottom Right Dark --- */
const BottomDarkCard = styled(BaseCard)`
  grid-column: span 1; grid-row: span 1; color: white; padding: 2rem; display: flex; flex-direction: column; justify-content: space-between; @media (max-width: 768px) { display: none; }
`;
const TopRightIcon = styled.div` position: absolute; top: 1.5rem; right: 1.5rem; width: 40px; height: 40px; border-radius: 50%; background: white; color: black; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.3s ease; z-index: 10; &:hover { transform: scale(1.1) rotate(45deg); } `;
const DarkCardText = styled.div` position: relative; z-index: 10; .subtitle { font-size: 1.2rem; font-family: monospace; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 0.5rem; margin-bottom: 2rem; display: inline-block; } .title { font-size: 2.2rem; font-weight: 700; line-height: 1.2; } `;

/* --- Card 4: Bottom Right Image --- */
const BottomImageCard = styled(BaseCard)`
  grid-column: span 1; grid-row: span 1; color: white; padding: 2rem; display: flex; flex-direction: column; justify-content: space-between; @media (max-width: 768px) { display: none; }
`;

// Fallback Data if backend is completely empty or resetting
const fallbackData = {
  card1: { images: [{ url: '/h7.jpg' }], tags: [{ text: 'Brand Edit' }, { text: '2026 Collection' }], headline: 'Your Style Speaks.', buttonText: 'SHOP' },
  card2: { text: 'Curate Your Everyday Look With Our New Essentials', button1Text: 'COMMISSIONS', button2Text: 'CONTACT US' },
  card3: { images: [{ url: '/h9.jpg' }], subtitle: 'New Arrivals!', title: 'Daily Must-Haves' },
  card4: { images: [{ url: '/h3.jpg' }] }
};

const HeroMain = () => {
  const containerRef = useRef(null);

  const [activeSlide1, setActiveSlide1] = useState(0);
  const [activeSlide2, setActiveSlide2] = useState(0);
  const [activeSlide3, setActiveSlide3] = useState(0);
  const [activeSlide4, setActiveSlide4] = useState(0);

  // Fetch Hero Config from Backend
  const { data: response, isLoading } = useQuery({
    queryKey: ['heroConfigFront'],
    queryFn: async () => {
      const res = await apiClient.get('/hero');
      return res.data;
    }
  });

  const config = response?.data;

  // 🚨 Handle parsing the new JSON structure or falling back safely
  const c1 = config?.card1 || fallbackData.card1;
  const c2 = config?.card2 || fallbackData.card2;
  const c3 = config?.card3 || fallbackData.card3;
  const c4 = config?.card4 || fallbackData.card4;

  const slides1 = c1.images?.length > 0 ? c1.images.map(i => i.url) : ['/h7.jpg'];
  // c2 no longer has slides
  const slides3 = c3.images?.length > 0 ? c3.images.map(i => i.url) : ['/h9.jpg'];
  const slides4 = c4.images?.length > 0 ? c4.images.map(i => i.url) : ['/h3.jpg'];

  useEffect(() => {
    const int1 = setInterval(() => setActiveSlide1(p => (p + 1) % slides1.length), 5000);
    const int3 = setInterval(() => setActiveSlide3(p => (p + 1) % slides3.length), 4500);
    const int4 = setInterval(() => setActiveSlide4(p => (p + 1) % slides4.length), 7500);

    return () => {
      clearInterval(int1); clearInterval(int3); clearInterval(int4);
    };
  }, [slides1.length, slides3.length, slides4.length]);

  // GSAP Entrance Animations
  useEffect(() => {
    if (isLoading) return; // Wait for loading to finish so we only show actual images

    let ctx = gsap.context(() => {
      gsap.fromTo('.bento-card',
        { y: 60, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, visibility: 'visible', duration: 1, stagger: 0.15, ease: 'power3.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isLoading]);

  return (
    <HeroWrapper ref={containerRef}>
      <NavContainer><Navbar /></NavContainer>
      <MainContent>
        <BentoGrid>

          {/* 1. Large Left Card */}
          <LeftCard className="bento-card">
            {slides1.map((src, idx) => (
              <BackgroundImg key={idx} $src={src} $active={idx === activeSlide1} />
            ))}
            <TopBadges>
              {c1.tags?.map((tag, i) => <PillBadge key={i}>{tag.text}</PillBadge>)}
            </TopBadges>
            <BottomContent>
              <MainTitle>{c1.headline}</MainTitle>
              <NextUpButton to="/shop">{c1.buttonText} <ArrowRight size={18} /></NextUpButton>
            </BottomContent>
          </LeftCard>

          {/* 2. Top Right Banner (No Image BG) */}
          <TopRightCard className="bento-card">
            <BannerContent>
              <BannerText>{c2.text}</BannerText>
              <ButtonRow>
                <ActionPill as={Link} to="/commissions" style={{ textDecoration: 'none' }}>{c2.button1Text} <div className="icon-wrapper"><ArrowDown size={14} /></div></ActionPill>
                <ActionPill as={Link} to="/contact" $dark style={{ textDecoration: 'none' }}>{c2.button2Text} <div className="icon-wrapper" style={{ background: 'transparent', border: '1px solid black', color: 'black' }}><Mail size={14} /></div></ActionPill>
              </ButtonRow>
            </BannerContent>
          </TopRightCard>

          {/* 3. Bottom Right Dark Card */}
          <BottomDarkCard className="bento-card">
            {slides3.map((src, idx) => (
              <BackgroundImg key={idx} $src={src} $active={idx === activeSlide3} $overlay="rgba(28, 28, 28, 0.8)" />
            ))}
            <TopRightIcon><ArrowUpRight size={20} /></TopRightIcon>
            <DarkCardText>
              <div className="subtitle">{c3.subtitle}</div>
              <div className="title">{c3.title}</div>
            </DarkCardText>
          </BottomDarkCard>

          {/* 4. Bottom Right Image Card */}
          <BottomImageCard className="bento-card">
            {slides4.map((src, idx) => (
              <BackgroundImg key={idx} $src={src} $active={idx === activeSlide4} $overlay="rgba(0, 0, 0, 0.2)" />
            ))}
            <TopRightIcon style={{ background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(5px)' }}>
              <ArrowUpRight size={20} />
            </TopRightIcon>
          </BottomImageCard>

        </BentoGrid>
      </MainContent>
    </HeroWrapper>
  );
};

export default HeroMain;