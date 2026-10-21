import React from 'react';
import styled from 'styled-components';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell,
  BarChart, Bar // 🚨 Added BarChart for the Customer Loyalty section
} from 'recharts';
import { 
  Calendar, 
  Download, 
  DollarSign, 
  Users, 
  MousePointerClick, 
  ShoppingCart,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import Currency from '../../../utils/Currency'; 
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { CANVAS, NAVY_ACCENT, INK, LINE, FONT_HERO } from '../../../theme/brand';

// --- Styled Components ---
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box; 
  padding: 2.5rem 3rem;
  background: ${CANVAS};
  min-height: 100vh;

  @media (max-width: 1024px) { padding: 2rem; }
  @media (max-width: 768px) { padding: 1.5rem; }
`;

/* HEADER */
const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1rem;

  div.text {
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
      font-weight: 900; 
      color: ${INK}; 
      margin: 0; 
      letter-spacing: -1px;
      
      @media (max-width: 768px) { font-size: 2.2rem; }
    }
  }

  div.actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    @media (max-width: 600px) { width: 100%; }
  }
`;

const SelectButton = styled.button`
  background: white;
  border: 1px solid ${LINE};
  padding: 0.8rem 1.25rem;
  border-radius: 50px;
  display: flex; 
  align-items: center; 
  gap: 0.5rem;
  color: ${INK}; 
  font-size: 0.75rem;
  font-weight: 800; 
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { border-color: ${NAVY_ACCENT}; }
  
  @media (max-width: 600px) { flex: 1; justify-content: center; }
`;

const IconButton = styled.button`
  background: ${NAVY_ACCENT};
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex; 
  align-items: center; 
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(37, 60, 90, 0.25);
  transition: all 0.2s;

  &:hover { opacity: 0.9; transform: translateY(-2px); }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  z-index: 50;
  min-width: 150px;

  button {
    background: transparent;
    border: none;
    text-align: left;
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    font-weight: 800;
    color: #111827;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.2s;

    &:hover { background: #F3F4F6; }
  }
`;

/* STATS GRID */
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 1rem;

  @media (max-width: 1200px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const StatCard = styled.div`
  background: ${props => props.$blue ? NAVY_ACCENT : 'white'};
  color: ${props => props.$blue ? 'white' : INK};
  border: 1px solid ${LINE};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 160px;

  .icon {
    color: ${props => props.$blue ? 'white' : NAVY_ACCENT};
    margin-bottom: 1rem;
  }

  p.label { 
    font-size: 0.65rem; 
    font-weight: 800; 
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin: 0 0 0.5rem 0; 
    color: ${props => props.$blue ? 'rgba(255,255,255,0.8)' : '#9CA3AF'};
  }
  
  h3 { 
    font-size: 2rem; 
    font-weight: 800; 
    margin: 0 0 0.5rem 0; 
    letter-spacing: -0.5px;
  }

  .trend {
    font-size: 0.75rem;
    font-weight: 800;
    color: ${props => props.$blue ? 'white' : (props.$down ? '#EF4444' : '#10B981')};
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`;

/* MAIN CHARTS ROW */
const MainChartsRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1rem;

  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const Card = styled.div`
  background: ${props => props.$dark ? NAVY_ACCENT : 'white'};
  color: ${props => props.$dark ? 'white' : INK};
  border: 1px solid ${LINE};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  display: flex; 
  flex-direction: column;
  min-width: 0;
`;

const CardHeader = styled.div`
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 2rem;
  
  h3 { 
    font-family: ${FONT_HERO};
    font-size: 0.85rem; 
    font-weight: 800; 
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin: 0;
  }
  
  div.legend {
    display: flex; gap: 1rem;
    span {
      display: flex; align-items: center; gap: 0.4rem; font-size: 0.65rem; font-weight: 800; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px;
      &:before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: ${props => props.color}; }
    }
  }
`;

/* BOTTOM ROW */
const BottomRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const DonutContainer = styled.div`
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DonutLabel = styled.div`
  position: absolute;
  top: 50%; left: 50%; transform: translate(-50%, -50%);
  text-align: center;
  h4 { font-size: 1.8rem; font-weight: 800; color: #111827; margin: 0; letter-spacing: -1px;}
`;

const SplitStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 1rem;

  div {
    display: flex;
    flex-direction: column;
    span.label { font-size: 0.6rem; font-weight: 800; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.25rem;}
    span.val { font-size: 1.2rem; font-weight: 800; color: #111827; }
  }
`;

/* CATEGORY BARS */
const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    span.name { font-size: 0.7rem; font-weight: 800; color: #111827; text-transform: uppercase; letter-spacing: 1px; }
    span.pct { font-size: 0.8rem; font-weight: 800; color: #1A1A1A; }
  }
`;

const CategoryBar = styled.div`
  width: 100%; height: 4px; background: #F3F4F6; border-radius: 50px; overflow: hidden;
  div { height: 100%; width: ${props => props.$width || '0%'}; background: ${NAVY_ACCENT}; border-radius: 50px; transition: width 1s ease;}
`;

const OutlineBtn = styled.button`
  width: 100%;
  background: transparent;
  color: ${NAVY_ACCENT};
  border: 1px solid ${NAVY_ACCENT};
  font-family: ${FONT_HERO};
  padding: 1rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-top: auto;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: ${NAVY_ACCENT}; color: white; }
`;

/* INSIGHTS LIST */
const InsightList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 auto 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  li {
    display: flex;
    align-items: flex-start;
    gap: 1rem;

    &::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: white;
      margin-top: 6px;
      flex-shrink: 0;
    }

    div {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      p { font-size: 0.85rem; font-weight: 600; color: white; margin: 0; line-height: 1.4; }
      span { font-size: 0.6rem; font-weight: 800; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; }
    }
  }
`;

const DarkLink = styled.a`
  color: white;
  font-family: ${FONT_HERO};
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-decoration: none;
  border-bottom: 1px solid white;
  padding-bottom: 2px;
  width: fit-content;
  margin-top: 2rem;
  &:hover { opacity: 0.8; }
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
  if (interval > 1) return Math.floor(interval) + " MINS AGO";
  
  return "JUST NOW";
};

// 🚨 Added a fallback array for the bar chart until a specific backend route is built
const loyaltyMockData = [
  { name: '1 Purchase', val: 30 },
  { name: '2 Purchases', val: 40 },
  { name: '3 Purchases', val: 35 },
  { name: '4 Purchases', val: 60 },
  { name: '5+ Purchases', val: 80 }
];

const AnalyticsPage = () => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ['adminAnalyticsDetailed'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/analytics/detailed');
      return res.data;
    }
  });

  const analytics = response?.data;

  if (isLoading || !analytics) {
    return (
      <div style={{padding: '2rem', width: '100%'}}><Skeleton count={1} height={200} borderRadius={12} style={{marginBottom: '2rem'}}/><Skeleton count={3} height={40} style={{marginBottom: '1rem'}}/></div>
    );
  }

  // Ensure robust fallbacks
  const { financials, traffic, performanceData, topCategories, realtimeInsights } = analytics;

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Your Brand Analytics Report", 14, 15);
    doc.autoTable({
      startY: 20,
      head: [['Metric', 'Value']],
      body: [
        ['Total Revenue', `GHC ${financials?.totalRevenue || 0}`],
        ['Average Order Value', `GHC ${financials?.aov || 0}`],
        ['Total Accounts', traffic?.totalAccounts || 0],
        ['Conversion Rate', traffic?.conversionRate || '0%']
      ],
    });
    doc.save("analytics_report.pdf");
    setShowExportMenu(false);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Metric: 'Total Revenue', Value: financials?.totalRevenue || 0 },
      { Metric: 'Average Order Value', Value: financials?.aov || 0 },
      { Metric: 'Total Accounts', Value: traffic?.totalAccounts || 0 },
      { Metric: 'Conversion Rate', Value: traffic?.conversionRate || '0%' }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Analytics");
    XLSX.writeFile(wb, "analytics_report.xlsx");
    setShowExportMenu(false);
  };

  return (
    <Container>
      
      {/* 1. Header */}
      <HeaderSection>
        <div className="text">
          <span>PERFORMANCE METRICS</span>
          <h1>Analytics.</h1>
        </div>
        <div className="actions">
          <SelectButton>
            <Calendar size={16} /> LAST 30 DAYS
          </SelectButton>
          <SelectButton>
            ALL CATEGORIES
          </SelectButton>
          <div style={{ position: 'relative' }}>
            <IconButton onClick={() => setShowExportMenu(!showExportMenu)}>
              <Download size={18} />
            </IconButton>
            {showExportMenu && (
              <DropdownMenu>
                <button onClick={exportToPDF}>Export to PDF</button>
                <button onClick={exportToExcel}>Export to Excel</button>
              </DropdownMenu>
            )}
          </div>
        </div>
      </HeaderSection>

      {/* 2. Top Stats */}
      {/* 2. Top Stats */}
      <StatsGrid>
        <StatCard>
          <div className="icon"><DollarSign size={20} strokeWidth={2.5}/></div>
          <div>
            <p className="label">TOTAL REVENUE</p>
            <h3><Currency amount={financials?.totalRevenue || 0} /></h3>
            <span className="trend"><TrendingUp size={14}/> +12.5%</span>
          </div>
        </StatCard>

        {/* 🚨 UPDATED TO REAL DATA */}
        <StatCard>
          <div className="icon"><Users size={20} strokeWidth={2.5}/></div>
          <div>
            <p className="label">TOTAL ACCOUNTS</p>
            <h3>{traffic?.totalAccounts || 0}</h3>
            <span className="trend" style={{color: '#9CA3AF', fontSize: '0.65rem', textTransform: 'uppercase'}}>Registered Users</span>
          </div>
        </StatCard>

        {/* 🚨 UPDATED TO REAL DATA */}
        <StatCard>
          <div className="icon"><MousePointerClick size={20} strokeWidth={2.5}/></div>
          <div>
            <p className="label">PURCHASE CONVERSION</p>
            <h3>{traffic?.conversionRate || '0%'}</h3>
            <span className="trend" style={{color: '#9CA3AF', fontSize: '0.65rem', textTransform: 'uppercase'}}>Accounts with Orders</span>
          </div>
        </StatCard>

        <StatCard $blue>
          <div className="icon"><ShoppingCart size={20} strokeWidth={2.5}/></div>
          <div>
            <p className="label" $blue>AOV</p>
            <h3><Currency amount={financials?.aov || 0} /></h3>
            <span className="trend" $blue style={{fontSize: '0.75rem'}}>Average Order Value</span>
          </div>
        </StatCard>
      </StatsGrid>
      
      {/* 3. Main Charts */}
      <MainChartsRow>
        <Card>
          <CardHeader>
            <h3>SALES PERFORMANCE OVER TIME</h3>
            <div className="legend">
              <span className="dot" color="#1A1A1A" style={{color: '#1A1A1A'}}>CURRENT</span>
              <span className="dot" color="#E5E7EB">PREVIOUS</span>
            </div>
          </CardHeader>
          <div style={{flex: 1, width: '100%', minHeight: '300px'}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 700}} />
                
                {/* 🚨 FIXED: The tooltip now formats using the Cedi symbol! */}
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontWeight: 700 }}
                  formatter={(value) => [`₵${value.toLocaleString()}`, "Revenue"]}
                />
                
                <Line type="monotone" dataKey="current" stroke={NAVY_ACCENT} strokeWidth={3} dot={false} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="previous" stroke="#E5E7EB" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <h3>TOP CATEGORIES</h3>
          </CardHeader>
          
          <CategoryList style={{marginBottom: '2rem'}}>
            {topCategories?.length === 0 && <p style={{fontSize:'0.8rem', color:'#9CA3AF'}}>No product data available.</p>}
            {topCategories?.map((cat, i) => (
              <CategoryItem key={i}>
                <div className="header">
                  <span className="name">{cat.name}</span>
                  <span className="pct">{cat.value}%</span>
                </div>
                <CategoryBar $width={`${cat.value}%`} />
              </CategoryItem>
            ))}
          </CategoryList>

          <OutlineBtn>FULL INVENTORY REPORT</OutlineBtn>
        </Card>
      </MainChartsRow>

      {/* 4. Bottom Grid */}
      <BottomRow>
        
        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <h3>TRAFFIC SOURCES</h3>
          </CardHeader>
          <DonutContainer>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={traffic?.sources} 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={2} 
                  dataKey="value"
                  stroke="none"
                >
                  {traffic?.sources?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <DonutLabel>
              <h4>{traffic?.sources?.[0]?.value || 0}%</h4>
            </DonutLabel>
          </DonutContainer>
          <SplitStats>
            <div>
              <span className="label">{traffic?.sources?.[0]?.name || 'N/A'}</span>
              <span className="val">{traffic?.sources?.[0]?.value || 0}%</span>
            </div>
            <div style={{textAlign: 'right'}}>
              <span className="label">{traffic?.sources?.[1]?.name || 'N/A'}</span>
              <span className="val">{traffic?.sources?.[1]?.value || 0}%</span>
            </div>
          </SplitStats>
        </Card>

        {/* Customer Loyalty */}
        <Card>
          <CardHeader>
            <h3>CUSTOMER LOYALTY</h3>
          </CardHeader>
          <p style={{fontSize: '0.85rem', color: '#6B7280', margin: '0 0 2rem 0', lineHeight: 1.5}}>
            Monthly active users who return within 30 days of their last purchase.
          </p>
          
          {/* 🚨 REPLACED fake CSS bars with a real interactive Recharts BarChart */}
          <div style={{ width: '100%', height: '120px', marginBottom: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={loyaltyMockData}>
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontWeight: 700, fontSize: '0.75rem' }}
                />
                <Bar 
                  dataKey="val" 
                  fill="#E5E7EB" 
                  radius={[4, 4, 0, 0]} 
                  activeBar={{ fill: NAVY_ACCENT }} 
                  name="Users"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <span style={{fontSize: '0.75rem', fontWeight: 800, color: NAVY_ACCENT, textTransform: 'uppercase', letterSpacing: '1px'}}>
            + VIP SEGMENT GROWTH +8%
          </span>
        </Card>

        {/* Real-time Insights */}
        <Card $dark>
          <CardHeader>
            <h3 style={{color: '#9CA3AF'}}>REAL-TIME INSIGHT</h3>
          </CardHeader>
          
          <InsightList>
            {realtimeInsights?.length === 0 && <p style={{fontSize:'0.8rem', color:'#9CA3AF'}}>Waiting for traffic...</p>}
            {realtimeInsights?.map((insight, i) => (
              <li key={i}>
                <div>
                  <p>{insight.text}</p>
                  <span>{timeAgo(insight.time)}</span>
                </div>
              </li>
            ))}
          </InsightList>

          <DarkLink href="/admin/orders">LAUNCH LIVE VIEW</DarkLink>
        </Card>

      </BottomRow>

    </Container>
  );
};

export default AnalyticsPage;