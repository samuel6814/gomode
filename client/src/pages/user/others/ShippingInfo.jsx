import React from 'react';
import styled from 'styled-components';
import { Truck, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
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

const ShippingInfo = () => {
  return (
    <>
      <SEO
        title="Ghana Shipping & Delivery Guidelines | GoMode"
        description="Learn about GoMode footwear delivery timelines, courier coverage across Greater Accra and regional Ghana, and order dispatch protocols."
        url="/shipping"
      />

      <PageWrapper>
        <Container>
          <HeaderSection>
            <span>FULFILLMENT & LOGISTICS</span>
            <h1>Shipping & Delivery Policy</h1>
            <p>Reliable door-to-door courier service and atelier pickup across all 16 regions of Ghana.</p>
          </HeaderSection>

          <PolicyCard>
            <CardHeader>
              <IconCircle><Truck size={22} /></IconCircle>
              <CardTitle>Greater Accra Metropolitan Deliveries</CardTitle>
            </CardHeader>
            <PolicyList>
              <PolicyItem>
                <CheckCircle2 size={18} />
                Orders within Greater Accra are dispatched via express direct dispatch within 24 to 48 hours of confirmation.
              </PolicyItem>
              <PolicyItem>
                <CheckCircle2 size={18} />
                Delivery fees are calculated transparently by delivery zone and displayed at checkout.
              </PolicyItem>
              <PolicyItem>
                <CheckCircle2 size={18} />
                Direct phone coordination is conducted by our courier partner before final delivery to your doorstep.
              </PolicyItem>
            </PolicyList>
          </PolicyCard>

          <PolicyCard>
            <CardHeader>
              <IconCircle><MapPin size={22} /></IconCircle>
              <CardTitle>Regional Ghana Deliveries</CardTitle>
            </CardHeader>
            <PolicyList>
              <PolicyItem>
                <CheckCircle2 size={18} />
                Shipments to Ashanti, Western, Central, Eastern, Volta, and Northern regions are delivered in 2 to 4 business days.
              </PolicyItem>
              <PolicyItem>
                <CheckCircle2 size={18} />
                All regional parcels are carefully cushioned and packaged in protective luxury cartons to maintain pristine condition.
              </PolicyItem>
              <PolicyItem>
                <CheckCircle2 size={18} />
                SMS and email tracking updates with courier bill numbers are provided as soon as your pair leaves our Accra hub.
              </PolicyItem>
            </PolicyList>
          </PolicyCard>

          <PolicyCard>
            <CardHeader>
              <IconCircle><ShieldCheck size={22} /></IconCircle>
              <CardTitle>Atelier Hub Pickup</CardTitle>
            </CardHeader>
            <PolicyList>
              <PolicyItem>
                <CheckCircle2 size={18} />
                Complimentary client pickup is available for all orders at our Accra fulfillment hub.
              </PolicyItem>
              <PolicyItem>
                <CheckCircle2 size={18} />
                Please select "Store Hub Pickup" during checkout. You will receive an alert once your footwear has been prepared.
              </PolicyItem>
            </PolicyList>
          </PolicyCard>
        </Container>
      </PageWrapper>
    </>
  );
};

export default ShippingInfo;
