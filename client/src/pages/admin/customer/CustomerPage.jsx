import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Users } from 'lucide-react';
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

/* --- HEADER SECTION --- */
const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }

  div.text {
    max-width: 500px;
    
    h1 {
      font-family: ${FONT_HERO};
      font-size: 3rem;
      font-weight: 900;
      color: ${INK};
      margin: 0 0 1rem 0;
      letter-spacing: -1.5px;
      
      @media (max-width: 768px) { font-size: 2.2rem; }
    }
    
    p {
      font-size: 0.95rem;
      font-weight: 400;
      color: #6B7280;
      line-height: 1.6;
      margin: 0;
    }
  }

  div.total-members {
    text-align: right;
    
    @media (max-width: 768px) { 
      text-align: left; 
      width: 100%;
      border-top: 1px solid ${LINE};
      padding-top: 1.5rem;
    }

    span.label {
      font-size: 0.65rem;
      font-weight: 800;
      color: ${NAVY_ACCENT};
      text-transform: uppercase;
      letter-spacing: 2px;
      display: block;
      margin-bottom: 0.5rem;
    }
    
    h2 {
      font-family: ${FONT_HERO};
      font-size: 2.2rem;
      font-weight: 800;
      color: ${INK};
      margin: 0;
    }
  }
`;

/* --- TOP STATS --- */
const TopGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const AcquisitionCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid ${LINE};
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) { padding: 1.5rem; }

  span.label {
    font-size: 0.65rem;
    font-weight: 800;
    color: #6B7280;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 1.5rem;
  }

  h3 {
    font-family: ${FONT_HERO};
    font-size: 2.5rem;
    font-weight: 800;
    color: ${INK};
    margin: 0 0 1rem 0;
  }

  span.trend {
    font-size: 0.65rem;
    font-weight: 800;
    color: #10B981; 
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const DistributionCard = styled.div`
  background: ${NAVY_ACCENT}; 
  border-radius: 8px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(37, 60, 90, 0.2);

  @media (max-width: 768px) { grid-template-columns: 1fr; }

  div.content {
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media (max-width: 768px) { padding: 1.5rem; }

    span.label {
      font-size: 0.65rem;
      font-weight: 800;
      color: rgba(255,255,255,0.7);
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 2rem;
    }

    div.stats {
      display: flex;
      justify-content: space-between;
      gap: 1.5rem;
      flex-wrap: wrap;

      div.stat {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        h4 { font-size: 2rem; font-family: ${FONT_HERO}; font-weight: 800; color: white; margin: 0;}
        span { font-size: 0.6rem; font-weight: 800; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1.5px;}
      }
    }
  }

  div.graphic {
    background-image: url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop');
    background-size: cover;
    background-position: center;
    mix-blend-mode: multiply; 
    opacity: 0.5;
    
    @media (max-width: 768px) { height: 160px; }
  }
`;

/* --- REGISTRY TABLE --- */
const RegistryCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid ${LINE};
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  margin-bottom: 3rem;
  overflow: hidden;
`;

const RegistryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2.5rem;
  border-bottom: 1px solid ${LINE};
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) { padding: 1.5rem; }

  h3 {
    font-family: ${FONT_HERO};
    font-size: 0.85rem;
    font-weight: 800;
    color: ${INK};
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0;
  }

  div.actions {
    display: flex;
    gap: 1rem;

    button {
      background: white;
      border: 1px solid ${LINE};
      color: ${INK};
      padding: 0.6rem 1.5rem;
      border-radius: 50px;
      font-size: 0.65rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover { border-color: ${NAVY_ACCENT}; color: ${NAVY_ACCENT}; }
    }
  }
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px; 

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

const CustomerCell = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    background: #F3F4F6;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    
    a {
      font-family: ${FONT_HERO};
      font-size: 0.95rem;
      font-weight: 700;
      color: ${INK};
      text-decoration: none;
      transition: color 0.2s;
      &:hover { color: ${NAVY_ACCENT}; }
    }
    span {
      font-size: 0.6rem;
      color: #9CA3AF; 
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
  }
`;

const MembershipPill = styled.span`
  padding: 0.35rem 0.8rem;
  border-radius: 50px;
  font-size: 0.6rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  white-space: nowrap;

  ${props => {
    if (props.$type === 'PLATINUM ELITE') return `background: #F3F4F6; color: #111827;`;
    if (props.$type === 'GOLD TIER') return `background: ${NAVY_ACCENT}; color: white;`;
    return `background: #F9FAFB; color: #9CA3AF;`;
  }}
