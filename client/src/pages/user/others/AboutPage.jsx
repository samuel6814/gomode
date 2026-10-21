import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Instagram, Mail, MessageCircle, Phone, ArrowRight, ShieldCheck, Sparkles, Compass } from 'lucide-react';
import SEO from '../../../components/SEO';
import {
  BRAND_NAME,
  CLIENT_CITY,
  CLIENT_EMAIL,
  CLIENT_PHONE,
  INSTAGRAM_HANDLE,
  CANVAS,
  NAVY_ACCENT,
  INK,
  LINE,
  FONT_HERO,
} from '../../../theme/brand';
import {
  WHATSAPP_URL,
  INSTAGRAM_URL,
  MAILTO_URL,
  PHONE_TEL,
} from '../../../utils/contactLinks';

const PageWrapper = styled.div`
  background: ${CANVAS};
  min-height: calc(100vh - 80px);
  padding: 3rem 1.5rem 6rem;
`;

const Container = styled.div`
  max-width: 1240px;
  margin: 0 auto;
`;

const HeaderSection = styled.header`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 4rem;

  span {
    font-size: 0.75rem;
    font-weight: 700;
    color: ${NAVY_ACCENT};
    letter-spacing: 0.16em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 0.75rem;
  }

  h1 {
    font-family: ${FONT_HERO};
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    color: ${INK};
    line-height: 1.05;
    letter-spacing: -0.03em;
    margin: 0 0 1.25rem;

    span {
      display: inline;
      font-size: inherit;
      color: ${NAVY_ACCENT};
      font-style: italic;
    }
  }

  p {
    font-size: 1.05rem;
    color: #555;
    line-height: 1.7;
    margin: 0;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 4rem;
  align-items: center;
  margin-bottom: 5rem;

  @media (min-width: 992px) {
    grid-template-columns: 1fr 1.15fr;
  }
`;

const ImageComposition = styled.div`
  position: relative;
`;

const MainImage = styled.div`
  width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid ${LINE};
  box-shadow: 0 12px 36px rgba(37, 60, 90, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FloatBadge = styled.div`
  position: absolute;
  bottom: -1.5rem;
  right: -1.5rem;
  background: ${NAVY_ACCENT};
  color: white;
  padding: 1.75rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(37, 60, 90, 0.3);
  max-width: 200px;

  span.number {
    font-family: ${FONT_HERO};
    font-size: 2.2rem;
    font-weight: 800;
    line-height: 1;
    display: block;
    margin-bottom: 0.35rem;
  }

  span.label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.9;
  }

  @media (max-width: 600px) {
    position: static;
    margin-top: 1rem;
    max-width: 100%;
  }
`;

const StoryContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  h2 {
    font-family: ${FONT_HERO};
    font-size: clamp(1.75rem, 3vw, 2.35rem);
    font-weight: 800;
    color: ${INK};
    margin: 0;
    letter-spacing: -0.02em;
    line-height: 1.15;
  }

  p {
    font-size: 1rem;
    color: #444;
    line-height: 1.8;
    margin: 0;
  }
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ValueCard = styled.div`
  background: white;
  border: 1px solid ${LINE};
  border-radius: 16px;
  padding: 2.25rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);

  .icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: #fbfbf9;
    color: ${NAVY_ACCENT};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.25rem;
    border: 1px solid ${LINE};
  }

  h3 {
    font-family: ${FONT_HERO};
    font-size: 1.2rem;
    font-weight: 800;
    color: ${INK};
    margin: 0 0 0.5rem 0;
  }

  p {
    font-size: 0.9rem;
    color: #666;
    line-height: 1.6;
    margin: 0;
  }
`;

const ContactStrip = styled.div`
  background: #fff;
  border: 1px solid ${LINE};
  border-radius: 16px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  text-align: center;

  @media (min-width: 900px) {
    flex-direction: row;
    text-align: left;
    justify-content: space-between;
  }
`;

const ContactInfo = styled.div`
  h3 {
    font-family: ${FONT_HERO};
    font-size: 1.5rem;
    font-weight: 800;
    color: ${INK};
    margin: 0 0 0.35rem 0;
  }

  p {
    font-size: 0.95rem;
    color: #666;
    margin: 0;
  }
