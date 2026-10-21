import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  ArrowRight,
  MoreVertical,
  Plus,
  ArrowLeft,
  Loader2,
  PackageX,
  Trash2,
  X,
  AlertTriangle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import { formatGHC } from '../../../utils/Currency';
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
  position: relative; 

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
  margin-bottom: 1.5rem;
  transition: color 0.2s;
  width: fit-content;
  
  &:hover { color: ${NAVY_ACCENT}; }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 3rem;

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
      text-transform: uppercase;
      
      @media (max-width: 768px) { font-size: 2.2rem; }
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${NAVY_ACCENT};
  color: white;
  border: none;
  font-family: ${FONT_HERO};
  padding: 1.25rem 2rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(37, 60, 90, 0.25);
  transition: all 0.2s;

  &:hover { 
    opacity: 0.9;
    transform: translateY(-2px); 
    box-shadow: 0 6px 20px rgba(37, 60, 90, 0.35);
  }

  @media (max-width: 600px) { width: 100%; }
`;

const TopGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr; 
  gap: 1.5rem;
  margin-bottom: 0;

  @media (max-width: 1100px) { 
    grid-template-columns: 1fr; 
  }
`;

const FilterBar = styled.div`
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-radius: 12px 12px 0 0; 
  border-bottom: 1px solid ${LINE};
  
  @media (max-width: 850px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 2.5rem;
  
  @media (max-width: 600px) {
    flex-wrap: wrap;
    gap: 1.5rem;
  }
  
  div {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;

    span.label { font-size: 0.6rem; font-weight: 800; color: #9CA3AF; text-transform: uppercase; letter-spacing: 2px;}
    select {
      border: none;
      background: transparent;
      font-size: 0.85rem;
      font-weight: 800;
      color: #111827;
      text-transform: uppercase;
      letter-spacing: 1px;
      outline: none;
      cursor: pointer;
      appearance: none; 
      padding: 0;
      
      &:focus { color: ${NAVY_ACCENT}; }
    }
  }
`;

