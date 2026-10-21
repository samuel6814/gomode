import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { SlidersHorizontal, ShoppingCart, ArrowRight, Loader2, Check, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import { useSession } from '../../../api/authClient';
import Currency from '../../../utils/Currency';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// --- Styled Components ---

const SectionWrapper = styled.section`
  width: 100%;
  background-color: #FAFAFA; 
  padding: 6rem 2rem;

  @media (max-width: 1024px) { padding: 4rem 1.5rem; }
  @media (max-width: 768px) { padding: 3rem 1rem; }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

/* --- HEADER, TABS & SORT --- */
const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid #E5E7EB;
  margin-bottom: 3rem;
  padding-bottom: 0.5rem;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 2.5rem;
  overflow-x: auto;
  
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (max-width: 768px) {
    width: 100%;
    gap: 1.5rem;
  }
`;

const Tab = styled.button`
  background: transparent;
  border: none;
  padding: 0 0 0.75rem 0;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${props => (props.$active ? '#1A1A1A' : '#6B7280')};
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  transition: color 0.2s ease;

  &:hover { color: #1A1A1A; }

  &::after {
    content: '';
    position: absolute;
    bottom: -9px; 
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${props => (props.$active ? '#1A1A1A' : 'transparent')};
    transition: background-color 0.2s ease;
  }
`;

const FilterWrapper = styled.div`
  position: relative;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #111827;
  cursor: pointer;
  padding-bottom: 0.75rem;
  transition: color 0.2s ease;

  svg { width: 16px; height: 16px; }

  &:hover, &.active { color: #1A1A1A; }

  @media (max-width: 768px) {
    padding-bottom: 0;
  }
`;

const SortDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  width: 200px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  
  /* Conditional visibility */
  visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  transform: ${props => (props.$isOpen ? 'translateY(0)' : 'translateY(-10px)')};
  transition: all 0.2s ease;

  @media (max-width: 768px) {
    left: 0; right: auto;
  }
`;

const SortOption = styled.button`
  background: transparent;
  border: none;
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: ${props => (props.$active ? '700' : '500')};
  color: ${props => (props.$active ? '#1A1A1A' : '#4B5563')};
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #F3F4F6;
    color: #1A1A1A;
  }
`;

/* --- 1x4 GRID LAYOUT --- */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr); 
  gap: 2.5rem;

  @media (max-width: 1024px) { 
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem; 
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    padding-bottom: 1rem;
  }
`;

/* --- CARD, IMAGE & HOVER EFFECTS --- */
const CategoryCard = styled(Link)`
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4/5; 
  border-radius: 12px;
  overflow: hidden;
  background: #E5E7EB;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  ${ImageWrapper}:hover & {
    transform: scale(1.05);
  }
`;

const HoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.15); /* Soft dark overlay for the button to pop */
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${ImageWrapper}:hover & { opacity: 1; }

  @media (max-width: 768px) {
    /* Keep overlay accessible on mobile */
    opacity: 1; 
    background: transparent;
    align-items: flex-end;
    padding: 1rem;
  }
`;

const CartButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.$success ? '#10B981' : 'white'};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.$success ? 'white' : '#111827'};
  transform: translateY(15px);
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);

  ${ImageWrapper}:hover & { transform: translateY(0); }

  &:hover {
    background: ${props => props.$success ? '#059669' : '#1A1A1A'}; 
    color: white;
    transform: translateY(0) scale(1.05);
  }
  
  &:disabled { cursor: not-allowed; opacity: 0.7; }

  @media (max-width: 768px) {
    transform: translateY(0);
    width: 40px; height: 40px;
    svg { width: 18px; height: 18px; }
  }
`;

/* --- CARD CONTENT (Text + Favorite) --- */
const CardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 0.25rem;
`;

const TextDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: #111827;
`;

const Tag = styled.span`
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
  color: #6B7280;
`;

const Title = styled.h3`
  font-family: 'Times New Roman', Times, serif;
  font-size: 1.2rem;
  font-weight: 400;
  margin: 0;

  @media (max-width: 600px) { font-size: 1rem; }
`;

const PriceText = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
`;

const FavoriteButton = styled.button`
  background: transparent;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: ${props => (props.$isFavorite ? '#EF4444' : '#9CA3AF')};
  transition: transform 0.2s ease, color 0.2s ease;

  &:hover {
    color: ${props => (props.$isFavorite ? '#DC2626' : '#EF4444')};
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.9);
  }
