import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Truck, PackageOpen } from 'lucide-react';
import { TextStackSkeleton } from '../../../components/ui/Skeleton';
import apiClient from '../../../api/axios';
import ProfileLayout from './ProfileLayout';
import Currency from '../../../utils/Currency';
import { NAVY_ACCENT, INK, LINE, FONT_HERO } from '../../../theme/brand';

const Header = styled.div`
  margin-bottom: 2.5rem;

  span {
    font-size: 0.75rem;
    font-weight: 700;
    color: ${NAVY_ACCENT};
    letter-spacing: 0.12em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 0.35rem;
  }

  h1 {
    font-family: ${FONT_HERO};
    font-size: clamp(2rem, 4vw, 2.75rem);
    font-weight: 800;
    color: ${INK};
    margin: 0;
    letter-spacing: -0.02em;
  }
`;

const ActiveOrdersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 3.5rem;
  width: 100%;

  @media (min-width: 1024px) {
    grid-template-columns: ${(props) => (props.$hasSecondary ? '2fr 1fr' : '1fr')};
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  border: 1px solid ${LINE};
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 600px) {
    padding: 1.5rem;
  }
`;

const SecondaryCard = styled(Card)`
  background: #fbfbf9;
`;

const StatusBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  width: fit-content;

  background: ${(props) =>
    props.$status === 'DELIVERED'
      ? '#10B981'
      : props.$status === 'CANCELLED'
      ? '#EF4444'
      : NAVY_ACCENT};
  color: white;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 1.25rem;
  margin-bottom: 1.75rem;
  gap: 1.5rem;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const OrderInfo = styled.div`
  h2 {
    font-family: ${FONT_HERO};
    font-size: 1.45rem;
    font-weight: 800;
    color: ${INK};
    margin: 0 0 0.35rem 0;
  }

  p {
    font-size: 0.75rem;
    font-weight: 700;
    color: #777;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 0;
  }
