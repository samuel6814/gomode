import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import { useSession } from '../../../api/authClient';
import { CjTag } from '../../../components/ProductMarks';
import { addCjToCart } from '../../../utils/cart';
import { formatGHC } from '../../../utils/Currency';
import { media } from '../../../theme/breakpoints';

const Page = styled.div`
  min-height: 60vh;
  padding: 1.25rem 1rem 6rem;
  font-family: 'Inter', system-ui, sans-serif;

  @media ${media.tablet} {
    padding: 1.75rem 1.5rem 5rem;
  }

  @media ${media.desktop} {
    padding: 2rem 2.5rem 4rem;
  }
`;

const Layout = styled.div`
  display: grid;
  gap: 1.5rem;

  @media ${media.desktop} {
    grid-template-columns: minmax(280px, 520px) 1fr;
    align-items: start;
  }
`;

const Photo = styled.div`
  position: relative;
  aspect-ratio: 3 / 4;
  background: #e6e6e6;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
`;

const Back = styled(Link)`
  display: inline-block;
  margin-bottom: 1rem;
  color: #111;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
`;

const Title = styled.h1`
  margin: 0.4rem 0;
  font-size: clamp(1.35rem, 4vw, 1.8rem);
  font-weight: 600;
  letter-spacing: -0.04em;
`;

const Price = styled.p`
  margin: 0 0 1rem;
  font-size: 1.1rem;
  font-weight: 700;
`;

const Copy = styled.p`
  margin: 0 0 1rem;
  color: #111;
  line-height: 1.5;
`;

const Options = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Option = styled.button`
  border: 1px solid ${(props) => (props.$active ? '#111' : '#ebebeb')};
  background: ${(props) => (props.$active ? '#111' : '#fff')};
  color: ${(props) => (props.$active ? '#fff' : '#111')};
  padding: 0.55rem 0.75rem;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
`;

const Action = styled.button`
  width: 100%;
  margin-bottom: 0.6rem;
  padding: 0.9rem 1rem;
  border-radius: 9999px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  background: ${(props) => (props.$ghost ? 'transparent' : '#111')};
  color: ${(props) => (props.$ghost ? '#111' : '#fff')};
  border: 1px solid #111;

  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const CjProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [variantId, setVariantId] = useState('');
  const [busy, setBusy] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['cjProduct', id],
    queryFn: async () => (await apiClient.get(`/cj/products/${id}`)).data,
  });
  const product = data?.data;
  const variants = product?.variants || [];
  const selected = variants.find((variant) => variant.id === variantId) || variants[0];

  const bagVariant = async () => {
    if (!selected || busy) return;
    setBusy(true);
    try {
      await addCjToCart(apiClient, session, product, selected, 1);
      queryClient.invalidateQueries({ queryKey: ['userCart'] });
    } finally {
      setBusy(false);
    }
  };

  const buyNow = async () => {
    if (!selected || busy) return;
    await bagVariant();
    navigate('/checkout');
  };

  if (isLoading) return <Page>Loading.</Page>;
  if (isError || !product) return <Page>This CJ product is not available.</Page>;

  return (
    <Page>
      <Back to="/cj">CJ</Back>
      <Layout>
        <Photo>
          {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
          <CjTag product={product} />
        </Photo>
        <div>
          <p style={{ margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 12 }}>
            {product.categoryName || 'CJ'}
          </p>
          <Title>{product.name}</Title>
          <Price>{formatGHC(selected?.cediPrice ?? product.cediPrice)}</Price>
          {product.description && <Copy>{product.description}</Copy>}
          {variants.length > 0 && (
            <Options>
              {variants.map((variant) => (
                <Option
                  key={variant.id}
                  type="button"
                  $active={(selected?.id || '') === variant.id}
                  onClick={() => setVariantId(variant.id)}
                >
                  {variant.optionLabel || variant.sku} · {formatGHC(variant.cediPrice)}
                </Option>
              ))}
            </Options>
          )}
          <Action type="button" disabled={!selected || busy} onClick={bagVariant}>
            Add to bag
          </Action>
          <Action type="button" $ghost disabled={!selected || busy} onClick={buyNow}>
            Buy now
          </Action>
        </div>
      </Layout>
    </Page>
  );
};

export default CjProductPage;
