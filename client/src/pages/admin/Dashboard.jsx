import React from 'react';
import styled from 'styled-components';
import { 
  ShoppingBag, 
  UserPlus, 
  Package, 
  Truck,
  TrendingUp,
  Loader2,
  Activity
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/axios';
import Currency from '../../utils/Currency';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { CANVAS, NAVY_ACCENT, INK, LINE, FONT_HERO } from '../../theme/brand';

// --- Styled Components ---
const DashboardContainer = styled.div`
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

const Header = styled.h1`
  font-family: ${FONT_HERO};
  font-size: 2.2rem;
  font-weight: 800;
  color: ${INK};
  letter-spacing: -0.5px;
  margin: 0 0 2rem 0;

  @media (max-width: 768px) { font-size: 1.8rem; margin-bottom: 1.5rem; }
`;

/* --- TOP STATS GRID --- */
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2.5rem;

  @media (max-width: 1024px) { grid-template-columns: 1fr 1fr; }
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const StatCard = styled.div`
  background: ${props => props.$blue ? NAVY_ACCENT : 'white'};
  border-radius: 16px;
  border: 1px solid ${LINE};
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 180px;

  color: ${props => props.$blue ? 'white' : INK};
`;

const StatLabel = styled.span`
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: ${props => props.$blue ? 'rgba(255,255,255,0.8)' : '#9CA3AF'};
  margin-bottom: 0.5rem;
  display: block;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -1px;
  color: ${props => props.$blue ? 'white' : '#1A1A1A'};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;

  span.sub {
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #9CA3AF;
  }
`;

const TrendIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 800;
  color: #10B981; 
  
  svg { width: 14px; height: 14px; }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #E5E7EB;
  border-radius: 50px;
  overflow: hidden;
  margin-top: auto;

  div {
    height: 100%;
    width: ${props => props.$width || '0%'};
    background: ${NAVY_ACCENT};
    border-radius: 50px;
    transition: width 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
`;

const AvatarGroup = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid ${NAVY_ACCENT};
    margin-left: -10px;
    object-fit: cover;
    background: white;
    &:first-child { margin-left: 0; }
  }

  .more {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid ${NAVY_ACCENT};
    background: rgba(255,255,255,0.2);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.6rem;
    font-weight: 800;
    margin-left: -10px;
    backdrop-filter: blur(4px);
  }
`;

/* --- BOTTOM SPLIT SECTION --- */
const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.5rem;

  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const ContentCard = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid ${LINE};
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);

  @media (max-width: 768px) { padding: 1.5rem; }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;

  h3 {
    font-family: ${FONT_HERO};
    font-size: 1rem;
    font-weight: 800;
    color: ${INK};
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  a {
    color: ${NAVY_ACCENT};
    font-family: ${FONT_HERO};
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-decoration: none;
    border-bottom: 1.5px solid ${NAVY_ACCENT};
    padding-bottom: 2px;
    &:hover { opacity: 0.8; }
  }
`;

/* --- ACTIVITY LIST --- */
const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;

  @media (max-width: 480px) { gap: 1rem; }
`;

const IconBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #F5F3EF;
  color: ${NAVY_ACCENT};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ActivityDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  h4 {
    font-size: 0.9rem;
    font-weight: 600;
    color: ${INK};
    margin: 0;
    line-height: 1.4;

    span.blue { color: ${NAVY_ACCENT}; font-weight: 800; }
  }

  p {
    font-size: 0.65rem;
    font-weight: 800;
    color: #9CA3AF;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.2rem;
  }
`;

const StatusPill = styled.span`
  padding: 0.4rem 0.8rem;
  border-radius: 50px;
  font-size: 0.6rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  flex-shrink: 0;

  ${props => {
    if (props.$type === 'PAID' || props.$type === 'DELIVERED') return `background: #ECFDF5; color: #10B981;`;
    if (props.$type === 'PROCESSING' || props.$type === 'SHIPPED') return `background: #FFFBEB; color: #D97706;`;
    if (props.$type === 'CANCELLED') return `background: #FEF2F2; color: #EF4444;`;
    return `background: #F3F4F6; color: #6B7280;`;
  }}
`;

/* --- CATEGORIES LIST --- */
const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    span.name {
      font-size: 0.7rem;
      font-weight: 800;
      color: #111827;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    span.pct {
      font-size: 0.8rem;
      font-weight: 800;
      color: #111827;
    }
  }
`;

