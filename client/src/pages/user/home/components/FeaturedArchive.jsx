import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { addToCart } from '../../../../utils/cart';
import { formatGHC } from '../../../../utils/Currency';
import { useSession } from '../../../../api/authClient';
import apiClient from '../../../../api/axios';
import {
  CANVAS,
  INK,
  LINE,
  NAVY_ACCENT,
  WHITE,
  MUTED,
  FONT_HERO,
} from '../../../../theme/brand';
import { media } from '../../../../theme/breakpoints';

const Section = styled.section`
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem 1.5rem 5rem;

  @media ${media.tabletUp} {
    padding: 3rem 2.5rem 6.5rem;
  }

  @media ${media.desktop} {
    padding: 3.5rem 3.5rem 7.5rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2.5rem;

  @media ${media.tabletUp} {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 3.5rem;
  }
`;

const TitleCol = styled.div`
  .eyebrow {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${NAVY_ACCENT};
    margin-bottom: 0.5rem;
    display: block;
  }

  h2 {
    font-family: ${FONT_HERO};
    font-size: clamp(1.45rem, 5.2vw, 3.2rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: ${INK};
    line-height: 1.15;
    margin: 0;
    text-transform: uppercase;
    word-break: normal;
    overflow-wrap: break-word;
  }
`;

const FilterTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media ${media.tabletUp} {
    gap: 0.75rem;
    padding-bottom: 0;
  }
