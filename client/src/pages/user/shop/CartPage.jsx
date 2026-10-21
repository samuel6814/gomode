import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Minus, Plus, Loader2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import { useSession } from '../../../api/authClient';
import Currency from '../../../utils/Currency';
import { saleUnitPrice, useSale } from '../../../utils/sale';
import { linePath, readGuestCart, removeGuestItem, setGuestQty } from '../../../utils/cart';
import { media } from '../../../theme/breakpoints';
import { CANVAS, NAVY_ACCENT, INK, LINE, FONT_HERO } from '../../../theme/brand';

const PageWrapper = styled.div`
  background: ${CANVAS};
  min-height: calc(100vh - 80px);
  padding: 2.5rem 1rem 6rem;

  @media (min-width: 768px) {
    padding: 3.5rem 2rem 6rem;
  }
`;

const Container = styled.div`
  max-width: 1360px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${LINE};

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
    font-size: clamp(2.2rem, 4vw, 3rem);
    font-weight: 800;
    color: ${INK};
    margin: 0;
    line-height: 1.1;
    letter-spacing: -0.03em;
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1.6fr 1fr;
    gap: 4rem;
  }
`;

const CartItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CartItem = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #fff;
  border: 1px solid ${LINE};
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const ItemImage = styled.div`
  width: 130px;
  aspect-ratio: 1;
  background: #fbfbf9;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
  border: 1px solid ${LINE};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  &:hover img {
    transform: scale(1.06);
  }

  @media (max-width: 500px) {
    width: 100%;
    aspect-ratio: 16 / 9;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.5rem;

  h3 {
    font-family: ${FONT_HERO};
    font-size: 1.15rem;
    font-weight: 700;
    color: ${INK};
    margin: 0;
    cursor: pointer;
    transition: color 0.15s ease;

    &:hover {
      color: ${NAVY_ACCENT};
    }
  }
`;

const ItemPrice = styled.div`
  font-family: ${FONT_HERO};
  font-weight: 800;
  font-size: 1.15rem;
  color: ${INK};
`;

const CategoryLabel = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${NAVY_ACCENT};
  margin-bottom: 1.25rem;
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 1rem;
`;

const QtySelector = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${LINE};
  border-radius: 9999px;
  padding: 0.25rem 0.6rem;
  background: #fbfbf9;

  button {
    width: 26px;
    height: 26px;
    background: transparent;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: ${INK};
    transition: color 0.2s;

    &:hover {
      color: ${NAVY_ACCENT};
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  span {
    font-size: 0.9rem;
    font-weight: 700;
    width: 32px;
    text-align: center;
    color: ${INK};
  }
`;

const RemoveBtn = styled.button`
  background: transparent;
  border: none;
  font-size: 0.75rem;
  font-weight: 700;
  color: #777;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  padding: 0.4rem 0.6rem;
  transition: color 0.2s;

  &:hover {
    color: #dc2626;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* --- SUMMARY --- */
const SummaryWrapper = styled.div`
  @media (min-width: 1024px) {
    position: sticky;
    top: 32px;
    align-self: start;
  }
`;

const SummaryCard = styled.div`
  background: #fff;
  padding: 2.25rem;
  border-radius: 16px;
  border: 1px solid ${LINE};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
