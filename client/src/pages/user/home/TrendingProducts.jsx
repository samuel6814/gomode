import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Heart, ShoppingCart, Check } from 'lucide-react';
import apiClient from '../../../api/axios';
import { useSession } from '../../../api/authClient';
import Currency from '../../../utils/Currency'; 
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// --- Styled Components ---

const Section = styled.section`
  width: 100%;
  padding: 8rem 2rem;
  background: #FAFAFA; 

  @media (max-width: 1024px) { padding: 6rem 2rem; }
  @media (max-width: 768px) { padding: 4rem 1.5rem; }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 4rem;

  @media (max-width: 768px) { gap: 3rem; }
`;

/* --- HEADER --- */
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;

  .popular-products {
    font-family: sans-serif;
    font-size: 3.5rem;
    font-weight: 900;
    color: #1A1A1A; 
    text-transform: uppercase;
    letter-spacing: -1px;
    line-height: 1;
    margin: 0;
  }

  @media (max-width: 1024px) {
    .popular-products { font-size: 3rem; }
  }

  @media (max-width: 768px) {
    .popular-products { font-size: 2.2rem; }
  }
`;

const Subtitle = styled.p`
  max-width: 400px;
  font-size: 0.95rem;
  color: #4B5563;
  line-height: 1.6;
  margin: 0;
  text-align: right;

  @media (max-width: 768px) { text-align: left; }
`;

/* --- GRID LAYOUT --- */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2.5rem 2rem;

  @media (max-width: 1024px) { 
    grid-template-columns: repeat(2, 1fr); 
    gap: 2rem 1.5rem;
  }
  
  @media (max-width: 600px) { 
    grid-template-columns: repeat(2, 1fr); 
    gap: 1rem;
  }
`;

/* --- PRODUCT CARD --- */
const ProductCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 4/5;
  border-radius: 12px;
  overflow: hidden;
  background: #E5E7EB;
  box-shadow: 0 10px 20px rgba(0,0,0,0.03);
  position: relative;
  cursor: pointer;
  margin-bottom: 1.25rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  &:hover img { transform: scale(1.05); }
`;

const HoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${ImageWrapper}:hover & { opacity: 1; }

  @media (max-width: 768px) {
    opacity: 1; 
    background: transparent;
    align-items: flex-end;
    padding: 1rem;
  }
`;

const WishlistButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.$active ? '#EF4444' : 'white'};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.$active ? 'white' : '#111827'};
  transform: translateY(15px);
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);

  ${ImageWrapper}:hover & { transform: translateY(0); }

  &:hover {
    background: ${props => props.$active ? '#DC2626' : '#EF4444'}; 
    color: white;
    transform: translateY(0) scale(1.05);
  }

  @media (max-width: 768px) {
    transform: translateY(0);
    width: 40px; height: 40px;
  }
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.5rem;
`;

const Category = styled.span`
  font-family: sans-serif;
  font-size: 0.7rem;
  font-weight: 800;
  color: #1A1A1A;
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

const ProductTitle = styled.h3`
  font-family: 'Times New Roman', Times, serif;
  font-style: italic;
  font-size: 1.6rem;
  font-weight: 400;
  color: #111827;
  margin: 0;
  line-height: 1.2;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 1rem;
`;

const Price = styled.span`
  font-family: sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  color: #111827;
`;

const CartIconBtn = styled.button`
  background: transparent;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: ${props => props.$success ? '#10B981' : '#9CA3AF'};
  transition: transform 0.2s ease, color 0.2s ease;

  &:hover {
    color: ${props => props.$success ? '#10B981' : '#1A1A1A'};
    transform: scale(1.1);
  }
  
  &:active { transform: scale(0.9); }
  &:disabled { cursor: not-allowed; opacity: 0.5; }
`;

/* --- LOAD MORE BUTTON --- */
const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const LoadMoreBtn = styled.button`
  background: transparent;
  color: #111827;
  border: 1px solid #111827;
  padding: 1rem 3rem;
  border-radius: 50px;
  font-family: sans-serif;
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #111827;
    color: white;
  }
`;

const FullScreenLoader = styled.div`
  display: flex; justify-content: center; align-items: center; padding: 5rem 0; color: #1A1A1A;
`;

