import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/axios';
import { useSale } from '../utils/sale';
import { BuyyTag, MarkedPrice } from './ProductMarks';
import { Loader2 } from 'lucide-react';
import { NAVY_ACCENT, INK, LINE, FONT_HERO } from '../theme/brand';

const SuggestionsWrapper = styled.div`
  margin-top: 5rem;
  padding-top: 3.5rem;
  border-top: 1px solid ${LINE};
  max-width: 1360px;
  margin-left: auto;
  margin-right: auto;
`;

const Title = styled.h2`
  font-family: ${FONT_HERO};
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${INK};
  margin-bottom: 1.75rem;
  text-align: left;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
`;

const ProductCard = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid ${LINE};
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px -8px rgba(37, 60, 90, 0.15);
    border-color: ${NAVY_ACCENT};
  }
`;

const CardImage = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: #fbfbf9;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  ${ProductCard}:hover img {
    transform: scale(1.05);
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.95);
  padding: 0.25rem 0.6rem;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: ${NAVY_ACCENT};
  text-transform: uppercase;
  border-radius: 4px;
`;

const CardDetails = styled.div`
  padding: 0.85rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border-top: 1px solid ${LINE};
`;

const ProductName = styled.h3`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: ${INK};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PriceText = styled.span`
  font-family: ${FONT_HERO};
  font-size: 13px;
  font-weight: 800;
  color: ${INK};
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 3rem 0;
  color: ${NAVY_ACCENT};
`;

const Suggestions = ({ currentProductId, categoryId }) => {
  const navigate = useNavigate();
  const sale = useSale();

  const { data: response, isLoading } = useQuery({
    queryKey: ['storefrontProducts'],
    queryFn: async () => {
      const res = await apiClient.get('/products');
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <SuggestionsWrapper>
        <Title>CURATED FOR YOU</Title>
        <LoaderWrapper><Loader2 size={28} className="animate-spin" /></LoaderWrapper>
      </SuggestionsWrapper>
    );
  }

  const allProducts = response?.data || [];
  
  // Prefer same category, otherwise other products
  let suggestedProducts = allProducts.filter((p) => p.categoryId === categoryId && p.id !== currentProductId);
  if (suggestedProducts.length < 4) {
    const additional = allProducts.filter((p) => p.id !== currentProductId && !suggestedProducts.some(sp => sp.id === p.id));
    suggestedProducts = [...suggestedProducts, ...additional];
  }
  suggestedProducts = suggestedProducts.slice(0, 4);

  if (suggestedProducts.length === 0) return null;

  return (
    <SuggestionsWrapper>
      <Title>CURATED PAIRS FOR YOU</Title>
      <ProductGrid>
        {suggestedProducts.map((product) => {
          const imgUrl = product.images?.[0]?.image?.url || '/items/black-loafers/black-loafers-1.png';
          return (
            <ProductCard
              key={product.id}
              onClick={() => {
                navigate(`/product/${product.id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <CardImage>
                <img src={imgUrl} alt={product.name} />
                <BuyyTag product={product} />
                {product.stock === 0 && <Badge style={{ color: '#DC2626' }}>Sold Out</Badge>}
                {product.stock > 0 && product.stock <= 5 && <Badge>Low Stock</Badge>}
              </CardImage>
              <CardDetails>
                <ProductName>{product.name}</ProductName>
                <PriceText><MarkedPrice product={product} sale={sale} /></PriceText>
              </CardDetails>
            </ProductCard>
          );
        })}
      </ProductGrid>
    </SuggestionsWrapper>
  );
};

export default Suggestions;
