import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Plus, 
  ArrowUpRight, 
  Layers, 
  Edit2, 
  Trash2, 
  EyeOff,
  Eye,
  Gift,
  ShoppingBag,
  TrendingUp,
  Loader2 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
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

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;

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
`;

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: ${NAVY_ACCENT};
  color: white;
  border: none;
  font-family: ${FONT_HERO};
  padding: 1rem 2rem;
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
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (max-width: 1024px) { grid-template-columns: 1fr 1fr; }
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const StatCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid ${LINE};
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 160px;
`;

const StatHeader = styled.div`
  span {
    font-size: 0.65rem;
    font-weight: 800;
    color: #9CA3AF;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  color: #111827;
  letter-spacing: -1px;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;

  span.trend {
    font-size: 0.65rem;
    font-weight: 800;
    color: ${NAVY_ACCENT};
    letter-spacing: 1px;
    margin-top: 0.25rem;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #F3F4F6;
  border-radius: 50px;
  margin-top: 1.5rem;

  div {
    height: 100%;
    width: ${props => props.$width || '50%'};
    background: ${NAVY_ACCENT};
    border-radius: 50px;
  }
`;

const FeaturedCard = styled.div`
  background: ${NAVY_ACCENT}; 
  color: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  min-height: 160px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover { transform: translateY(-2px); }

  @media (max-width: 1024px) { grid-column: 1 / -1; } 

  span.label {
    font-size: 0.65rem;
    font-weight: 800;
    color: rgba(255,255,255,0.7);
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  h3 {
    font-family: ${FONT_HERO};
    font-size: 1.8rem;
    font-weight: 800;
    margin: 0;
    letter-spacing: -0.5px;
  }

  svg {
    position: absolute;
    bottom: 2.5rem;
    right: 2.5rem;
    color: white;
  }
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  background: white;
  border-radius: 12px;
  border: 1px solid ${LINE};
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;

  th {
    text-align: left;
    padding: 1.5rem 2rem;
    color: #9CA3AF;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    background: #FAFAFA;
    border-bottom: 1px solid ${LINE};
  }

  td {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid ${LINE};
    vertical-align: middle;
    color: #1F2937;
  }

  tr:last-child td { border-bottom: none; }
  tr:hover { background-color: #FAFAFA; }
`;

const PreviewImage = styled.div`
  width: 60px;
  height: 80px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  background-color: #f3f4f6; 
`;

const NameCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  a { 
    font-size: 1rem; 
    font-weight: 800; 
    color: #111827; 
    text-decoration: none;
    transition: color 0.2s;
    &:hover { color: ${NAVY_ACCENT}; }
  }

  p { 
    font-size: 0.65rem; 
    font-weight: 800;
    color: #9CA3AF; 
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0;
  }
`;

const ItemsCell = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #6B7280;
`;

const StatusPill = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;

  ${props => props.$status === 'ACTIVE' 
    ? `background: #ECFDF5; color: #10B981;` 
    : `background: #FFFBEB; color: #D97706;`
  }
