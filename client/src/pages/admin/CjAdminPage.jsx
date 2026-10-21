import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, RefreshCw } from 'lucide-react';
import apiClient from '../../api/axios';
import { media } from '../../theme/breakpoints';

const Page = styled.div`
  padding: 1.25rem 1rem 3rem;
  background: #fafafa;
  min-height: 100vh;
  font-family: 'Inter', system-ui, sans-serif;
  max-width: 100%;

  @media ${media.tablet} {
    padding: 1.75rem 1.5rem 3rem;
  }

  @media ${media.desktop} {
    padding: 2.5rem 3rem;
  }
`;

const Title = styled.h1`
  margin: 0 0 0.35rem;
  font-size: 1.6rem;
  font-weight: 600;
`;

const Note = styled.p`
  margin: 0 0 1.5rem;
  color: #6b7280;
`;

const Card = styled.form`
  background: #fff;
  border: 1px solid #ebebeb;
  padding: 1.5rem;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 13px;
  font-weight: 600;
`;

const Field = styled.input`
  border: 1px solid #ebebeb;
  padding: 0.7rem 0.8rem;
  font: inherit;
`;

const Button = styled.button`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: none;
  background: #000;
  color: #fff;
  padding: 0.75rem 1rem;
  font: inherit;
  cursor: pointer;
`;

const Status = styled.p`
  margin: 0;
  font-size: 13px;
`;

const TableWrap = styled.div`
  width: 100%;
  max-width: 960px;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;
  background: #fff;
  font-size: 13px;

  th, td {
    text-align: left;
    padding: 0.7rem 0.8rem;
    border-bottom: 1px solid #ebebeb;
    vertical-align: top;
  }
`;

const CjAdminPage = () => {
  const queryClient = useQueryClient();
  const [keyword, setKeyword] = useState('shirt');
  const [pages, setPages] = useState('1');
  const [message, setMessage] = useState('');
  const [rate, setRate] = useState('11.75');
  const [tax, setTax] = useState('15');

  const { data: statusResponse } = useQuery({
    queryKey: ['cjAdminStatus'],
    queryFn: async () => (await apiClient.get('/admin/cj/status')).data,
  });
  const { data: productResponse } = useQuery({
    queryKey: ['cjAdminProducts'],
    queryFn: async () => (await apiClient.get('/admin/cj/products')).data,
  });

  const { data: pricingResponse } = useQuery({
    queryKey: ['cjPricing'],
    queryFn: async () => (await apiClient.get('/cj/pricing')).data,
  });

  useEffect(() => {
    if (!pricingResponse?.data) return;
    setRate(String(pricingResponse.data.usdToGhs));
    setTax(String(pricingResponse.data.taxPercent));
  }, [pricingResponse]);

  const status = statusResponse?.data;
  const products = productResponse?.data || [];

  const savePricing = useMutation({
    mutationFn: async () => {
      const res = await apiClient.put('/admin/cj/pricing', {
        usdToGhs: Number(rate),
        taxPercent: Number(tax),
      });
      return res.data;
    },
    onSuccess: () => {
      setMessage('Exchange rate and tax saved. CJ prices are in cedis.');
      queryClient.invalidateQueries({ queryKey: ['cjPricing'] });
      queryClient.invalidateQueries({ queryKey: ['cjProducts'] });
      queryClient.invalidateQueries({ queryKey: ['cjProduct'] });
      queryClient.invalidateQueries({ queryKey: ['cjAdminProducts'] });
    },
    onError: (error) => {
      setMessage(error.response?.data?.message || 'Could not save the rate.');
    },
  });

  const sync = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post('/admin/cj/sync', {
        keyword,
        pages: Number(pages),
      });
      return res.data;
    },
    onSuccess: (result) => {
      setMessage(`Saved ${result.data?.saved || 0} products.`);
      queryClient.invalidateQueries({ queryKey: ['cjAdminStatus'] });
      queryClient.invalidateQueries({ queryKey: ['cjAdminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['cjProducts'] });
    },
    onError: (error) => {
      setMessage(error.response?.data?.message || 'Sync failed.');
    },
  });

  return (
    <Page>
      <Title>CJ</Title>
      <Note>
        These products stay out of the buyy catalog. Cedis = USD × rate × (1 + tax / 100).
        A $10 item at 11.75 and 15% tax is GHC 135.13.
      </Note>
      <Card
        onSubmit={(event) => {
          event.preventDefault();
          setMessage('');
          savePricing.mutate();
        }}
      >
        <Label>
          Cedis per 1 US dollar
          <Field type="number" min="0.01" step="0.01" value={rate} onChange={(event) => setRate(event.target.value)} />
        </Label>
        <Label>
          Tax percent
          <Field type="number" min="0" max="100" step="0.01" value={tax} onChange={(event) => setTax(event.target.value)} />
        </Label>
        <Button type="submit" disabled={savePricing.isPending}>
          {savePricing.isPending ? <Loader2 size={16} /> : null}
          Save rate and tax
        </Button>
      </Card>
      <Card
        onSubmit={(event) => {
          event.preventDefault();
          setMessage('');
          sync.mutate();
        }}
      >
        <Status>
          {status?.keyConfigured ? 'API key is set.' : 'API key is missing.'}
          {' '}
          {status?.connected ? 'Token is active.' : 'Token is not active yet.'}
          {' '}
          {status?.productCount || 0} stored.
        </Status>
        <Label>
          Keyword
          <Field value={keyword} onChange={(event) => setKeyword(event.target.value)} />
        </Label>
        <Label>
          Pages (1 to 5, 20 products each)
          <Field type="number" min="1" max="5" value={pages} onChange={(event) => setPages(event.target.value)} />
        </Label>
        <Button type="submit" disabled={sync.isPending}>
          {sync.isPending ? <Loader2 size={16} /> : <RefreshCw size={16} />}
          Sync from CJ
        </Button>
        {message && <Status>{message}</Status>}
      </Card>
      <TableWrap>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>USD</th>
            <th>GHC</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.categoryName}</td>
              <td>${Number(product.price || 0).toFixed(2)}</td>
              <td>GHC {Number(product.cediPrice || 0).toFixed(2)}</td>
              <td>{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      </TableWrap>
    </Page>
  );
};

export default CjAdminPage;
