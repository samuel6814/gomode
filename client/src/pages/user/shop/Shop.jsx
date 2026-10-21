import React, { useEffect, useMemo, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { ArrowUp, Check, ChevronDown, Heart, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import { useSession } from '../../../api/authClient';
import { addToCart } from '../../../utils/cart';
import { useSale } from '../../../utils/sale';
import { BuyyTag, MarkedPrice } from '../../../components/ProductMarks';
import { ProductGridSkeleton } from '../../../components/ui/Skeleton';
import { media } from '../../../theme/breakpoints';
import { CANVAS, NAVY_ACCENT, INK, LINE, FONT_HERO } from '../../../theme/brand';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const PageWrapper = styled.div`
  background: ${CANVAS};
  min-height: calc(100vh - 80px);
  padding: 2rem 1rem 6rem;

  @media ${media.tablet} {
    padding: 2.5rem 2rem 5rem;
  }

  @media ${media.desktop} {
    padding: 3rem 4rem 6rem;
    max-width: 1440px;
    margin: 0 auto;
  }
`;

const HeaderSection = styled.header`
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${LINE};
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media ${media.tablet} {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
`;

const HeaderTitle = styled.h1`
  font-family: ${FONT_HERO};
  font-size: clamp(2rem, 4vw, 3.25rem);
  font-weight: 800;
  color: ${INK};
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin: 0;

  span {
    color: ${NAVY_ACCENT};
    font-style: italic;
  }
`;

const HeaderSubtitle = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #555;
  max-width: 520px;
  line-height: 1.5;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const Menu = styled.div`
  position: relative;
`;

const MenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 40px;
  padding: 0 1rem;
  background: #fff;
  border: 1px solid ${(props) => (props.$active ? NAVY_ACCENT : LINE)};
  color: ${(props) => (props.$active ? NAVY_ACCENT : INK)};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  &:hover {
    border-color: ${NAVY_ACCENT};
  }
`;

const MenuList = styled.div`
  position: absolute;
  z-index: 20;
  top: calc(100% + 6px);
  left: 0;
  min-width: 200px;
  max-height: 300px;
  overflow: auto;
  background: #fff;
  border: 1px solid ${LINE};
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding: 0.35rem 0;
`;

const MenuItem = styled.button`
  background: ${(props) => (props.$active ? NAVY_ACCENT : 'transparent')};
  color: ${(props) => (props.$active ? '#fff' : INK)};
  border: none;
  text-align: left;
  padding: 0.7rem 1rem;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: ${(props) => (props.$active ? NAVY_ACCENT : '#F0EEE8')};
  }
`;

const Count = styled.div`
  margin-left: auto;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${NAVY_ACCENT};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem 1rem;

  @media ${media.tablet} {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem 1.25rem;
  }

  @media ${media.desktop} {
    grid-template-columns: repeat(4, 1fr);
    gap: 2.5rem 1.5rem;
  }
`;

const ProductCard = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  background: #fff;
  border: 1px solid ${LINE};
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -10px rgba(37, 60, 90, 0.15);
    border-color: ${NAVY_ACCENT};
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #fbfbf9;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }

  ${ProductCard}:hover img {
    transform: scale(1.05);
  }
`;

const HeartButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid ${LINE};
  background: rgba(255, 255, 255, 0.9);
  color: ${NAVY_ACCENT};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #fff;
    transform: scale(1.1);
  }
