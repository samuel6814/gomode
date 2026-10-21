import React from 'react';
import styled from 'styled-components';
import { 
  Printer, 
  XCircle, 
  Trash2, 
  RefreshCcw, 
  CheckCircle2, 
  CreditCard,
  Edit2,
  Mail,
  Phone,
  ArrowLeft,
  Loader2,
  Package
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import Currency from '../../../utils/Currency'; 
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { CANVAS, NAVY_ACCENT, INK, LINE, FONT_HERO } from '../../../theme/brand';

// --- Styled Components ---

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box; 
  padding: 2.5rem 3rem;
  background: ${CANVAS};
  min-height: 100vh;

  @media (max-width: 1024px) { padding: 2rem; }
  @media (max-width: 768px) { padding: 1.5rem; }
`;

/* --- HEADER SECTION --- */
const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: #6B7280;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1.5rem;
  transition: color 0.2s;
  width: fit-content;
  
  &:hover { color: ${NAVY_ACCENT}; }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1.5rem;

  div.text {
    span.overline {
      font-size: 0.65rem;
      font-weight: 800;
      color: ${NAVY_ACCENT};
      text-transform: uppercase;
      letter-spacing: 2px;
      display: block;
      margin-bottom: 0.5rem;
    }

    h1 {
      font-family: ${FONT_HERO};
      font-size: 3rem;
      font-weight: 900;
      color: ${INK};
      margin: 0 0 0.5rem 0;
      letter-spacing: -1px;
      
      @media (max-width: 768px) { font-size: 2.2rem; }
    }
    
    p {
      font-size: 0.95rem;
      color: #6B7280;
      margin: 0;
    }
  }

  div.actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    @media (max-width: 600px) { width: 100%; }
  }
`;

const SecondaryBtn = styled.button`
  background: transparent;
  color: ${INK};
  border: 1px solid ${LINE};
  font-family: ${FONT_HERO};
  padding: 0.85rem 1.5rem;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover { border-color: ${NAVY_ACCENT}; color: ${NAVY_ACCENT}; background: #F9FAFB; }
  @media (max-width: 600px) { flex: 1; }
`;

const DangerBtn = styled.button`
  background: white;
  color: #EF4444;
  border: 1px solid #FECACA;
  font-family: ${FONT_HERO};
  padding: 0.85rem 1.5rem;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover { background: ${props => props.disabled ? 'white' : '#FEF2F2'}; }
  @media (max-width: 600px) { flex: 1; }
`;

const PrimaryBtn = styled.button`
  background: ${NAVY_ACCENT};
  color: white;
  border: none;
  font-family: ${FONT_HERO};
  padding: 0.85rem 1.5rem;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(37, 60, 90, 0.25);

  &:hover { opacity: 0.9; transform: translateY(-2px); }
  @media (max-width: 600px) { flex: 1; }
`;

/* --- MAIN GRID --- */
const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr; 
  gap: 2.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem; 
`;

/* --- CARDS --- */
const Card = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid ${LINE};
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);

  @media (max-width: 600px) { padding: 1.5rem; }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.$noMargin ? '0' : '2rem'};

  h3 {
    font-family: ${FONT_HERO};
    font-size: 0.8rem;
    font-weight: 800;
    color: ${INK};
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  span.sub {
    font-size: 0.65rem;
    font-weight: 600;
    color: #9CA3AF;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

/* --- STATUS CARD (BLUE) --- */
const StatusCard = styled.div`
  background: ${NAVY_ACCENT};
  border-radius: 12px;
  padding: 2.5rem;
  color: white;
  box-shadow: 0 10px 30px rgba(37, 60, 90, 0.2);
  display: flex;
  flex-direction: column;

  @media (max-width: 600px) { padding: 1.5rem; }

  span.label {
    font-size: 0.65rem;
    font-weight: 800;
    color: rgba(255,255,255,0.7);
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-bottom: 1.5rem;
  }

  div.status-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    h2 {
      font-family: ${FONT_HERO};
      font-size: 2rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: 0.5px;
    }
  }
