import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { 
  Bell, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag, 
  Heart, 
  Star, 
  Sparkles, 
  Gem, 
  Zap 
} from 'lucide-react';
import Navbar from '../../../components/Navbar'; 

// --- Mock Data ---

const leftContent = {
  badge: 'LIVE LOOKBOOK',
  title: 'CURATED FINDS FOR YOUR VIBE',
  image: '/w1.jpg', 
};

// Right Slider Content
const slidesRight = [
  {
    id: 'drop',
    type: 'countdown',
    title: 'THE NEXT DROP IS COMING',
    targetDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000),
    bg: '#FDF2F8' 
  },
  {
    id: 'q1',
    type: 'quote',
    title: 'LIVE LOVE SHOP',
    subtitle: 'Retail therapy is the best therapy.',
    bg: '#FFF1F2',
    icon: Heart,
    btnText: 'SHOP NEW IN'
  },
  {
    id: 'q2', type: 'quote', title: 'BUY THE SHOES', subtitle: 'Life is too short for boring footwear.', bg: '#F3E8FF', icon: ShoppingBag, btnText: 'VIEW SHOES'
  },
  {
    id: 'q3', type: 'quote', title: 'STAY CHIC DAILY', subtitle: 'Elegance is the only beauty that never fades.', bg: '#ECFEFF', icon: Star, btnText: 'BROWSE CHIC'
  },
  {
    id: 'q4', type: 'quote', title: 'DRESS LIKE A DREAM', subtitle: 'Make every outfit count.', bg: '#FFF7ED', icon: Sparkles, btnText: 'DREAMY FITS'
  },
  {
    id: 'q5', type: 'quote', title: 'TOO GLAM TO CARE', subtitle: 'Confidence is your best accessory.', bg: '#F0F9FF', icon: Gem, btnText: 'GET GLAM'
  },
  {
    id: 'q6', type: 'quote', title: 'FASHION IS ART', subtitle: 'And you are the canvas.', bg: '#FDF4FF', icon: Heart, btnText: 'EXPLORE ART'
  },
  {
    id: 'q7', type: 'quote', title: 'KEEP IT CLASSY', subtitle: 'Trends fade, style is eternal.', bg: '#F5F5F4', icon: Star, btnText: 'CLASSICS'
  },
  {
    id: 'q8', type: 'quote', title: 'BORN TO SHOP', subtitle: 'Forced to work.', bg: '#FEF2F2', icon: ShoppingBag, btnText: 'SHOP NOW'
  },
  {
    id: 'q9', type: 'quote', title: 'STYLE HAS NO LIMIT', subtitle: 'Express yourself without boundaries.', bg: '#EFF6FF', icon: Sparkles, btnText: 'PUSH LIMITS'
  },
  {
    id: 'q10', type: 'quote', title: 'TREND SETTER MODE', subtitle: 'Lead the way, never follow.', bg: '#FAF5FF', icon: Zap, btnText: 'SEE TRENDS'
  }
];

// --- Styled Components ---

const HeroWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 900px; 
  background: white;
  display: flex;
  flex-direction: column;

  @media (max-width: 900px) {
    height: auto;
    min-height: 100vh;
  }
`;

const NavOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  background: transparent;
`;

const SplitLayout = styled.div`
  width: 100%;
  flex: 1; 
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 120px 266px 2rem 266px; 
  gap: 2rem;
  box-sizing: border-box;
  /* Ensure the grid respects the parent height */
  height: 100%; 
  overflow: hidden; /* Prevent grid blowout */

  @media (max-width: 1600px) { padding: 120px 100px 2rem 100px; }
  @media (max-width: 1200px) { padding: 120px 40px 2rem 40px; }
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    height: auto;
    padding: 100px 1.5rem 2rem 1.5rem;
    overflow: visible;
  }
`;

const CardBase = styled.div`
  position: relative;
  width: 100%;
  height: 100%; /* Fill the grid cell */
  border-radius: 30px; 
  overflow: hidden; /* CRITICAL: Clips content (image) inside */
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  background: #f0f0f0; /* Fallback */

  @media (max-width: 900px) {
    min-height: 500px; /* Fixed height for mobile stacking */
  }
`;