`;

const DateText = styled.span`
  font-size: 0.75rem;
  font-weight: 800;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 2px;
  white-space: nowrap;
`;

const PriceText = styled.span`
  font-family: ${FONT_HERO};
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$active ? NAVY_ACCENT : '#D1D5DB'};
  margin-left: 1.5rem;
`;

/* --- REGISTRY FOOTER --- */
const PaginationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2.5rem;
  background: white;
  border-top: 1px solid #F3F4F6;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    align-items: flex-start;
  }

  span.label {
    font-size: 0.65rem;
    font-weight: 800;
    color: #9CA3AF;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  div.nav {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #9CA3AF;

    span.page {
      color: #9CA3AF;
      cursor: pointer;
      &:hover { color: #111827; }
      &.active { color: #1A1A1A; }
    }
  }
`;

/* --- BOTTOM SPLIT --- */
const BottomSplit = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;

  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const MetricsSection = styled.div`
  display: flex;
  flex-direction: column;

  h3 {
    font-size: 0.65rem;
    font-weight: 800;
    color: #9CA3AF;
    text-transform: uppercase;
    letter-spacing: 3px;
    margin: 0 0 2rem 0;
    padding-bottom: 1rem;
    border-bottom: 1px solid #E5E7EB;
  }
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 2.5rem;

  span.label {
    font-size: 0.85rem;
    font-weight: 500;
    color: #4B5563;
  }

  span.val {
    font-family: 'Times New Roman', Times, serif;
    font-size: 1.25rem;
    font-style: italic;
    color: #111827;
  }
`;

