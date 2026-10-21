import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import Currency from '../../../utils/Currency';
import {
  BRAND_NAME_PLAIN,
  FONT_FAMILY,
  INK,
  MUTED,
  PAPER,
} from '../../../theme/brand';
import { media } from '../../../theme/breakpoints';
import { ProductSkeleton } from '../../../components/ui/Skeleton';

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1rem;
  font-family: ${FONT_FAMILY};

  @media ${media.tabletUp} {
    padding: 6rem 1.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.1;
  color: ${INK};
`;

const ViewAll = styled(Link)`
  color: ${INK};
  text-decoration: none;
  font-size: 14px;
  border-bottom: 1px solid ${INK};
  padding-bottom: 2px;
  margin-bottom: 4px;

  &:hover {
    color: ${MUTED};
    border-color: ${MUTED};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 0.75rem;
  row-gap: 2.5rem;

  @media ${media.tabletUp} {
    grid-template-columns: repeat(3, 1fr);
    column-gap: 1rem;
    row-gap: 3rem;
  }

  @media ${media.desktop} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  background: #ffffff;
`;

const ImageWrap = styled.div`
  aspect-ratio: 4 / 5;
  background: ${PAPER};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    mix-blend-mode: multiply;
    transition: transform 0.5s ease;
  }

  ${Card}:hover & img {
    transform: scale(1.05);
  }
`;

const CardBody = styled.div`
  padding: 1rem 0.25rem;
`;

const BrandLine = styled.p`
  margin: 0 0 0.25rem;
  font-size: 11px;
  color: #000000;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.35;
  color: ${INK};
`;

const CardPrice = styled.p`
  margin: 0.15rem 0 0;
  font-size: 13px;
  color: ${MUTED};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2.5rem 1.5rem;
  background: #ffffff;
  border: 1px solid #e6e7e9;

  p {
    margin: 0 0 1.25rem;
    color: ${MUTED};
    font-size: 15px;
    line-height: 1.5;
  }
`;

const EmptyCta = styled(Link)`
  display: inline-flex;
  border-radius: 30px;
  padding: 0.75rem 1.5rem;
  background: ${INK};
  color: #ffffff;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;

  &:hover {
    background: #1a2635;
  }
`;

const fetchProducts = async () => {
  const res = await apiClient.get('/products');
  return res.data;
};

const ShopSection = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ['storefrontProducts'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const products = (response?.data || [])
    .filter((product) => product.isActive !== false && product.images?.[0]?.image?.url)
    .slice(0, 8);

  return (
    <Section>
      <Header>
        <Title>New Arrivals</Title>
        <ViewAll to="/shop">View all</ViewAll>
      </Header>

      {isLoading ? (
        <Grid>
          {[...Array(8)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </Grid>
      ) : products.length === 0 ? (
        <EmptyState>
          <p>New sneakers are on the way. Browse the shop for what is in stock now.</p>
          <EmptyCta to="/shop">Shop Collection</EmptyCta>
        </EmptyState>
      ) : (
        <Grid>
          {products.map((product) => {
            const img = product.images[0].image.url;

            return (
              <Card key={product.id} to={`/product/${product.id}`}>
                <ImageWrap>
                  <img src={img} alt={product.name} width={400} height={500} loading="lazy" decoding="async" />
                </ImageWrap>
                <CardBody>
                  <BrandLine>{BRAND_NAME_PLAIN}</BrandLine>
                  <CardTitle>{product.name}</CardTitle>
                  <CardPrice>
                    <Currency amount={product.price} />
                  </CardPrice>
                </CardBody>
              </Card>
            );
          })}
        </Grid>
      )}
    </Section>
  );
};

export { fetchProducts };
export default ShopSection;
