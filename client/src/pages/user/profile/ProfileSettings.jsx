import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Edit2, CheckCircle2, Loader2, Save } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import ProfileLayout from './ProfileLayout';
import { useUser } from '../../../hooks/useUser';
import { authClient } from '../../../api/authClient';
import { NAVY_ACCENT, INK, LINE, FONT_HERO } from '../../../theme/brand';

const Header = styled.div`
  margin-bottom: 2.5rem;

  span {
    font-size: 0.75rem;
    font-weight: 700;
    color: ${NAVY_ACCENT};
    letter-spacing: 0.12em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 0.35rem;
  }

  h1 {
    font-family: ${FONT_HERO};
    font-size: clamp(2rem, 4vw, 2.75rem);
    font-weight: 800;
    color: ${INK};
    margin: 0;
    letter-spacing: -0.02em;
  }
`;

const TopGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1.3fr 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2.25rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  border: 1px solid ${LINE};

  @media (max-width: 600px) {
    padding: 1.5rem;
  }
`;

const LogisticsCard = styled(Card)`
  background: #fbfbf9;
`;

const CardOverline = styled.span`
  font-size: 0.7rem;
  font-weight: 800;
  color: ${NAVY_ACCENT};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 0.5rem;
`;

const CardTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h2 {
    font-family: ${FONT_HERO};
    font-size: 1.45rem;
    font-weight: 800;
    color: ${INK};
    margin: 0;
  }

  button {
    background: transparent;
    border: none;
    color: ${NAVY_ACCENT};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.75;
    }
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.75rem;
  margin-bottom: 2.5rem;

  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    font-size: 0.7rem;
    font-weight: 700;
    color: #777;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  p {
    font-size: 1rem;
    font-weight: 600;
    color: ${INK};
    margin: 0;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.85rem;
  border: 1px solid ${LINE};
  border-radius: 8px;
  font-size: 0.95rem;
  color: ${INK};
  background: #fff;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${NAVY_ACCENT};
  }
  &:disabled {
    color: #888;
    background: #f4f4f2;
    cursor: not-allowed;
  }
`;

const UpdateBtn = styled.button`
  background: ${NAVY_ACCENT};
  color: white;
  border: none;
  padding: 0.85rem 1.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(37, 60, 90, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: fit-content;

  &:hover {
    background: #1b2c42;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const AddressBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${LINE};
  border-left: 4px solid ${NAVY_ACCENT};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  position: relative;

  h4 {
    font-size: 0.7rem;
    font-weight: 800;
    color: ${NAVY_ACCENT};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin: 0 0 0.85rem 0;
  }
  h3 {
    font-family: ${FONT_HERO};
    font-size: 1.15rem;
    font-weight: 700;
    color: ${INK};
    margin: 0 0 0.4rem 0;
  }
  p {
    font-size: 0.9rem;
    color: #555;
    margin: 0 0 0.25rem 0;
    line-height: 1.5;
  }
  .check-icon {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    color: ${NAVY_ACCENT};
  }
`;

const PreferencesCard = styled(Card)`
  display: flex;
  align-items: flex-start;
  gap: 3.5rem;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 2.5rem;
  }
`;

const PrefIntro = styled.div`
  flex: 1;
  max-width: 320px;

  h2 {
    font-family: ${FONT_HERO};
    font-size: 1.45rem;
    font-weight: 800;
    color: ${INK};
    margin: 0;
  }

  p {
    font-size: 0.95rem;
    color: #666;
    line-height: 1.6;
    margin-top: 0.75rem;
  }

  @media (max-width: 1024px) {
    max-width: 100%;
  }
`;

const TogglesGrid = styled.div`
  flex: 2;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #d1d5db;
    transition: 0.3s;
    border-radius: 34px;
    &::before {
      position: absolute;
      content: '';
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    }
  }
  input:checked + span {
    background-color: ${NAVY_ACCENT};
  }
  input:checked + span:before {
    transform: translateX(20px);
  }
`;

const ToggleInfo = styled.div`
  h4 {
    font-size: 0.8rem;
    font-weight: 700;
    color: ${INK};
    margin: 0 0 0.35rem 0;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  p {
    font-size: 0.85rem;
    color: #666;
    margin: 0;
    line-height: 1.4;
  }
`;