const TrendingProducts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const IS_LOGGED_IN = !!session;
  const [visibleCount, setVisibleCount] = useState(8);
  const [successItemId, setSuccessItemId] = useState(null);

  // 1. Fetch Products
  const { data: response, isLoading } = useQuery({
    queryKey: ['trendingProducts', visibleCount],
    queryFn: async () => {
      const res = await apiClient.get('/products/trending');
      return res.data;
    }
  });

  // 2. Fetch Wishlist
  const { data: wishlistResponse } = useQuery({
    queryKey: ['userWishlist'],
    queryFn: async () => {
      const res = await apiClient.get('/users/wishlist');
      return res.data;
    },
    enabled: IS_LOGGED_IN
  });

  const wishlistIds = (wishlistResponse?.data || []).map(item => item.productId);
  const allProducts = response?.data || [];
  const trendingItems = allProducts.slice(0, visibleCount);

  // 3. Add to Cart
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

  // 4. Toggle Wishlist
  const toggleWishlistMutation = useMutation({
    mutationFn: async (productId) => {
      await apiClient.post('/users/wishlist/toggle', { productId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userWishlist']);
    }
  });

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (!IS_LOGGED_IN) return navigate('/login');
    if (product.stock > 0) addToCartMutation.mutate(product.id);
  };

  const handleToggleFavorite = (e, productId) => {
    e.stopPropagation();
    if (!IS_LOGGED_IN) return navigate('/login');
    toggleWishlistMutation.mutate(productId);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  if (isLoading) {
    return (
      <Section>
        <Container><div style={{padding: '2rem', width: '100%'}}><Skeleton count={1} height={200} borderRadius={12} style={{marginBottom: '2rem'}}/><Skeleton count={3} height={40} style={{marginBottom: '1rem'}}/></div></Container>
      </Section>
    );
  }

  if (trendingItems.length === 0) return null;

  return (
    <Section>
      <Container>
        
        <Header>
          <TitleBox>
            <h2 className="popular-products">Popular Products</h2>
          </TitleBox>
          <Subtitle>
            A highly curated selection of the season's most influential pieces. From architectural silhouettes to reimagined classics, these are the objects defining the modern zeitgeist.
          </Subtitle>
        </Header>

        <Grid>
          {trendingItems.map((item) => {
            const imgUrl = item.images?.[0]?.image?.url || 'https://via.placeholder.com/600x750?text=Trending';
            const isFavorite = wishlistIds.includes(item.id);
            const isAdding = addToCartMutation.isPending && addToCartMutation.variables === item.id;
            const isSuccess = successItemId === item.id;
            const isOutOfStock = item.stock === 0;
            
            return (
              <ProductCard key={item.id}>
                <ImageWrapper onClick={() => navigate(`/product/${item.id}`)}>
                  <img src={imgUrl} alt={item.name} />
                  <HoverOverlay>
                    <WishlistButton 
                      onClick={(e) => handleToggleFavorite(e, item.id)}
                      $active={isFavorite}
                      title={isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <Heart 
                        size={22} 
                        fill={isFavorite ? 'white' : 'transparent'} 
                        strokeWidth={isFavorite ? 0 : 2}
                      />
                    </WishlistButton>
                  </HoverOverlay>
                </ImageWrapper>
                
                <InfoBox>
                  <Category>{item.category?.name || 'FEATURED'}</Category>
                  <ProductTitle title={item.name}>{item.name}</ProductTitle>
                  
                  <ActionRow>
                    <Price>
                      <Currency amount={item.price} />
                    </Price>
                    <CartIconBtn 
                      onClick={(e) => handleAddToCart(e, item)}
                      disabled={isAdding || isOutOfStock}
                      $success={isSuccess}
                      title={isOutOfStock ? "Out of Stock" : "Add to Bag"}
                    >
                      {isAdding ? <Loader2 size={20} className="animate-spin" /> : isSuccess ? <Check size={22} /> : <ShoppingCart size={22} />}
                    </CartIconBtn>
                  </ActionRow>
                </InfoBox>
              </ProductCard>
            );
          })}
        </Grid>

        {visibleCount < allProducts.length && (
          <LoadMoreContainer>
            <LoadMoreBtn onClick={handleLoadMore}>
              Load More
            </LoadMoreBtn>
          </LoadMoreContainer>
        )}

      </Container>
    </Section>
  );
};

export default TrendingProducts;