/* FIXED EDITORIAL IMAGE */
const EditorialImage = styled.div`
  width: 90%;
  border-radius: 8px;
  background-image: url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2.5rem;
  filter: grayscale(80%) sepia(20%) hue-rotate(200deg); 
  min-height: 400px; 

  @media (max-width: 1024px) { min-height: 350px; }
  @media (max-width: 768px) { min-height: 280px; padding: 1.5rem; }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(17, 24, 39, 0.8) 0%, rgba(0,0,0,0) 60%);
    border-radius: 8px;
    z-index: 1;
  }

  div {
    position: relative;
    z-index: 2;

    span {
      font-size: 0.6rem;
      font-weight: 800;
      color: rgba(255,255,255,0.7);
      text-transform: uppercase;
      letter-spacing: 2px;
      display: block;
      margin-bottom: 0.5rem;
    }
    
    h3 {
      font-family: 'Times New Roman', Times, serif;
      font-size: 2rem;
      font-weight: 400;
      color: white;
      margin: 0;
      line-height: 1.1;

      @media (max-width: 768px) { font-size: 1.75rem; }
    }
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

// Helper: Format Dates cleanly
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
};

const CustomerPage = () => {

  // Fetch Real Data from backend
  const { data: response, isLoading } = useQuery({
    queryKey: ['adminCustomers'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/customers');
      return res.data;
    }
  });

  const { data: subResponse } = useQuery({
    queryKey: ['adminSubscribers'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/customers/subscribers');
      return res.data;
    }
  });

  const customers = response?.data || [];
  const subscribers = subResponse?.data || [];
  
  // Safely extract analytics or provide defaults
  const analytics = response?.analytics || {
    totalDatabaseSize: 0,
    averageOrderValue: 0,
    repeatPurchaseFrequency: '0%',
    membershipDistribution: { platinum: 0, gold: 0, aspirant: 0 }
  };

  const handleExportNewsletter = () => {
    if (!subscribers || subscribers.length === 0) return alert('No subscribers found');
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,SubscribedAt\n" 
      + subscribers.map(s => `${s.email},${new Date(s.createdAt).toISOString()}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "newsletter_subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container>
      
      {/* 1. Header */}
      <HeaderSection>
        <div className="text">
          <h1>The Customer Archive.</h1>
          <p>Curating relationships and analyzing the lifetime value of the modern editorial audience. A centralized database for your most valued patrons.</p>
        </div>
        <div className="total-members">
          <span className="label">TOTAL DATABASE SIZE</span>
          <h2>{analytics.totalDatabaseSize} Members</h2>
        </div>
      </HeaderSection>

      {/* 2. Top Stats */}
      <TopGrid>
        <AcquisitionCard>
          <span className="label">AVERAGE ORDER VALUE</span>
          <h3><Currency amount={Number(analytics.averageOrderValue)}/></h3>
          <span className="trend">BASED ON LIFETIME SPEND</span>
        </AcquisitionCard>

        <DistributionCard>
          <div className="content">
            <span className="label">MEMBERSHIP DISTRIBUTION</span>
            <div className="stats">
              <div className="stat">
                <h4>{analytics.membershipDistribution.platinum}%</h4>
                <span>PLATINUM ELITE</span>
              </div>
              <div className="stat">
                <h4>{analytics.membershipDistribution.gold}%</h4>
                <span>GOLD TIER</span>
              </div>
              <div className="stat">
                <h4>{analytics.membershipDistribution.aspirant}%</h4>
                <span>ASPIRANT</span>
              </div>
            </div>
          </div>
          <div className="graphic" />
        </DistributionCard>
      </TopGrid>

      {/* 3. Registry Table */}
      <RegistryCard>
        <RegistryHeader>
          <h3>CUSTOMER REGISTRY</h3>
          <div className="actions">
            <button onClick={handleExportNewsletter}>EXPORT NEWSLETTER EMAILS</button>
            <button>FILTER</button>
            <button>EXPORT CSV</button>
          </div>
        </RegistryHeader>

        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>NAME / IDENTITY</th>
                <th>MEMBERSHIP</th>
                <th>TOTAL SPEND</th>
                <th>MEMBER SINCE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Skeleton circle width={40} height={40} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', width: '100px' }}>
                          <Skeleton height={20} />
                          <Skeleton height={10} width={80} />
                        </div>
                      </div>
                    </td>
                    <td><Skeleton width={80} height={20} borderRadius={50} /></td>
                    <td><Skeleton width={60} height={20} /></td>
                    <td><Skeleton width={80} height={20} /></td>
                    <td><Skeleton circle width={10} height={10} /></td>
                  </tr>
                ))
              ) : customers.length === 0 ? (
                 <tr>
                  <td colSpan="5">
                     <EmptyStateContainer>
                       <Users size={48} color="#D1D5DB" />
                       <p className="main">No Customers Found</p>
                       <p className="sub">Wait for users to create accounts to start tracking data.</p>
                     </EmptyStateContainer>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => {
                  // Generate a dynamic avatar based on their name
                  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=F3F4F6&color=111827&font-size=0.35&bold=true`;

                  return (
                    <tr key={customer.id}>
                      <td>
                        <CustomerCell>
                          <img src={avatarUrl} alt={customer.name} />
                          <div>
                            {/* We will route to a detail page if you build one later! */}
                            <Link to={`/admin/customers/${customer.id}`}> 
                              {customer.name}
                            </Link>
                            <span>{customer.email}</span>
                          </div>
                        </CustomerCell>
                      </td>
                      <td>
                        <MembershipPill $type={customer.tier}>{customer.tier}</MembershipPill>
                      </td>
                      <td>
                        <PriceText><Currency amount={customer.totalSpend} /></PriceText>
                      </td>
                      <td>
                        <DateText>{formatDate(customer.createdAt)}</DateText>
                      </td>
                      <td>
                        {/* If they've ordered at least once, consider them an active patron */}
                        <StatusDot $active={customer.orderCount > 0} title={customer.orderCount > 0 ? "Active Buyer" : "Registered"} />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </Table>
        </TableContainer>

        {!isLoading && customers.length > 0 && (
          <PaginationRow>
            <span className="label">SHOWING {customers.length} ENTRIES</span>
            <div className="nav">
              <span style={{marginRight: '1rem'}}>PREVIOUS</span>
              <span className="page active">1</span>
              <span style={{marginLeft: '1rem'}}>NEXT</span>
            </div>
          </PaginationRow>
        )}
      </RegistryCard>

      {/* 4. Bottom Split (Metrics & Image) */}
      <BottomSplit>
        <MetricsSection>
          <h3>ENGAGEMENT METRICS</h3>
          
          <MetricRow>
            <span className="label">Email Open Rate (Mock)</span>
            <span className="val">74.2%</span>
          </MetricRow>
          <MetricRow>
            <span className="label">Repeat Purchase Frequency</span>
            <span className="val">{analytics.repeatPurchaseFrequency}</span>
          </MetricRow>
          <MetricRow>
            <span className="label">Average Order Value</span>
            <span className="val"><Currency amount={Number(analytics.averageOrderValue)}/></span>
          </MetricRow>
        </MetricsSection>

        <EditorialImage>
          <div>
            <span>INTERNAL REPORT</span>
            <h3>Visualizing Customer Flow</h3>
          </div>
        </EditorialImage>
      </BottomSplit>

    </Container>
  );
};

export default CustomerPage;