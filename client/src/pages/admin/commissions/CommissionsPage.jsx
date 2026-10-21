import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
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

const Header = styled.div`
  margin-bottom: 2rem;

  span {
    font-size: 0.65rem;
    font-weight: 800;
    color: ${ACCENT_COLOR};
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 900;
    color: #111827;
    margin: 0.35rem 0 0;
    letter-spacing: -1px;
  }
`;

const TableWrap = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th,
  td {
    text-align: left;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #f3f4f6;
  }

  th {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #6b7280;
    background: #f9fafb;
  }

  tr:last-child td {
    border-bottom: none;
  }

  a {
    color: #111827;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      color: ${ACCENT_COLOR};
    }
  }
`;

const Status = styled.span`
  display: inline-block;
  padding: 0.25rem 0.6rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  background: ${(p) =>
    p.$status === 'REPLIED'
      ? '#ecfdf5'
      : p.$status === 'READ'
        ? '#eff6ff'
        : '#fff7ed'};
  color: ${(p) =>
    p.$status === 'REPLIED'
      ? '#059669'
      : p.$status === 'READ'
        ? '#2563eb'
        : '#c2410c'};
`;

const Empty = styled.p`
  padding: 3rem;
  text-align: center;
  color: #6b7280;
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  padding: 4rem;
  color: ${ACCENT_COLOR};
`;

const AdminCommissionsPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminCommissions'],
    queryFn: async () => {
      const res = await apiClient.get('/contact?type=commission');
      return res.data.data || [];
    },
  });

  return (
    <Container>
      <Header>
        <span>Inbox</span>
        <h1>{SERVICE_NAME} requests</h1>
      </Header>

      {isLoading && (
        <Loading>
          <Loader2 size={28} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
        </Loading>
      )}

      {isError && <Empty>Failed to load requests.</Empty>}

      {!isLoading && !isError && (
        <TableWrap>
          {!data?.length ? (
            <Empty>No {SERVICE_NAME.toLowerCase()} inquiries yet.</Empty>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((msg) => (
                  <tr key={msg.id}>
                    <td>
                      <Link to={`/admin/commissions/${msg.id}`}>{msg.name}</Link>
                    </td>
                    <td>{msg.email}</td>
                    <td>{msg.phone || 'N/A'}</td>
                    <td>
                      {new Date(msg.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td>
                      <Status $status={msg.status}>{msg.status}</Status>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </TableWrap>
      )}
    </Container>
  );
};

export default AdminCommissionsPage;
