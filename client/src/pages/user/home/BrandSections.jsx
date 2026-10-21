import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FONT_FAMILY, INK, LINE, MUTED, PAPER } from '../../../theme/brand';
import { fetchProducts } from './ShopSection';

const Story = styled.section`
  background: ${PAPER};
  padding: 5rem 1.5rem;
  border-top: 1px solid ${LINE};
  border-bottom: 1px solid ${LINE};
  font-family: ${FONT_FAMILY};
`;

const StoryInner = styled.div`
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
`;

const StoryTitle = styled.h2`
  margin: 0 0 1.5rem;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.1;
  color: ${INK};

  @media (min-width: 768px) {
    font-size: 44px;
  }
`;

const StoryCopy = styled.p`
  margin: 0 auto;
  max-width: 640px;
  font-size: 16px;
  line-height: 1.4;
  color: ${MUTED};
`;

const OutlineLink = styled(Link)`
  display: inline-flex;
  margin-top: 2.5rem;
  border-radius: 30px;
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: ${INK};
  border: 1px solid ${LINE};
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;

  &:hover {
    border-color: #dcdddf;
  }
`;

const Split = styled.section`
  background: ${PAPER};
  overflow: hidden;
  border-bottom: 1px solid ${LINE};
  font-family: ${FONT_FAMILY};
`;

const SplitInner = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const SplitCopy = styled.div`
  width: 100%;
  padding: 4rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (min-width: 768px) {
    width: 50%;
    padding: 6rem 3rem 6rem 4rem;
  }

  @media (min-width: 1024px) {
    padding-left: 8rem;
  }
`;

const SplitTitle = styled.h2`
  margin: 0 0 1.5rem;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.1;
  color: ${INK};

  @media (min-width: 768px) {
    font-size: 30px;
  }
`;

const SplitText = styled.p`
  margin: 0 0 2rem;
  font-size: 16px;
  line-height: 1.4;
  color: ${MUTED};
`;

const TextLink = styled(Link)`
  width: fit-content;
  font-size: 15px;
  font-weight: 500;
  color: ${INK};
  text-decoration: none;
  border-bottom: 1px solid ${INK};
  padding-bottom: 4px;

  &:hover {
    color: ${MUTED};
    border-color: ${MUTED};
  }
`;

const SplitVisual = styled.div`
  width: 100%;
  height: 400px;
  background: #e6e7e9;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (min-width: 768px) {
    width: 50%;
    height: auto;
    min-height: 420px;
  }
`;

const BrandSections = () => {
  const { data: response } = useQuery({
    queryKey: ['storefrontProducts'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const materialsImage = (response?.data || []).find(
    (product) => product.isActive !== false && product.images?.[0]?.image?.url
  )?.images?.[0]?.image?.url;

  return (
    <>
      <Story>
        <StoryInner>
          <StoryTitle>Honest design, built from the ground up.</StoryTitle>
          <StoryCopy>
            We believe that good footwear shouldn&apos;t come at the cost of the environment.
            Every piece on buyy is listed with a clear price in Ghana cedis, using photos from the live catalog.
            and designed to outlast passing trends.
          </StoryCopy>
          <OutlineLink to="/about">Read our story</OutlineLink>
        </StoryInner>
      </Story>

      <Split>
        <SplitInner>
          <SplitCopy>
            <SplitTitle>Materials that matter.</SplitTitle>
            <SplitText>
              From organic cotton laces to outsoles made from recycled rubber, we carefully select
              every element of our sneakers. Our flat-lay approach to materials means nothing is
              hidden—what you see is exactly what you step into.
            </SplitText>
            <TextLink to="/shop">Explore our materials</TextLink>
          </SplitCopy>
          <SplitVisual>
            {materialsImage && (
              <img src={materialsImage} alt="Materials from the current collection" />
            )}
          </SplitVisual>
        </SplitInner>
      </Split>
    </>
  );
};

export default BrandSections;
