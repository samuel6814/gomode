import React from 'react';
import styled from 'styled-components';
import { Check, Truck, MapPin, ShoppingCart, FileText, AlertCircle, CreditCard } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import { TextStackSkeleton } from '../../../components/ui/Skeleton';
import { CANVAS, NAVY_ACCENT, INK, LINE, FONT_HERO } from '../../../theme/brand';

const PageWrapper = styled.div`
  background: ${CANVAS};
  min-height: calc(100vh - 80px);
  padding: 3rem 1rem 6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 840px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const SuccessIcon = styled.div`
  width: 76px;
  height: 76px;
  background: ${NAVY_ACCENT};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1.75rem;
  box-shadow: 0 10px 25px rgba(37, 60, 90, 0.25);

  svg {
    width: 36px;
    height: 36px;
    stroke-width: 2.5;
  }
`;

const Title = styled.h1`
  font-family: ${FONT_HERO};
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  color: ${INK};
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
`;

const OrderId = styled.p`
  font-size: 1rem;
  color: ${NAVY_ACCENT};
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  color: #555;
  font-size: 0.95rem;
  max-width: 520px;
  line-height: 1.6;
  margin-bottom: 2.5rem;
`;

const DetailsCard = styled.div`
  background: white;
  width: 100%;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid ${LINE};
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2.5rem;

  @media (max-width: 600px) {
    padding: 1.5rem;
  }
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  text-align: left;
  border-bottom: 1px solid ${LINE};
  padding-bottom: 1.75rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Label = styled.h3`
  font-size: 0.75rem;
  font-weight: 800;
  color: ${NAVY_ACCENT};
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0 0 0.25rem 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const ValueTitle = styled.p`
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #777;
  margin: 0;
`;

const ValueStrong = styled.p`
  font-family: ${FONT_HERO};
  font-size: 1.15rem;
  font-weight: 800;
  color: ${INK};
  margin: 0;
`;

const AddressText = styled.div`
  font-size: 0.9rem;
  color: #555;
  line-height: 1.5;
  p {
    margin: 0;
  }
`;

const ItemsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  text-align: left;
  flex-wrap: wrap;

  span.label {
    font-size: 0.75rem;
    font-weight: 800;
    color: ${INK};
    margin-right: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
`;

const ItemThumb = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  background: #fbfbf9;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  margin-left: -12px;
  &:first-of-type {
    margin-left: 0;
  }
`;

const MoreItemsBadge = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #fbfbf9;
  color: ${NAVY_ACCENT};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 800;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-left: -12px;
  z-index: 2;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryBtn = styled(Link)`
  background: ${NAVY_ACCENT};
  color: white;
  text-decoration: none;
  padding: 0.95rem 2rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(37, 60, 90, 0.25);

  &:hover {
    background: #1b2c42;
    transform: translateY(-2px);
  }
`;

const SecondaryBtn = styled(Link)`
  background: white;
  color: ${INK};
  text-decoration: none;
  padding: 0.95rem 2rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  border: 1px solid ${LINE};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${NAVY_ACCENT};
    color: ${NAVY_ACCENT};
  }