`;

const TabButton = styled.button`
  border: 1px solid ${(props) => (props.$active ? NAVY_ACCENT : LINE)};
  background: ${(props) => (props.$active ? NAVY_ACCENT : 'transparent')};
  color: ${(props) => (props.$active ? WHITE : INK)};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.65rem 1.25rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${NAVY_ACCENT};
    color: ${(props) => (props.$active ? WHITE : NAVY_ACCENT)};
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media ${media.tablet} {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  @media ${media.desktop} {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  @media ${media.wide} {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background: ${WHITE};
  border: 1px solid ${LINE};
  position: relative;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: ${NAVY_ACCENT};
    box-shadow: 0 16px 36px rgba(37, 60, 90, 0.08);

    .product-thumb {
      transform: scale(1.06);
    }
  }
`;

const ImageContainer = styled(Link)`
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #EFECE6;
  overflow: hidden;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;

  .product-thumb {
    max-height: 85%;
    max-width: 85%;
    object-fit: contain;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    filter: drop-shadow(0 10px 20px rgba(17, 20, 24, 0.12));
  }
`;

const BadgeRow = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
  pointer-events: none;

  .category-pill {
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    background: rgba(255, 255, 255, 0.92);
    color: ${NAVY_ACCENT};
    padding: 0.3rem 0.65rem;
    border: 1px solid rgba(229, 226, 219, 0.8);
    backdrop-filter: blur(4px);
  }

  .brand-pill {
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${MUTED};
  }
`;

const CardDetails = styled.div`
  padding: 1.25rem 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
`;

const MetaTop = styled.div`
  margin-bottom: 1.25rem;

  h3 {
    font-family: ${FONT_HERO};
    font-size: 1.0625rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: ${INK};
    margin: 0 0 0.4rem;
    line-height: 1.25;

    a {
      color: inherit;
      text-decoration: none;
      transition: color 0.2s ease;
      &:hover {
        color: ${NAVY_ACCENT};
      }
    }
  }

  .price {
    font-size: 1.125rem;
    font-weight: 800;
    color: ${INK};
    letter-spacing: -0.02em;
    margin: 0;
  }
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid ${LINE};
  gap: 0.75rem;
`;

const SizesPill = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: ${MUTED};
  text-transform: uppercase;
`;

const QuickAddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: ${(props) => (props.$added ? '#2E7D32' : NAVY_ACCENT)};
  color: ${WHITE};
  border: none;
  padding: 0.55rem 1rem;
  font-size: 0.71875rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$added ? '#2E7D32' : INK)};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BottomCta = styled.div`
  margin-top: 3.5rem;
  text-align: center;
`;

const ViewFullShopBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: ${INK};
  color: ${WHITE};
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 1.1rem 2.75rem;
  transition: all 0.25s ease;
  box-shadow: 0 4px 14px rgba(17, 20, 24, 0.12);

  &:hover {
    background: ${NAVY_ACCENT};
    box-shadow: 0 8px 24px rgba(37, 60, 90, 0.25);
    transform: translateY(-2px);
  }
`;

const TABS = ['All Pieces', 'Outerwear & Jackets', 'Denim & Jeans', 'Sweaters & Knits', 'Shirts', 'Bags & Accessories'];

const FeaturedArchive = ({ products = [] }) => {
  const [selectedTab, setSelectedTab] = useState('All Pieces');
  const [addedIds, setAddedIds] = useState({});
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const filteredProducts = products.filter((item) => {
    if (selectedTab === 'All Pieces') return true;
    return item.category?.name === selectedTab;
  });

  const handleQuickAdd = async (product) => {
    try {
      setAddedIds((prev) => ({ ...prev, [product.id]: 'loading' }));
      await addToCart(apiClient, session, product);
      queryClient.invalidateQueries({ queryKey: ['userCart'] });
      setAddedIds((prev) => ({ ...prev, [product.id]: 'done' }));
      setTimeout(() => {
        setAddedIds((prev) => ({ ...prev, [product.id]: null }));
      }, 2000);
    } catch (err) {
      console.error('Failed to add to bag', err);
      setAddedIds((prev) => ({ ...prev, [product.id]: null }));
    }
  };

  return (
    <Section>
      <SectionHeader>
        <TitleCol>
          <span className="eyebrow">Collection No. 1</span>
          <h2>The GoMode Archive</h2>
        </TitleCol>

        <FilterTabs>
          {TABS.map((tab) => (
            <TabButton
              key={tab}
              $active={selectedTab === tab}
              onClick={() => setSelectedTab(tab)}
              type="button"
            >
              {tab}
            </TabButton>
          ))}
        </FilterTabs>
      </SectionHeader>

      <ProductGrid>
        {filteredProducts.slice(0, 8).map((product) => {
          const imgUrl = product.images?.[0]?.image?.url || '/gomode.jpeg';
          const isAdded = addedIds[product.id] === 'done';
          const isLoading = addedIds[product.id] === 'loading';

          const sizeTags = (product.tags || [])
            .filter((t) => t.startsWith('Size '))
            .map((t) => t.replace('Size ', ''));
          const sizeDisplay = sizeTags.length > 0 ? sizeTags.slice(0, 4).join(' • ') : 'Curated Fit';

          return (
            <Card key={product.id}>
              <ImageContainer to={`/product/${product.id}`}>
                <BadgeRow>
                  <span className="category-pill">{product.category?.name || 'Apparel'}</span>
                  {product.brand && <span className="brand-pill">{product.brand}</span>}
                </BadgeRow>
                <img src={imgUrl} alt={product.name} className="product-thumb" />
              </ImageContainer>

              <CardDetails>
                <MetaTop>
                  <h3>
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                  </h3>
                  <p className="price">{formatGHC(product.price)}</p>
                </MetaTop>

                <ActionRow>
                  <SizesPill>{sizeDisplay}</SizesPill>
                  <QuickAddButton
                    type="button"
                    $added={isAdded}
                    disabled={isLoading}
                    onClick={() => handleQuickAdd(product)}
                  >
                    {isAdded ? (
                      <>
                        <Check size={13} strokeWidth={2.5} />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={13} strokeWidth={2} />
                        <span>{isLoading ? 'Adding...' : 'Add to Bag'}</span>
                      </>
                    )}
                  </QuickAddButton>
                </ActionRow>
              </CardDetails>
            </Card>
          );
        })}
      </ProductGrid>

      <BottomCta>
        <ViewFullShopBtn to="/shop">
          <span>Discover Complete Collection</span>
          <ArrowRight size={15} />
        </ViewFullShopBtn>
      </BottomCta>
    </Section>
  );
};

export default FeaturedArchive;