`;

/* --- VIEW ALL BUTTON --- */
const ViewAllContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
`;

const ViewAllButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2.5rem;
  background: transparent;
  color: #111827;
  font-weight: 700;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-decoration: none;
  border: 1px solid #111827;
  border-radius: 50px;
  transition: all 0.3s ease;

  &:hover {
    background: #111827;
    color: white;
    gap: 0.75rem; 
  }
`;

const FullScreenLoader = styled.div`
  display: flex; justify-content: center; align-items: center; padding: 5rem 0; color: #1A1A1A;
`;


const CategorySection = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [sortOption, setSortOption] = useState('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [successItemId, setSuccessItemId] = useState(null);

  const sortRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const IS_LOGGED_IN = !!session;

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. Fetch Products
  const { data: response, isLoading } = useQuery({
    queryKey: ['storefrontProducts'],
    queryFn: async () => {
      const res = await apiClient.get('/products');
      return res.data;
    }
  });

  // 1b. Fetch Wishlist (so we know which items are already favorited)
  const { data: wishlistResponse } = useQuery({
    queryKey: ['userWishlist'],
    queryFn: async () => {
      const res = await apiClient.get('/users/wishlist');
      return res.data;
    },
    enabled: IS_LOGGED_IN
  });

  const wishlistIds = (wishlistResponse?.data || []).map(item => item.productId);

  const allProducts = React.useMemo(() => {
    const products = response?.data || [];
    return [...products].sort(() => 0.5 - Math.random());
  }, [response?.data]);

  // 2. Add to Cart Mutation
  const addToCartMutation = useMutation({
    mutationFn: async (productId) => {
      await apiClient.post('/cart', { productId, quantity: 1 });
    },
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries(['userCart']); 
      setSuccessItemId(productId); 
      setTimeout(() => setSuccessItemId(null), 2000);
    }
  });

  // 2b. Toggle Wishlist Mutation (calls backend)
  const toggleWishlistMutation = useMutation({
    mutationFn: async (productId) => {
      await apiClient.post('/users/wishlist/toggle', { productId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userWishlist']);
    }
  });

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!IS_LOGGED_IN) return navigate('/login');
    if (product.stock > 0) addToCartMutation.mutate(product.id);
  };

  const handleToggleFavorite = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!IS_LOGGED_IN) return navigate('/login');
    toggleWishlistMutation.mutate(productId);
  };

  // --- DYNAMIC FILTER & SORT LOGIC ---
  
  // Extract unique categories from actual products
  const uniqueCategories = ['ALL', 'NEW ARRIVALS', ...new Set(allProducts.map(p => p.category?.name).filter(Boolean))];

  let displayItems = [...allProducts];

  // Filter
  if (activeTab === 'ALL') {
    // 24-hour rotation logic: exactly 1 product from up to 4 distinct categories
    const daySeed = Math.floor(Date.now() / 86400000);
    const categoryMap = new Map();
    
    // Group products by category
    allProducts.forEach(p => {
      if (p.category?.name) {
        if (!categoryMap.has(p.category.name)) {
          categoryMap.set(p.category.name, []);
        }
        categoryMap.get(p.category.name).push(p);
      }
    });

    const selectedProducts = [];
    let catIndex = 0;
    
    // Convert map to array to ensure consistent order before slicing
    const categories = Array.from(categoryMap.entries());
    
    // Rotate the categories shown every day if there are more than 4
    const rotatedCategories = [...categories.slice(daySeed % categories.length), ...categories.slice(0, daySeed % categories.length)];

    for (const [catName, products] of rotatedCategories) {
      if (selectedProducts.length >= 4) break;
      // Rotate the product selected within the category every day
      const prodIndex = (daySeed + catIndex) % products.length;
      selectedProducts.push(products[prodIndex]);
      catIndex++;
    }
    
    displayItems = selectedProducts;
  } else if (activeTab === 'NEW ARRIVALS') {
    // Just sort by createdAt (assuming ID or date) and slice
    displayItems = displayItems.slice(0, 4); // Simplification for 'new'
  } else {
    displayItems = displayItems.filter(item => item.category?.name?.toUpperCase() === activeTab.toUpperCase());
    
    // Sort
    if (sortOption === 'price-low') {
      displayItems.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      displayItems.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name-asc') {
      displayItems.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'newest') {
      displayItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Slice to strictly 1x4 Grid (max 4 items)
    displayItems = displayItems.slice(0, 4);
  }

  const viewAllLink = activeTab === 'ALL' || activeTab === 'NEW ARRIVALS' 
    ? '/shop/categories' 
    : `/shop?category=${activeTab}`;

  if (isLoading) {
    return (
      <SectionWrapper>
        <Container>
          <HeaderRow>
            <TabsContainer>
              <Skeleton width={80} height={20} style={{ marginRight: '1rem' }} />
              <Skeleton width={80} height={20} style={{ marginRight: '1rem' }} />
              <Skeleton width={80} height={20} />
            </TabsContainer>
          </HeaderRow>
          <Grid>
            {[1, 2, 3, 4].map(n => (
              <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                <Skeleton height={350} borderRadius={12} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ width: '70%' }}>
                    <Skeleton width={50} height={10} />
                    <Skeleton width="100%" height={20} style={{ marginTop: '0.25rem' }} />
                    <Skeleton width={60} height={15} style={{ marginTop: '0.25rem' }} />
                  </div>
                  <Skeleton circle width={30} height={30} />
                </div>
              </div>
            ))}
          </Grid>
        </Container>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      <Container>
        
        {/* Header & Navigation */}
        <HeaderRow>
          <TabsContainer>
            {uniqueCategories.slice(0, 5).map((tab) => ( // Show max 5 tabs so UI doesn't break
              <Tab 
                key={tab}
                $active={activeTab === tab}
                onClick={() => { setActiveTab(tab); setIsSortOpen(false); }}
              >
                {tab}
              </Tab>
            ))}
          </TabsContainer>
        </HeaderRow>

        {/* 1x4 Grid */}
        <Grid>
          {displayItems.length > 0 ? (
            displayItems.map((product) => {
              const imgUrl = product.images?.[0]?.image?.url || 'https://via.placeholder.com/600x800?text=No+Image';
              const isAdding = addToCartMutation.isPending && addToCartMutation.variables === product.id;
              const isSuccess = successItemId === product.id;
              const isOutOfStock = product.stock === 0;
              const isFavorite = wishlistIds.includes(product.id);

              return (
                <CategoryCard key={product.id} to={`/product/${product.id}`}>
                  
                  {/* Image with Hover Wishlist Button */}
                  <ImageWrapper>
                    <CardImage src={imgUrl} alt={product.name} />
                    <HoverOverlay>
                      <CartButton 
                        onClick={(e) => handleToggleFavorite(e, product.id)}
                        $success={isFavorite}
                        title={isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
                      >
                        <Heart 
                          size={22} 
                          fill={isFavorite ? 'white' : 'transparent'} 
                          strokeWidth={isFavorite ? 0 : 2}
                        />
                      </CartButton>
                    </HoverOverlay>
                  </ImageWrapper>
                  
                  {/* Info Row Below Image */}
                  <CardContent>
                    <TextDetails>
                      <Tag>{product.category?.name || 'ESSENTIAL'}</Tag>
                      <Title>{product.name}</Title>
                      <PriceText><Currency amount={product.price} /></PriceText>
                    </TextDetails>
                    
                    <FavoriteButton 
                      $isFavorite={false}
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={isAdding || isOutOfStock}
                      title={isOutOfStock ? "Out of Stock" : "Add to Bag"}
                      style={isSuccess ? {color: '#10B981'} : isOutOfStock ? {color: '#D1D5DB', cursor: 'not-allowed'} : {}}
                    >
                      {isAdding ? <Loader2 size={20} className="animate-spin" /> : isSuccess ? <Check size={22} /> : <ShoppingCart size={22} />}
                    </FavoriteButton>
                  </CardContent>
                  
                </CategoryCard>
              );
            })
          ) : (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6B7280', padding: '3rem 0' }}>
              We are currently restocking this collection. Check back soon.
            </p>
          )}
        </Grid>

        {/* View All Button */}
        {displayItems.length > 0 && (
          <ViewAllContainer>
            <ViewAllButton to={viewAllLink}>
              View All {activeTab === 'ALL' ? 'Items' : activeTab} <ArrowRight size={18} />
            </ViewAllButton>
          </ViewAllContainer>
        )}

      </Container>
    </SectionWrapper>
  );
};

export default CategorySection;