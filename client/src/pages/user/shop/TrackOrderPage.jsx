import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import { Truck, Search, Loader2, PackageCheck } from 'lucide-react';
import apiClient from '../../../api/axios';
import Currency from '../../../utils/Currency';
import { CANVAS, NAVY_ACCENT, INK, LINE, FONT_HERO } from '../../../theme/brand';

const Page = styled.div`
  background: ${CANVAS};
  min-height: calc(100vh - 80px);
  padding: 3.5rem 1.25rem 6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 640px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;

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
    font-size: clamp(2rem, 4vw, 2.75rem);
    font-weight: 800;
    color: ${INK};
    margin: 0 0 0.75rem;
    letter-spacing: -0.02em;
  }

  p {
    font-size: 0.95rem;
    color: #666;
    margin: 0 auto;
    max-width: 460px;
    line-height: 1.5;
  }
`;

const FormCard = styled.form`
  background: #fff;
  border: 1px solid ${LINE};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${INK};
  }
`;

const Input = styled.input`
  height: 48px;
  border: 1px solid ${LINE};
  border-radius: 8px;
  padding: 0 1rem;
  font: inherit;
  font-size: 0.95rem;
  background: #fbfbf9;
  color: ${INK};
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${NAVY_ACCENT};
    background: #fff;
    box-shadow: 0 0 0 3px rgba(37, 60, 90, 0.08);
  }
`;

const Button = styled.button`
  height: 48px;
  border: none;
  border-radius: 9999px;
  background: ${NAVY_ACCENT};
  color: #fff;
  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(37, 60, 90, 0.2);

  &:hover {
    background: #1b2c42;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorBanner = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 0.9rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const ResultCard = styled.div`
  background: #fff;
  border: 1px solid ${LINE};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid ${LINE};

  h2 {
    font-family: ${FONT_HERO};
    font-size: 1.35rem;
    font-weight: 800;
    color: ${INK};
    margin: 0 0 0.35rem;
  }

  p {
    font-size: 0.85rem;
    color: #666;
    margin: 0;
  }
`;

const StatusPill = styled.span`
  background: ${NAVY_ACCENT};
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${LINE};
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: ${INK};
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.15rem;
  font-weight: 800;
  font-family: ${FONT_HERO};
  color: ${INK};
`;

const TrackOrderPage = () => {
  const [params] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(params.get('order') || '');
  const [email, setEmail] = useState(params.get('email') || '');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const lookupOrder = async (number, address) => {
    setPending(true);
    setError('');
    setOrder(null);
    try {
      const res = await apiClient.get('/orders/track', {
        params: { orderNumber: number, email: address },
      });
      setOrder(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'No footwear order matches that tracking number and email.');
    } finally {
      setPending(false);
    }
  };

  const orderParam = params.get('order');
  const emailParam = params.get('email');

  useEffect(() => {
    if (orderParam && emailParam) lookupOrder(orderParam, emailParam);
  }, [orderParam, emailParam]);

  const lookup = (event) => {
    event.preventDefault();
    lookupOrder(orderNumber, email);
  };

  return (
    <Page>
      <Container>
        <Header>
          <span>ORDER TRACKING</span>
          <h1>Track Your Shipment</h1>
          <p>Enter your order tracking reference and checkout email address to view live dispatch status.</p>
        </Header>

        <FormCard onSubmit={lookup}>
          <InputGroup>
            <label>Order Number / Reference</label>
            <Input
              value={orderNumber}
              onChange={(event) => setOrderNumber(event.target.value)}
              placeholder="e.g. ORD-2026-XXXX"
              aria-label="Order number"
              required
            />
          </InputGroup>

          <InputGroup>
            <label>Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="e.g. customer@example.com"
              aria-label="Email"
              required
            />
          </InputGroup>

          <Button type="submit" disabled={pending}>
            {pending ? (
              <><Loader2 size={16} className="animate-spin" /> Retrieving Status...</>
            ) : (
              <><Search size={16} /> Track Order</>
            )}
          </Button>
        </FormCard>

        {error && <ErrorBanner>{error}</ErrorBanner>}

        {order && (
          <ResultCard>
            <CardHeader>
              <div>
                <h2>{order.orderNumber}</h2>
                <p>Payment: {order.paymentStatus || 'Verified'}</p>
              </div>
              <StatusPill>{order.status || 'PROCESSING'}</StatusPill>
            </CardHeader>

            <ItemsList>
              {order.items?.map((item, idx) => (
                <Row key={idx}>
                  <span>{item.productName || item.product?.name} × {item.quantity}</span>
                  <Currency amount={(item.price || item.unitPrice || 0) * item.quantity} />
                </Row>
              ))}
            </ItemsList>

            <TotalRow>
              <span>Total Amount</span>
              <Currency amount={order.totalAmount} />
            </TotalRow>
          </ResultCard>
        )}
      </Container>
    </Page>
  );
};

export default TrackOrderPage;
