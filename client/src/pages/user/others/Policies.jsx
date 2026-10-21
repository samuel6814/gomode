import React from 'react';
import styled from 'styled-components';
import { CreditCard, Truck, RotateCcw, CheckCircle2, Info } from 'lucide-react';
import SEO from '../../../components/SEO';
import { CANVAS, NAVY_ACCENT, INK, LINE, FONT_HERO } from '../../../theme/brand';

const PageWrapper = styled.div`
  background: ${CANVAS};
  min-height: calc(100vh - 80px);
  padding: 3rem 1.5rem 6rem;
`;

const Container = styled.div`
  max-width: 860px;
  margin: 0 auto;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 3.5rem;

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

  p {
    color: #666;
    font-size: 1rem;
    max-width: 520px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const PolicyCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2.25rem;
  margin-bottom: 1.75rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  border: 1px solid ${LINE};
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(37, 60, 90, 0.08);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${LINE};
`;

const IconCircle = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #fbfbf9;
  border: 1px solid ${LINE};
  color: ${NAVY_ACCENT};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardTitle = styled.h2`
  font-family: ${FONT_HERO};
  font-size: 1.25rem;
  font-weight: 800;
  color: ${INK};
  letter-spacing: -0.01em;
  margin: 0;
`;

const PolicyList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
`;

const PolicyItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  color: #444;
  line-height: 1.6;
  font-size: 0.95rem;

  svg {
    flex-shrink: 0;
    margin-top: 3px;
    color: ${NAVY_ACCENT};
  }
`;

const NoteBox = styled.div`
  background: white;
  border-left: 4px solid ${NAVY_ACCENT};
  border: 1px solid ${LINE};
  border-left-width: 4px;
  padding: 1.5rem;
  border-radius: 12px;
  margin-top: 2.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;

  svg {
    color: ${NAVY_ACCENT};
    flex-shrink: 0;
    margin-top: 2px;
  }

  p {
    margin: 0;
    color: #444;
    font-size: 0.95rem;
    line-height: 1.6;
  }
`;

const Policies = () => {
  return (
    <>
      <SEO
        title="Store Policies | GoMode"
        description="Comprehensive store policies for GoMode: order processing, secure Paystack checkout, courier dispatch, and footwear exchange."
        url="/policies"
      />

      <PageWrapper>
        <Container>
          <HeaderSection>
            <span>TERMS & STANDARDS</span>
            <h1>GoMode Policies</h1>
            <p>Guidelines governing orders, delivery coordination, and exchange guarantees.</p>
          </HeaderSection>

          <PolicyCard>
            <CardHeader>
              <IconCircle><CreditCard size={22} /></IconCircle>
              <CardTitle>Order Confirmation & Payment</CardTitle>
            </CardHeader>
            <PolicyList>
              <PolicyItem>
                <CheckCircle2 size={18} />
                All orders are confirmed immediately upon verified payment through Paystack or confirmed cash on delivery request.
              </PolicyItem>
              <PolicyItem>
                <CheckCircle2 size={18} />
                We accept all major Ghana mobile money services (MTN MoMo, Telecel Cash, AT Money) and debit/credit cards.
              </PolicyItem>
              <PolicyItem>
                <CheckCircle2 size={18} />
                Footwear pieces are held and reserved once checkout is finalized.
              </PolicyItem>
            </PolicyList>
          </PolicyCard>

          <PolicyCard>
            <CardHeader>
              <IconCircle><Truck size={22} /></IconCircle>
              <CardTitle>Delivery & Courier Coordination</CardTitle>
            </CardHeader>
            <PolicyList>
              <PolicyItem>
                <CheckCircle2 size={18} />
                Deliveries within Greater Accra take 24 to 48 hours; regional deliveries across Ghana take 2 to 4 business days.
              </PolicyItem>
              <PolicyItem>
                <CheckCircle2 size={18} />
                Clients are kindly requested to provide active contact phone numbers and accurate digital address identifiers.
              </PolicyItem>
              <PolicyItem>
                <CheckCircle2 size={18} />
                Complimentary atelier pickup is available in Accra for clients who prefer personal collection.
              </PolicyItem>
            </PolicyList>
          </PolicyCard>

          <PolicyCard>
            <CardHeader>
              <IconCircle><RotateCcw size={22} /></IconCircle>
              <CardTitle>Exchanges & Care Guarantee</CardTitle>
            </CardHeader>
            <PolicyList>
              <PolicyItem>
                <CheckCircle2 size={18} />
                Size exchanges are accommodated within 7 days of delivery, provided the footwear is in unworn condition with original packaging.
              </PolicyItem>
              <PolicyItem>
                <CheckCircle2 size={18} />
                Damaged or irregular items must be reported within 48 hours for immediate replacement or full reimbursement.
              </PolicyItem>
            </PolicyList>
          </PolicyCard>

          <NoteBox>
            <Info size={20} />
            <p>
              For bespoke corporate gifting, custom sizing inquiries, or concierge assistance, please visit our Help Center or message our team directly via WhatsApp.
            </p>
          </NoteBox>
        </Container>
      </PageWrapper>
    </>
  );
};

export default Policies;
