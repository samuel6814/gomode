import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save } from 'lucide-react';
import apiClient from '../../api/axios';
import { CANVAS, NAVY_ACCENT, INK, LINE, FONT_HERO } from '../../theme/brand';

const Page = styled.div`
  padding: 2.5rem 3rem;
  background: ${CANVAS};
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Title = styled.h1`
  margin: 0 0 0.35rem;
  font-family: ${FONT_HERO};
  font-size: 2.2rem;
  font-weight: 800;
  color: ${INK};
`;

const Note = styled.p`
  margin: 0 0 1.5rem;
  color: #6b7280;
  font-size: 0.95rem;
`;

const Card = styled.form`
  background: #fff;
  border: 1px solid ${LINE};
  border-radius: 12px;
  padding: 2rem;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 13px;
  font-weight: 700;
  color: ${INK};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Field = styled.input`
  border: 1px solid ${LINE};
  border-radius: 8px;
  padding: 0.85rem 1rem;
  font: inherit;
  font-size: 0.95rem;
  outline: none;
  background: #F5F3EF;

  &:focus { border-color: ${NAVY_ACCENT}; }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  max-height: 360px;
  overflow: auto;
  border: 1px solid ${LINE};
  border-radius: 8px;
  padding: 1rem;
  background: #F5F3EF;
`;

const Item = styled.label`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  font-weight: 600;
  font-size: 0.9rem;
  color: ${INK};
  cursor: pointer;

  input[type="checkbox"] {
    accent-color: ${NAVY_ACCENT};
    width: 16px;
    height: 16px;
  }
`;

const SaveButton = styled.button`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  background: ${NAVY_ACCENT};
  color: #fff;
  padding: 0.85rem 1.5rem;
  border-radius: 50px;
  font-family: ${FONT_HERO};
  font-weight: 800;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const Status = styled.p`
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: ${NAVY_ACCENT};
`;

function toLocalInput(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const SalesPage = () => {
  const queryClient = useQueryClient();
  const { data: saleResponse } = useQuery({
    queryKey: ['storefrontSale'],
    queryFn: async () => (await apiClient.get('/sales')).data,
  });
  const { data: productResponse } = useQuery({
    queryKey: ['adminSaleProducts'],
    queryFn: async () => (await apiClient.get('/products?includeInactive=true')).data,
  });

  const [percent, setPercent] = useState('45');
  const [endsAt, setEndsAt] = useState('');
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const sale = saleResponse?.data;
    if (!sale) return;
    setPercent(String(sale.discountPercent || 45));
    setEndsAt(toLocalInput(sale.endsAt));
    setSelected(sale.productIds || []);
  }, [saleResponse]);

  const products = productResponse?.data || [];

  const save = useMutation({
    mutationFn: async () => {
      const res = await apiClient.put('/sales', {
        discountPercent: Number(percent),
        endsAt: new Date(endsAt).toISOString(),
        productIds: selected,
      });
      return res.data;
    },
    onSuccess: () => {
      setMessage('Sale saved.');
      queryClient.invalidateQueries({ queryKey: ['storefrontSale'] });
    },
    onError: (error) => {
      setMessage(error.response?.data?.message || 'Could not save the sale.');
    },
  });

  const toggle = (id) => {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <Page>
      <Title>Sales</Title>
      <Note>The homepage countdown and checkout use this discount until the end time.</Note>
      <Card
        onSubmit={(event) => {
          event.preventDefault();
          setMessage('');
          save.mutate();
        }}
      >
        <Label>
          Discount percent
          <Field type="number" min="1" max="99" value={percent} onChange={(event) => setPercent(event.target.value)} />
        </Label>
        <Label>
          Ends
          <Field type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} required />
        </Label>
        <Label>
          Products
          <List>
            {products.map((product) => (
              <Item key={product.id}>
                <input type="checkbox" checked={selected.includes(product.id)} onChange={() => toggle(product.id)} />
                {product.name}
              </Item>
            ))}
          </List>
        </Label>
        <SaveButton type="submit" disabled={save.isPending}>
          {save.isPending ? <Loader2 size={16} /> : <Save size={16} />}
          Save sale
        </SaveButton>
        {message && <Status>{message}</Status>}
      </Card>
    </Page>
  );
};

export default SalesPage;
