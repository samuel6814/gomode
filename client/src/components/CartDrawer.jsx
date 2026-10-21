import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { X, Minus, Plus, Loader2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/axios';
import Currency from '../utils/Currency';
import { saleUnitPrice, useSale } from '../utils/sale';
import { linePath, readGuestCart, removeGuestItem, setGuestQty } from '../utils/cart';
import { useSession } from '../api/authClient';
import { media } from '../theme/breakpoints';

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// --- Styled Components ---
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(136, 138, 149, 0.6); 
  backdrop-filter: blur(2px);
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
  animation: ${fadeIn} 0.3s ease;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const DrawerContainer = styled.div`
  width: 100%;
  max-width: 480px;
  height: 100%;
  background: #FFFFFF;
  box-shadow: -10px 0 40px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  transform: ${props => (props.$isOpen ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;

  @media ${media.small} { max-width: 100%; }
`;

/* HEADER */
const Header = styled.div`
  padding: 1.25rem 1.25rem 1rem;

  @media ${media.tabletUp} {
    padding: 2.5rem 2.5rem 2rem;
  }
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1px solid #F3F4F6;

  div {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    span { font-family: 'Inter', system-ui, sans-serif; font-size: 0.7rem; font-weight: 800; color: #1A1A1A; letter-spacing: 2px; text-transform: uppercase; }
    h2 { font-family: 'Inter', system-ui, sans-serif; font-size: 1.6rem; font-weight: 400; color: #111827; margin: 0; line-height: 1; }
    @media ${media.tabletUp} { h2 { font-size: 2.2rem; } }
  }
`;

const CloseBtn = styled.button`
  background: transparent; border: none; cursor: pointer; color: #111827; padding: 0; display: flex; align-items: center; justify-content: center; transition: transform 0.2s;
  &:hover { transform: rotate(90deg); }
`;

/* CART ITEMS LIST */
const ItemsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.25rem;

  @media ${media.tabletUp} {
    padding: 1rem 2.5rem;
  }
  
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const CartItemRow = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 2rem 0;
  border-bottom: 1px solid #F9FAFB;
  position: relative;
  &:last-child { border-bottom: none; }
`;

const ItemImage = styled.div`
  width: 100px; height: 100px; background: #F3F4F6; flex-shrink: 0; border-radius: 8px; overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const ItemDetails = styled.div`
  flex: 1; display: flex; flex-direction: column;
`;

const ItemHeader = styled.div`
  display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;
  h3 { font-family: 'Inter', system-ui, sans-serif; font-size: 1.1rem; font-weight: 400; color: #111827; margin: 0 0 0.4rem 0; }
`;

const DeleteIconBtn = styled.button`
  width: 20px; height: 20px; background: transparent; border: 1px solid #E5E7EB; border-radius: 4px; color: #9CA3AF; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; transition: all 0.2s ease;
  &:hover { color: #EF4444; border-color: #EF4444; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const VariantText = styled.p`
  font-family: 'Inter', system-ui, sans-serif; font-size: 0.65rem; color: #6B7280; margin: 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;
`;

const ItemControls = styled.div`
  display: flex; justify-content: space-between; align-items: flex-end; margin-top: auto;
`;

const QtySelector = styled.div`
  display: flex; align-items: center; border: 1px solid #E5E7EB; border-radius: 50px; padding: 0.2rem 0.5rem;
  button { width: 24px; height: 24px; background: transparent; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #9CA3AF; transition: color 0.2s; &:hover { color: #111827; } &:disabled { opacity: 0.5; cursor: not-allowed; } }
  span { font-family: 'Inter', system-ui, sans-serif; font-size: 0.85rem; font-weight: 700; width: 30px; text-align: center; color: #111827; }
`;

const ItemPrice = styled.div`
  font-family: 'Inter', system-ui, sans-serif; font-weight: 400; font-size: 1.1rem; color: #111827; 
`;

/* FOOTER */
const Footer = styled.div`
  background: #F9FAFB;
  padding: 1.25rem;

  @media ${media.tabletUp} {
    padding: 2.5rem;
  }
`;

const Divider = styled.div`
  width: 100%; height: 1px; background: #E5E7EB; margin-bottom: 2rem;
`;

const SummaryRow = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: ${props => props.$last ? '2rem' : '1rem'};
  span.label { font-family: 'Inter', system-ui, sans-serif; font-size: 0.75rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #4B5563; }
  span.val { font-family: ${props => props.$total ? "'Inter', system-ui, sans-serif" : "'Inter', system-ui, sans-serif"}; font-size: ${props => props.$total ? '1.5rem' : '0.75rem'}; font-weight: ${props => props.$total ? '400' : '600'}; color: ${props => props.$total ? '#111827' : '#6B7280'}; letter-spacing: ${props => props.$total ? '0' : '1px'}; text-transform: ${props => props.$total ? 'none' : 'uppercase'}; }
`;

const ActionBtn = styled.button`
  width: 100%; padding: 1.25rem; border-radius: 8px; font-family: 'Inter', system-ui, sans-serif; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; transition: all 0.3s ease; margin-bottom: 1rem;
  &.secondary { background: transparent; color: #1A1A1A; border: 1px solid #1A1A1A; &:hover { background: #F4F1EB; } }
  &.primary { background: #1A1A1A; color: white; border: 1px solid #1A1A1A; box-shadow: 0 10px 20px -5px rgba(75, 118, 252, 0.3); &:hover { background: #333333; border-color: #333333; transform: translateY(-2px); box-shadow: 0 15px 25px -5px rgba(75, 118, 252, 0.4); } }
`;

const SecureText = styled.p`
  text-align: center; font-family: 'Inter', system-ui, sans-serif; font-size: 0.6rem; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; margin: 1.5rem 0 0 0;
`;

const EmptyCartState = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #9CA3AF; padding: 2rem; text-align: center;
  h3 { font-family: 'Inter', system-ui, sans-serif; font-size: 1.5rem; color: #111827; margin: 1rem 0 0.5rem 0; }
  p { font-family: 'Inter', system-ui, sans-serif; font-size: 0.85rem; line-height: 1.5; }
`;


const CartDrawer = ({ isOpen, onClose }) => {
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

  // 1. Fetch REAL Cart Data from database
  const { data: response, isLoading } = useQuery({
    queryKey: ['userCart'],
    queryFn: async () => {
      const res = await apiClient.get('/cart');
      return res.data;
    },
    enabled: IS_LOGGED_IN && isOpen // Only fetch if drawer is open AND logged in
  });

  const cartItems = IS_LOGGED_IN ? (response?.data?.items || []) : guestItems;
  const sale = useSale();
  const subtotal = cartItems.reduce((acc, item) => acc + (saleUnitPrice(item.product, sale) * item.quantity), 0);

  // 2. Mutations to update backend
  const updateQtyMutation = useMutation({
    mutationFn: async ({ id, quantity }) => {
      await apiClient.put(`/cart/item/${id}`, { quantity });
    },
    onSuccess: () => queryClient.invalidateQueries(['userCart'])
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/cart/item/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries(['userCart'])
  });

  const handleQtyChange = (id, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (!IS_LOGGED_IN) {
      setGuestQty(id, newQty);
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

  const handleViewBag = () => {
    onClose();
    navigate('/cart');
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout'); 
  };

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <DrawerContainer $isOpen={isOpen} onClick={(e) => e.stopPropagation()}>
        
        <Header>
          <div>
            <span>SHOPPING BAG</span>
            <h2>Your Bag</h2>
          </div>
          <CloseBtn onClick={onClose}>
            <X size={28} strokeWidth={1} />
          </CloseBtn>
        </Header>

        {IS_LOGGED_IN && isLoading ? (
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
            <Loader2 size={32} className="animate-spin" color="#1A1A1A"/>
          </div>
        ) : cartItems.length === 0 ? (
          /* If Cart is truly empty in the Database */
          <EmptyCartState>
            <ShoppingBag size={48} strokeWidth={1} color="#D1D5DB" />
            <h3>Your Bag is Empty</h3>
            <p>Discover our latest arrivals and add your favorite pieces to the bag.</p>
          </EmptyCartState>
        ) : (
          <>
            <ItemsList>
              {cartItems.map((item) => {
                const product = item.product;
                const imgUrl = product.images?.[0]?.image?.url || 'https://via.placeholder.com/150';
                
                return (
                  <CartItemRow key={item.id}>
                    <ItemImage onClick={() => navigate(linePath(item))} style={{ cursor: 'pointer' }}>
                      <img src={imgUrl} alt={product.name} />
                    </ItemImage>
                    <ItemDetails>
                      <ItemHeader>
                        <div>
                          <h3>{product.name}</h3>
                          <VariantText>SIZE OS</VariantText>
                        </div>
                        <DeleteIconBtn onClick={() => handleRemove(item.id)} disabled={removeItemMutation.isPending}>
                          {removeItemMutation.isPending && removeItemMutation.variables === item.id 
                            ? <Loader2 size={12} className="animate-spin"/> 
                            : <X size={12} strokeWidth={2.5} />}
                        </DeleteIconBtn>
                      </ItemHeader>
                      
                      <ItemControls>
                        <QtySelector>
                          <button onClick={() => handleQtyChange(item.id, item.quantity, -1)} disabled={updateQtyMutation.isPending}>
                            <Minus size={12} strokeWidth={2} />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => handleQtyChange(item.id, item.quantity, 1)} disabled={updateQtyMutation.isPending || item.quantity >= product.stock}>
                            <Plus size={12} strokeWidth={2} />
                          </button>
                        </QtySelector>
                        
                        <ItemPrice>
                          <Currency amount={saleUnitPrice(product, sale) * item.quantity} />
                        </ItemPrice>
                      </ItemControls>
                    </ItemDetails>
                  </CartItemRow>
                );
              })}
            </ItemsList>

            <Footer>
              <Divider />
              <SummaryRow>
                <span className="label">SUBTOTAL</span>
                <span className="val"><Currency amount={subtotal} /></span>
              </SummaryRow>
              <SummaryRow $last>
                <span className="label">SHIPPING</span>
                <span className="val">CALCULATED AT CHECKOUT</span>
              </SummaryRow>
              
              <ActionBtn className="secondary" onClick={handleViewBag}>
                VIEW FULL BAG
              </ActionBtn>
              <ActionBtn className="primary" onClick={handleCheckout}>
                CHECKOUT
              </ActionBtn>
              <SecureText>SECURED BY YOUR BRAND ARCHITECTURAL EDITIONS</SecureText>
            </Footer>
          </>
        )}
      </DrawerContainer>
    </Overlay>
  );
};

export default CartDrawer;