import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Mail, MessageCircle } from 'lucide-react';
import apiClient from '../../../api/axios';
import { ACCENT_COLOR, SERVICE_NAME } from '../../../theme/brand';

const Container = styled.div`
  padding: 2.5rem 3rem;
  background: #fafafa;
  min-height: 100vh;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Back = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #6b7280;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1.5rem;

  &:hover {
    color: ${ACCENT_COLOR};
  }
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 2rem;
  max-width: 720px;
`;

const Title = styled.h1`
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
  color: #111827;
`;

const Meta = styled.div`
  display: grid;
  gap: 0.5rem;
  margin: 1.5rem 0;
  color: #374151;
  font-size: 0.95rem;

  strong {
    color: #6b7280;
    font-weight: 600;
    margin-right: 0.35rem;
  }
`;

const Message = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  padding: 1.25rem;
  line-height: 1.6;
  color: #111827;
  white-space: pre-wrap;
  margin-bottom: 1.5rem;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const Btn = styled.button`
  background: ${(p) => (p.$primary ? ACCENT_COLOR : 'transparent')};
  color: ${(p) => (p.$primary ? '#fff' : '#111827')};
  border: 1px solid ${(p) => (p.$primary ? ACCENT_COLOR : '#e5e7eb')};
  padding: 0.75rem 1.1rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ExtLink = styled.a`
  background: transparent;
  color: #111827;
  border: 1px solid #e5e7eb;
  padding: 0.75rem 1.1rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
`;

const Status = styled.span`
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.2rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 700;
  background: #eff6ff;
  color: #2563eb;
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  padding: 4rem;
  color: ${ACCENT_COLOR};
`;

const AdminCommissionDetailPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: message, isLoading, isError } = useQuery({
    queryKey: ['adminCommission', id],
    queryFn: async () => {
      const res = await apiClient.get(`/contact/${id}`);
      return res.data.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async (status) => {
      const res = await apiClient.patch(`/contact/${id}`, { status });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCommission', id] });
      queryClient.invalidateQueries({ queryKey: ['adminCommissions'] });
    },
  });

  useEffect(() => {
    if (message?.status === 'UNREAD') {
      statusMutation.mutate('READ');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message?.id, message?.status]);

  if (isLoading) {
    return (
      <Container>
        <Loading>
          <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
        </Loading>
      </Container>
    );
  }

  if (isError || !message) {
    return (
      <Container>
        <Back to="/admin/commissions">
          <ArrowLeft size={16} /> Back to {SERVICE_NAME}
        </Back>
        <p>Request not found.</p>
      </Container>
    );
  }

  const waPhone = message.phone
    ? `https://wa.me/${message.phone.replace(/\D/g, '')}`
    : null;

  return (
    <Container>
      <Back to="/admin/commissions">
        <ArrowLeft size={16} /> Back to {SERVICE_NAME}
      </Back>

      <Card>
        <Title>
          {message.name}
          <Status>{message.status}</Status>
        </Title>
        <Meta>
          <div>
            <strong>Email</strong>
            {message.email}
          </div>
          <div>
            <strong>Phone</strong>
            {message.phone || 'N/A'}
          </div>
          <div>
            <strong>Subject</strong>
            {message.subject || 'N/A'}
          </div>
          <div>
            <strong>Date</strong>
            {new Date(message.createdAt).toLocaleString()}
          </div>
        </Meta>

        <Message>{message.message}</Message>

        <Actions>
          <Btn
            $primary
            type="button"
            disabled={
              message.status === 'REPLIED' || statusMutation.isPending
            }
            onClick={() => statusMutation.mutate('REPLIED')}
          >
            Mark as replied
          </Btn>
          <ExtLink href={`mailto:${message.email}`}>
            <Mail size={14} /> Email client
          </ExtLink>
          {waPhone && (
            <ExtLink href={waPhone} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={14} /> WhatsApp
            </ExtLink>
          )}
        </Actions>
      </Card>
    </Container>
  );
};

export default AdminCommissionDetailPage;