`;

const ContactLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ContactPill = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #fbfbf9;
  border: 1px solid ${LINE};
  border-radius: 9999px;
  color: ${INK};
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 700;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${NAVY_ACCENT};
    color: ${NAVY_ACCENT};
    background: #fff;
  }
`;

const ShopCtaBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.75rem;
  background: ${NAVY_ACCENT};
  color: white;
  border-radius: 9999px;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(37, 60, 90, 0.25);

  &:hover {
    background: #1b2c42;
    transform: translateY(-2px);
  }
`;

const AboutPage = () => {
  return (
    <>
      <SEO
        title="About GoMode | Curated Footwear & Streetwear"
        description="GoMode crafts and curates premium footwear silhouettes in Ghana, celebrating artisanal leatherwork, contemporary sneaker design, and timeless West African luxury."
        url="/about"
      />
      <PageWrapper>
        <Container>
          <HeaderSection>
            <span>THE MAISON STORY</span>
            <h1>
              WHERE HERITAGE MEETS <span>CONTEMPORARY FOOTWEAR</span>
            </h1>
            <p>
              Founded in Accra, GoMode is dedicated to creating architectural footwear silhouettes that embody refined Ghanaian craftsmanship and modern global aesthetics.
            </p>
          </HeaderSection>

          <Grid>
            <ImageComposition>
              <MainImage>
                <img src="/items/black-loafers/black-loafers-1.png" alt="GoMode Loafer craftsmanship" />
              </MainImage>
              <FloatBadge>
                <span className="number">100%</span>
                <span className="label">Handcrafted Quality</span>
              </FloatBadge>
            </ImageComposition>

            <StoryContent>
              <h2>Sculpted for Movement, Designed for Distinction.</h2>
              <p>
                GoMode was created from a single vision: to craft luxury footwear in West Africa that stands alongside the finest ateliers worldwide. Every silhouette—from our monk strap loafers to sculpted platform slides—is drafted with ergonomic precision and executed using hand-selected leathers.
              </p>
              <p>
                Our designs blend Ghana's rich cultural textures with sleek minimalist contours. Whether traversing the vibrant boulevards of Accra, attending private soirees, or navigating international travels, GoMode pairs ensure uncompromising comfort and distinguished presence.
              </p>
              <div>
                <ShopCtaBtn to="/shop">
                  Explore Footwear Catalog <ArrowRight size={16} />
                </ShopCtaBtn>
              </div>
            </StoryContent>
          </Grid>

          <ValuesGrid>
            <ValueCard>
              <div className="icon-wrapper">
                <ShieldCheck size={22} />
              </div>
              <h3>Artisanal Mastercraft</h3>
              <p>
                Constructed with supple full-grain leathers, hand-burnished patinas, and durable reinforced stitching meant to endure generations.
              </p>
            </ValueCard>

            <ValueCard>
              <div className="icon-wrapper">
                <Sparkles size={22} />
              </div>
              <h3>Modern Ergonomics</h3>
              <p>
                Engineered with memory-cushion footbeds, lightweight outsoles, and breathable linings calibrated for West African climates.
              </p>
            </ValueCard>

            <ValueCard>
              <div className="icon-wrapper">
                <Compass size={22} />
              </div>
              <h3>Ghanaian Pride</h3>
              <p>
                Headquartered in {CLIENT_CITY}, our atelier champions sustainable local employment and African design excellence on the global stage.
              </p>
            </ValueCard>
          </ValuesGrid>

          <ContactStrip>
            <ContactInfo>
              <h3>Client Concierge & Inquiries</h3>
              <p>Reach out for bespoke sizing guidance, regional Ghana shipping, or corporate gifting.</p>
            </ContactInfo>

            <ContactLinks>
              <ContactPill href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                <Instagram size={16} /> @{INSTAGRAM_HANDLE}
              </ContactPill>
              <ContactPill href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={16} /> WhatsApp Care
              </ContactPill>
              <ContactPill href={MAILTO_URL}>
                <Mail size={16} /> {CLIENT_EMAIL}
              </ContactPill>
              <ContactPill href={PHONE_TEL}>
                <Phone size={16} /> {CLIENT_PHONE}
              </ContactPill>
            </ContactLinks>
          </ContactStrip>
        </Container>
      </PageWrapper>
    </>
  );
};

export default AboutPage;
