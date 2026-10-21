import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import { CjTag } from '../../../components/ProductMarks';
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

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1.25rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: -0.04em;
`;

const Count = styled.p`
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.08em;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem 0.65rem;

  @media ${media.tablet} {
    grid-template-columns: repeat(3, 1fr);
  }

  @media ${media.desktop} {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem 1rem;
  }
`;

const Card = styled.button`
  display: flex;
  flex-direction: column;
  padding: 0;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  color: #111;
`;

const Photo = styled.div`
  position: relative;
  aspect-ratio: 3 / 4;
  background: #e6e6e6;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const Name = styled.h2`
  margin: 0.7rem 0 0.2rem;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const Price = styled.p`
  margin: 0;
  font-size: 13px;
  font-weight: 700;
`;

const Empty = styled.p`
  color: #787574;
`;

const CjPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['cjProducts'],
    queryFn: async () => (await apiClient.get('/cj/products')).data,
  });
  const products = data?.data || [];

  return (
    <Page>
      <Head>
        <Title>CJ specials</Title>
        <Count>{products.length} PRODUCTS</Count>
      </Head>
      {isLoading ? (
        <Empty>Loading CJ products.</Empty>
      ) : products.length === 0 ? (
        <Empty>CJ products show up here after an admin sync.</Empty>
      ) : (
        <Grid>
          {products.map((product) => (
            <Card key={product.id} type="button" onClick={() => navigate(`/cj/${product.id}`)}>
              <Photo>
                {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
                <CjTag product={product} />
              </Photo>
              <Name>{product.name}</Name>
              <Price>{formatGHC(product.cediPrice)}</Price>
            </Card>
          ))}
        </Grid>
      )}
    </Page>
  );
};

export default CjPage;
