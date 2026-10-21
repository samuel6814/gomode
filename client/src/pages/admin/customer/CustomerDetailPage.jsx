import React from 'react';
import styled from 'styled-components';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  ShoppingBag, 
  Award,
  TrendingUp,
  Clock,
  Loader2,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import Currency from '../../../utils/Currency'; 
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
  margin-bottom: 2rem;
  transition: color 0.2s;
  width: fit-content;
  
  &:hover { color: ${NAVY_ACCENT}; }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1.5rem;

  div.title {
    span {
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
      font-weight: 800;
      color: ${INK};
      margin: 0;
      letter-spacing: -1px;
    }
  }

  div.actions {
    display: flex;
    gap: 1rem;
    
    button {
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
      gap: 0.5rem;
      transition: all 0.2s;
    }

    button.outline {
      background: transparent;
      border: 1px solid ${LINE};
      color: ${INK};
      &:hover { border-color: ${NAVY_ACCENT}; color: ${NAVY_ACCENT}; background: white; }
    }

    button.danger {
      background: #FEF2F2;
      border: 1px solid #FECACA;
      color: #EF4444;
      &:hover { background: #FEE2E2; }
    }
  }
`;

const MainLayout = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2.5rem;
  align-items: flex-start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

/* --- LEFT SIDEBAR (PROFILE) --- */
const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid ${LINE};
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  img.avatar {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    margin-bottom: 1.5rem;
    border: 4px solid #F5F3EF;
  }

  h2 {
    font-family: ${FONT_HERO};
    font-size: 1.8rem;
    font-weight: 800;
    color: ${INK};
    margin: 0 0 0.5rem 0;
  }

  span.tier {
    font-size: 0.65rem;
    font-weight: 800;
    color: ${NAVY_ACCENT};
    background: #F5F3EF;
    padding: 0.4rem 1rem;
    border-radius: 50px;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 2rem;
  }

  div.contact-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    text-align: left;
    padding-top: 1.5rem;
    border-top: 1px solid ${LINE};

    div.row {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.85rem;
      color: #4B5563;
      
      svg { color: #9CA3AF; flex-shrink: 0; }
    }
  }
`;

const InfoCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid ${LINE};
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);

  h3 {
    font-family: ${FONT_HERO};
    font-size: 0.75rem;
    font-weight: 800;
    color: ${INK};
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0 0 1.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg { color: #9CA3AF; }
  }

  div.content {
    font-size: 0.9rem;
    color: #4B5563;
    line-height: 1.6;

    p { margin: 0 0 0.5rem 0; }
    strong { color: #111827; }
  }
`;

/* --- RIGHT MAIN CONTENT --- */
const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const KPICard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid ${LINE};
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  span.label {
    font-size: 0.65rem;
    font-weight: 800;
    color: #9CA3AF;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 0.5rem;
    z-index: 2;
  }

  h4 {
    font-family: ${FONT_HERO};
    font-size: 1.8rem;
    font-weight: 800;
    color: #111827;
    margin: 0;
    z-index: 2;
  }

  svg.bg-icon {
    position: absolute;
    right: -10px;
    bottom: -10px;
    width: 80px;
    height: 80px;
    color: #F3F4F6;
    z-index: 1;
    transform: rotate(-15deg);
  }

  ${props => props.$highlight && `
    background: ${NAVY_ACCENT};
    span.label { color: rgba(255,255,255,0.7); }
    h4 { color: white; }
    svg.bg-icon { color: rgba(255,255,255,0.1); }
  `}
`;

const TableCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid ${LINE};
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  overflow: hidden;

  div.header {
    padding: 2rem 2.5rem;
    border-bottom: 1px solid ${LINE};
    
    h3 {
      font-family: ${FONT_HERO};
      font-size: 0.85rem;
      font-weight: 800;
      color: ${INK};
      text-transform: uppercase;
      letter-spacing: 2px;
      margin: 0;
    }
  }
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 700px; 

  th {
    text-align: left;
    padding: 1.5rem 2.5rem;
    color: #9CA3AF;
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 3px;
    background: #FAFAFA;
    border-bottom: 1px solid ${LINE};
  }

  td {
    padding: 1.5rem 2.5rem;
    border-bottom: 1px solid ${LINE};
    vertical-align: middle;
  }

  tr:last-child td { border-bottom: none; }
  tr:hover { background-color: #FAFAFA; }
`;

const OrderIdLink = styled(Link)`
  font-family: ${FONT_HERO};
  font-size: 0.95rem;
  font-weight: 800;
  color: ${NAVY_ACCENT};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: opacity 0.2s;
  &:hover { opacity: 0.8; }
`;

const StatusPill = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;

  ${props => {
    switch (props.$status) {
      case 'DELIVERED': 
      case 'PAID': 
        return `background: #ECFDF5; color: #10B981;`;
      case 'PROCESSING':
      case 'SHIPPED':
      case 'PENDING': 
        return `background: #FFFBEB; color: #D97706;`;
      case 'CANCELLED': 
        return `background: #FEF2F2; color: #EF4444;`;
      default: 
        return `background: #F3F4F6; color: #6B7280;`;
    }
  }}
