import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CreditCard, CheckCircle2, Circle, Loader2, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../../hooks/useUser';
import apiClient from '../../../api/axios';
import { useSession } from '../../../api/authClient';
import Currency from '../../../utils/Currency';
import { saleUnitPrice, useSale } from '../../../utils/sale';
import PaystackPop from '@paystack/inline-js';
import { GHANA_REGIONS, getCitiesForRegion } from '../../../utils/ghanaLocations';
import { clearGuestCart, readGuestCart } from '../../../utils/cart';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { TextStackSkeleton } from '../../../components/ui/Skeleton';
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
  gap: 2.5rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1.6fr 1fr;
    gap: 4rem;
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const Section = styled.div`
  background: #fff;
  border: 1px solid ${LINE};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);

  @media (max-width: 600px) {
    padding: 1.5rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StepNumber = styled.div`
  background: ${NAVY_ACCENT};
  color: white;
  font-family: ${FONT_HERO};
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 1px;
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
`;

const SectionTitle = styled.h2`
  font-family: ${FONT_HERO};
  font-size: 1.35rem;
  font-weight: 800;
  color: ${INK};
  margin: 0;
  letter-spacing: -0.02em;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
`;

const FullWidthInput = styled.div`
  grid-column: 1 / -1;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${INK};
  text-transform: uppercase;
  letter-spacing: 0.08em;

  ${(props) =>
    !props.$optional &&
    `
    &::after {
      content: ' *';
      color: #dc2626;
    }
  `}
`;

const Input = styled.input`
  width: 100%;
  padding: 0.95rem 1rem;
  border: 1px solid ${LINE};
  background: #fbfbf9;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  color: ${INK};
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    border-color: ${NAVY_ACCENT};
    background: #fff;
    box-shadow: 0 0 0 3px rgba(37, 60, 90, 0.08);
  }

  &::placeholder {
    color: #999;
  }
`;

const PhoneWrapper = styled.div`
  .PhoneInput {
    display: flex;
    align-items: center;
  }
  .PhoneInputInput {
    width: 100%;
    padding: 0.95rem 1rem;
    border: 1px solid ${LINE};
    background: #fbfbf9;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.95rem;
    color: ${INK};
    outline: none;
    transition: all 0.2s ease;
    box-sizing: border-box;

    &:focus {
      border-color: ${NAVY_ACCENT};
      background: #fff;
      box-shadow: 0 0 0 3px rgba(37, 60, 90, 0.08);
    }

    &::placeholder {
      color: #999;
    }
  }
  .PhoneInputCountry {
    margin-right: 0.75rem;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.95rem 1rem;
  border: 1px solid ${LINE};
  background: #fbfbf9;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  color: ${INK};
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    border-color: ${NAVY_ACCENT};
    background: #fff;
  }
`;

/* Delivery Cards */
const DeliveryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const DeliveryCard = styled.div`
  border: 1.5px solid ${(props) => (props.$active ? NAVY_ACCENT : LINE)};
  border-radius: 12px;
  background: ${(props) => (props.$active ? '#F8F9FA' : '#fff')};
  padding: 1.5rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${NAVY_ACCENT};
  }

  .tag {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: ${NAVY_ACCENT};
  }

  .title {
    font-family: ${FONT_HERO};
    font-size: 1.15rem;
    font-weight: 700;
    color: ${INK};
    margin: 0;
  }

  .price {
    font-size: 0.9rem;
    color: #555;
    font-weight: 600;
  }

  .icon {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    color: ${(props) => (props.$active ? NAVY_ACCENT : '#ccc')};
  }
`;

const PaymentBox = styled.div`
  border: 1px solid ${LINE};
  border-radius: 12px;
  background: #fbfbf9;
  overflow: hidden;
`;

const PaymentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: #fff;
  border-bottom: 1px solid ${LINE};

  div {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: ${INK};
    font-weight: 700;
    font-size: 0.95rem;

    svg {
      color: ${NAVY_ACCENT};
    }
  }
`;

const PaymentBody = styled.div`
  padding: 1.5rem;
  color: #555;
  font-size: 0.9rem;
  line-height: 1.6;
`;

/* Order Summary */
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
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  border: 1px solid ${LINE};
`;

const SummaryHeader = styled.h3`
  font-family: ${FONT_HERO};
  font-size: 1.35rem;
  font-weight: 800;
  margin: 0 0 1.75rem 0;
  color: ${INK};
  letter-spacing: -0.02em;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
  padding-bottom: 1.75rem;
  border-bottom: 1px solid ${LINE};
  max-height: 320px;
  overflow-y: auto;
