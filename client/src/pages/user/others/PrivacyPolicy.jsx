import React from 'react';
import styled from 'styled-components';
import { ArrowRight, Mail, Info, Cookie, ShieldCheck } from 'lucide-react';
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
    margin: 0 0 0.5rem 0;
  }

  span.date {
    font-size: 0.75rem;
    color: #888;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
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

const ContactBox = styled.div`
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

const HighlightBox = styled.div`
  background: #fbfbf9;
  border-left: 4px solid ${NAVY_ACCENT};
  border: 1px solid ${LINE};
  border-left-width: 4px;
  padding: 1.25rem 1.5rem;
  border-radius: 8px;
  margin: 1.25rem 0;

  div.header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.35rem;
    color: ${NAVY_ACCENT};
    font-weight: 700;
    font-size: 0.9rem;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: #555;
    font-style: italic;
  }
`;

const InquiryCard = styled.div`
  background: white;
  border: 1px solid ${LINE};
  border-radius: 16px;
  padding: 2.25rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);

  .icon-wrapper {
    width: 44px;
    height: 44px;
    background: #fbfbf9;
    color: ${NAVY_ACCENT};
    border-radius: 50%;
    border: 1px solid ${LINE};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h3 {
    font-family: ${FONT_HERO};
    font-size: 1.35rem;
    font-weight: 800;
    color: ${INK};
    margin: 0;
  }

  p {
    color: #666;
    max-width: 440px;
    line-height: 1.6;
    margin: 0 0 0.5rem 0;
  }
`;

const SupportBtn = styled(Link)`
  background: ${NAVY_ACCENT};
  color: white;
  padding: 0.85rem 2rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.85rem;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(37, 60, 90, 0.25);

  &:hover {
    background: #1b2c42;
    transform: translateY(-1px);
  }
`;

const PrivacyPolicy = () => {
  return (
    <>
      <SEO
        title="Privacy Policy | GoMode"
        description="Learn how GoMode safeguards personal client information, payment tokens, and cookies with 256-bit encryption standards."
        url="/privacy"
      />

      <PageWrapper>
        <HeaderSection>
          <span>DATA PROTECTION</span>
          <h1>Privacy Policy</h1>
          <p className="intro">
            Your privacy is of utmost importance to us. This policy details how GoMode collects, utilizes, and secures your personal information.
          </p>
          <span className="date">Effective Date: October 2026</span>
        </HeaderSection>

        <ContentContainer>
          <Sidebar>
            <SidebarTitle>Contents</SidebarTitle>
            <MenuList>
              <MenuItem $active><a href="#collect">1. Information We Collect</a></MenuItem>
              <MenuItem><a href="#use">2. Utilization of Data</a></MenuItem>
              <MenuItem><a href="#cookies">3. Cookies & Sessions</a></MenuItem>
              <MenuItem><a href="#rights">4. Client Rights</a></MenuItem>
              <MenuItem><a href="#security">5. Data Protection</a></MenuItem>
            </MenuList>

            <ContactBox>
              <h5>Privacy Desk</h5>
              <p>For inquiries regarding your personal record, contact our privacy desk.</p>
              <Link to="/contact">Contact Care <ArrowRight size={14} /></Link>
            </ContactBox>
          </Sidebar>

          <MainContent>
            <Section id="collect">
              <SectionTitle>1. Information We Collect</SectionTitle>
              <TextBlock>
                <p>
                  We collect information provided directly when you register an account, order footwear, or subscribe to release updates. This includes your recipient name, phone number, Ghana delivery location, and order history.
                </p>

                <HighlightBox>
                  <div className="header"><ShieldCheck size={16} /> Payment Tokenization</div>
                  <p>GoMode does not store full credit card or mobile money PIN numbers. All checkouts are processed via Paystack's certified PCI-DSS Level 1 compliant gateway.</p>
                </HighlightBox>
              </TextBlock>
            </Section>

            <Section id="use">
              <SectionTitle>2. Utilization of Data</SectionTitle>
              <TextBlock>
                <p>Client information is utilized specifically to:</p>
                <ul>
                  <li>Fulfill footwear shipments with local couriers and dispatch partners across Ghana.</li>
                  <li>Transmit delivery updates, tracking codes, and electronic purchase receipts.</li>
                  <li>Safeguard against fraudulent transactions and coordinate size exchanges.</li>
                </ul>
              </TextBlock>
            </Section>

            <Section id="cookies">
              <SectionTitle>3. Cookies & Session Storage</SectionTitle>
              <TextBlock>
                <p>
                  We use secure session cookies to remember footwear cart items, wishlist selections, and client login status.
                </p>
                <HighlightBox>
                  <div className="header"><Cookie size={16} /> Privacy Control</div>
                  <p>You can adjust cookie settings in your browser, though active cookies are required for shopping bag persistence.</p>
                </HighlightBox>
              </TextBlock>
            </Section>

            <Section id="rights">
              <SectionTitle>4. Client Rights</SectionTitle>
              <TextBlock>
                <p>
                  You hold the right to access, update, or request the deletion of your personal contact records at any time through your Profile Settings or by reaching out to our concierge desk.
                </p>
              </TextBlock>
            </Section>

            <Section id="security">
              <SectionTitle>5. Data Protection Standards</SectionTitle>
              <TextBlock>
                <p>
                  All network communication between your browser and our servers is protected using 256-bit TLS/SSL encryption. Authentication credentials utilize modern salted hashing protocols.
                </p>
              </TextBlock>
            </Section>

            <InquiryCard>
              <div className="icon-wrapper">
                <Mail size={22} />
              </div>
              <h3>Privacy & Data Queries</h3>
              <p>Have inquiries concerning your data privacy? Our client care team is available to assist.</p>
              <SupportBtn to="/contact">Contact Support Center</SupportBtn>
            </InquiryCard>
          </MainContent>
        </ContentContainer>
      </PageWrapper>
    </>
  );
};

export default PrivacyPolicy;