import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, Loader2, Save } from 'lucide-react';
import apiClient from '../../api/axios';
import { GHANA_REGIONS, getCitiesForRegion } from '../../utils/ghanaLocations';
import { CANVAS, NAVY_ACCENT, INK, LINE, FONT_HERO } from '../../theme/brand';

// --- Styled Components ---
const Container = styled.div`
  padding: 2.5rem 3rem;
  background: ${CANVAS};
  min-height: 100vh;
  @media (max-width: 1024px) { padding: 2rem; }
  @media (max-width: 768px) { padding: 1.5rem; }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-family: ${FONT_HERO};
    font-size: 2.2rem;
    font-weight: 800;
    color: ${INK};
    margin: 0;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid ${LINE};
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  label {
    font-size: 0.75rem;
    font-weight: 700;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  input, select {
    padding: 0.875rem;
    border: 1px solid ${LINE};
    border-radius: 8px;
    outline: none;
    font-family: inherit;
    font-size: 0.95rem;

    &:focus { border-color: ${NAVY_ACCENT}; }
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${NAVY_ACCENT};
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-family: ${FONT_HERO};
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  transition: opacity 0.2s;

  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid ${LINE};
  }

  th {
    font-size: 0.75rem;
    font-weight: 700;
    color: #6B7280;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  td {
    font-size: 0.95rem;
    color: #111827;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;

    button {
      background: transparent;
      border: none;
      cursor: pointer;
      color: #6B7280;
      transition: color 0.2s;

      &:hover { color: #ef4444; }
    }
  }
`;

const Badge = styled.span`
  background: ${props => props.$active ? '#dcfce7' : '#fef2f2'};
  color: ${props => props.$active ? '#166534' : '#991b1b'};
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
`;

const DeliverySettings = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ region: '', city: '', fee: '', isActive: true });
  const [editingId, setEditingId] = useState(null);

  const availableCities = formData.region ? getCitiesForRegion(formData.region) : [];

  const { data: response, isLoading } = useQuery({
    queryKey: ['adminDeliveryFees'],
    queryFn: async () => {
      const res = await apiClient.get('/delivery/admin');
      return res.data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingId) {
        return await apiClient.put(`/delivery/${editingId}`, payload);
      }
      return await apiClient.post('/delivery', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminDeliveryFees']);
      setFormData({ region: '', city: '', fee: '', isActive: true });
      setEditingId(null);
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to save delivery fee.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await apiClient.delete(`/delivery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminDeliveryFees']);
    }
  });

  const fees = response?.data || [];

  const handleEdit = (fee) => {
    setFormData({
      region: fee.region,
      city: fee.city || '',
      fee: fee.fee.toString(),
      isActive: fee.isActive
    });
    setEditingId(fee.id);
  };

  return (
    <Container>
      <Header>
        <h1>Delivery Configuration</h1>
      </Header>

      <ContentGrid>
        <Card>
          <h3>{editingId ? 'Edit Fee' : 'Add New Fee'}</h3>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '2rem' }}>
            Set a general fee for a region by leaving the City blank, or set specific fees for specific cities.
          </p>

          <FormGroup>
            <label>Region</label>
            <select 
              value={formData.region} 
              onChange={(e) => setFormData({...formData, region: e.target.value, city: ''})}
            >
              <option value="">Select Region</option>
              {GHANA_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </FormGroup>

          <FormGroup>
            <label>City / Town (Optional)</label>
            <select 
              value={formData.city} 
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              disabled={!formData.region}
            >
              <option value="">General Region Area (All Cities)</option>
              {availableCities.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </FormGroup>

          <FormGroup>
            <label>Delivery Fee (GHS)</label>
            <input 
              type="number" 
              step="0.01" 
              placeholder="0.00" 
              value={formData.fee} 
              onChange={(e) => setFormData({...formData, fee: e.target.value})} 
            />
          </FormGroup>

          <FormGroup style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              checked={formData.isActive} 
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              style={{ width: 'auto' }}
            />
            <label style={{ margin: 0 }}>Active</label>
          </FormGroup>

          <Button 
            onClick={() => saveMutation.mutate(formData)}
            disabled={!formData.region || !formData.fee || saveMutation.isPending}
          >
            {saveMutation.isPending ? <Loader2 className="animate-spin" /> : <Save size={18} />}
            {editingId ? 'Update Fee' : 'Save Fee'}
          </Button>

          {editingId && (
            <button 
              onClick={() => { setEditingId(null); setFormData({ region: '', city: '', fee: '', isActive: true }); }}
              style={{ background: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer', marginTop: '1rem', width: '100%', fontSize: '0.8rem', fontWeight: 700 }}
            >
              CANCEL EDIT
            </button>
          )}
        </Card>

        <Card style={{ overflowX: 'auto' }}>
          <h3>Configured Regions</h3>
          
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <Loader2 className="animate-spin" size={24} color="#1A1A1A" />
            </div>
          ) : fees.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#9CA3AF', padding: '2rem 0' }}>No delivery fees configured yet.</p>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Region</th>
                  <th>City</th>
                  <th>Fee (GHS)</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {fees.map(f => (
                  <tr key={f.id}>
                    <td><strong>{f.region}</strong></td>
                    <td>{f.city || <em>General</em>}</td>
                    <td>{f.fee.toFixed(2)}</td>
                    <td><Badge $active={f.isActive}>{f.isActive ? 'Active' : 'Inactive'}</Badge></td>
                    <td className="actions">
                      <button onClick={() => handleEdit(f)}><Edit2 size={16} color="#1A1A1A" /></button>
                      <button onClick={() => { if(window.confirm('Delete this fee?')) deleteMutation.mutate(f.id) }}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </ContentGrid>
    </Container>
  );
};

export default DeliverySettings;