/* --- LEFT SIDE (Static) --- */
const LeftSide = styled(CardBase)`
  background: #EAE0D5; 
`;

const StaticImage = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  img {
    position: absolute; /* CRITICAL: Takes image out of flow */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover; /* Ensures it fills container without stretching */
    object-position: center;
  }

  /* Gradient Shadow */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%);
    z-index: 1;
  }
`;

const ContentContainer = styled.div`
  position: absolute;
  bottom: 4rem;
  left: 3rem;
  z-index: 10;
  max-width: 80%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 500px) {
    left: 1.5rem;
    bottom: 2rem;
  }
`;

const Badge = styled.span`
  background: #1A1A1A;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 6px;
  display: inline-block;
  margin-bottom: 1rem;
  border: 2px solid white;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
`;

const Heading = styled.h2`
  font-size: 3rem;
  font-weight: 900;
  color: white;
  line-height: 1.1;
  text-transform: uppercase;
  max-width: 500px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);

  @media (max-width: 1200px) { font-size: 2.5rem; }
`;

/* --- RIGHT SIDE (Slider) --- */
const RightSide = styled(CardBase)`
  /* Inherits CardBase styles */
`;

const ContentSlide = styled.div`
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: ${props => props.$bg};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease;
  transform: translateX(${props => (props.$active ? '0' : '100%')});
  opacity: ${props => (props.$active ? 1 : 0)};
  z-index: ${props => props.$active ? 2 : 1};
`;

/* Countdown & Text Styles */
const AccessText = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #1A1A1A;
  margin-bottom: 2rem;
  display: block;
`;

const DropTitle = styled.h2`
  font-size: 4rem;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 3rem;
  text-transform: uppercase;
  max-width: 500px;
  color: #1F2937;

  @media (max-width: 1200px) { font-size: 3rem; }
`;

const TimerRow = styled.div`
  display: flex;
  gap: 3rem;
  margin-bottom: 4rem;
  @media (max-width: 500px) { gap: 1rem; margin-bottom: 2rem; }
`;

const TimeBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span.num {
    font-size: 3.5rem;
    font-weight: 800;
    color: #1A1A1A;
    line-height: 1;
    font-family: monospace;
  }

  span.label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #9CA3AF;
    text-transform: uppercase;
    margin-top: 0.5rem;
    letter-spacing: 1px;
  }
`;

const NotifyButton = styled.button`
  background: #1A1A1A;
  color: white;
  border: none;
  padding: 1.25rem 3rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  box-shadow: 0 10px 25px -5px rgba(30, 77, 233, 0.5);
  transition: transform 0.2s;
  margin-bottom: 2rem;

  &:hover { transform: translateY(-3px); }
`;

const Disclaimer = styled.p`
  font-size: 0.85rem;
  color: #6B7280;
  max-width: 350px;
  line-height: 1.6;
`;

/* QUOTE SLIDE STYLES */
const QuoteBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const QuoteText = styled.h2`
  font-size: 5rem;
  font-weight: 900;
  color: #1A1A1A;
  line-height: 0.9;
  font-style: italic;
  font-family: serif; 
  max-width: 600px;
  text-shadow: 2px 2px 0px rgba(0,0,0,0.05);

  @media (max-width: 1200px) { font-size: 4rem; }
  @media (max-width: 600px) { font-size: 3rem; }
`;

const QuoteSub = styled.p`
  font-size: 1.2rem;
  color: #4B5563;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const ShopButton = styled.button`
  background: #1F2937;
  color: white;
  border: none;
  padding: 1.25rem 3rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { 
    background: #1A1A1A; 
    transform: translateY(-3px);
    box-shadow: 0 10px 25px -5px rgba(30, 125, 233, 0.4);
  }
`;

/* CONTROLS */
const SliderControls = styled.div`
  position: absolute;
  bottom: 2.5rem;
  right: 2.5rem;
  display: flex;
  gap: 1rem;
  z-index: 10;

  @media (max-width: 900px) {
    display: none; /* Removed on Mobile as requested */
  }
`;

const ControlBtn = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.1);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #1F2937;
  transition: all 0.2s;

  &:hover {
    background: #1A1A1A;
    color: white;
    border-color: #1A1A1A;
  }
`;

