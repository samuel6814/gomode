import React, { useState } from 'react';
import styled from 'styled-components';
import { Truck, Sparkles, Tag, Loader2, Save } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import ProfileLayout from './ProfileLayout';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { NAVY_ACCENT, INK, LINE, FONT_HERO } from '../../../theme/brand';

const Header = styled.div`
  margin-bottom: 2.5rem;

  h1 {
    font-family: ${FONT_HERO};
    font-size: clamp(2rem, 4vw, 2.75rem);
    font-weight: 800;
    color: ${INK};
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.02em;
  }

  p {
    font-size: 0.95rem;
    color: #666;
    line-height: 1.6;
    margin: 0;
    max-width: 600px;
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const SettingCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  border: 1px solid ${LINE};
  display: flex;
  flex-direction: column;

  @media (max-width: 600px) {
    padding: 1.5rem;
  }
`;

const FullWidthCard = styled(SettingCard)`
  margin-bottom: 2.5rem;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  .icon-box {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #fbfbf9;
    color: ${NAVY_ACCENT};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1px solid ${LINE};
  }

  h3 {
    font-family: ${FONT_HERO};
    font-size: 1.25rem;
    font-weight: 700;
    color: ${INK};
    margin: 0;
  }
`;

const CardDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  margin: 0 0 1.5rem 0;
`;

const ToggleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 0;
  border-top: 1px solid ${LINE};

  span.label {
    font-size: 0.85rem;
    font-weight: 600;
    color: ${INK};
  }
`;

const InlineToggleRow = styled.div`
  display: flex;
  gap: 2rem;

  div {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    span.label {
      font-size: 0.85rem;
      font-weight: 600;
      color: ${INK};
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
  }
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

const ActionFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1rem;

  button.discard {
    background: transparent;
    border: none;
    color: #666;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: ${INK};
    }
  }

  button.save {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: ${NAVY_ACCENT};
    color: white;
    border: none;
    padding: 0.95rem 2rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(37, 60, 90, 0.25);
    transition: all 0.2s ease;

    &:hover {
      background: #1b2c42;
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
  }
`;

const NotificationSettings = () => {
  const queryClient = useQueryClient();
  const [preferences, setPreferences] = useState({
    orderEmail: true,
    orderSms: false,
    collectionEmail: false,
    collectionSms: false,
    offersEmail: false,
    offersSms: false,
  });

  const { data: response, isLoading } = useQuery({
    queryKey: ['userPreferences'],
    queryFn: async () => {
      const res = await apiClient.get('/users/preferences');
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.data) {
        const isSubscribed = data.data.marketingEmails;
        setPreferences((prev) => ({
          ...prev,
          collectionEmail: isSubscribed,
          offersEmail: isSubscribed,
        }));
      }
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (marketingStatus) => {
      const res = await apiClient.put('/users/preferences', { marketingEmails: marketingStatus });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userPreferences']);
      alert('Preferences saved successfully.');
    },
  });

  const toggle = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    const isSubscribed = preferences.collectionEmail || preferences.offersEmail;
    saveMutation.mutate(isSubscribed);
  };

  const handleDiscard = () => {
    const isSubscribed = response?.data?.marketingEmails || false;
    setPreferences((prev) => ({
      ...prev,
      collectionEmail: isSubscribed,
      offersEmail: isSubscribed,
    }));
  };

  if (isLoading) {
    return (
      <ProfileLayout>
        <div style={{ padding: '2rem', width: '100%' }}>
          <Skeleton count={1} height={180} borderRadius={16} style={{ marginBottom: '2rem' }} />
          <Skeleton count={3} height={40} style={{ marginBottom: '1rem' }} />
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <ContentArea>
        <Header>
          <h1>Notification Preferences</h1>
          <p>Configure how you receive updates about your footwear orders, exclusive drops, and private offers.</p>
        </Header>

        <SettingsGrid>
          <SettingCard>
            <CardHeader>
              <div className="icon-box"><Truck size={18} /></div>
              <h3>Order Status Updates</h3>
            </CardHeader>
            <CardDescription>
              Instant courier tracking, delivery confirmations, and dispatch notifications for your purchases.
            </CardDescription>

            <div>
              <ToggleRow>
                <span className="label">Email Notifications</span>
                <Switch>
                  <input type="checkbox" checked={preferences.orderEmail} onChange={() => toggle('orderEmail')} />
                  <span></span>
                </Switch>
              </ToggleRow>
              <ToggleRow>
                <span className="label">SMS Notifications</span>
                <Switch>
                  <input type="checkbox" checked={preferences.orderSms} onChange={() => toggle('orderSms')} />
                  <span></span>
                </Switch>
              </ToggleRow>
            </div>
          </SettingCard>

          <SettingCard>
            <CardHeader>
              <div className="icon-box"><Sparkles size={18} /></div>
              <h3>Footwear Drops & Releases</h3>
            </CardHeader>
            <CardDescription>
              Be first to know when new footwear silhouettes, collaborative sneakers, and luxury loafer lines drop.
            </CardDescription>

            <div>
              <ToggleRow>
                <span className="label">Email Notifications</span>
                <Switch>
                  <input type="checkbox" checked={preferences.collectionEmail} onChange={() => toggle('collectionEmail')} />
                  <span></span>
                </Switch>
              </ToggleRow>
              <ToggleRow>
                <span className="label">SMS Notifications</span>
                <Switch>
                  <input type="checkbox" checked={preferences.collectionSms} onChange={() => toggle('collectionSms')} />
                  <span></span>
                </Switch>
              </ToggleRow>
            </div>
          </SettingCard>
        </SettingsGrid>

        <FullWidthCard>
          <div style={{ flex: 1 }}>
            <CardHeader>
              <div className="icon-box"><Tag size={18} /></div>
              <h3>Special Client Privileges</h3>
            </CardHeader>
            <CardDescription style={{ marginBottom: 0 }}>
              Exclusive invitations to seasonal promotions, private VIP client sales, and complimentary delivery tokens.
            </CardDescription>
          </div>

          <InlineToggleRow>
            <div>
              <span className="label">Email Alerts</span>
              <Switch>
                <input type="checkbox" checked={preferences.offersEmail} onChange={() => toggle('offersEmail')} />
                <span></span>
              </Switch>
            </div>
            <div>
              <span className="label">SMS Alerts</span>
              <Switch>
                <input type="checkbox" checked={preferences.offersSms} onChange={() => toggle('offersSms')} />
                <span></span>
              </Switch>
            </div>
          </InlineToggleRow>
        </FullWidthCard>

        <ActionFooter>
          <button type="button" className="discard" onClick={handleDiscard} disabled={saveMutation.isPending}>
            Discard Changes
          </button>
          <button type="button" className="save" onClick={handleSave} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saveMutation.isPending ? 'Saving...' : 'Save Preferences'}
          </button>
        </ActionFooter>
      </ContentArea>
    </ProfileLayout>
  );
};

export default NotificationSettings;