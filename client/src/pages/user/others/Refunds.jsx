import React from 'react';
import styled from 'styled-components';
import { RotateCcw, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
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

const Refunds = () => {
  return (
    <>
      <SEO
        title="Returns & Size Exchange Policy | GoMode"
        description="Review GoMode straightforward footwear exchange policy: pristine condition, original packaging, and 7-day exchange window."
        url="/returns"
      />

      <PageWrapper>
        <Container>
          <HeaderSection>
            <span>CLIENT ASSURANCE</span>
            <h1>Returns & Size Exchanges</h1>
            <p>Our commitment to pristine craftsmanship and effortless footwear fit.</p>
          </HeaderSection>

          <PolicyCard>
            <CardHeader>
              <IconCircle><RotateCcw size={22} /></IconCircle>
              <CardTitle>Size Exchange Policy</CardTitle>
            </CardHeader>
            <PolicyList>
              <PolicyItem>
                <CheckCircle2 size={18} />
                If your pair does not fit comfortably, you may request a size exchange within 7 days of receiving your delivery.
              </PolicyItem>
              <PolicyItem>
                <CheckCircle2 size={18} />
                Footwear must be tested exclusively on soft indoor surfaces. Soles and uppers must remain unblemished, free of creases, scuffs, or outdoor debris.
              </PolicyItem>
              <PolicyItem>
                <CheckCircle2 size={18} />
                All original brand boxes, dust bags, and authenticity cards must be included with the returned pair.
              </PolicyItem>
            </PolicyList>
          </PolicyCard>

          <PolicyCard>
            <CardHeader>
              <IconCircle><ShieldAlert size={22} /></IconCircle>
              <CardTitle>Defects & Transit Inaccuracies</CardTitle>
            </CardHeader>
            <PolicyList>
              <PolicyItem>
                <CheckCircle2 size={18} />
                In the rare event that an item arrives with a craft irregularity or an incorrect silhouette is dispatched, report it to client care within 48 hours.
              </PolicyItem>
              <PolicyItem>
                <CheckCircle2 size={18} />
                We will arrange a direct courier exchange or issue an immediate refund upon verification.
              </PolicyItem>
            </PolicyList>
          </PolicyCard>

          <PolicyCard>
            <CardHeader>
              <IconCircle><Sparkles size={22} /></IconCircle>
              <CardTitle>Refund Processing</CardTitle>
            </CardHeader>
            <PolicyList>
              <PolicyItem>
                <CheckCircle2 size={18} />
                Approved refunds are processed through the original payment channel (Paystack / Mobile Money) within 3 to 5 business days.
              </PolicyItem>
            </PolicyList>
          </PolicyCard>
        </Container>
      </PageWrapper>
    </>
  );
};

export default Refunds;