`;

const SummaryHeader = styled.h3`
  font-family: ${FONT_HERO};
  font-size: 1.35rem;
  font-weight: 800;
  margin: 0 0 2rem 0;
  color: ${INK};
  letter-spacing: -0.02em;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => (props.$last ? '1.5rem' : '1.15rem')};

  span.label {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #666;
  }

  span.val {
    font-family: ${(props) => (props.$total ? FONT_HERO : 'inherit')};
    font-size: ${(props) => (props.$total ? '1.75rem' : '0.9rem')};
    font-weight: ${(props) => (props.$total ? '800' : '700')};
    color: ${INK};
    font-style: ${(props) => (props.$italic ? 'italic' : 'normal')};
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${LINE};
  margin: 1.5rem 0;
`;

const CheckoutBtn = styled.button`
  width: 100%;
  background: ${NAVY_ACCENT};
  color: white;
  border: none;
  padding: 1.15rem;
  border-radius: 9999px;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(37, 60, 90, 0.25);

  &:hover {
    background: #1b2c42;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(37, 60, 90, 0.35);
  }
`;

const SecureText = styled.p`
  font-size: 0.7rem;
  color: #777;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  line-height: 1.6;
  margin: 1.5rem 0 0 0;
  text-align: center;
`;

const EmptyCartState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  text-align: center;
  border: 1px dashed ${LINE};
  border-radius: 16px;
  background: #fff;

  h3 {
    font-family: ${FONT_HERO};
    font-size: 1.75rem;
    font-weight: 800;
    color: ${INK};
    margin: 1.5rem 0 0.5rem 0;
  }

  p {
    font-size: 0.95rem;
    color: #666;
    margin-bottom: 2rem;
    max-width: 420px;
  }

  button {
    background: ${NAVY_ACCENT};
    color: white;
    border: none;
    padding: 1rem 2.5rem;
    border-radius: 9999px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #1b2c42;
      transform: translateY(-2px);
    }
  }
`;

const CartPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const IS_LOGGED_IN = !!session;
  const [guestItems, setGuestItems] = useState(readGuestCart);

  useEffect(() => {
    const sync = () => setGuestItems(readGuestCart());
    window.addEventListener('guest-cart', sync);
    return () => window.removeEventListener('guest-cart', sync);
  }, []);

  const { data: response, isLoading } = useQuery({
    queryKey: ['userCart'],
    queryFn: async () => {
      const res = await apiClient.get('/cart');
      return res.data;
    },
    enabled: IS_LOGGED_IN,
  });

  const cartItems = IS_LOGGED_IN ? (response?.data?.items || []) : guestItems;
  const sale = useSale();
  const subtotal = cartItems.reduce((acc, item) => acc + saleUnitPrice(item.product, sale) * item.quantity, 0);

  const updateQtyMutation = useMutation({
    mutationFn: async ({ id, quantity }) => {
      await apiClient.put(`/cart/item/${id}`, { quantity });
    },
    onSuccess: () => queryClient.invalidateQueries(['userCart']),
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/cart/item/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries(['userCart']),
  });

  const handleQtyChange = (id, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (!IS_LOGGED_IN) {
      setGuestQty(id, newQty);
      return;
    }
    if (newQty <= 0) {
      removeItemMutation.mutate(id);
      return;
    }
    updateQtyMutation.mutate({ id, quantity: newQty });
  };

  const handleRemove = (id) => {
    if (!IS_LOGGED_IN) {
      removeGuestItem(id);
      return;
    }
    removeItemMutation.mutate(id);
  };

  return (
    <PageWrapper>
      <Container>
        <PageHeader>
          <span>SNEAKER GARDEN BAG</span>
          <h1>Your Footwear Selection</h1>
        </PageHeader>

        <MainContent>
          {/* LEFT: Cart Items */}
          <CartItemsList>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
                <Loader2 size={36} className="animate-spin" color={NAVY_ACCENT} />
              </div>
            ) : cartItems.length > 0 ? (
              cartItems.map((item) => {
                const product = item.product;
                const imgUrl = product.images?.[0]?.image?.url || '/items/black-loafers/black-loafers-1.png';

                return (
                  <CartItem key={item.id}>
                    <ItemImage onClick={() => navigate(linePath(item))}>
                      <img src={imgUrl} alt={product.name} />
                    </ItemImage>
                    <ItemDetails>
                      <ItemHeader>
                        <h3 onClick={() => navigate(linePath(item))}>{product.name}</h3>
                        <ItemPrice>
                          <Currency amount={saleUnitPrice(product, sale) * item.quantity} />
                        </ItemPrice>
                      </ItemHeader>
                      <CategoryLabel>{product.category?.name || 'FOOTWEAR'}</CategoryLabel>

                      <ControlsContainer>
                        <QtySelector>
                          <button
                            type="button"
                            onClick={() => handleQtyChange(item.id, item.quantity, -1)}
                            disabled={updateQtyMutation.isPending}
                          >
                            <Minus size={13} strokeWidth={2.5} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleQtyChange(item.id, item.quantity, 1)}
                            disabled={updateQtyMutation.isPending || item.quantity >= product.stock}
                          >
                            <Plus size={13} strokeWidth={2.5} />
                          </button>
                        </QtySelector>
                        <RemoveBtn
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          disabled={removeItemMutation.isPending}
                        >
                          Remove
                        </RemoveBtn>
                      </ControlsContainer>
                    </ItemDetails>
                  </CartItem>
                );
              })
            ) : (
              <EmptyCartState>
                <ShoppingBag size={56} strokeWidth={1.5} color={NAVY_ACCENT} />
                <h3>Your Bag is Empty</h3>
                <p>Discover our handcrafted footwear silhouettes and add your preferred pair to the bag.</p>
                <button type="button" onClick={() => navigate('/shop')}>Explore Footwear Catalog</button>
              </EmptyCartState>
            )}
          </CartItemsList>

          {/* RIGHT: Summary */}
          {cartItems.length > 0 && (
            <SummaryWrapper>
              <SummaryCard>
                <SummaryHeader>Order Summary</SummaryHeader>

                <SummaryRow>
                  <span className="label">Subtotal</span>
                  <span className="val"><Currency amount={subtotal} /></span>
                </SummaryRow>

                <SummaryRow>
                  <span className="label">Ghana Delivery</span>
                  <span className="val" $italic>Calculated at checkout</span>
                </SummaryRow>

                <SummaryRow $last>
                  <span className="label">Tax</span>
                  <span className="val"><Currency amount={0} /></span>
                </SummaryRow>

                <Divider />

                <SummaryRow $last>
                  <span className="label" style={{ fontSize: '0.95rem', color: INK, fontWeight: '800' }}>Estimated Total</span>
                  <span className="val" $total><Currency amount={subtotal} /></span>
                </SummaryRow>

                <CheckoutBtn type="button" onClick={() => navigate('/checkout')}>
                  Proceed to Checkout <ArrowRight size={16} />
                </CheckoutBtn>

                <SecureText>
                  SECURE CHECKOUT POWERED BY PAYSTACK & DIRECT CASH ON DELIVERY ACROSS GHANA.
                </SecureText>
              </SummaryCard>
            </SummaryWrapper>
          )}
        </MainContent>
      </Container>
    </PageWrapper>
  );
};

export default CartPage;