import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { 
  MoreVertical,
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Activity,
  CheckSquare,
  Truck,
  Loader2,
  PackageX
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import Currency from '../../../utils/Currency'; 
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
const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2.5rem;

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
      margin: 0; 
      letter-spacing: -1.5px;
      line-height: 1.1;
      
      @media (max-width: 768px) { font-size: 2.2rem; }
    }
  }

  div.actions {
    display: flex;
    gap: 1rem;

    @media (max-width: 600px) { width: 100%; }
  }
`;

const OutlineBtn = styled.button`
  background: transparent;
  color: ${INK};
  border: 1px solid ${LINE};
  font-family: ${FONT_HERO};
  padding: 1rem 1.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { border-color: ${NAVY_ACCENT}; color: ${NAVY_ACCENT}; }
  @media (max-width: 600px) { flex: 1; }
`;

const PrimaryBtn = styled.button`
  background: ${NAVY_ACCENT}; 
  color: white;
  border: none;
  font-family: ${FONT_HERO};
  padding: 1rem 1.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(37, 60, 90, 0.25);
  transition: all 0.2s;

  &:hover { opacity: 0.9; transform: translateY(-2px); }
  @media (max-width: 600px) { flex: 1; }
`;

/* --- TOP BANNER (Filters & Fulfillment) --- */
const TopBanner = styled.div`
  display: grid;
  grid-template-columns: 2.5fr 1fr;
  background: white;
  border-radius: 4px;
  border: 1px solid ${LINE};
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  margin-bottom: 2rem;

  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const FilterStatsArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2.5rem;
  flex-wrap: wrap;
  gap: 2rem;

  @media (max-width: 768px) { padding: 1.5rem; flex-direction: column; align-items: flex-start; }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  span.label { font-size: 0.6rem; font-weight: 800; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1.5px;}
  
  div.links {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    
    button {
      background: transparent;
      border: none;
      padding: 0;
      font-size: 0.9rem;
      font-weight: 600;
      color: #9CA3AF;
      cursor: pointer;
      
      &.active { color: ${NAVY_ACCENT}; font-weight: 800; border-bottom: 2px solid ${NAVY_ACCENT}; padding-bottom: 2px;}
      &:hover:not(.active) { color: #111827; }
    }
  }
`;

const RevenueStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: right;

  @media (max-width: 768px) { text-align: left; }

  span.label { font-size: 0.6rem; font-weight: 800; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1.5px;}
  span.val { font-size: 1.5rem; font-weight: 900; color: #111827; letter-spacing: -0.5px;}
`;

const FulfillmentCard = styled.div`
  background: ${NAVY_ACCENT}; 
  color: white;
  padding: 1.5rem 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;

  span.label { font-size: 0.65rem; font-weight: 800; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1.5px; position: relative; z-index: 2;}
  h3 { font-family: ${FONT_HERO}; font-size: 1.8rem; font-weight: 900; margin: 0.25rem 0 0 0; letter-spacing: -0.5px; position: relative; z-index: 2;}

  svg {
    position: absolute;
    right: 1.5rem;
    bottom: 50%;
    transform: translateY(50%);
    width: 80px;
    height: 80px;
    color: rgba(255,255,255,0.1);
    z-index: 1;
  }
`;

/* --- TABLE SECTION --- */
const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  background: white;
  border: 1px solid ${LINE};
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  margin-bottom: 2rem;
  
  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px; 

  th {
    text-align: left;
    padding: 1.5rem 2.5rem;
    color: #9CA3AF;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 3px;
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
  transition: opacity 0.2s;
  &:hover { opacity: 0.8; }
`;

const CustomerCell = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  div.avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #F3F4F6;
    color: #4B5563;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
  }

  div.text {
    display: flex;
    flex-direction: column;
    
    span.name { font-size: 0.95rem; font-weight: 800; color: #111827; }
    span.email { font-size: 0.75rem; color: #9CA3AF; font-weight: 500;}
  }
`;

const DateText = styled.span`
  font-size: 0.9rem;
  color: #6B7280;
  font-weight: 500;
`;

const PriceText = styled.span`
  font-size: 1.05rem;
  font-weight: 900;
  color: #111827;
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

const ActionMenu = styled.button`
  background: transparent;
  border: none;
  color: #9CA3AF;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  
  &:hover { color: #1A1A1A; }
`;

/* --- PAGINATION --- */
const PaginationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2.5rem;
  background: white;
  border-top: 1px solid #F3F4F6;

  @media (max-width: 600px) { flex-direction: column; gap: 1rem; align-items: flex-start;}

  span.label {
    font-size: 0.75rem;
    font-weight: 800;
    color: #9CA3AF;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  div.nav {
    display: flex;
    gap: 0.5rem;

    button {
      width: 32px;
      height: 32px;
      border: 1px solid #E5E7EB;
      background: white;
      color: #6B7280;
      font-size: 0.8rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;

      &:hover { border-color: #1A1A1A; color: #1A1A1A; }
      &.active { background: #1A1A1A; color: white; border-color: #1A1A1A; }
    }
  }
`;

/* --- BOTTOM KPI BARS --- */
const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 1024px) { grid-template-columns: 1fr 1fr; }
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const KPICard = styled.div`
  background: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-left: 3px solid ${props => props.$color || '#E5E7EB'};
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);

  div.text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    span.label { font-size: 0.6rem; font-weight: 800; color: #9CA3AF; text-transform: uppercase; letter-spacing: 2px;}
    span.val { font-size: 1.5rem; font-weight: 900; color: #111827; }
  }

  svg {
    color: ${props => props.$color || '#9CA3AF'};
    margin-bottom: 0.25rem;
  }
`;

const GoalBar = styled.div`
  width: 60px;
  height: 4px;
  background: #E5E7EB;
  border-radius: 4px;
  margin-bottom: 0.5rem;

  div {
    width: ${props => props.$width};
    height: 100%;
    background: #1A1A1A;
    border-radius: 4px;
  }
`;

const EmptyStateContainer = styled.div`
  padding: 4rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  
  p.main { color: #111827; font-weight: 800; font-size: 1.1rem; margin: 0; }
  p.sub { color: #6B7280; font-size: 0.85rem; margin: 0; }
`;

// Helper function to extract initials
const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2);
};