// --- Components ---

const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', mins: '00', secs: '00' });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;
      if (diff <= 0) {
        clearInterval(timer);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
      const mins = Math.floor((diff / 1000 / 60) % 60).toString().padStart(2, '0');
      const secs = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
      setTimeLeft({ days, hours, mins, secs });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <TimerRow>
      <TimeBlock><span className="num">{timeLeft.days}</span><span className="label">Days</span></TimeBlock>
      <TimeBlock><span className="num">:</span></TimeBlock>
      <TimeBlock><span className="num">{timeLeft.hours}</span><span className="label">Hours</span></TimeBlock>
      <TimeBlock><span className="num">:</span></TimeBlock>
      <TimeBlock><span className="num">{timeLeft.mins}</span><span className="label">Mins</span></TimeBlock>
      <TimeBlock><span className="num">:</span></TimeBlock>
      <TimeBlock><span className="num">{timeLeft.secs}</span><span className="label">Secs</span></TimeBlock>
    </TimerRow>
  );
};

const Hero = () => {
  const [rightIndex, setRightIndex] = useState(0);
  const timerRef = useRef(null);

  // Auto-play Right Slider (3 Seconds)
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRightIndex((prev) => (prev + 1) % slidesRight.length);
    }, 3000); 
    
    return () => clearInterval(timerRef.current);
  }, []);

  // Manual Controls
  const nextRightSlide = () => {
    setRightIndex((prev) => (prev + 1) % slidesRight.length);
    resetTimer();
  };

  const prevRightSlide = () => {
    setRightIndex((prev) => (prev === 0 ? slidesRight.length - 1 : prev - 1));
    resetTimer();
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRightIndex((prev) => (prev + 1) % slidesRight.length);
    }, 3000);
  };

  return (
    <HeroWrapper>
      <NavOverlay>
        <Navbar />
      </NavOverlay>

      <SplitLayout>
        
        {/* LEFT COLUMN: Static Image with Gradient Shadow & Bordered Badge */}
        <LeftSide>
          <StaticImage>
            <img src={leftContent.image} alt="Lookbook" />
            <ContentContainer>
              <Badge>{leftContent.badge}</Badge>
              <Heading>{leftContent.title}</Heading>
            </ContentContainer>
          </StaticImage>
        </LeftSide>

        {/* RIGHT COLUMN: Infinite Slider (Countdown + 10 Quotes) */}
        <RightSide>
          {slidesRight.map((slide, index) => (
            <ContentSlide 
              key={slide.id} 
              $bg={slide.bg} 
              $active={index === rightIndex}
            >
              {slide.type === 'countdown' ? (
                <>
                  <AccessText>Exclusive Access</AccessText>
                  <DropTitle>{slide.title}</DropTitle>
                  <Countdown targetDate={slide.targetDate} />
                  <NotifyButton>
                    GET NOTIFIED <Bell size={18} fill="white" />
                  </NotifyButton>
                  <Disclaimer>
                    Be the first to know. High demand expected. Limited pieces per style available on launch day.
                  </Disclaimer>
                </>
              ) : (
                <QuoteBox>
                  <div style={{color: '#1A1A1A', marginBottom: '1rem'}}>
                    {slide.icon ? <slide.icon size={48} /> : <ShoppingBag size={48} />}
                  </div>
                  <QuoteText>
                    {slide.title.split(' ').map((word, i) => (
                      <div key={i}>{word}</div>
                    ))}
                  </QuoteText>
                  <QuoteSub>{slide.subtitle}</QuoteSub>
                  <ShopButton>
                    {slide.btnText} <ArrowRight size={18} />
                  </ShopButton>
                </QuoteBox>
              )}
            </ContentSlide>
          ))}

          {/* Controls */}
          <SliderControls>
            <ControlBtn onClick={prevRightSlide}><ChevronLeft size={20} /></ControlBtn>
            <ControlBtn onClick={nextRightSlide}><ChevronRight size={20} /></ControlBtn>
          </SliderControls>
        </RightSide>

      </SplitLayout>
    </HeroWrapper>
  );
};

export default Hero;