`;

const QuickAddBar = styled.button`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: ${(props) => (props.$success ? '#10B981' : NAVY_ACCENT)};
  color: #fff;
  border: none;
  padding: 0.85rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  cursor: pointer;
  transform: ${(props) => (props.$isPending || props.$success ? 'translateY(0)' : 'translateY(100%)')};
  transition: transform 0.25s ease, background 0.2s ease;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  ${ProductCard}:hover & {
    transform: translateY(0);
  }

  &:hover {
    background: ${(props) => (props.$success ? '#10B981' : '#1b2c42')};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  .animate-spin {
    animation: ${spin} 1s linear infinite;
  }

  @media ${media.mobile} {
    display: none;
  }
`;

const CardContent = styled.div`
  padding: 1rem 1.15rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  background: #fff;
  border-top: 1px solid ${LINE};
`;

const ProductCategory = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${NAVY_ACCENT};
`;

const ProductName = styled.h3`
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: ${INK};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductPrice = styled.div`
  color: ${INK};
  font-family: ${FONT_HERO};
  font-size: 15px;
  font-weight: 800;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.25rem;
  gap: 0.5rem;
`;

const MobileAddButton = styled.button`
  display: none;
  background: ${NAVY_ACCENT};
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  align-items: center;
  gap: 4px;

  @media ${media.mobile} {
    display: inline-flex;
  }

  &:hover {
    background: #1b2c42;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Empty = styled.div`
  padding: 5rem 1rem;
  text-align: center;
  color: #666;
  font-size: 1rem;
  background: #fff;
  border: 1px dashed ${LINE};
  border-radius: 12px;
`;

const ScrollTopBtn = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${NAVY_ACCENT};
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 50;
  box-shadow: 0 8px 20px rgba(37, 60, 90, 0.25);
  transition: transform 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    background: #1b2c42;
  }
`;

const sizesOf = (product) =>
  (product.tags || [])
    .filter((tag) => tag.startsWith('size:'))
    .map((tag) => tag.slice(5));

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'ALL';
  const [activeFilter, setActiveFilter] = useState(initialCategory);
  const [sort, setSort] = useState('newest');
  const [colour, setColour] = useState('ALL');
  const [size, setSize] = useState('ALL');
  const [openMenu, setOpenMenu] = useState(null);
  const [successItemId, setSuccessItemId] = useState(null);
  const sale = useSale();

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const IS_LOGGED_IN = !!session;

  useEffect(() => {
    const cat = searchParams.get('category');
    setActiveFilter(cat || 'ALL');
  }, [searchParams]);

  useEffect(() => {
    const close = () => setOpenMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  const { data: response, isLoading } = useQuery({
    queryKey: ['storefrontProducts'],
    queryFn: async () => (await apiClient.get('/products')).data,
  });

  const { data: wishlistResponse } = useQuery({
    queryKey: ['userWishlist'],
    queryFn: async () => (await apiClient.get('/users/wishlist')).data,
    enabled: IS_LOGGED_IN,
  });

  const products = response?.data || [];
  const wishedIds = useMemo(() => {
    const fromServer = (wishlistResponse?.data || []).map((item) => item.product?.id || item.productId);
    return new Set(fromServer);
  }, [wishlistResponse]);

  const addToCartMutation = useMutation({
    mutationFn: async (product) => {
      await addToCart(apiClient, session, product, 1);
    },
    onSuccess: (_, product) => {
      queryClient.invalidateQueries({ queryKey: ['userCart'] });
      setSuccessItemId(product.id);
      setTimeout(() => setSuccessItemId(null), 2000);
    },
  });

  const wishlistMutation = useMutation({
    mutationFn: async (productId) => {
      await apiClient.post('/users/wishlist/toggle', { productId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userWishlist'] });
    },
  });

  const handleQuickAdd = (event, product) => {
    event.preventDefault();
    event.stopPropagation();
    if (!IS_LOGGED_IN) return navigate('/login');
    if (product.stock > 0) addToCartMutation.mutate(product);
  };

  const handleHeart = (event, product) => {
    event.preventDefault();
    event.stopPropagation();
    if (!IS_LOGGED_IN) return navigate('/login');
    wishlistMutation.mutate(product.id);
  };

  // Discover all distinct categories in the catalog
  const categoryNames = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category?.name) set.add(p.category.name);
    });
    return Array.from(set).sort();
  }, [products]);

  const colourOptions = [...new Set(products.flatMap((product) => product.colors || []))].sort();
  const sizeOptions = [...new Set(products.flatMap(sizesOf))].sort();

  const filteredProducts = products
    .filter((product) => activeFilter === 'ALL' || product.category?.name?.toLowerCase() === activeFilter.toLowerCase())
    .filter((product) => colour === 'ALL' || (product.colors || []).includes(colour))
    .filter((product) => size === 'ALL' || sizesOf(product).includes(size))
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return 0;
    });

  const toggleMenu = (event, key) => {
    event.stopPropagation();
    setOpenMenu((current) => (current === key ? null : key));
  };

  const choose = (event, apply) => {
    event.stopPropagation();
    apply();
    setOpenMenu(null);
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <ProductGridSkeleton count={8} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <HeaderSection>
        <div>
          <HeaderTitle>
            SNEAKER <span>GARDEN</span> CATALOG
          </HeaderTitle>
          <HeaderSubtitle>
            Handcrafted silhouettes, contemporary sneakers, sculpted clogs, and iconic sandals designed for modern elegance.
          </HeaderSubtitle>
        </div>
      </HeaderSection>

      <Toolbar>
        <Menu>
          <MenuButton type="button" $active={sort !== 'newest'} onClick={(event) => toggleMenu(event, 'sort')}>
            Sort <ChevronDown size={14} />
          </MenuButton>
          {openMenu === 'sort' && (
            <MenuList>
              {[
                ['newest', 'Newest'],
                ['price-asc', 'Price: Low to High'],
                ['price-desc', 'Price: High to Low'],
              ].map(([value, label]) => (
                <MenuItem key={value} type="button" $active={sort === value} onClick={(event) => choose(event, () => setSort(value))}>
                  {label}
                </MenuItem>
              ))}
            </MenuList>
          )}
        </Menu>

        <Menu>
          <MenuButton type="button" $active={activeFilter !== 'ALL'} onClick={(event) => toggleMenu(event, 'category')}>
            Category: {activeFilter === 'ALL' ? 'All' : activeFilter} <ChevronDown size={14} />
          </MenuButton>
          {openMenu === 'category' && (
            <MenuList>
              {['ALL', ...categoryNames].map((name) => (
                <MenuItem
                  key={name}
                  type="button"
                  $active={activeFilter === name}
                  onClick={(event) => choose(event, () => {
                    setActiveFilter(name);
                    if (name === 'ALL') setSearchParams({});
                    else setSearchParams({ category: name });
                  })}
                >
                  {name === 'ALL' ? 'All Footwear' : name}
                </MenuItem>
              ))}
            </MenuList>
          )}
        </Menu>

        {colourOptions.length > 0 && (
          <Menu>
            <MenuButton type="button" $active={colour !== 'ALL'} onClick={(event) => toggleMenu(event, 'colour')}>
              Colour: {colour === 'ALL' ? 'All' : colour} <ChevronDown size={14} />
            </MenuButton>
            {openMenu === 'colour' && (
              <MenuList>
                {['ALL', ...colourOptions].map((name) => (
                  <MenuItem key={name} type="button" $active={colour === name} onClick={(event) => choose(event, () => setColour(name))}>
                    {name === 'ALL' ? 'All Colours' : name}
                  </MenuItem>
                ))}
              </MenuList>
            )}
          </Menu>
        )}

        {sizeOptions.length > 0 && (
          <Menu>
            <MenuButton type="button" $active={size !== 'ALL'} onClick={(event) => toggleMenu(event, 'size')}>
              Size: {size === 'ALL' ? 'All' : size} <ChevronDown size={14} />
            </MenuButton>
            {openMenu === 'size' && (
              <MenuList>
                {['ALL', ...sizeOptions].map((name) => (
                  <MenuItem key={name} type="button" $active={size === name} onClick={(event) => choose(event, () => setSize(name))}>
                    {name === 'ALL' ? 'All Sizes' : `Size ${name}`}
                  </MenuItem>
                ))}
              </MenuList>
            )}
          </Menu>
        )}

        <Count>{filteredProducts.length} DESIGNS</Count>
      </Toolbar>

      {filteredProducts.length === 0 ? (
        <Empty>No footwear designs match these filters.</Empty>
      ) : (
        <Grid>
          {filteredProducts.map((product) => {
            const imgUrl = product.images?.[0]?.image?.url;
            const isAdding = addToCartMutation.isPending && addToCartMutation.variables?.id === product.id;
            const isSuccess = successItemId === product.id;
            const isOutOfStock = product.stock === 0;
            const saved = wishedIds.has(product.id);

            return (
              <ProductCard key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
                <ImageWrapper>
                  {imgUrl && <img src={imgUrl} alt={product.name} />}
                  <BuyyTag product={product} />
                  <HeartButton type="button" aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'} onClick={(event) => handleHeart(event, product)}>
                    <Heart size={16} strokeWidth={2} fill={saved ? NAVY_ACCENT : 'none'} color={NAVY_ACCENT} />
                  </HeartButton>
                  <QuickAddBar
                    type="button"
                    onClick={(event) => handleQuickAdd(event, product)}
                    disabled={isAdding || isOutOfStock}
                    $isPending={isAdding}
                    $success={isSuccess}
                  >
                    {isAdding ? (
                      <><Loader2 size={16} className="animate-spin" /> Adding</>
                    ) : isSuccess ? (
                      <><Check size={16} /> Added to Cart</>
                    ) : isOutOfStock ? (
                      'Out of stock'
                    ) : (
                      'Quick add'
                    )}
                  </QuickAddBar>
                </ImageWrapper>
                <CardContent>
                  <ProductCategory>{product.category?.name || 'Footwear'}</ProductCategory>
                  <ProductName title={product.name}>{product.name}</ProductName>
                  <PriceRow>
                    <ProductPrice><MarkedPrice product={product} sale={sale} /></ProductPrice>
                    <MobileAddButton
                      type="button"
                      disabled={isAdding || isOutOfStock}
                      onClick={(e) => handleQuickAdd(e, product)}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      {isAdding ? 'Adding...' : isSuccess ? 'Added' : 'Add'}
                    </MobileAddButton>
                  </PriceRow>
                </CardContent>
              </ProductCard>
            );
          })}
        </Grid>
      )}

      <ScrollTopBtn type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <ArrowUp size={20} />
      </ScrollTopBtn>
    </PageWrapper>
  );
};

export default Shop;