const ResultCount = styled.span`
  font-size: 0.65rem;
  font-weight: 800;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const AlertCard = styled.div`
  background: ${NAVY_ACCENT}; 
  color: white;
  padding: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.2s;
  border-radius: 12px;
  
  &:hover { opacity: 0.92; }

  div {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    span.label { font-size: 0.65rem; font-weight: 800; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 2px;}
    h3 { font-family: ${FONT_HERO}; font-size: 1.8rem; font-weight: 800; margin: 0; letter-spacing: -0.5px;}
  }

  @media (max-width: 1100px) {
    margin-top: 1.5rem;
  }
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  background: white;
  border-radius: 0 0 12px 12px;
  border: 1px solid ${LINE};
  border-top: none;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  margin-bottom: 2rem;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px; 

  th {
    text-align: left;
    padding: 1.5rem 2rem;
    color: #9CA3AF;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 3px;
    border-bottom: 1px solid ${LINE};
  }

  td {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid ${LINE};
    vertical-align: middle;
  }

  tr:last-child td { border-bottom: none; }
  tr:hover { background-color: #FAFAFA; }
`;

const ProductCell = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  img {
    width: 64px;
    height: 80px;
    background-color: #F3F4F6;
    object-fit: cover;
    border-radius: 4px;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    
    a {
      font-size: 0.95rem;
      font-weight: 800;
      color: #111827;
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: color 0.2s;
      &:hover { color: #1A1A1A; }
    }
    span {
      font-size: 0.65rem;
      color: #9CA3AF; 
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
    }
  }
`;

const SkuText = styled.span`
  font-family: monospace;
  font-size: 0.85rem;
  font-weight: 600;
  color: #9CA3AF;
  letter-spacing: 1px;
`;

const CategoryBadge = styled.span`
  background: ${props => props.$bg || '#F3F4F6'};
  color: ${props => props.$text || '#9CA3AF'};
  padding: 0.4rem 0.8rem;
  border-radius: 50px;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

const getCategoryColor = (name) => {
  if (!name) return { bg: '#F3F4F6', text: '#9CA3AF' };
  const colors = [
    { bg: '#E0E7FF', text: '#3730A3' }, // Indigo
    { bg: '#ECFDF5', text: '#065F46' }, // Emerald
    { bg: '#FEF3C7', text: '#92400E' }, // Amber
    { bg: '#FCE7F3', text: '#9D174D' }, // Pink
    { bg: '#E0F2FE', text: '#075985' }, // Sky
    { bg: '#EDE9FE', text: '#5B21B6' }  // Purple
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const PriceText = styled.span`
  font-size: 0.95rem;
  font-weight: 800;
  color: #111827;
`;

const StockWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 120px;
`;

const StockBar = styled.div`
  flex: 1;
  height: 4px;
  background: #F3F4F6;
  border-radius: 50px;
  overflow: hidden;

  div {
    height: 100%;
    border-radius: 50px;
    width: ${props => Math.min(props.$percent, 100)}%;
    background: ${props => {
      if (props.$status === 'low') return '#EF4444';
      if (props.$status === 'out') return '#E5E7EB';
      return NAVY_ACCENT;
    }};
  }
`;

const StockNumber = styled.span`
  font-size: 0.8rem;
  font-weight: 800;
  color: #111827;
  min-width: 24px;
`;

const StatusText = styled.span`
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  color: ${props => {
    if (props.$type === 'LOW STOCK' || props.$type === 'OUT OF STOCK') return '#EF4444';
    if (props.$type === 'DRAFT') return '#9CA3AF';
    return NAVY_ACCENT;
  }};

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
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

const FooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;

  div.nav {
    display: flex;
    align-items: center;
    gap: 1rem;

    button {
      background: transparent;
      border: none;
      color: #9CA3AF;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 2px;
      cursor: pointer;
      transition: color 0.2s;

      &.next { color: #111827; }
      &:hover { color: #1A1A1A; }
    }

    span.page {
      font-size: 0.7rem;
      font-weight: 800;
      color: #D1D5DB;
      letter-spacing: 1px;
      
      &.active { color: #1A1A1A; }
    }
  }

  span.copyright {
    font-size: 0.65rem;
    font-weight: 800;
    color: #9CA3AF;
    text-transform: uppercase;
    letter-spacing: 2px;

    @media (max-width: 800px) { display: none; }
  }

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${NAVY_ACCENT};
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 560px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 60px rgba(0,0,0,0.2);
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2.5rem;
  border-bottom: 1px solid #F3F4F6;

  div {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  h2 {
    font-size: 1.1rem;
    font-weight: 900;
    color: #111827;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0;
  }

  button {
    background: transparent;
    border: none;
    color: #9CA3AF;
    cursor: pointer;
    padding: 0;
    display: flex;
    transition: color 0.2s;
    &:hover { color: #111827; }
  }
`;

const ModalBody = styled.div`
  overflow-y: auto;
  padding: 1rem 2.5rem 2rem;
  flex: 1;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
`;

const LowStockItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid #F9FAFB;

  &:last-child { border-bottom: none; }

  img {
    width: 56px;
    height: 70px;
    object-fit: cover;
    border-radius: 6px;
    background: #F3F4F6;
  }

  .info {
    flex: 1;

    h4 {
      font-size: 0.9rem;
      font-weight: 800;
      color: #111827;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 0.3rem 0;
    }

    .stock-label {
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: ${props => props.$stock === 0 ? '#EF4444' : '#D97706'};
    }
  }

  a {
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #1A1A1A;
    text-decoration: none;
    white-space: nowrap;
    &:hover { text-decoration: underline; }
  }
`;

const SelectionBar = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #111827;
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 2rem;
  z-index: 200;
  box-shadow: 0 15px 40px rgba(0,0,0,0.25);
  font-family: sans-serif;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from { transform: translateX(-50%) translateY(100px); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
  }

  button {
    background: #EF4444;
    color: white;
    border: none;
    padding: 0.6rem 1.5rem;
    border-radius: 50px;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: background 0.2s;
    &:hover { background: #DC2626; }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }

  .cancel {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.3);
    color: white;
    &:hover { background: rgba(255,255,255,0.1); }
  }
`;

const FloatingBtn = styled.button`
  position: fixed;
  bottom: 2.5rem;
  right: 2.5rem;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #1D4ED8; 
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(29, 78, 216, 0.4);
  transition: transform 0.2s, background 0.2s;
  z-index: 100;

  &:hover { transform: scale(1.05); background: #1E40AF; }

  @media (max-width: 768px) {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 56px;
    height: 56px;
  }
`;

const ProductsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState([]);
  const [showLowStockModal, setShowLowStockModal] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // 1. Fetch Real Data
  const { data: response, isLoading } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: async () => {
      const res = await apiClient.get('/products', { params: { includeInactive: true } });
      return res.data;
    }
  });

  const products = response?.data || [];
  
  // Calculate dynamic stats
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 10).length;

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids) => {
      await apiClient.post('/products/bulk-delete', { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProducts']);
      setSelectedIds([]);
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to delete products');
    }
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(products.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} product(s)? This cannot be undone.`)) {
      bulkDeleteMutation.mutate(selectedIds);
    }
  };

  return (
    <Container>
      
      <BackButton onClick={() => navigate('/admin/dashboard')}>
        <ArrowLeft size={18} /> Back to Dashboard
      </BackButton>

      <HeaderSection>
        <div className="text">
          <span className="overline">MANAGEMENT PORTAL</span>
          <h1>YOUR BRAND PRODUCT<br/>INVENTORY</h1>
        </div>
        <PrimaryButton onClick={() => navigate('/admin/products/add')}>
          ADD NEW PRODUCT
        </PrimaryButton>
      </HeaderSection>

      <TopGrid>
        <FilterBar>
          <FilterGroup>
            <div>
              <span className="label">STATUS</span>
              <select>
                <option>ALL PRODUCTS</option>
                <option>ACTIVE</option>
                <option>DRAFTS</option>
              </select>
            </div>
            <div>
              <span className="label">CATEGORY</span>
              <select>
                <option>EVERYTHING</option>
                <option>OUTERWEAR</option>
                <option>FOOTWEAR</option>
              </select>
            </div>
            <div>
              <span className="label">PRICE RANGE</span>
              <select>
                <option>ANY PRICE</option>
                <option>UNDER $500</option>
                <option>OVER $500</option>
              </select>
            </div>
          </FilterGroup>
          <ResultCount>SHOWING {isLoading ? '...' : products.length} ITEMS</ResultCount>
        </FilterBar>

        <AlertCard onClick={() => setShowLowStockModal(true)}>
          <div>
            <span className="label">INVENTORY ALERT</span>
            <h3>{lowStockCount} ITEMS LOW STOCK</h3>
          </div>
          <ArrowRight size={24} />
        </AlertCard>
      </TopGrid>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th style={{width: '50px'}}>
                <Checkbox 
                  type="checkbox" 
                  checked={products.length > 0 && selectedIds.length === products.length} 
                  onChange={handleSelectAll}
                />
              </th>
              <th>PRODUCT</th>
              <th>SKU</th>
              <th>CATEGORY</th>
              <th>PRICE</th>
              <th>STOCK</th>
              <th>STATUS</th>
              <th style={{width: '60px'}}></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '4rem' }}>
                  <Loader2 className="animate-spin" size={32} color="#1A1A1A" style={{ margin: '0 auto' }} />
                  <p style={{ marginTop: '1rem', color: '#6B7280', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px' }}>LOADING INVENTORY...</p>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '4rem' }}>
                  <PackageX size={48} color="#D1D5DB" style={{ margin: '0 auto 1rem auto' }} />
                  <p style={{ color: '#111827', fontSize: '1rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>No products found</p>
                  <p style={{ color: '#6B7280', fontSize: '0.85rem' }}>Your catalog is empty. Click 'Add New Product' to get started.</p>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                // Dynamic Status & Stock Logic
                let stockStatus = 'good';
                let displayStatus = product.isActive ? 'ACTIVE' : 'DRAFT';
                
                if (product.stock === 0) {
                  stockStatus = 'out';
                  displayStatus = 'OUT OF STOCK';
                } else if (product.stock < 10) {
                  stockStatus = 'low';
                  if(product.isActive) displayStatus = 'LOW STOCK';
                }

                // Safely grab the first image, or use a placeholder if none exists
                const imageUrl = product.images?.[0]?.image?.url || `https://ui-avatars.com/api/?name=${product.name}&background=F3F4F6&color=9CA3AF`;
                
                // 🚨 Format Price using your GHC utility
                const formattedPrice = formatGHC(product.price);

                return (
                  <tr key={product.id} style={selectedIds.includes(product.id) ? {background: '#F4F1EB'} : {}}>
                    <td>
                      <Checkbox 
                        type="checkbox" 
                        checked={selectedIds.includes(product.id)} 
                        onChange={() => handleSelectOne(product.id)}
                      />
                    </td>
                    <td>
                      <ProductCell>
                        <img src={imageUrl} alt={product.name} />
                        <div>
                          <Link to={`/admin/products/edit/${product.id}`}>
                            {product.name}
                          </Link>
                          {/* Fallback to part of description if no subtitle exists */}
                          <span>{product.description?.substring(0, 30)}...</span>
                        </div>
                      </ProductCell>
                    </td>
                    <td><SkuText>{product.id.substring(0, 8).toUpperCase()}</SkuText></td>
                    <td>
                      <CategoryBadge 
                        $bg={getCategoryColor(product.category?.name).bg} 
                        $text={getCategoryColor(product.category?.name).text}
                      >
                        {product.category?.name || 'UNCATEGORIZED'}
                      </CategoryBadge>
                    </td>
                    <td><PriceText>{formattedPrice}</PriceText></td>
                    <td>
                      <StockWrapper>
                        <StockBar $status={stockStatus} $percent={product.stock === 0 ? 0 : (product.stock / 150) * 100}>
                          <div />
                        </StockBar>
                        <StockNumber>{product.stock}</StockNumber>
                      </StockWrapper>
                    </td>
                    <td><StatusText $type={displayStatus}>{displayStatus}</StatusText></td>
                    <td style={{ position: 'relative' }}>
                      <ActionMenu onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === product.id ? null : product.id); }}>
                        <MoreVertical size={20} strokeWidth={2.5}/>
                      </ActionMenu>
                      {activeMenuId === product.id && (
                        <>
                          <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }} />
                          <div style={{ position: 'absolute', right: '40px', top: '10px', background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', zIndex: 50, display: 'flex', flexDirection: 'column' }}>
                             <button onClick={() => navigate(`/admin/products/edit/${product.id}`)} style={{ padding: '0.75rem 1.5rem', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, borderBottom: '1px solid #F3F4F6', color: '#111827', width: '100%' }}>Edit Product</button>
                             <button onClick={() => { if(window.confirm('Delete this product?')) bulkDeleteMutation.mutate([product.id]); setActiveMenuId(null); }} style={{ padding: '0.75rem 1.5rem', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, color: '#EF4444', width: '100%' }}>Delete Product</button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </TableContainer>

      <FooterRow>
        <div className="nav">
          <button>PREVIOUS</button>
          <span className="page active">01</span>
          <button className="next">NEXT</button>
        </div>
        <span className="copyright">© 2026 YOUR BRAND ARCHIVE</span>
      </FooterRow>

      {selectedIds.length === 0 && (
        <FloatingBtn onClick={() => navigate('/admin/products/add')}>
          <Plus size={28} strokeWidth={2.5} />
        </FloatingBtn>
      )}

      {selectedIds.length > 0 && (
        <SelectionBar>
          <span>{selectedIds.length} SELECTED</span>
          <button onClick={handleBulkDelete} disabled={bulkDeleteMutation.isPending}>
            <Trash2 size={14} /> {bulkDeleteMutation.isPending ? 'DELETING...' : 'DELETE'}
          </button>
          <button className="cancel" onClick={() => setSelectedIds([])}>CANCEL</button>
        </SelectionBar>
      )}

      {/* Low Stock Modal */}
      {showLowStockModal && (
        <ModalOverlay onClick={() => setShowLowStockModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <div>
                <AlertTriangle size={20} color="#D97706" />
                <h2>Low Stock Items</h2>
              </div>
              <button onClick={() => setShowLowStockModal(false)}>
                <X size={24} />
              </button>
            </ModalHeader>
            <ModalBody>
              {products.filter(p => p.stock >= 0 && p.stock < 10).length === 0 ? (
                <p style={{textAlign: 'center', color: '#9CA3AF', padding: '2rem 0', fontSize: '0.85rem'}}>All products are well-stocked!</p>
              ) : (
                products
                  .filter(p => p.stock >= 0 && p.stock < 10)
                  .sort((a, b) => a.stock - b.stock)
                  .map(product => {
                    const imgUrl = product.images?.[0]?.image?.url || `https://ui-avatars.com/api/?name=${product.name}&background=F3F4F6&color=9CA3AF`;
                    return (
                      <LowStockItem key={product.id} $stock={product.stock}>
                        <img src={imgUrl} alt={product.name} />
                        <div className="info">
                          <h4>{product.name}</h4>
                          <span className="stock-label">
                            {product.stock === 0 ? 'OUT OF STOCK' : `${product.stock} LEFT IN STOCK`}
                          </span>
                        </div>
                        <Link to={`/admin/products/edit/${product.id}`} onClick={() => setShowLowStockModal(false)}>
                          EDIT →
                        </Link>
                      </LowStockItem>
                    );
                  })
              )}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

    </Container>
  );
};

export default ProductsPage;