`;

const FullScreenLoader = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #F8F9FA;
  color: #1A1A1A;
  gap: 1rem;
  p { color: #6B7280; font-size: 0.75rem; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; }
`;

// Helper: Format Dates cleanly
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
};

const CustomerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch Single Customer Data
  const { data: response, isLoading } = useQuery({
    queryKey: ['adminCustomer', id],
    queryFn: async () => {
      const res = await apiClient.get(`/admin/customers/${id}`);
      return res.data;
    }
  });

  const customer = response?.data;

  if (isLoading || !customer) {
    return (
      <div style={{padding: '2rem', width: '100%'}}><Skeleton count={1} height={200} borderRadius={12} style={{marginBottom: '2rem'}}/><Skeleton count={3} height={40} style={{marginBottom: '1rem'}}/></div>
    );
  }

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=ffffff&color=111827&font-size=0.35&bold=true`;

  return (
    <Container>
      
      <BackButton onClick={() => navigate('/admin/customers')}>
        <ArrowLeft size={18} /> Back to Registry
      </BackButton>

      <Header>
        <div className="title">
          <span>CLIENT DOSSIER</span>
          <h1>{customer.name}</h1>
        </div>
        <div className="actions">
          <button className="outline"><Mail size={16}/> Email Client</button>
          <button className="danger"><ShieldAlert size={16}/> Suspend Account</button>
        </div>
      </Header>

      <MainLayout>
        
        {/* LEFT SIDEBAR */}
        <Sidebar>
          
          <ProfileCard>
            <img src={avatarUrl} alt={customer.name} className="avatar" />
            <h2>{customer.name}</h2>
            <span className="tier">{customer.status}</span>

            <div className="contact-info">
              <div className="row"><Mail size={16}/> {customer.email}</div>
              <div className="row"><Phone size={16}/> {customer.telephone}</div>
              <div className="row"><Clock size={16}/> Member since {formatDate(customer.memberSince)}</div>
            </div>
          </ProfileCard>

          <InfoCard>
            <h3><MapPin size={16}/> Primary Address</h3>
            <div className="content">
              {customer.shippingAddress ? (
                <>
                  <p>{customer.shippingAddress.street}</p>
                  <p>{customer.shippingAddress.city}, {customer.shippingAddress.region}</p>
                  <p>{customer.shippingAddress.country}</p>
                </>
              ) : (
                <p style={{fontStyle: 'italic', color: '#9CA3AF'}}>No address on file.</p>
              )}
            </div>
          </InfoCard>

          <InfoCard>
            <h3><CreditCard size={16}/> Saved Payments</h3>
            <div className="content">
              {customer.paymentMethods?.map((pm, i) => (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem'}}>
                  <div style={{background: '#F3F4F6', padding: '0.3rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800}}>{pm.brand}</div>
                  <span>•••• {pm.last4}</span>
                </div>
              ))}
              {(!customer.paymentMethods || customer.paymentMethods.length === 0) && (
                <p style={{fontStyle: 'italic', color: '#9CA3AF'}}>No saved payment methods.</p>
              )}
            </div>
          </InfoCard>

        </Sidebar>

        {/* RIGHT CONTENT AREA */}
        <ContentArea>
          
          <KPIGrid>
            <KPICard $highlight>
              <span className="label">LIFETIME SPEND</span>
              <h4><Currency amount={Number(customer.totalSpend)} /></h4>
              <Award className="bg-icon" />
            </KPICard>
            <KPICard>
              <span className="label">AVERAGE ORDER</span>
              <h4><Currency amount={Number(customer.avgOrder)} /></h4>
              <TrendingUp className="bg-icon" />
            </KPICard>
            <KPICard>
              <span className="label">TOTAL ORDERS</span>
              <h4>{customer.orderHistory?.length || 0}</h4>
              <ShoppingBag className="bg-icon" />
            </KPICard>
          </KPIGrid>

          <TableCard>
            <div className="header">
              <h3>ORDER HISTORY</h3>
            </div>
            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>DATE</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.orderHistory?.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{textAlign: 'center', padding: '3rem', color: '#9CA3AF', fontStyle: 'italic'}}>
                        No order history available.
                      </td>
                    </tr>
                  ) : (
                    customer.orderHistory?.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <OrderIdLink to={`/admin/orders/${order.id}`}>
                            #{order.id.substring(0, 8).toUpperCase()}
                            <ExternalLink size={14} />
                          </OrderIdLink>
                        </td>
                        <td>
                          <span style={{color: '#6B7280', fontSize: '0.9rem', fontWeight: 500}}>
                            {formatDate(order.createdAt)}
                          </span>
                        </td>
                        <td>
                          <span style={{color: '#111827', fontSize: '1.05rem', fontWeight: 800}}>
                            <Currency amount={order.totalAmount} />
                          </span>
                        </td>
                        <td>
                          <StatusPill $status={order.status}>{order.status}</StatusPill>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </TableContainer>
          </TableCard>

        </ContentArea>

      </MainLayout>

    </Container>
  );
};

export default CustomerDetailPage;