const CategoryBar = styled.div`
  width: 100%;
  height: 4px;
  background: #F3F4F6;
  border-radius: 50px;
  overflow: hidden;

  div {
    height: 100%;
    width: ${props => props.$width || '0%'};
    background: ${NAVY_ACCENT};
    border-radius: 50px;
    transition: width 1s ease-out;
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

// Helper: Convert timestamp to "X AGO"
const timeAgo = (dateInput) => {
  const date = new Date(dateInput);
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " DAYS AGO";
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " HOURS AGO";
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " MINUTES AGO";
  
  return "JUST NOW";
};

const Dashboard = () => {

  // Fetch Dashboard Analytics
  const { data: response, isLoading } = useQuery({
    queryKey: ['adminDashboardSummary'],
    queryFn: async () => {
      // Ensure your route prefix in server.js points to this exactly!
      const res = await apiClient.get('/admin/analytics/summary'); 
      return res.data;
    },
    // Refresh the dashboard every 30 seconds automatically so it acts like a live command center
    refetchInterval: 30000 
  });

  const analytics = response?.data;

  // Real-time WebSocket connection
  useEffect(() => {
    // We now rely on the Vercel/Vite proxy to route /socket.io correctly to the backend!
    // By connecting to '/', we ensure there are NO cross-domain CORS errors.
    const socket = io('/', { 
      path: '/socket.io/', 
      transports: ['polling', 'websocket'], // Vercel supports polling, Render supports WebSockets.
    });

    socket.on('connect', () => {
      console.log('Admin Dashboard connected to real-time events');
    });

    socket.on('admin_notification', (data) => {
      if (data.type === 'NEW_ORDER') {
        toast.success(data.message, {
          duration: 6000,
          position: 'top-right',
          style: { background: '#111827', color: '#fff', fontSize: '0.85rem' },
          iconTheme: { primary: '#1A1A1A', secondary: '#fff' }
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (isLoading || !analytics) {
    return (
      <div style={{padding: '2rem', width: '100%'}}><Skeleton count={1} height={200} borderRadius={12} style={{marginBottom: '2rem'}}/><Skeleton count={3} height={40} style={{marginBottom: '1rem'}}/></div>
    );
  }

  // Calculate dynamic progress bar for active orders (assuming 100 is a "busy" day)
  const orderProgress = Math.min((analytics.activeOrders / 100) * 100, 100);

  return (
    <DashboardContainer>
      <Header>Dashboard</Header>

      <StatsGrid>
        {/* Total Sales Card */}
        <StatCard>
          <div>
            <StatLabel>LIFETIME REVENUE</StatLabel>
            <StatValue><Currency amount={analytics.totalSales || 0} /></StatValue>
          </div>
          <TrendIndicator>
            <TrendingUp /> SYSTEM HEALTH OPTIMAL
          </TrendIndicator>
        </StatCard>

        {/* Active Orders Card */}
        <StatCard>
          <div>
            <StatLabel>ACTIVE FULFILLMENT</StatLabel>
            <StatValue>
              {analytics.activeOrders} <span className="sub">PROCESSING</span>
            </StatValue>
          </div>
          <ProgressBar $width={`${orderProgress}%`} />
        </StatCard>

        {/* Customer Growth Card (Blue) */}
        <StatCard $blue>
          <div>
            <StatLabel $blue>CUSTOMER REGISTRY</StatLabel>
            <StatValue $blue>{analytics.customerGrowth?.total || 0}</StatValue>
            <StatLabel $blue style={{marginBottom: '1rem'}}>
              +{analytics.customerGrowth?.newLast30Days || 0} NEW MEMBERS THIS MONTH
            </StatLabel>
          </div>
          <AvatarGroup>
            {/* Generating dynamic avatars just to make it look alive */}
            <img src="https://ui-avatars.com/api/?name=Alex+S&background=ffffff&color=4b76fc" alt="User" />
            <img src="https://ui-avatars.com/api/?name=Sam+K&background=F3F4F6&color=111827" alt="User" />
            <img src="https://ui-avatars.com/api/?name=Jordan+L&background=ffffff&color=4b76fc" alt="User" />
            <div className="more"><Activity size={14}/></div>
          </AvatarGroup>
        </StatCard>
      </StatsGrid>

      <BottomGrid>
        
        {/* Recent Activity */}
        <ContentCard>
          <CardHeader>
            <h3>RECENT ACTIVITY</h3>
            <a href="/admin/orders">VIEW ALL</a>
          </CardHeader>
          
          <ActivityList>
            {analytics.recentActivity?.length === 0 ? (
              <p style={{color: '#9CA3AF', fontStyle: 'italic', fontSize: '0.85rem'}}>No recent activity found.</p>
            ) : (
              analytics.recentActivity?.map((order, i) => (
                <ActivityItem key={order.id}>
                  <IconBox>
                    <ShoppingBag size={20} />
                  </IconBox>
                  
                  <ActivityDetails>
                    <h4>
                      New order by <span className="blue">{order.user?.name || 'Guest'}</span>
                    </h4>
                    <p>
                      {timeAgo(order.createdAt)} 
                      {' • '}
                      <Currency amount={order.totalAmount} />
                      {' • '}
                      ORDER #{order.id.substring(0, 8).toUpperCase()}
                    </p>
                  </ActivityDetails>

                  <StatusPill $type={order.status}>{order.status}</StatusPill>
                </ActivityItem>
              ))
            )}
          </ActivityList>
        </ContentCard>

        {/* Top Categories */}
        <ContentCard>
          <CardHeader>
            <h3 style={{margin: '0 auto'}}>TOP CATEGORY</h3>
          </CardHeader>

          <CategoryList>
            <CategoryItem>
              <div className="header">
                <span className="name">{analytics.topCategory || 'N/A'}</span>
                <span className="pct">#1</span>
              </div>
              {/* Force the top category to be a 100% full bar */}
              <CategoryBar $width="100%" />
            </CategoryItem>
            
            {/* If no categories exist, provide a helpful prompt */}
            {analytics.topCategory === 'No categories yet' && (
               <p style={{color: '#9CA3AF', fontSize: '0.8rem', textAlign: 'center', marginTop: '1rem'}}>
                 Add products to categories to track metrics.
               </p>
            )}
          </CategoryList>
        </ContentCard>

      </BottomGrid>
    </DashboardContainer>
  );
};

export default Dashboard;