`;

const StatusSelect = styled.select`
  width: 100%;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  outline: none;
  appearance: none;
  text-align: center;
  transition: background 0.2s;

  &:hover { background: rgba(255,255,255,0.25); }
  option { color: #111827; background: white; }
`;

/* --- ITEMS TABLE --- */
const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemHeader = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${LINE};
  margin-bottom: 1.5rem;
  
  span {
    color: #9CA3AF;
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    &:not(:first-child) { text-align: right; }
  }
`;

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr;
  align-items: center;
  padding-bottom: 2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${LINE};
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  div.product-info {
    display: flex;
    gap: 1.5rem;
    align-items: center;
    
    div.icon-placeholder {
      width: 56px;
      height: 72px;
      border-radius: 4px;
      background: #F3F4F6;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9CA3AF;
    }
    
    div {
      h4 { font-family: ${FONT_HERO}; font-size: 1rem; font-weight: 800; color: #111827; margin: 0 0 0.4rem 0; letter-spacing: -0.5px;}
      p { font-size: 0.65rem; font-weight: 800; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; margin: 0;}
    }
  }

  span.price { text-align: right; font-weight: 600; font-size: 0.95rem; color: #6B7280;}
  span.qty { text-align: right; font-weight: 600; font-size: 0.95rem; color: #111827;}
  span.total { text-align: right; font-weight: 800; font-size: 1rem; color: #111827; }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    span.price, span.qty, span.total { text-align: left; }
  }
`;

/* --- TIMELINE --- */
const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
`;

const TimelineItem = styled.div`
  display: flex;
  gap: 2rem;
  position: relative;
  padding-bottom: 2.5rem;
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 4px; 
    top: 14px;
    bottom: -6px; 
    width: 1px;
    background: #E5E7EB;
  }

  &:last-child { padding-bottom: 0; }
`;

const TimelineDot = styled.div`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${props => props.$active ? '#1A1A1A' : '#D1D5DB'};
  margin-top: 6px;
  z-index: 2;
  flex-shrink: 0;
  box-shadow: ${props => props.$active ? '0 0 0 4px rgba(75, 118, 252, 0.1)' : 'none'};
`;

const TimelineContent = styled.div`
  h4 { 
    font-family: 'Times New Roman', Times, serif; 
    font-size: 1.1rem; 
    font-weight: 800; 
    color: ${props => props.$active ? '#111827' : '#4B5563'}; 
    margin: 0 0 0.4rem 0; 
  }
  p { 
    font-size: 0.65rem; 
    font-weight: 800;
    color: #9CA3AF; 
    margin: 0; 
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

/* --- RIGHT COLUMN CARDS --- */
const CustomerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;

  div.avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #F4F1EB;
    color: #1A1A1A;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1.25rem;
    text-transform: uppercase;
  }

  div.details {
    h4 { font-family: 'Times New Roman', Times, serif; font-size: 1.4rem; font-weight: 800; color: #111827; margin: 0 0 0.25rem 0; letter-spacing: -0.5px;}
    p { font-size: 0.65rem; font-weight: 800; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; margin: 0;}
  }
`;

const ContactRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: #4B5563;

  svg { color: #9CA3AF; }
`;

const AddressBlock = styled.div`
  font-family: 'Times New Roman', Times, serif;
  font-size: 1.1rem;
  font-style: italic;
  color: #374151;
  line-height: 1.8;
  margin-bottom: 2rem;
`;

const VerificationBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.65rem;
  font-weight: 800;
  color: #1A1A1A;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

/* --- BILLING SUMMARY --- */
const BillRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  
  span.label { font-size: 0.85rem; color: #6B7280; }
  span.val { font-size: 0.95rem; font-weight: 600; color: #111827; }
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2.5rem;
  margin-bottom: 2.5rem;
  padding-top: 1rem;
  
  h4 { font-size: 0.75rem; font-weight: 800; color: #111827; text-transform: uppercase; letter-spacing: 2px; margin: 0;}
  span.total { font-family: 'Times New Roman', Times, serif; font-size: 1.75rem; font-weight: 800; color: #1A1A1A; }
`;

const PaymentMethodBox = styled.div`
  background: #FAFAFA;
  padding: 1.25rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid #F3F4F6;

  div.icon { color: #9CA3AF; }
  
  div.details {
    p { font-size: 0.6rem; font-weight: 800; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 0.25rem 0;}
    h5 { font-size: 0.85rem; font-weight: 800; color: #111827; margin: 0; }
  }
`;

const FullScreenLoader = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #FAFAFA;
  color: #1A1A1A;
  gap: 1rem;
  
  p { color: #6B7280; font-size: 0.75rem; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; }
`;

// Helper function to extract initials
const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2);
};

// Helper function to format date cleanly
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
};


const OrdersDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  // 1. Fetch Single Order Details
  const { data: response, isLoading } = useQuery({
    queryKey: ['adminOrder', id],
    queryFn: async () => {
      const res = await apiClient.get(`/orders/${id}`);
      return res.data;
    }
  });

  const order = response?.data;

  // 2. Status Update Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus) => {
      const res = await apiClient.put(`/orders/${id}/status`, { status: newStatus });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminOrder', id]);
      queryClient.invalidateQueries(['adminOrdersDashboard']); // Refresh main table stats
    }
  });

  // 3. Delete Order Mutation (Archiving)
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (window.confirm("Are you sure you want to remove this order from the dashboard?")) {
        const res = await apiClient.delete(`/orders/${id}`);
        return res.data;
      }
      return Promise.reject(new Error('User Cancelled'));
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminOrdersDashboard']);
      navigate('/admin/orders');
    }
  });

  const handleStatusChange = (e) => {
    updateStatusMutation.mutate(e.target.value);
  };

  // 4. Update Address Mutation
  const updateAddressMutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.put(`/orders/${id}/address`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminOrder', id]);
      setIsEditingAddress(false);
    }
  });

  const onAddressSubmit = (data) => {
    updateAddressMutation.mutate(data);
  };

  if (isLoading || !order) {
    return (
      <div style={{padding: '2rem', width: '100%'}}><Skeleton count={1} height={200} borderRadius={12} style={{marginBottom: '2rem'}}/><Skeleton count={3} height={40} style={{marginBottom: '1rem'}}/></div>
    );
  }

  // Fallbacks for data structures
  const address = order.shippingAddress || {};
  const customerName = address.name || order.user?.name || 'Guest Checkout';
  const customerEmail = address.email || order.user?.email || 'N/A';

  // Dynamic Timeline Generation
  const timeline = [
    { status: order.status, time: 'CURRENT STATUS', system: 'SYSTEM', active: true },
    { status: 'Order Placed', time: formatDateTime(order.createdAt), system: customerName.toUpperCase(), active: false }
  ];

  return (
    <Container>
      
      {/* 1. Back Button */}
      <BackButton onClick={() => navigate('/admin/orders')}>
        <ArrowLeft size={18} /> Back to Orders
      </BackButton>
      
      {/* 2. Header */}
      <HeaderSection>
        <div className="text">
          <span className="overline">SALES & LOGISTICS</span>
          <h1>ORDER {order.orderNumber || `#${order.id.substring(0, 8).toUpperCase()}`}</h1>
          <p>Order placed on {formatDateTime(order.createdAt)}</p>
        </div>
        <div className="actions">
          <SecondaryBtn onClick={() => window.print()}>
            <Printer size={14} /> PRINT INVOICE
          </SecondaryBtn>
          
          {order.status !== 'CANCELLED' && (
            <SecondaryBtn onClick={() => updateStatusMutation.mutate('CANCELLED')} style={{color: '#D97706', borderColor: '#FDE68A'}}>
              <XCircle size={14} /> CANCEL ORDER
            </SecondaryBtn>
          )}

          <DangerBtn onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} 
            DELETE ORDER
          </DangerBtn>
        </div>
      </HeaderSection>

      {/* 3. Main Grid */}
      <MainGrid>
        
        {/* LEFT COLUMN */}
        <Column>
          
          {/* Order Items */}
          <Card>
            <SectionHeader>
              <h3>ORDER ITEMS</h3>
              <span className="sub">{order.items?.length || 0} ITEMS TOTAL</span>
            </SectionHeader>
            
            <ItemsList>
              <ItemHeader>
                <span>PRODUCT</span>
                <span>PRICE</span>
                <span>QTY</span>
                <span>TOTAL</span>
              </ItemHeader>
              
              {order.items?.map(item => {
                // 🚨 Extracting the nested product image!
                const itemImage = item.product?.images?.[0]?.image?.url;

                return (
                  <ItemRow key={item.id}>
                    <div className="product-info">
                      {itemImage ? (
                        <img 
                          src={itemImage} 
                          alt={item.productName} 
                          style={{ width: '56px', height: '72px', borderRadius: '4px', objectFit: 'cover', background: '#F9FAFB' }} 
                        />
                      ) : (
                        <div className="icon-placeholder"><Package size={24} /></div>
                      )}
                      <div>
                        <h4>{item.productName}</h4>
                        <p>{item.attributes || 'N/A'}</p>
                      </div>
                    </div>
                    <span className="price"><Currency amount={item.price} /></span>
                    <span className="qty">{item.quantity.toString().padStart(2, '0')}</span>
                    <span className="total"><Currency amount={item.price * item.quantity} /></span>
                  </ItemRow>
                );
              })}
            </ItemsList>
          </Card>

          {/* Timeline / History */}
          <Card>
            <SectionHeader>
              <h3>TIMELINE / HISTORY</h3>
            </SectionHeader>
            
            <Timeline>
              {timeline.map((event, i) => (
                <TimelineItem key={i}>
                  <TimelineDot $active={event.active} />
                  <TimelineContent $active={event.active}>
                    <h4>{event.status}</h4>
                    <p>{event.time} • {event.system}</p>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Card>

        </Column>

        {/* RIGHT COLUMN */}
        <Column>
          
          {/* Status Card (Blue) */}
          <StatusCard>
            <span className="label">ORDER STATUS</span>
            <div className="status-row">
              <h2>{order.status}</h2>
              {updateStatusMutation.isPending ? (
                 <Loader2 size={24} className="animate-spin" />
              ) : (
                 <RefreshCcw size={24} />
              )}
            </div>
            
            {/* Native Select disguised as a button! */}
            <StatusSelect value={order.status} onChange={handleStatusChange} disabled={updateStatusMutation.isPending}>
              <option value="PENDING">Mark as PENDING</option>
              <option value="PROCESSING">Mark as PROCESSING</option>
              <option value="SHIPPED">Mark as SHIPPED</option>
              <option value="DELIVERED">Mark as DELIVERED</option>
              <option value="CANCELLED">Mark as CANCELLED</option>
            </StatusSelect>
          </StatusCard>

          {/* Customer Info */}
          <Card>
            <SectionHeader>
              <h3>CUSTOMER INFO</h3>
            </SectionHeader>
            
            <CustomerInfo>
              <div className="avatar">{getInitials(customerName)}</div>
              <div className="details">
                <h4>{customerName}</h4>
                <p>{address.city || 'Unknown Location'}, {address.country || 'Unknown'}</p>
              </div>
            </CustomerInfo>
            
            <ContactRow>
              <Mail size={16} /> {customerEmail}
            </ContactRow>
            {address.phone && (
              <ContactRow>
                <Phone size={16} /> {address.phone}
              </ContactRow>
            )}
          </Card>

          {/* Shipping Address */}
          <Card>
            <SectionHeader>
              <h3>SHIPPING ADDRESS</h3>
              <button 
                onClick={() => { 
                  setIsEditingAddress(!isEditingAddress); 
                  if(!isEditingAddress) reset(address); 
                }} 
                style={{background:'transparent', border:'none', cursor:'pointer', color:'#9CA3AF'}}
              >
                <Edit2 size={16} />
              </button>
            </SectionHeader>
            
            {isEditingAddress ? (
              <form onSubmit={handleSubmit(onAddressSubmit)} style={{display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: "'Times New Roman', Times, serif", fontSize: '1.1rem', fontStyle: 'italic', color: '#374151'}}>
                <input {...register('name')} placeholder="Name" style={{padding: '0.5rem', border: '1px solid #E5E7EB', borderRadius: '4px', outline: 'none', width: '100%'}} />
                <input {...register('street')} placeholder="Street" style={{padding: '0.5rem', border: '1px solid #E5E7EB', borderRadius: '4px', outline: 'none', width: '100%'}} />
                <div style={{display:'flex', gap:'0.5rem'}}>
                  <input {...register('city')} placeholder="City" style={{padding: '0.5rem', flex: 1, border: '1px solid #E5E7EB', borderRadius: '4px', outline: 'none'}} />
                  <input {...register('region')} placeholder="Region" style={{padding: '0.5rem', flex: 1, border: '1px solid #E5E7EB', borderRadius: '4px', outline: 'none'}} />
                </div>
                <div style={{display:'flex', gap:'0.5rem'}}>
                  <input {...register('zipCode')} placeholder="Zip Code" style={{padding: '0.5rem', flex: 1, border: '1px solid #E5E7EB', borderRadius: '4px', outline: 'none'}} />
                  <input {...register('country')} placeholder="Country" style={{padding: '0.5rem', flex: 1, border: '1px solid #E5E7EB', borderRadius: '4px', outline: 'none'}} />
                </div>
                <div style={{display:'flex', gap:'0.5rem', marginTop: '1rem'}}>
                  <SecondaryBtn type="button" onClick={() => setIsEditingAddress(false)}>CANCEL</SecondaryBtn>
                  <PrimaryBtn type="submit" disabled={updateAddressMutation.isPending}>{updateAddressMutation.isPending ? 'SAVING...' : 'SAVE'}</PrimaryBtn>
                </div>
              </form>
            ) : (
              <AddressBlock>
                {address.name ? (
                  <>
                    <div>{address.name}</div>
                    <div>{address.street}</div>
                    <div>{address.city}, {address.region} {address.zipCode}</div>
                    <div>{address.country}</div>
                  </>
                ) : (
                  <div style={{color: '#9CA3AF', fontStyle: 'normal', fontSize: '0.9rem'}}>No shipping address provided.</div>
                )}
              </AddressBlock>
            )}
            
            {(!isEditingAddress && address.street) && (
              <VerificationBadge>
                <CheckCircle2 size={16} /> ADDRESS VERIFIED
              </VerificationBadge>
            )}
          </Card>

          {/* Billing Summary */}
          <Card>
            <SectionHeader>
              <h3>BILLING SUMMARY</h3>
            </SectionHeader>
            
            <BillRow>
              <span className="label">Subtotal</span>
              <span className="val"><Currency amount={order.totalAmount} /></span>
            </BillRow>
            <BillRow>
              <span className="label">Shipping (Standard)</span>
              <span className="val"><Currency amount={0} /></span>
            </BillRow>

            <TotalRow>
              <h4>TOTAL AMOUNT</h4>
              <span className="total"><Currency amount={order.totalAmount} /></span>
            </TotalRow>

            <PaymentMethodBox>
              <div className="icon"><CreditCard size={24} /></div>
              <div className="details">
                <p>SECURE CHECKOUT</p>
                <h5>System Verified</h5>
              </div>
            </PaymentMethodBox>
          </Card>

        </Column>
      </MainGrid>

    </Container>
  );
};

export default OrdersDetailPage;