const ProfileSettings = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    region: '',
    zipCode: '',
    country: '',
  });

  const [toggles, setToggles] = useState({
    priority: true,
    eco: true,
    digest: false,
    anonymous: false,
  });

  const { data: response, isLoading } = useUser();
  const user = response?.data;

  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await apiClient.put('/users/profile', updatedData);
      return res.data;
    },
    onSuccess: async (_, variables) => {
      try {
        await authClient.updateUser({ name: variables.name });
      } catch (e) {
        console.error('Failed to update authClient session', e);
      }
      queryClient.invalidateQueries(['userProfile']);
      setIsEditing(false);
    },
  });

  useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        street: user.street || '',
        city: user.city || '',
        region: user.region || '',
        zipCode: user.zipCode || '',
        country: user.country || '',
      });
    }
  }, [user, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      setIsEditing(true);
    }
  };

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading) {
    return (
      <ProfileLayout>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
          <Loader2 size={32} className="animate-spin" color={NAVY_ACCENT} />
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <Header>
        <span>ACCOUNT MANAGEMENT</span>
        <h1>Client Profile</h1>
      </Header>

      <TopGrid>
        <Card>
          <CardOverline>PERSONAL DETAILS</CardOverline>
          <CardTitleRow>
            <h2>Contact Information</h2>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} aria-label="Edit Profile">
                <Edit2 size={18} />
              </button>
            )}
          </CardTitleRow>

          <InfoGrid>
            <InfoGroup>
              <label>Full Name</label>
              {isEditing ? (
                <Input name="name" value={formData.name} onChange={handleChange} autoFocus />
              ) : (
                <p>{user?.name || 'Not provided'}</p>
              )}
            </InfoGroup>

            <InfoGroup>
              <label>Email Address</label>
              {isEditing ? (
                <Input name="email" type="email" value={formData.email} onChange={handleChange} />
              ) : (
                <p>{user?.email || 'Not provided'}</p>
              )}
            </InfoGroup>

            <InfoGroup>
              <label>Phone Number</label>
              {isEditing ? (
                <Input name="phone" value={formData.phone} onChange={handleChange} />
              ) : (
                <p>{user?.phone || 'Not provided'}</p>
              )}
            </InfoGroup>

            <InfoGroup>
              <label>Region & Country</label>
              <Input value={`${user?.region ? `${user.region}, ` : ''}${user?.country || 'Ghana'}`} disabled />
            </InfoGroup>
          </InfoGrid>

          <UpdateBtn $isEditing={isEditing} onClick={handleSubmit} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <><Loader2 size={16} className="animate-spin" /> Saving Changes...</>
            ) : isEditing ? (
              <><Save size={16} /> Save Changes</>
            ) : (
              'Edit Profile Details'
            )}
          </UpdateBtn>
        </Card>

        <LogisticsCard>
          <CardOverline>DELIVERY ADDRESS</CardOverline>
          <CardTitleRow>
            <h2>Shipping Location</h2>
          </CardTitleRow>

          <AddressBox>
            <h4>PRIMARY ADDRESS</h4>
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <Input name="street" value={formData.street} onChange={handleChange} placeholder="Street Address" />
                <Input name="city" value={formData.city} onChange={handleChange} placeholder="City / Town" />
                <Input name="region" value={formData.region} onChange={handleChange} placeholder="Region in Ghana" />
                <Input name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Digital Postal Code" />
                <Input name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
              </div>
            ) : (
              <>
                <h3>{user?.name || 'Recipient'}</h3>
                <p>{user?.phone || 'No phone recorded'}</p>
                <p>{user?.street || 'No street address set'}</p>
                <p>{user?.city ? `${user.city}, ${user.region || ''} ${user.zipCode || ''}` : 'No city specified'}</p>
                <p>{user?.country || 'Ghana'}</p>
                <CheckCircle2 size={18} className="check-icon" />
              </>
            )}
          </AddressBox>
        </LogisticsCard>
      </TopGrid>

      <PreferencesCard>
        <PrefIntro>
          <CardOverline>PREFERENCES</CardOverline>
          <h2>Curation & Alerts</h2>
          <p>Customize notifications regarding limited-edition footwear drops and dispatch updates.</p>
        </PrefIntro>

        <TogglesGrid>
          <ToggleRow>
            <Switch>
              <input type="checkbox" checked={toggles.priority} onChange={() => handleToggle('priority')} />
              <span></span>
            </Switch>
            <ToggleInfo>
              <h4>DROP NOTIFICATIONS</h4>
              <p>Instant SMS/Email alerts when new footwear designs drop.</p>
            </ToggleInfo>
          </ToggleRow>

          <ToggleRow>
            <Switch>
              <input type="checkbox" checked={toggles.digest} onChange={() => handleToggle('digest')} />
              <span></span>
            </Switch>
            <ToggleInfo>
              <h4>SNEAKER GARDEN JOURNAL</h4>
              <p>Monthly curated editorial features on Ghanaian streetwear & footwear design.</p>
            </ToggleInfo>
          </ToggleRow>
        </TogglesGrid>
      </PreferencesCard>
    </ProfileLayout>
  );
};

export default ProfileSettings;