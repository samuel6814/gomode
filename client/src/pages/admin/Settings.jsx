import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Save, 
  Upload, 
  CreditCard, 
  Percent, 
  Image as ImageIcon, 
  Edit2,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { CANVAS, NAVY_ACCENT, INK, LINE, FONT_HERO } from '../../theme/brand';

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
      margin: 0;
      letter-spacing: -1.5px;
      
      @media (max-width: 768px) { font-size: 2.2rem; }
    }
  }

  div.actions {
    display: flex;
    gap: 1rem;
    @media (max-width: 600px) { width: 100%; }
  }
`;

const PrimaryBtn = styled.button`
  background: ${NAVY_ACCENT};
  color: white;
  border: none;
  font-family: ${FONT_HERO};
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(37, 60, 90, 0.25);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover { opacity: 0.9; transform: translateY(-2px); }
  &:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
  @media (max-width: 600px) { flex: 1; }
`;

/* --- GRID LAYOUT --- */
const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  max-width: 800px; /* Constrain width since it's a single column now */
  gap: 2.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

/* --- CARDS --- */
const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  border: 1px solid ${LINE};
  display: flex;
  flex-direction: column;

  @media (max-width: 600px) { padding: 1.5rem; }
`;

const BlueCard = styled(Card)`
  background: ${NAVY_ACCENT};
  color: white;
  border: none;
  box-shadow: 0 10px 30px rgba(37, 60, 90, 0.2);
`;

const SectionTitle = styled.h3`
  font-family: ${FONT_HERO};
  font-size: 1.3rem;
  font-weight: 800;
  color: ${props => props.$white ? 'white' : INK};
  margin: 0 0 0.5rem 0;
`;

const SectionLabel = styled.span`
  font-size: 0.65rem;
  font-weight: 800;
  color: ${props => props.$white ? 'rgba(255,255,255,0.7)' : '#9CA3AF'};
  text-transform: uppercase;
  letter-spacing: 2px;
  display: block;
  margin-bottom: 2rem;
`;