`;

const PriceInfo = styled.div`
  text-align: right;

  @media (max-width: 600px) {
    text-align: left;
  }

  .amount {
    font-family: ${FONT_HERO};
    font-size: 1.6rem;
    font-weight: 800;
    color: ${INK};
    margin-bottom: 0.2rem;
    display: block;
  }

  .items {
    font-size: 0.7rem;
    font-weight: 700;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
`;

const ImageGallery = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  width: 100%;

  img {
    width: 90px;
    height: 90px;
    object-fit: cover;
    border-radius: 10px;
    background: #fbfbf9;
    border: 1px solid ${LINE};
  }

  .more-box {
    width: 90px;
    height: 90px;
    background: #fbfbf9;
    border: 1px solid ${LINE};
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.95rem;
    font-weight: 800;
    color: ${NAVY_ACCENT};
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  border-top: 1px solid ${LINE};
  padding-top: 1.25rem;
  gap: 1.5rem;

  .arrival {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: ${NAVY_ACCENT};
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  button {
    background: transparent;
    border: none;
    color: ${NAVY_ACCENT};
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: opacity 0.2s;
    padding: 0;

    &:hover {
      opacity: 0.7;
    }
  }
`;

const MiniSummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;

  span.label {
    font-size: 0.7rem;
    font-weight: 700;
    color: #777;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  span.val {
    font-family: ${FONT_HERO};
    font-size: 0.95rem;
    font-weight: 800;
    color: ${INK};
  }
`;

const PastOrdersContainer = styled.div`
  margin-top: 3.5rem;
  width: 100%;
`;

const SectionTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 800;
  color: ${NAVY_ACCENT};
  text-transform: uppercase;
  letter-spacing: 0.14em;
  margin-bottom: 1.25rem;
`;

const PastOrderRow = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.25rem 2rem;
  margin-bottom: 0.75rem;
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 1fr 1fr auto;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  border: 1px solid ${LINE};
  gap: 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  @media (max-width: 600px) {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
`;

const ColInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  span.label {
    font-size: 0.65rem;
    font-weight: 700;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  span.val {
    font-size: 0.95rem;
    font-weight: 700;
    color: ${INK};
  }
`;

const ActionBtn = styled.button`
  background: #fbfbf9;
  border: 1px solid ${LINE};
  color: ${NAVY_ACCENT};
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  padding: 0.6rem 1rem;
  border-radius: 9999px;
  transition: all 0.2s;

  &:hover {
    background: ${NAVY_ACCENT};
    color: white;
    border-color: ${NAVY_ACCENT};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  background: white;
  border-radius: 16px;
  border: 1px dashed ${LINE};
  text-align: center;

  h3 {
    font-family: ${FONT_HERO};
    font-size: 1.5rem;
    color: ${INK};
    margin: 1rem 0 0.5rem 0;
  }

  p {
    font-size: 0.95rem;
    color: #666;
    margin-bottom: 2rem;
  }

  button {
    background: ${NAVY_ACCENT};
    color: white;
    border: none;
    padding: 0.85rem 2.25rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.2s ease;

    &:hover {
      background: #1b2c42;
    }
  }
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
};

const UserOrdersPage = () => {
  const navigate = useNavigate();

  const { data: response, isLoading } = useQuery({
    queryKey: ['myOrders'],
    queryFn: async () => {
      const res = await apiClient.get('/users/orders');
      return res.data;
    },
  });

  const orders = response?.data || [];
  const activeOrders = orders.filter((o) => ['PENDING', 'PROCESSING', 'SHIPPED'].includes(o.status));
  const pastOrders = orders.filter((o) => ['DELIVERED', 'CANCELLED'].includes(o.status));

  const primaryOrder = activeOrders[0];
  const secondaryOrder = activeOrders[1];

  if (isLoading) {
    return (
      <ProfileLayout>
        <div style={{ padding: '2rem' }}>
          <TextStackSkeleton />
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <Header>
        <span>CLIENT ORDERS</span>
        <h1>Order History</h1>
      </Header>

      {orders.length === 0 ? (
        <EmptyState>
          <PackageOpen size={48} color={NAVY_ACCENT} strokeWidth={1.5} />
          <h3>No Footwear Orders Yet</h3>
          <p>You haven't placed any orders with us. Discover our latest handcrafted collections.</p>
          <button type="button" onClick={() => navigate('/shop')}>Explore Footwear Catalog</button>
        </EmptyState>
      ) : (
        <>
          {activeOrders.length > 0 && (
            <ActiveOrdersGrid $hasSecondary={Boolean(secondaryOrder)}>
              {primaryOrder && (
                <Card>
                  <StatusBadge $status={primaryOrder.status}>{primaryOrder.status}</StatusBadge>

                  <CardHeader>
                    <OrderInfo>
                      <h2>ORDER #{primaryOrder.orderNumber || primaryOrder.id.substring(0, 8).toUpperCase()}</h2>
                      <p>PLACED ON {formatDate(primaryOrder.createdAt)}</p>
                    </OrderInfo>
                    <PriceInfo>
                      <span className="amount"><Currency amount={primaryOrder.totalAmount} /></span>
                      <span className="items">
                        {primaryOrder.items?.reduce((acc, item) => acc + item.quantity, 0) || 0} ITEMS
                      </span>
                    </PriceInfo>
                  </CardHeader>

                  <ImageGallery>
                    {primaryOrder.items?.slice(0, 3).map((item, i) => {
                      const imgUrl = item.product?.images?.[0]?.image?.url || '/items/black-loafers/black-loafers-1.png';
                      return <img key={i} src={imgUrl} alt={item.productName} />;
                    })}
                    {primaryOrder.items?.length > 3 && (
                      <div className="more-box">+{primaryOrder.items.length - 3}</div>
                    )}
                  </ImageGallery>

                  <CardFooter>
                    <span className="arrival">
                      <Truck size={16} strokeWidth={2.5} />
                      {primaryOrder.status === 'SHIPPED' ? 'IN TRANSIT' : 'DISPATCH PREPARATION'}
                    </span>
                    <button type="button" onClick={() => navigate(`/orders/${primaryOrder.id}`)}>
                      View Order Details
                    </button>
                  </CardFooter>
                </Card>
              )}

              {secondaryOrder && (
                <SecondaryCard>
                  <StatusBadge $status={secondaryOrder.status}>{secondaryOrder.status}</StatusBadge>

                  <CardHeader>
                    <OrderInfo>
                      <h2 style={{ fontSize: '1.25rem' }}>
                        ORDER #{secondaryOrder.orderNumber || secondaryOrder.id.substring(0, 8).toUpperCase()}
                      </h2>
                      <p>PLACED ON {formatDate(secondaryOrder.createdAt)}</p>
                    </OrderInfo>
                  </CardHeader>

                  <div style={{ marginTop: 'auto', marginBottom: '1.5rem' }}>
                    <MiniSummaryRow>
                      <span className="label">TOTAL</span>
                      <span className="val"><Currency amount={secondaryOrder.totalAmount} /></span>
                    </MiniSummaryRow>
                    <MiniSummaryRow>
                      <span className="label">ITEMS</span>
                      <span className="val">{secondaryOrder.items?.reduce((acc, item) => acc + item.quantity, 0) || 0} PAIRS</span>
                    </MiniSummaryRow>
                  </div>

                  <CardFooter style={{ borderTop: 'none', paddingTop: 0 }}>
                    <button type="button" onClick={() => navigate(`/orders/${secondaryOrder.id}`)}>
                      View Details
                    </button>
                  </CardFooter>
                </SecondaryCard>
              )}
            </ActiveOrdersGrid>
          )}

          {pastOrders.length > 0 && (
            <PastOrdersContainer>
              <SectionTitle>FULFILLED & ARCHIVED ORDERS</SectionTitle>

              {pastOrders.map((order) => (
                <PastOrderRow key={order.id}>
                  <ColInfo>
                    <span className="label">Order Ref</span>
                    <span className="val">#{order.orderNumber || order.id.substring(0, 8).toUpperCase()}</span>
                  </ColInfo>

                  <ColInfo>
                    <span className="label">Date</span>
                    <span className="val">{formatDate(order.createdAt)}</span>
                  </ColInfo>

                  <ColInfo>
                    <span className="label">Status</span>
                    <span className="val" style={{ color: order.status === 'DELIVERED' ? '#10B981' : INK }}>
                      {order.status}
                    </span>
                  </ColInfo>

                  <ColInfo>
                    <span className="label">Total</span>
                    <span className="val" style={{ fontFamily: FONT_HERO, fontSize: '1.15rem' }}>
                      <Currency amount={order.totalAmount} />
                    </span>
                  </ColInfo>

                  <ActionBtn type="button" onClick={() => navigate(`/orders/${order.id}`)}>
                    View Details
                  </ActionBtn>
                </PastOrderRow>
              ))}
            </PastOrdersContainer>
          )}
        </>
      )}
    </ProfileLayout>
  );
};

export default UserOrdersPage;