`;

const HelpText = styled.p`
  margin-top: 2.5rem;
  font-size: 0.85rem;
  color: #777;

  a {
    color: ${NAVY_ACCENT};
    text-decoration: none;
    font-weight: 700;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  background: white;
  border-radius: 16px;
  border: 1px dashed ${LINE};
  max-width: 500px;
  margin: 0 auto;

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

const OrderConfirmationPage = () => {
  const { id } = useParams();

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['orderConfirmation', id],
    queryFn: async () => {
      try {
        const res = await apiClient.get(`/users/orders/${id}`);
        return res.data;
      } catch (error) {
        const saved = JSON.parse(sessionStorage.getItem('buyy-last-order') || 'null');
        if (saved?.id === id) return { success: true, data: saved };
        throw error;
      }
    },
    enabled: !!id,
  });

  const order = response?.data;

  if (isLoading) {
    return (
      <PageWrapper>
        <div style={{ padding: '2rem', maxWidth: 840, width: '100%' }}>
          <TextStackSkeleton />
        </div>
      </PageWrapper>
    );
  }

  if (isError || !order) {
    return (
      <PageWrapper>
        <ContentContainer>
          <ErrorState>
            <AlertCircle size={44} color="#dc2626" style={{ margin: '0 auto' }} />
            <h3>Order Not Located</h3>
            <p>We could not retrieve this order's confirmation data.</p>
            <PrimaryBtn to="/shop">Explore Footwear Catalog</PrimaryBtn>
          </ErrorState>
        </ContentContainer>
      </PageWrapper>
    );
  }

  const { shippingAddress, items } = order;
  const displayItems = items?.slice(0, 3) || [];
  const remainingItemsCount = Math.max(0, (items?.length || 0) - 3);

  const deliveryDate = new Date(order.createdAt);
  deliveryDate.setDate(deliveryDate.getDate() + 4);
  const formattedDelivery = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <PageWrapper>
      <ContentContainer>
        <SuccessIcon>
          <Check />
        </SuccessIcon>

        <Title>Order Confirmed</Title>
        <OrderId>Order Reference #{order.orderNumber || order.id.substring(0, 8)}</OrderId>
        {shippingAddress?.email && (
          <OrderId style={{ fontWeight: 600, textTransform: 'none', letterSpacing: 0, color: '#666' }}>
            Confirmation sent to {shippingAddress.email}
          </OrderId>
        )}
        <Subtitle>
          We have received your footwear order and our fulfillment team is preparing your package for courier dispatch.
        </Subtitle>

        <DetailsCard>
          <InfoRow>
            <InfoBlock>
              <Label><Truck size={16} /> Estimated Delivery</Label>
              <ValueTitle>Dispatch Window</ValueTitle>
              <ValueStrong>{formattedDelivery}</ValueStrong>
            </InfoBlock>

            <InfoBlock>
              <Label><MapPin size={16} /> Destination</Label>
              {shippingAddress ? (
                <>
                  <ValueStrong>{shippingAddress.name}</ValueStrong>
                  <AddressText>
                    <p>{shippingAddress.street}</p>
                    <p>{shippingAddress.city}, {shippingAddress.region} {shippingAddress.zipCode}</p>
                    <p>{shippingAddress.country}</p>
                  </AddressText>
                </>
              ) : (
                <ValueStrong style={{ color: '#999', fontStyle: 'italic', fontWeight: 400 }}>Address pending</ValueStrong>
              )}
            </InfoBlock>
          </InfoRow>

          {order.paymentStatus && (
            <InfoRow>
              <InfoBlock>
                <Label><CreditCard size={16} /> Payment Status</Label>
                <ValueStrong style={{ color: order.paymentStatus === 'SUCCESS' ? '#10B981' : '#F59E0B' }}>
                  {order.paymentStatus === 'SUCCESS' ? '✓ Payment Verified' : order.paymentStatus}
                </ValueStrong>
              </InfoBlock>
              <InfoBlock>
                <Label>Transaction Record</Label>
                {order.paymentMethod && (
                  <AddressText>
                    <p><strong>Method:</strong> {order.paymentMethod}</p>
                    {order.transactionRef && <p><strong>Ref:</strong> {order.transactionRef}</p>}
                  </AddressText>
                )}
              </InfoBlock>
            </InfoRow>
          )}

          <ItemsRow>
            <span className="label">Order Items:</span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {displayItems.map((item) => {
                const imgUrl = item.product?.images?.[0]?.image?.url || '/items/black-loafers/black-loafers-1.png';
                return (
                  <ItemThumb key={item.id}>
                    <img src={imgUrl} alt={item.productName} />
                  </ItemThumb>
                );
              })}
              {remainingItemsCount > 0 && <MoreItemsBadge>+{remainingItemsCount}</MoreItemsBadge>}
            </div>
          </ItemsRow>
        </DetailsCard>

        <ActionButtons>
          <PrimaryBtn
            to={
              shippingAddress?.email && order.orderNumber
                ? `/track?order=${encodeURIComponent(order.orderNumber)}&email=${encodeURIComponent(shippingAddress.email)}`
                : '/track'
            }
          >
            <Truck size={16} /> Track Shipment
          </PrimaryBtn>
          <SecondaryBtn to="/shop">
            <ShoppingCart size={16} /> Browse Footwear
          </SecondaryBtn>
          <SecondaryBtn to="/orders">
            <FileText size={16} /> Order History
          </SecondaryBtn>
        </ActionButtons>

        <HelpText>
          Questions about your delivery? <Link to="/contact">Contact GoMode Support</Link>
        </HelpText>
      </ContentContainer>
    </PageWrapper>
  );
};

export default OrderConfirmationPage;