/* --- FORM ELEMENTS --- */
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;

  label {
    font-size: 0.65rem;
    font-weight: 800;
    color: #6B7280;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 0.75rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 1px solid ${LINE};
  border-radius: 8px;
  font-size: 0.95rem;
  color: #111827;
  background: #F5F3EF;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;

  &:focus { box-shadow: 0 0 0 2px rgba(37, 60, 90, 0.2); border-color: ${NAVY_ACCENT}; }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 1px solid ${LINE};
  border-radius: 8px;
  font-size: 0.95rem;
  color: #111827;
  background: #F5F3EF;
  outline: none;
  cursor: pointer;
  box-sizing: border-box;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

/* --- ASSET UPLOAD --- */
const UploadZone = styled.div`
  border: 2px dashed ${LINE};
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { border-color: ${NAVY_ACCENT}; background: #F5F3EF; }

  svg { color: #9CA3AF; margin-bottom: 1rem; }
  p { font-size: 0.75rem; font-weight: 800; color: #111827; text-transform: uppercase; margin: 0; }
  span { font-size: 0.65rem; color: #9CA3AF; margin-top: 0.25rem; }
`;

/* --- TOGGLES --- */
const ToggleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 0;
  border-bottom: 1px solid ${LINE};
  &:last-child { border-bottom: none; }

  div {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    h4 { font-size: 0.85rem; font-weight: 800; color: #111827; margin: 0; text-transform: uppercase;}
    p { font-size: 0.75rem; color: #6B7280; margin: 0; }
  }
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;

  input { opacity: 0; width: 0; height: 0; }
  span {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: ${props => props.$checked ? NAVY_ACCENT : '#E5E7EB'};
    transition: .3s;
    border-radius: 34px;
    &:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .3s;
      border-radius: 50%;
    }
  }
  input:checked + span:before { transform: translateX(20px); }
`;

/* --- NOTIFICATION TABLE --- */
const CompactTable = styled.div`
  display: flex;
  flex-direction: column;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 40px;
  padding: 1.25rem 0;
  border-bottom: 1px solid #F3F4F6;
  align-items: center;
  &:last-child { border-bottom: none; }

  div.info {
    h5 { font-family: 'Times New Roman', Times, serif; font-size: 1.1rem; font-weight: 800; color: #111827; margin: 0 0 0.25rem 0; }
    p { font-size: 0.65rem; font-weight: 800; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; margin: 0;}
  }

  span.status {
    font-size: 0.65rem;
    font-weight: 900;
    color: ${props => props.$active ? '#10B981' : '#9CA3AF'};
    text-transform: uppercase;
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

const Settings = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Local state for all settings
  const [formData, setFormData] = useState({
    STORE_NAME: 'Your Brand',
    STORE_CURRENCY: 'GHS',
    SUPPORT_EMAIL: 'norteygeorge888@gmail.com',
    LOCALIZATION: 'English (International)',
    TAX_SHIPPING: 'true',
    PRICES_INC_TAX: 'false',
    TAX_RATE: '15.0',
    TAX_ID: ''
  });

  // 1. Fetch Current Settings
  const { isLoading } = useQuery({
    queryKey: ['adminSettings'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/settings');
      return res.data;
    },
    onSuccess: (data) => {
      // Merge fetched database settings with our local state defaults
      if (data?.data) {
        setFormData(prev => ({ ...prev, ...data.data }));
      }
    }
  });

  // 2. Save Settings Mutation
  const saveMutation = useMutation({
    mutationFn: async (updatedSettings) => {
      const res = await apiClient.put('/admin/settings/bulk', updatedSettings);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminSettings']);
      alert('Settings saved successfully!'); // We can replace this with a nice toast notification later
    }
  });

  // Universal change handler for inputs & selects
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler for boolean toggle switches
  const handleToggle = (name) => {
    setFormData(prev => ({ 
      ...prev, 
      [name]: prev[name] === 'true' ? 'false' : 'true' 
    }));
  };

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div style={{padding: '2rem', width: '100%'}}><Skeleton count={1} height={200} borderRadius={12} style={{marginBottom: '2rem'}}/><Skeleton count={3} height={40} style={{marginBottom: '1rem'}}/></div>
    );
  }

  return (
    <Container>
      <BackButton onClick={() => navigate('/admin/dashboard')}>
        <ArrowLeft size={18} /> Back to Dashboard
      </BackButton>

      <HeaderSection>
        <div className="text">
          <span className="overline">STORE PREFERENCES</span>
          <h1>Settings.</h1>
        </div>
        <div className="actions">
          <PrimaryBtn onClick={handleSave} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
            {saveMutation.isPending ? 'SAVING...' : 'SAVE CONFIGURATION'}
          </PrimaryBtn>
        </div>
      </HeaderSection>

      <MainGrid>
        <Column>
          {/* Store Profile */}
          <Card>
            <SectionLabel>BASIC IDENTIFICATION</SectionLabel>
            <SectionTitle>Store Profile</SectionTitle>
            <p style={{fontSize: '0.9rem', color: '#6B7280', marginBottom: '2.5rem'}}>How customers and systems identify your brand.</p>
            
            <FormRow>
              <FormGroup>
                <label>STORE NAME</label>
                <Input 
                  name="STORE_NAME" 
                  value={formData.STORE_NAME || ''} 
                  onChange={handleChange} 
                />
              </FormGroup>
              <FormGroup>
                <label>STORE CURRENCY</label>
                <Select name="STORE_CURRENCY" value={formData.STORE_CURRENCY} onChange={handleChange}>
                  <option value="GHS">GHS - Ghanaian Cedi (GH₵)</option>
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                </Select>
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <label>SUPPORT EMAIL</label>
                <Input 
                  type="email" 
                  name="SUPPORT_EMAIL" 
                  value={formData.SUPPORT_EMAIL || ''} 
                  onChange={handleChange} 
                />
              </FormGroup>
              <FormGroup>
                <label>LOCALIZATION</label>
                <Select name="LOCALIZATION" value={formData.LOCALIZATION} onChange={handleChange}>
                  <option value="English (International)">English (International)</option>
                  <option value="French (Regional)">French (Regional)</option>
                </Select>
              </FormGroup>
            </FormRow>
          </Card>

          {/* Tax Settings */}
          <Card>
            <SectionLabel>FINANCIAL LOGIC</SectionLabel>
            <SectionTitle>Tax Configuration</SectionTitle>
            <div style={{marginTop: '2rem'}}>
              
              <ToggleRow>
                <div>
                  <h4>Charge Tax on Shipping</h4>
                  <p>Apply regional tax to fulfillment costs</p>
                </div>
                <Switch $checked={formData.TAX_SHIPPING === 'true'}>
                  <input type="checkbox" onChange={() => handleToggle('TAX_SHIPPING')} />
                  <span />
                </Switch>
              </ToggleRow>

              <ToggleRow>
                <div>
                  <h4>Inclusive Pricing</h4>
                  <p>Display prices with tax already calculated</p>
                </div>
                <Switch $checked={formData.PRICES_INC_TAX === 'true'}>
                  <input type="checkbox" onChange={() => handleToggle('PRICES_INC_TAX')} />
                  <span />
                </Switch>
              </ToggleRow>
            </div>

            <FormRow style={{marginTop: '2rem'}}>
              <FormGroup>
                <label>DEFAULT TAX RATE (%)</label>
                <Input 
                  type="number" 
                  name="TAX_RATE" 
                  value={formData.TAX_RATE || ''} 
                  onChange={handleChange} 
                />
              </FormGroup>
              <FormGroup>
                <label>TAX ID / VAT NUMBER</label>
                <Input 
                  type="text" 
                  name="TAX_ID" 
                  placeholder="GHA-000000000" 
                  value={formData.TAX_ID || ''} 
                  onChange={handleChange} 
                />
              </FormGroup>
            </FormRow>
          </Card>

          {/* Notifications */}
          <Card>
            <SectionLabel>AUTOMATIONS</SectionLabel>
            <SectionTitle>Notification Center</SectionTitle>
            <CompactTable style={{marginTop: '2rem'}}>
              <TableRow $active={true}>
                <div className="info">
                  <h5>Order Confirmation</h5>
                  <p>TRIGGER: CUSTOMER PURCHASE</p>
                </div>
                <span className="status">ACTIVE</span>
                <Edit2 size={16} color="#9CA3AF" style={{cursor: 'pointer'}} />
              </TableRow>
              <TableRow $active={true}>
                <div className="info">
                  <h5>Shipping Update</h5>
                  <p>TRIGGER: FULFILLMENT STATUS</p>
                </div>
                <span className="status">ACTIVE</span>
                <Edit2 size={16} color="#9CA3AF" style={{cursor: 'pointer'}} />
              </TableRow>
              <TableRow $active={false}>
                <div className="info">
                  <h5>Upcoming Drops</h5>
                  <p>TRIGGER: SCHEDULED LAUNCH</p>
                </div>
                <span className="status">INACTIVE</span>
                <Edit2 size={16} color="#9CA3AF" style={{cursor: 'pointer'}} />
              </TableRow>
            </CompactTable>
          </Card>
        </Column>

        {/* RIGHT COLUMN */}
      </MainGrid>

    </Container>
  );
};

export default Settings;