// Helper function to format date cleanly
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const OrdersPage = () => {
  const [filter, setFilter] = useState('ALL');

  // Fetch Orders Dashboard Data
  const { data: response, isLoading } = useQuery({
    queryKey: ['adminOrdersDashboard'],
    queryFn: async () => {
      const res = await apiClient.get('/orders/dashboard');
      return res.data;
    }
  });

  const orders = response?.data || [];
  const metrics = response?.metrics || {
    totalRevenue: 0,
    activeFulfillment: 0,
    avgOrderValue: 0,
    completionRate: '0%',
    weeklyGoal: '0%',
    adminTasks: '0 Due'
  };

  // Client-Side Filtering
  const filteredOrders = useMemo(() => {
    if (filter === 'ALL') return orders;
    return orders.filter(o => {
      if (filter === 'PAID' && (o.status === 'PAID' || o.status === 'DELIVERED')) return true;
      if (filter === 'PENDING' && (o.status === 'PENDING' || o.status === 'PROCESSING' || o.status === 'SHIPPED')) return true;
      if (filter === 'CANCELLED' && o.status === 'CANCELLED') return true;
      return false;
    });
  }, [orders, filter]);

  return (
    <Container>
      
      {/* 1. Header */}
      <HeaderSection>
        <div className="text">
          <span className="overline">MANAGEMENT PORTAL</span>
          <h1>Customer Orders</h1>
        </div>
        <div className="actions">
          <OutlineBtn>EXPORT DATA</OutlineBtn>
          <PrimaryBtn>CREATE NEW</PrimaryBtn>
        </div>
      </HeaderSection>

      {/* 2. Top Banner (Filters & Alert) */}
      <TopBanner>
        <FilterStatsArea>
          
          <FilterGroup>
            <span className="label">FILTER BY STATUS</span>
            <div className="links">
              <button className={filter === 'ALL' ? 'active' : ''} onClick={() => setFilter('ALL')}>All Orders</button>
              <button className={filter === 'PAID' ? 'active' : ''} onClick={() => setFilter('PAID')}>Completed</button>
              <button className={filter === 'PENDING' ? 'active' : ''} onClick={() => setFilter('PENDING')}>Active</button>
              <button className={filter === 'CANCELLED' ? 'active' : ''} onClick={() => setFilter('CANCELLED')}>Cancelled</button>
            </div>
          </FilterGroup>

          <RevenueStat>
            <span className="label">TOTAL REVENUE</span>
            <span className="val"><Currency amount={Number(metrics.totalRevenue)} /></span>
          </RevenueStat>

        </FilterStatsArea>

        <FulfillmentCard>
          <Truck />
          <span className="label">ACTIVE FULFILMENT</span>
          <h3>{metrics.activeFulfillment} Orders Ready</h3>
        </FulfillmentCard>
      </TopBanner>

      {/* 3. Table */}
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>CUSTOMER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>STATUS</th>
              <th style={{width: '60px'}}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '4rem' }}>
                  <Loader2 className="animate-spin" size={32} color="#1A1A1A" style={{ margin: '0 auto' }} />
                  <p style={{ marginTop: '1rem', color: '#6B7280', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px' }}>LOADING ORDERS...</p>
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6">
                   <EmptyStateContainer>
                     <PackageX size={48} color="#D1D5DB" />
                     <p className="main">No Orders Found</p>
                     <p className="sub">There are no orders matching this filter.</p>
                   </EmptyStateContainer>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    {/* Format ID to look like a clean receipt number */}
                    <OrderIdLink to={`/admin/orders/${order.id}`}>
                      {order.orderNumber || `#${order.id.substring(0, 8).toUpperCase()}`}
                    </OrderIdLink>
                  </td>
                  <td>
                    <CustomerCell>
                      <div className="avatar">{getInitials(order.user?.name)}</div>
                      <div className="text">
                        <span className="name">{order.user?.name || 'Guest Checkout'}</span>
                        <span className="email">{order.user?.email || 'N/A'}</span>
                      </div>
                    </CustomerCell>
                  </td>
                  <td><DateText>{formatDate(order.createdAt)}</DateText></td>
                  <td><PriceText><Currency amount={order.totalAmount}/></PriceText></td>
                  <td>
                    <StatusPill $status={order.status}>{order.status}</StatusPill>
                  </td>
                  <td>
                    <ActionMenu>
                      <MoreVertical size={20} strokeWidth={2.5}/>
                    </ActionMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {!isLoading && filteredOrders.length > 0 && (
          <PaginationRow>
            <span className="label">SHOWING {filteredOrders.length} ORDERS</span>
            <div className="nav">
              <button><ChevronLeft size={16}/></button>
              <button className="active">1</button>
              <button><ChevronRight size={16}/></button>
            </div>
          </PaginationRow>
        )}
      </TableContainer>

      {/* 4. Bottom KPIs */}
      <KPIGrid>
        <KPICard $color="#1A1A1A">
          <div className="text">
            <span className="label">WEEKLY GOAL</span>
            <span className="val">{metrics.weeklyGoal}</span>
          </div>
          <GoalBar $width={metrics.weeklyGoal}><div/></GoalBar>
        </KPICard>

        <KPICard $color="#10B981">
          <div className="text">
            <span className="label">COMPLETION RATE</span>
            <span className="val">{metrics.completionRate}</span>
          </div>
          <TrendingUp size={20} strokeWidth={3} />
        </KPICard>

        <KPICard $color="#F59E0B">
          <div className="text">
            <span className="label">AVG. ORDER VALUE</span>
            <span className="val"><Currency amount={Number(metrics.avgOrderValue)} /></span>
          </div>
          <Activity size={20} strokeWidth={3} />
        </KPICard>

        <KPICard $color="#1A1A1A">
          <div className="text">
            <span className="label">ADMIN TASKS</span>
            <span className="val">{metrics.adminTasks}</span>
          </div>
          <CheckSquare size={20} strokeWidth={3} />
        </KPICard>
      </KPIGrid>

    </Container>
  );
};

export default OrdersPage;