import React from 'react';
import styled from 'styled-components';
import { ArrowLeft, Truck, Download, RotateCcw, CreditCard, AlertCircle } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import ProfileLayout from './ProfileLayout';
import Currency from '../../../utils/Currency';
import { TextStackSkeleton } from '../../../components/ui/Skeleton';
import { NAVY_ACCENT, INK, LINE, FONT_HERO } from '../../../theme/brand';

const HeaderSection = styled.div`
  margin-bottom: 2.5rem;
  border-bottom: 1px solid ${LINE};
  padding-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const OrderInfo = styled.div`
  span.overline {
    font-size: 0.75rem;
    font-weight: 700;
    color: ${NAVY_ACCENT};
    letter-spacing: 0.12em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 0.4rem;
  }

  h1 {
    font-family: ${FONT_HERO};
    font-size: clamp(2rem, 4vw, 2.75rem);
    font-weight: 800;
    color: ${INK};
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.02em;
  }

  p {
    font-size: 0.8rem;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 0;

    span.status {
      color: ${NAVY_ACCENT};
      font-weight: 800;
      margin-left: 0.5rem;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;

  @media (max-width: 480px) {
    width: 100%;
    flex-direction: column;
  }
`;

const PrimaryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${NAVY_ACCENT};
  color: white;
  border: none;
  padding: 0.85rem 1.65rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(37, 60, 90, 0.25);
  transition: all 0.2s ease;

  &:hover {
    background: #1b2c42;
    transform: translateY(-1px);
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const SecondaryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #fff;
  color: ${INK};
  border: 1px solid ${LINE};
  padding: 0.85rem 1.65rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${NAVY_ACCENT};
    color: ${NAVY_ACCENT};
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1.5fr 1fr;
    gap: 4rem;
  }
`;

const ItemsSection = styled.div`
  display: flex;
  flex-direction: column;

  h2 {
    font-family: ${FONT_HERO};
    font-size: 1.5rem;
    font-weight: 800;
    color: ${INK};
    margin: 0 0 1.75rem 0;
  }
`;

const ItemRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid ${LINE};
  background: #fff;
  border: 1px solid ${LINE};
  border-radius: 12px;
  padding: 1.5rem;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1.25rem;
  }
`;

const ItemImage = styled.div`
  width: 110px;
  aspect-ratio: 1;
  background: #fbfbf9;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid ${LINE};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 600px) {
    width: 100%;
    aspect-ratio: 16 / 9;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  h3 {
    font-family: ${FONT_HERO};
    font-size: 1.15rem;
    font-weight: 700;
    color: ${INK};
    margin: 0 0 0.35rem 0;
  }

  p.collection {
    font-size: 0.7rem;
    font-weight: 700;
    color: ${NAVY_ACCENT};
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0 0 1rem 0;
  }
`;

const SpecsGrid = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;

  div {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;

    span.label {
      font-size: 0.65rem;
      font-weight: 700;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    span.val {
      font-size: 0.85rem;
      font-weight: 700;
      color: ${INK};
      text-transform: uppercase;
    }
  }
`;

const ItemPrice = styled.div`
  font-family: ${FONT_HERO};
  font-size: 1.15rem;
  font-weight: 800;
  color: ${INK};
  margin-top: 0.2rem;
`;

const DetailsSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const SidebarBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background: #fff;
  border: 1px solid ${LINE};
  border-radius: 16px;
  padding: 1.75rem;

  h4 {
    font-size: 0.75rem;
    font-weight: 800;
    color: ${NAVY_ACCENT};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin: 0;
  }
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  span.label {
    font-size: 0.7rem;
    font-weight: 700;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  p {
    font-size: 0.9rem;
    color: ${INK};
    line-height: 1.5;
    margin: 0;
  }
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-top: 1px solid ${LINE};

  span.label {
    font-size: 0.75rem;
    font-weight: 800;
    color: ${INK};
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  span.val {
    font-family: ${FONT_HERO};
    font-size: 1.5rem;
    font-weight: 800;
    color: ${INK};
  }
`;

const OutroLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;

  a {
    font-size: 0.75rem;
    font-weight: 700;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.1em;

    &.bordered {
      width: 100%;
      text-align: center;
      padding: 0.85rem;
      border: 1px solid ${NAVY_ACCENT};
      color: ${NAVY_ACCENT};
      border-radius: 9999px;
      background: #fff;
      transition: all 0.2s;

      &:hover {
        background: ${NAVY_ACCENT};
        color: white;
      }
    }

    &.simple {
      color: #666;
      &:hover {
        color: ${NAVY_ACCENT};
      }
    }
  }
`;

const ErrorState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  background: white;
  border-radius: 16px;
  border: 1px dashed ${LINE};

  h3 {
    font-family: ${FONT_HERO};
    font-size: 1.5rem;
    color: ${INK};
    margin: 1rem 0;
  }
  p {
    color: #666;
    font-size: 0.95rem;
    margin-bottom: 2rem;
  }
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
};

const UserOrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['myOrderDetails', id],
    queryFn: async () => {
      const res = await apiClient.get(`/users/orders/${id}`);
      return res.data;
    },
  });

  const order = response?.data;

  if (isLoading) {
    return (
      <ProfileLayout>
        <div style={{ padding: '2rem', width: '100%' }}>
          <TextStackSkeleton />
        </div>
      </ProfileLayout>
    );
  }

  if (isError || !order) {
    return (
      <ProfileLayout>
        <ErrorState>
          <AlertCircle size={44} color="#dc2626" style={{ margin: '0 auto' }} />
          <h3>Order Record Not Found</h3>
          <p>We could not locate this order in your purchase history.</p>
          <SecondaryBtn onClick={() => navigate('/orders')} style={{ margin: '0 auto' }}>
            Return to Orders
          </SecondaryBtn>
        </ErrorState>
      </ProfileLayout>
    );
  }

  const { shippingAddress, items } = order;

  return (
    <ProfileLayout>
      <button
        type="button"
        onClick={() => navigate('/orders')}
        style={{
          background: 'transparent',
          border: 'none',
          color: NAVY_ACCENT,
          cursor: 'pointer',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.75rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: 0,
        }}
      >
        <ArrowLeft size={14} /> Back to Orders
      </button>

      <HeaderSection>
        <OrderInfo>
          <span className="overline">ORDER DETAILS</span>
          <h1>#{order.orderNumber || order.id.substring(0, 8).toUpperCase()}</h1>
          <p>
            PLACED ON {formatDate(order.createdAt)} • STATUS: <span className="status">{order.status}</span>
          </p>
        </OrderInfo>

        <ActionButtons>
          {['SHIPPED', 'DELIVERED'].includes(order.status) && (
            <PrimaryBtn
              type="button"
              onClick={() =>
                navigate(
                  `/track?order=${encodeURIComponent(order.orderNumber)}&email=${encodeURIComponent(
                    shippingAddress?.email || ''
                  )}`
                )
              }
            >
              <Truck size={15} /> Track Shipment
            </PrimaryBtn>
          )}
          <SecondaryBtn type="button" onClick={() => window.print()}>
            <Download size={15} /> Print Invoice
          </SecondaryBtn>
        </ActionButtons>
      </HeaderSection>

      <LayoutGrid>
        <ItemsSection>
          <h2>Ordered Footwear Pieces</h2>

          {items?.map((item) => (
            <ItemRow key={item.id}>
              <ItemImage>
                <img
                  src={item.product?.images?.[0]?.image?.url || '/items/black-loafers/black-loafers-1.png'}
                  alt={item.productName}
                />
              </ItemImage>

              <ItemDetails>
                <h3>{item.productName}</h3>
                <p className="collection">{item.product?.category?.name || 'FOOTWEAR'}</p>

                <SpecsGrid>
                  <div>
                    <span className="label">Quantity</span>
                    <span className="val">{item.quantity}</span>
                  </div>
                  {item.attributes && (
                    <div>
                      <span className="label">Details</span>
                      <span className="val">{item.attributes}</span>
                    </div>
                  )}
                </SpecsGrid>
              </ItemDetails>

              <ItemPrice>
                <Currency amount={item.price * item.quantity} />
              </ItemPrice>
            </ItemRow>
          ))}
        </ItemsSection>

        <DetailsSidebar>
          <SidebarBlock>
            <h4>SHIPPING INFORMATION</h4>

            <InfoBox>
              <span className="label">DELIVERY DESTINATION</span>
              {shippingAddress ? (
                <p>
                  <strong>{shippingAddress.name}</strong><br />
                  {shippingAddress.street}<br />
                  {shippingAddress.city}, {shippingAddress.region} {shippingAddress.zipCode}<br />
                  {shippingAddress.country}
                </p>
              ) : (
                <p style={{ color: '#888', fontStyle: 'italic' }}>Address details unavailable.</p>
              )}
            </InfoBox>
          </SidebarBlock>

          <SidebarBlock>
            <h4>PAYMENT SUMMARY</h4>

            <InfoBox>
              <span className="label">PAYMENT METHOD</span>
              <p>{order.paymentMethod || 'Paystack Gateway'}</p>
            </InfoBox>

            <TotalRow>
              <span className="label">Total Paid</span>
              <span className="val"><Currency amount={order.totalAmount} /></span>
            </TotalRow>
          </SidebarBlock>

          <OutroLinks>
            <Link to="/orders" className="bordered">View All Orders</Link>
            <Link to="/contact" className="simple">Need Help? Contact Client Care</Link>
          </OutroLinks>
        </DetailsSidebar>
      </LayoutGrid>
    </ProfileLayout>
  );
};

export default UserOrderDetailsPage;