`;

const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ItemImage = styled.div`
  width: 60px;
  height: 60px;
  background: #fbfbf9;
  border-radius: 8px;
  flex-shrink: 0;
  overflow: hidden;
  border: 1px solid ${LINE};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  h4 {
    font-size: 0.9rem;
    font-weight: 700;
    color: ${INK};
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    font-size: 0.75rem;
    font-weight: 600;
    color: #666;
    margin: 0;
    text-transform: uppercase;
  }
`;

const ItemPrice = styled.div`
  font-family: ${FONT_HERO};
  font-weight: 800;
  font-size: 0.9rem;
  color: ${INK};
`;

const CostRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.15rem;

  span.label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #666;
  }

  span.val {
    font-size: 0.9rem;
    font-weight: 700;
    color: ${INK};
  }
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  margin-bottom: 2rem;
  padding-top: 1.25rem;
  border-top: 1px solid ${LINE};

  span.label {
    font-family: ${FONT_HERO};
    font-size: 1.25rem;
    font-weight: 800;
    color: ${INK};
  }

  span.val {
    font-family: ${FONT_HERO};
    font-size: 1.6rem;
    font-weight: 800;
    color: ${INK};
  }
`;

const PlaceOrderBtn = styled.button`
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
  box-shadow: 0 4px 14px rgba(37, 60, 90, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: #1b2c42;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(37, 60, 90, 0.35);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const DisclaimerText = styled.p`
  font-size: 0.65rem;
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
  background: white;

  h3 {
    font-family: ${FONT_HERO};
    font-size: 1.75rem;
    color: ${INK};
    margin: 1.5rem 0 0.5rem 0;
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
    padding: 1rem 2.5rem;
    border-radius: 9999px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #1b2c42;
    }
  }