`;

const ActionWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionBtn = styled.button`
  background: transparent;
  border: none;
  color: #9CA3AF;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  
  &:hover { color: #111827; }
  &.delete:hover { color: #EF4444; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  border-top: 1px solid ${LINE};
  border-radius: 0 0 12px 12px;

  span {
    color: #9CA3AF;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  div.nav {
    display: flex;
    gap: 1.5rem;
    
    button {
      background: transparent;
      border: none;
      color: #9CA3AF;
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;

      &.next { color: #1A1A1A; }
      &:hover { opacity: 0.7; }
    }
  }
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-top: 1rem;

  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const WidgetCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  div.text {
    h3 { font-size: 1.25rem; font-weight: 900; color: #111827; margin: 0 0 0.5rem 0; letter-spacing: -0.5px; }
    p { font-size: 0.85rem; color: #6B7280; margin: 0; }
  }

  button {
    background: transparent;
    color: #1A1A1A;
    border: 1px solid #1A1A1A;
    padding: 0.8rem 1.5rem;
    border-radius: 50px;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover { background: #1A1A1A; color: white; }
  }
`;

const ArchiveCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;

  span.label { font-size: 0.65rem; font-weight: 800; color: #9CA3AF; text-transform: uppercase; letter-spacing: 2px;}
  h3 { font-size: 2.5rem; font-weight: 900; color: #9CA3AF; margin: 1rem 0; letter-spacing: -1px;}
  a { font-size: 0.65rem; font-weight: 800; color: #9CA3AF; text-decoration: underline; text-underline-offset: 4px; text-transform: uppercase; letter-spacing: 1px; }

  svg { position: absolute; top: 2.5rem; right: 2.5rem; color: #D1D5DB; }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #1A1A1A;
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

const CategoryPageAdmin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState([]);

  // 1. Fetch Categories from Backend
  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminCategories'],
    queryFn: async () => {
      const res = await apiClient.get('/categories'); 
      return res.data;
    }
  });

  const categories = data?.data || [];
  
  // 2. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCategories']);
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to delete category");
    }
  });

  // 3. Bulk Delete Mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids) => {
      await apiClient.post('/categories/bulk-delete', { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCategories']);
      setSelectedIds([]);
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to delete categories');
    }
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the "${name}" category? This cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(categories.map(c => c.id));
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
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} category(ies)? Categories with products cannot be deleted.`)) {
      bulkDeleteMutation.mutate(selectedIds);
    }
  };

  return (
    <Container>
      
      <HeaderSection>
        <div className="text">
          <span>CATALOG MANAGEMENT</span>
          <h1>Categories</h1>
        </div>
        <PrimaryButton onClick={() => navigate('/admin/category/add')}>
          <Plus size={16} strokeWidth={3} /> ADD NEW CATEGORY
        </PrimaryButton>
      </HeaderSection>

      <TopGrid>
        <StatCard>
          <StatHeader><span>TOTAL CATEGORIES</span></StatHeader>
          <StatValue>
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : categories.length}
            <ProgressBar $width="100%" />
          </StatValue>
        </StatCard>

        <StatCard>
          <StatHeader><span>ACTIVE LISTINGS</span></StatHeader>
          <StatValue>
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : categories.reduce((sum, cat) => sum + (cat._count?.products || cat.products?.length || 0), 0)}
            <span className="trend">STORE WIDE CATALOG</span>
          </StatValue>
        </StatCard>

        <FeaturedCard onClick={() => navigate('/admin/products')}>
          <span className="label">Featured View</span>
          <h3>ALL PRODUCTS</h3>
          <Gift size={24} />
          <ArrowUpRight size={20} />
        </FeaturedCard>
      </TopGrid>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th style={{width: '50px'}}>
                <Checkbox 
                  type="checkbox" 
                  checked={categories.length > 0 && selectedIds.length === categories.length} 
                  onChange={handleSelectAll}
                />
              </th>
              <th>PREVIEW</th>
              <th>NAME</th>
              <th>ITEMS</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                  <Loader2 className="animate-spin" size={32} color="#1A1A1A" style={{ margin: '0 auto', animation: 'spin 1s linear infinite' }} />
                  <p style={{ marginTop: '1rem', color: '#6B7280', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px' }}>LOADING CATALOG...</p>
                </td>
              </tr>
            ) : categories.length === 0 ? (
               <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: '#6B7280', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px' }}>NO CATEGORIES FOUND. ADD ONE TO START.</p>
                </td>
              </tr>
            ) : (
              categories.map(cat => {
                const productCount = cat._count?.products || cat.products?.length || 0;
                
                return (
                  <tr key={cat.id} style={selectedIds.includes(cat.id) ? {background: '#F4F1EB'} : {}}>
                    <td>
                      <Checkbox 
                        type="checkbox" 
                        checked={selectedIds.includes(cat.id)} 
                        onChange={() => handleSelectOne(cat.id)}
                      />
                    </td>
                    <td style={{width: '100px'}}>
                      {/* Using real image, or fallback if none exists */}
                      <PreviewImage src={cat.image || `https://ui-avatars.com/api/?name=${cat.name}&background=111827&color=fff&size=100&font-size=0.3`} />
                    </td>
                    <td>
                      <NameCell>
                        <Link to={`/admin/category/edit/${cat.id}`}>
                          {cat.name}
                        </Link>
                        {/* Using real description */}
                        <p>{cat.description || 'STORE CATEGORY'}</p>
                      </NameCell>
                    </td>
                    <td>
                      <ItemsCell>{productCount} Products</ItemsCell>
                    </td>
                    <td>
                      {/* Using real status from DB */}
                      <StatusPill $status={cat.status || 'ACTIVE'}>{cat.status || 'ACTIVE'}</StatusPill>
                    </td>
                    <td>
                      <ActionWrapper>
                        <Link to={`/admin/category/edit/${cat.id}`}>
                          <ActionBtn><Edit2 size={16} /></ActionBtn>
                        </Link>
                        <ActionBtn 
                          className="delete" 
                          onClick={() => handleDelete(cat.id, cat.name)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 size={16} />
                        </ActionBtn>
                      </ActionWrapper>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
        
        <BottomBar>
          <span>SHOWING {categories.length} CATEGORIES</span>
          <div className="nav">
            <button>PREVIOUS</button>
            <button className="next">NEXT PAGE</button>
          </div>
        </BottomBar>
      </TableContainer>

      <FooterGrid>
        <WidgetCard>
          <div className="text">
            <h3>Category Reordering</h3>
            <p>Drag and drop to change storefront navigation priority.</p>
          </div>
          <button>MANAGE ORDER</button>
        </WidgetCard>

        <ArchiveCard>
          <span className="label">ARCHIVED</span>
          <Trash2 size={20} strokeWidth={2} />
          <h3>0</h3>
          <a href="#">VIEW TRASH</a>
        </ArchiveCard>
      </FooterGrid>

      {selectedIds.length > 0 && (
        <SelectionBar>
          <span>{selectedIds.length} SELECTED</span>
          <button onClick={handleBulkDelete} disabled={bulkDeleteMutation.isPending}>
            <Trash2 size={14} /> {bulkDeleteMutation.isPending ? 'DELETING...' : 'DELETE'}
          </button>
          <button className="cancel" onClick={() => setSelectedIds([])}>CANCEL</button>
        </SelectionBar>
      )}

    </Container>
  );
};

export default CategoryPageAdmin;