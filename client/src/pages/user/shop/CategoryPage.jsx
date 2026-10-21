import React from 'react';
import styled from 'styled-components';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import Currency from '../../../utils/Currency';
import { ProductGridSkeleton } from '../../../components/ui/Skeleton';
import SEO from '../../../components/SEO';
import { CANVAS, NAVY_ACCENT, INK, LINE, FONT_HERO } from '../../../theme/brand';

const PageWrapper = styled.div`
  background: ${CANVAS};
  min-height: calc(100vh - 80px);
  padding: 2.5rem 1rem 6rem;

  @media (min-width: 768px) {
    padding: 3.5rem 2rem 6rem;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const CategoryPageSummary = styled.div`
  margin-bottom: 4rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid ${LINE};
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }

  h1 {
    font-family: ${FONT_HERO};
    font-size: clamp(2.2rem, 4.5vw, 3.5rem);
    font-weight: 800;
    color: ${INK};
    margin: 0;
    letter-spacing: -0.03em;
    line-height: 1.05;

    span {
      color: ${NAVY_ACCENT};
      font-style: italic;
    }
  }

  p {
    color: #555;
    font-size: 0.95rem;
    max-width: 480px;
    margin: 0;
    line-height: 1.6;
  }
`;

/* --- HERO SECTION --- */
const HeroSection = styled.section`
  margin-bottom: 5rem;
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const HeroCard = styled.div`
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid ${LINE};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  &:hover img {
    transform: scale(1.06);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(17, 20, 24, 0.85) 0%, rgba(17, 20, 24, 0.1) 60%);
  }
`;

const HeroContent = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  right: 2rem;
  z-index: 2;
  color: white;

  span.tag {
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #ffd166;
    margin-bottom: 0.5rem;
    display: block;
  }

  h2 {
    font-family: ${FONT_HERO};
    font-size: 1.6rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    line-height: 1.2;
  }

  button {
    background: transparent;
    border: none;
    color: white;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    padding: 0;
    border-bottom: 1.5px solid white;
    cursor: pointer;
    padding-bottom: 3px;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }
  }
`;

/* --- CATEGORY ROW --- */
const CategorySectionWrapper = styled.section`
  margin-bottom: 5rem;
  border-top: 1px solid ${LINE};
  padding-top: 3.5rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h2 {
    font-family: ${FONT_HERO};
    font-size: 1.85rem;
    font-weight: 800;
    color: ${INK};
    margin: 0;
    letter-spacing: -0.02em;
  }

  a {
    background: transparent;
    color: ${NAVY_ACCENT};
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.85rem;
    border-radius: 9999px;
    border: 1px solid ${LINE};
    background: #fff;
    transition: all 0.2s ease;

    &:hover {
      border-color: ${NAVY_ACCENT};
      background: ${NAVY_ACCENT};
      color: #fff;
    }
  }
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
  display: flex;
  flex-direction: column;
  cursor: pointer;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${LINE};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px -8px rgba(37, 60, 90, 0.15);
    border-color: ${NAVY_ACCENT};
  }
`;

const CardImage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #fbfbf9;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  ${ProductCard}:hover img {
    transform: scale(1.05);
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  background: ${NAVY_ACCENT};
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 0.3rem 0.6rem;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  z-index: 2;
`;

const CardDetails = styled.div`
  padding: 1rem 1.15rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  border-top: 1px solid ${LINE};
`;

const ProductName = styled.h3`
  font-size: 13px;
  font-weight: 700;
  color: ${INK};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PriceText = styled.div`
  font-family: ${FONT_HERO};
  font-size: 14px;
  font-weight: 800;
  color: ${INK};
`;

const CategoryPage = () => {
  const navigate = useNavigate();

  const { data: response, isLoading } = useQuery({
    queryKey: ['storefrontProducts'],
    queryFn: async () => {
      const res = await apiClient.get('/products');
      return res.data;
    },
  });

  const allProducts = response?.data || [];

  if (isLoading) {
    return (
      <PageWrapper>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <ProductGridSkeleton count={8} />
        </div>
      </PageWrapper>
    );
  }

  const heroProducts = allProducts.slice(0, 3);
  const heroTags = ["EDITOR'S PICK", 'NEW FOOTWEAR', 'FEATURED SILHOUETTE'];

  const categoriesMap = {};
  allProducts.forEach((product) => {
    const catName = product.category?.name;
    if (catName) {
      if (!categoriesMap[catName]) categoriesMap[catName] = [];
      categoriesMap[catName].push(product);
    }
  });

  const dynamicCategories = Object.entries(categoriesMap).filter(([_, products]) => products.length > 0);

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: allProducts.slice(0, 20).map((product, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `https://sneakergarden.com/product/${product.id}`,
      name: product.name,
    })),
  };

  return (
    <>
      <SEO
        title="Footwear Categories & Collections | GoMode"
        description="Explore GoMode curated footwear collections: handcrafted sneakers, sculpted clogs, sleek sandals, and luxury slip-ons."
        schema={itemListSchema}
        url="/shop/categories"
      />

      <PageWrapper>
        <Container>
          <CategoryPageSummary>
            <div>
              <h1>
                THE FOOTWEAR <span>COLLECTIONS</span>
              </h1>
            </div>
            <p>
              Explore our architectural silhouettes designed to elevate personal style. Handcrafted precision, superior comfort, and timeless contemporary aesthetics.
            </p>
          </CategoryPageSummary>

          {/* 1. HERO: New In */}
          {heroProducts.length > 0 && (
            <HeroSection>
              <HeroGrid>
                {heroProducts.map((product, i) => {
                  const imgUrl = product.images?.[0]?.image?.url || '/items/black-loafers/black-loafers-1.png';
                  return (
                    <HeroCard key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
                      <img src={imgUrl} alt={product.name} />
                      <HeroContent>
                        <span className="tag">{heroTags[i] || 'CURATED'}</span>
                        <h2>{product.name}</h2>
                        <button>Discover Drop</button>
                      </HeroContent>
                    </HeroCard>
                  );
                })}
              </HeroGrid>
            </HeroSection>
          )}

          {/* 2. DYNAMIC CATEGORY ROWS */}
          {dynamicCategories.map(([categoryName, catProducts]) => (
            <CategorySectionWrapper key={categoryName}>
              <SectionHeader>
                <h2>{categoryName}</h2>
                <Link to={`/shop?category=${categoryName}`}>
                  View All ({catProducts.length}) <ArrowRight size={14} />
                </Link>
              </SectionHeader>

              <ProductGrid>
                {catProducts.slice(0, 4).map((product) => {
                  const imgUrl = product.images?.[0]?.image?.url || '/items/black-loafers/black-loafers-1.png';
                  return (
                    <ProductCard key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
                      <CardImage>
                        <img src={imgUrl} alt={product.name} />
                        {product.stock === 0 && <Badge style={{ background: '#DC2626' }}>Sold Out</Badge>}
                        {product.stock > 0 && product.stock <= 5 && <Badge>Low Stock</Badge>}
                      </CardImage>
                      <CardDetails>
                        <ProductName>{product.name}</ProductName>
                        <PriceText><Currency amount={product.price} /></PriceText>
                      </CardDetails>
                    </ProductCard>
                  );
                })}
              </ProductGrid>
            </CategorySectionWrapper>
          ))}
        </Container>
      </PageWrapper>
    </>
  );
};

export default CategoryPage;