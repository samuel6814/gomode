import React from 'react';
import styled from 'styled-components';
import { Package, Sparkles, Clock, ArrowLeft, Loader2, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PageWrapper = styled.div`
  background: #f2f4f5;
  min-height: 100vh;
  padding-top: 1.5rem;
  font-family: sans-serif;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;

  @media (max-width: 768px) { padding: 2rem 1.5rem; }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;

  button {
    background: transparent;
    border: none;
    cursor: pointer;
    color: #6B7280;
    display: flex;
    align-items: center;
    padding: 0;
    transition: color 0.2s;
    &:hover { color: #111827; }
  }

  h1 {
    font-family: 'Times New Roman', Times, serif;
    font-size: 2.5rem;
    font-weight: 900;
    color: #111827;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: -1px;
  }
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NotificationCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
  border: 1px solid #F3F4F6;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; bottom: 0;
    width: 4px;
    background: ${props => props.$unread ? '#1A1A1A' : 'transparent'};
  }
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.$bg || '#F4F1EB'};
  color: ${props => props.$color || '#1A1A1A'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;

  h3 {
    font-size: 1rem;
    font-weight: 800;
    color: #111827;
    margin: 0 0 0.5rem 0;
  }

  p {
    font-size: 0.9rem;
    color: #6B7280;
    margin: 0 0 0.75rem 0;
    line-height: 1.5;
  }

  .time {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    color: #9CA3AF;
    font-weight: 600;
  }
`;

const FullScreenLoader = styled.div`
  display: flex; justify-content: center; align-items: center; padding: 5rem 0; color: #1A1A1A;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  background: white;
  border-radius: 12px;
  border: 1px dashed #E5E7EB;
  text-align: center;

  h3 { font-family: 'Times New Roman', Times, serif; font-size: 1.5rem; color: #111827; margin: 1rem 0 0.5rem 0; }
  p { font-size: 0.9rem; color: #6B7280; }
`;

// Helper to get a human-readable relative time
const timeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

// Map order status to icon styles
const statusConfig = {
  PENDING: { icon: Package, bg: '#FFFBEB', color: '#D97706', title: 'Order Placed' },
  PROCESSING: { icon: Package, bg: '#F4F1EB', color: '#1A1A1A', title: 'Processing' },
  SHIPPED: { icon: Package, bg: '#F0FDF4', color: '#16A34A', title: 'Order Shipped' },
  DELIVERED: { icon: Package, bg: '#F0FDF4', color: '#16A34A', title: 'Order Delivered' },
  CANCELLED: { icon: Package, bg: '#FEF2F2', color: '#EF4444', title: 'Order Cancelled' },
};

const AlertsPage = () => {
  const navigate = useNavigate();

  const { data: response, isLoading } = useQuery({
    queryKey: ['userNotifications'],
    queryFn: async () => {
      const res = await apiClient.get('/users/notifications');
      return res.data;
    }
  });

  const notifications = response?.data || [];

  return (
    <>
      <PageWrapper>
        <Container>
          <Header>
            <button onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
            <h1>Updates</h1>
          </Header>

          {isLoading ? (
            <div style={{padding: '2rem', width: '100%'}}><Skeleton count={1} height={200} borderRadius={12} style={{marginBottom: '2rem'}}/><Skeleton count={3} height={40} style={{marginBottom: '1rem'}}/></div>
          ) : notifications.length > 0 ? (
            <NotificationList>
              {notifications.map((notif) => {
                const config = statusConfig[notif.status] || statusConfig.PENDING;
                const IconComp = config.icon;

                return (
                  <NotificationCard key={notif.id} $unread={notif.status === 'PENDING' || notif.status === 'SHIPPED'}>
                    <IconWrapper $bg={config.bg} $color={config.color}>
                      <IconComp size={24} />
                    </IconWrapper>
                    <Content>
                      <h3>{config.title}</h3>
                      <p>{notif.message}</p>
                      <div className="time"><Clock size={12} /> {timeAgo(notif.createdAt)}</div>
                    </Content>
                  </NotificationCard>
                );
              })}
            </NotificationList>
          ) : (
            <EmptyState>
              <Bell size={48} color="#D1D5DB" strokeWidth={1.5} />
              <h3>All Caught Up</h3>
              <p>You have no notifications at the moment. Place an order to start seeing updates here!</p>
            </EmptyState>
          )}
        </Container>
      </PageWrapper>
    </>
  );
};

export default AlertsPage;
