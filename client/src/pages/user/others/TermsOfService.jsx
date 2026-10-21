import React from 'react';
import styled from 'styled-components';
import { ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../../components/SEO';
import { CANVAS, NAVY_ACCENT, INK, LINE, FONT_HERO, CLIENT_EMAIL } from '../../../theme/brand';

const PageWrapper = styled.div`
  background: ${CANVAS};
  min-height: calc(100vh - 80px);
  padding: 3rem 1.5rem 6rem;
`;

const HeaderSection = styled.div`
  max-width: 1100px;
  margin: 0 auto 3rem;

  span {
    font-size: 0.75rem;
    font-weight: 700;
    color: ${NAVY_ACCENT};
    letter-spacing: 0.14em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 0.5rem;
  }

  h1 {
    font-family: ${FONT_HERO};
    font-size: clamp(2.2rem, 4.5vw, 3.25rem);
    color: ${INK};
    margin: 0 0 1rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  p.intro {
    font-size: 1.05rem;
    color: #666;
    max-width: 720px;
    line-height: 1.6;
    margin: 0;
  }
`;

const ContentContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 4rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

const Sidebar = styled.aside`
  position: sticky;
  top: 32px;
  height: fit-content;

  @media (max-width: 900px) {
    display: none;
  }
`;

const SidebarTitle = styled.h4`
  font-size: 0.75rem;
  font-weight: 800;
  color: ${NAVY_ACCENT};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin: 0 0 1rem 0;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  border-left: 2px solid ${LINE};
`;

const MenuItem = styled.li`
  padding-left: 1.25rem;
  margin-bottom: 0.85rem;
  position: relative;

  a {
    color: ${(props) => (props.$active ? NAVY_ACCENT : '#666')};
    font-weight: ${(props) => (props.$active ? '700' : '500')};
    text-decoration: none;
    font-size: 0.85rem;
    display: block;
    transition: color 0.2s;

    &:hover {
      color: ${NAVY_ACCENT};
    }
  }

  ${(props) =>
    props.$active &&
    `
    &::before {
      content: '';
      position: absolute;
      left: -2px;
      top: 0;
      height: 100%;
      width: 2px;
      background: ${NAVY_ACCENT};
    }
  `}
`;

const ClarificationBox = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${LINE};
  margin-top: 2rem;

  h5 {
    font-size: 0.85rem;
    font-weight: 700;
    color: ${INK};
    margin: 0 0 0.4rem 0;
  }

  p {
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  a {
    color: ${NAVY_ACCENT};
    font-size: 0.8rem;
    font-weight: 700;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const Section = styled.section`
  background: white;
  border-radius: 16px;
  padding: 2rem 2.25rem;
  border: 1px solid ${LINE};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
`;

const SectionTitle = styled.h2`
  font-family: ${FONT_HERO};
  font-size: 1.35rem;
  font-weight: 800;
  color: ${INK};
  margin: 0 0 1.25rem 0;
  letter-spacing: -0.01em;
`;

const TextBlock = styled.div`
  font-size: 0.95rem;
  color: #444;
  line-height: 1.75;

  p {
    margin: 0 0 1.25rem;
    &:last-child {
      margin-bottom: 0;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0 0 1.25rem;

    li {
      position: relative;
      padding-left: 1.25rem;
      margin-bottom: 0.5rem;

      &::before {
        content: '•';
        position: absolute;
        left: 0;
        color: ${NAVY_ACCENT};
        font-weight: bold;
      }
    }
  }
`;

const BottomCard = styled.div`
  background: white;
  border: 1px solid ${LINE};
  border-radius: 16px;
  padding: 2.25rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);

  h3 {
    font-family: ${FONT_HERO};
    font-size: 1.35rem;
    font-weight: 800;
    color: ${INK};
    margin: 0 0 0.5rem 0;
  }

  p {
    color: #666;
    margin-bottom: 1.75rem;
    font-size: 0.95rem;
    line-height: 1.6;
  }
`;

const PrimaryBtn = styled.a`
  background: ${NAVY_ACCENT};
  color: white;
  padding: 0.85rem 1.75rem;
  border-radius: 9999px;
  font-weight: 700;
  text-decoration: none;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(37, 60, 90, 0.25);

  &:hover {
    background: #1b2c42;
    transform: translateY(-1px);
  }
`;

const TermsOfService = () => {
  return (
    <>
      <SEO
        title="Terms of Service | GoMode"
        description="Review the terms and conditions governing the purchase of luxury footwear, delivery coordination, and digital services on GoMode."
        url="/terms"
      />

      <PageWrapper>
        <HeaderSection>
          <span>LEGAL AGREEMENT</span>
          <h1>Terms of Service</h1>
          <p className="intro">
            Please read these terms and conditions carefully before utilizing our platform or purchasing footwear pieces. By placing an order with GoMode, you agree to be bound by these Terms of Service.
          </p>
        </HeaderSection>

        <ContentContainer>
          <Sidebar>
            <SidebarTitle>Contents</SidebarTitle>
            <MenuList>
              <MenuItem $active><a href="#acceptance">1. Acceptance of Terms</a></MenuItem>
              <MenuItem><a href="#use">2. Platform Usage</a></MenuItem>
              <MenuItem><a href="#account">3. Client Accounts</a></MenuItem>
              <MenuItem><a href="#ip">4. Intellectual Property</a></MenuItem>
              <MenuItem><a href="#purchases">5. Footwear Purchases</a></MenuItem>
              <MenuItem><a href="#law">6. Governing Law (Ghana)</a></MenuItem>
            </MenuList>

            <ClarificationBox>
              <h5>Need Clarification?</h5>
              <p>Our concierge and legal team are available to answer any questions.</p>
              <Link to="/contact">Contact Concierge <ArrowRight size={14} /></Link>
            </ClarificationBox>
          </Sidebar>

          <MainContent>
            <Section id="acceptance">
              <SectionTitle>1. Acceptance of Terms</SectionTitle>
              <TextBlock>
                <p>
                  GoMode provides luxury footwear products, online catalog browsing, and delivery logistics throughout Ghana. By visiting our site or ordering from our collections, you agree to be bound by these Terms of Service.
                </p>
              </TextBlock>
            </Section>

            <Section id="use">
              <SectionTitle>2. Platform Usage</SectionTitle>
              <TextBlock>
                <p>You agree to use GoMode exclusively for legitimate, lawful purchasing purposes:</p>
                <ul>
                  <li>Providing accurate recipient details and contact phone numbers for regional deliveries.</li>
                  <li>Refraining from automated scraping, disruptive traffic generation, or identity impersonation.</li>
                  <li>Ensuring all payment authorizations submitted through Paystack are verified and legitimate.</li>
                </ul>
              </TextBlock>
            </Section>

            <Section id="account">
              <SectionTitle>3. Client Accounts</SectionTitle>
              <TextBlock>
                <p>
                  When registering a client account, you are responsible for maintaining the confidentiality of your session credentials. You agree to notify us immediately of any suspected unauthorized access.
                </p>
              </TextBlock>
            </Section>

            <Section id="ip">
              <SectionTitle>4. Intellectual Property</SectionTitle>
              <TextBlock>
                <p>
                  All footwear photography, silhouette designs, logos, typographic stylings, and editorial descriptions on GoMode are protected intellectual property. Commercial reproduction or unauthorized redistribution is strictly prohibited.
                </p>
              </TextBlock>
            </Section>

            <Section id="purchases">
              <SectionTitle>5. Footwear Purchases & Sizing</SectionTitle>
              <TextBlock>
                <p>
                  Prices are listed in Ghana Cedis (GHS). We make every effort to display true leather textures and silhouette profiles accurately. Size exchanges are accommodated within 7 days in accordance with our return guidelines.
                </p>
              </TextBlock>
            </Section>

            <Section id="law">
              <SectionTitle>6. Governing Law</SectionTitle>
              <TextBlock>
                <p>
                  These Terms and any purchase contracts shall be governed by and construed in accordance with the laws of the Republic of Ghana, under the jurisdiction of the courts in Accra.
                </p>
              </TextBlock>
            </Section>

            <BottomCard>
              <h3>Questions Regarding Legal Terms?</h3>
              <p>Reach out directly to our compliance and management desk for official queries.</p>
              <PrimaryBtn href={`mailto:${CLIENT_EMAIL}`}>
                <Mail size={16} /> Contact Legal Desk
              </PrimaryBtn>
            </BottomCard>
          </MainContent>
        </ContentContainer>
      </PageWrapper>
    </>
  );
};

export default TermsOfService;