`;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const IS_LOGGED_IN = !!session;
  const [guestItems, setGuestItems] = useState(readGuestCart);

  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    email: session?.user?.email || '',
    phone: '',
    streetAddress: '',
    city: '',
    region: '',
    postalCode: '',
    country: 'Ghana',
  });

  const { data: profileResponse } = useUser({
    enabled: IS_LOGGED_IN,
  });

  useEffect(() => {
    if (profileResponse?.data) {
      const p = profileResponse.data;
      const parts = p.name ? p.name.split(' ') : [];
      setShippingDetails((prev) => ({
        ...prev,
        firstName: prev.firstName || parts[0] || '',
        lastName: prev.lastName || parts.slice(1).join(' ') || '',
        email: prev.email || p.email || '',
        phone: prev.phone || p.phone || '',
        streetAddress: prev.streetAddress || p.street || '',
        city: prev.city || p.city || '',
        region: prev.region || p.region || '',
        postalCode: prev.postalCode || p.zipCode || '',
        country: prev.country || p.country || 'Ghana',
      }));
    }
  }, [profileResponse]);

  const availableCities = shippingDetails.region ? getCitiesForRegion(shippingDetails.region) : [];

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

  const { data: deliveryResponse } = useQuery({
    queryKey: ['deliveryFee', shippingDetails.region, shippingDetails.city],
    queryFn: async () => {
      if (!shippingDetails.region) return { data: { fee: 25.0 } };
      const res = await apiClient.post('/delivery/calculate', {
        region: shippingDetails.region,
        city: shippingDetails.city,
      });
      return res.data;
    },
    enabled: Boolean(shippingDetails.region),
  });

  const subtotal = cartItems.reduce((acc, item) => acc + saleUnitPrice(item.product, sale) * item.quantity, 0);
  const baseShippingCost = deliveryResponse?.fee || 25.0;
  const shippingCost = deliveryMethod === 'standard' ? baseShippingCost : 0.0;
  const taxes = 0.0;
  const total = subtotal + shippingCost + taxes;

  const verifyMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient.post('/payments/verify', payload);
      return res.data;
    },
    onSuccess: (data) => {
      clearGuestCart();
      setGuestItems([]);
      if (data.order) sessionStorage.setItem('buyy-last-order', JSON.stringify(data.order));
      queryClient.invalidateQueries({ queryKey: ['userCart'] });
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
      navigate(`/order-confirmation/${data.orderId}`);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Payment verification failed. Please contact support.');
    },
  });

  const initializeMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient.post('/payments/initialize', payload);
      return res.data;
    },
    onSuccess: (data) => {
      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: data.publicKey || import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: shippingDetails.email,
        amount: Math.round(data.totalAmount * 100),
        ref: data.reference,
        access_code: data.access_code,
        onSuccess: (transaction) => {
          verifyMutation.mutate({
            reference: transaction.reference,
            shippingDetails: {
              name: `${shippingDetails.firstName} ${shippingDetails.lastName}`.trim(),
              email: shippingDetails.email,
              phone: shippingDetails.phone,
              street: shippingDetails.streetAddress,
              city: shippingDetails.city,
              region: shippingDetails.region,
              zipCode: shippingDetails.postalCode,
              country: shippingDetails.country,
            },
            deliveryMethod,
          });
        },
        onCancel: () => {
          alert('Transaction was cancelled.');
        },
      });
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Checkout initialization failed.');
    },
  });

  const isProcessing = initializeMutation.isPending || verifyMutation.isPending;

  const handleInputChange = (e) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert('Your cart is empty.');

    const form = document.getElementById('checkout-form');
    if (form && !form.checkValidity()) {
      form.reportValidity();
      return;
    }

    initializeMutation.mutate({
      deliveryMethod,
      region: shippingDetails.region,
      city: shippingDetails.city,
      email: shippingDetails.email,
      country: shippingDetails.country,
      zip: shippingDetails.postalCode,
      items: IS_LOGGED_IN
        ? undefined
        : cartItems.map((item) => ({
            source: 'buyy',
            productId: item.productId || item.product?.id,
            quantity: item.quantity,
          })),
    });
  };

  if (IS_LOGGED_IN && isLoading) {
    return (
      <PageWrapper>
        <Container>
          <TextStackSkeleton />
        </Container>
      </PageWrapper>
    );
  }

  if (cartItems.length === 0) {
    return (
      <PageWrapper>
        <Container>
          <EmptyCartState>
            <ShoppingBag size={56} strokeWidth={1.5} color={NAVY_ACCENT} />
            <h3>Your Bag is Empty</h3>
            <p>You need items in your footwear bag to checkout.</p>
            <button type="button" onClick={() => navigate('/shop')}>Return to Catalog</button>
          </EmptyCartState>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <PageHeader>
          <span>SECURE CHECKOUT</span>
          <h1>Finalize Your Order</h1>
        </PageHeader>

        <MainContent>
          <FormContainer id="checkout-form" onSubmit={handlePlaceOrder}>
            {/* Step 1: Shipping Details */}
            <Section>
              <SectionHeader>
                <StepNumber>01</StepNumber>
                <SectionTitle>Shipping Details</SectionTitle>
              </SectionHeader>

              <FormGrid>
                <InputGroup>
                  <Label>First Name</Label>
                  <Input required name="firstName" type="text" placeholder="Kwame" onChange={handleInputChange} value={shippingDetails.firstName} />
                </InputGroup>
                <InputGroup>
                  <Label>Last Name</Label>
                  <Input required name="lastName" type="text" placeholder="Mensah" onChange={handleInputChange} value={shippingDetails.lastName} />
                </InputGroup>
                <InputGroup>
                  <Label>Email</Label>
                  <Input required name="email" type="email" placeholder="kwame@example.com" onChange={handleInputChange} value={shippingDetails.email} />
                </InputGroup>
                <InputGroup>
                  <Label>Phone Number</Label>
                  <PhoneWrapper>
                    <PhoneInput
                      defaultCountry="GH"
                      placeholder="+233 24 123 4567"
                      value={shippingDetails.phone}
                      onChange={(val) => setShippingDetails((prev) => ({ ...prev, phone: val }))}
                      required
                    />
                  </PhoneWrapper>
                </InputGroup>
                <FullWidthInput>
                  <InputGroup>
                    <Label>Street Address</Label>
                    <Input required name="streetAddress" type="text" placeholder="e.g. Ring Road Central, House 14" onChange={handleInputChange} value={shippingDetails.streetAddress} />
                  </InputGroup>
                </FullWidthInput>
                <InputGroup>
                  <Label>Region in Ghana</Label>
                  <Select required name="region" onChange={(e) => setShippingDetails((prev) => ({ ...prev, region: e.target.value, city: '' }))} value={shippingDetails.region}>
                    <option value="" disabled>Select a Region</option>
                    {GHANA_REGIONS.map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </Select>
                </InputGroup>
                <InputGroup>
                  <Label>City / Town</Label>
                  <Select required name="city" onChange={handleInputChange} value={shippingDetails.city} disabled={!shippingDetails.region}>
                    <option value="" disabled>Select a City/Town</option>
                    {availableCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </Select>
                </InputGroup>
                <InputGroup>
                  <Label $optional>GhanaPost Digital Address</Label>
                  <Input name="postalCode" type="text" placeholder="e.g. GA-123-4567" onChange={handleInputChange} value={shippingDetails.postalCode} />
                </InputGroup>
                <InputGroup>
                  <Label>Country</Label>
                  <Input required name="country" type="text" placeholder="Ghana" onChange={handleInputChange} value={shippingDetails.country} />
                </InputGroup>
              </FormGrid>
            </Section>

            {/* Step 2: Delivery Method */}
            <Section>
              <SectionHeader>
                <StepNumber>02</StepNumber>
                <SectionTitle>Delivery Preference</SectionTitle>
              </SectionHeader>

              <DeliveryGrid>
                <DeliveryCard
                  $active={deliveryMethod === 'standard'}
                  onClick={() => setDeliveryMethod('standard')}
                >
                  <span className="tag">DOORSTEP COURIER</span>
                  <h3 className="title">Standard Courier</h3>
                  <span className="price"><Currency amount={baseShippingCost} /></span>
                  <div className="icon">
                    {deliveryMethod === 'standard' ? <CheckCircle2 fill={NAVY_ACCENT} color="white" size={24} /> : <Circle size={24} />}
                  </div>
                </DeliveryCard>

                <DeliveryCard
                  $active={deliveryMethod === 'pickup'}
                  onClick={() => setDeliveryMethod('pickup')}
                >
                  <span className="tag">IN-STORE PICKUP</span>
                  <h3 className="title">Store Hub Pickup</h3>
                  <span className="price">Complimentary</span>
                  <div className="icon">
                    {deliveryMethod === 'pickup' ? <CheckCircle2 fill={NAVY_ACCENT} color="white" size={24} /> : <Circle size={24} />}
                  </div>
                </DeliveryCard>
              </DeliveryGrid>
            </Section>

            {/* Step 3: Payment */}
            <Section>
              <SectionHeader>
                <StepNumber>03</StepNumber>
                <SectionTitle>Payment Method</SectionTitle>
              </SectionHeader>

              <PaymentBox>
                <PaymentHeader>
                  <div>
                    <CreditCard size={20} />
                    <span>Paystack Secure Gateway (Mobile Money / Cards)</span>
                  </div>
                  <ShieldCheck size={20} color="#10B981" />
                </PaymentHeader>

                <PaymentBody>
                  Pay seamlessly with MTN Mobile Money, Telecel Cash, AT Money, or Visa / Mastercard. All transactions are 256-bit encrypted and verified through Paystack.
                </PaymentBody>
              </PaymentBox>
            </Section>

            <button type="submit" style={{ display: 'none' }}></button>
          </FormContainer>

          {/* RIGHT: Order Summary */}
          <SummaryWrapper>
            <SummaryCard>
              <SummaryHeader>Order Breakdown</SummaryHeader>

              <ItemList>
                {cartItems.map((item) => {
                  const product = item.product;
                  const imgUrl = product.images?.[0]?.image?.url || '/items/black-loafers/black-loafers-1.png';
                  return (
                    <SummaryItem key={item.id}>
                      <ItemImage>
                        <img src={imgUrl} alt={product.name} />
                      </ItemImage>
                      <ItemDetails>
                        <h4>{product.name}</h4>
                        <p>QTY: {item.quantity}</p>
                      </ItemDetails>
                      <ItemPrice>
                        <Currency amount={saleUnitPrice(product, sale) * item.quantity} />
                      </ItemPrice>
                    </SummaryItem>
                  );
                })}
              </ItemList>

              <div>
                <CostRow>
                  <span className="label">Subtotal</span>
                  <span className="val"><Currency amount={subtotal} /></span>
                </CostRow>
                <CostRow>
                  <span className="label">Ghana Delivery</span>
                  <span className="val"><Currency amount={shippingCost} /></span>
                </CostRow>
                <CostRow>
                  <span className="label">Taxes</span>
                  <span className="val"><Currency amount={taxes} /></span>
                </CostRow>
              </div>

              <TotalRow>
                <span className="label">Total</span>
                <span className="val"><Currency amount={total} /></span>
              </TotalRow>

              <PlaceOrderBtn
                type="button"
                onClick={handlePlaceOrder}
                disabled={isProcessing}
              >
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : null}
                {isProcessing ? 'Processing...' : 'Pay with Paystack'}
              </PlaceOrderBtn>

              <DisclaimerText>
                By placing your order, you agree to GoMode terms of service, warranty, and return policies.
              </DisclaimerText>
            </SummaryCard>
          </SummaryWrapper>
        </MainContent>
      </Container>
    </PageWrapper>
  );
};

export default CheckoutPage;