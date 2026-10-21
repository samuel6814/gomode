import React from 'react';
import styled from 'styled-components';
import { X, Loader2, Heart, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import ProfileLayout from './ProfileLayout';
import Currency from '../../../utils/Currency';
import { ProductGridSkeleton } from '../../../components/ui/Skeleton';
import { NAVY_ACCENT, INK, LINE, FONT_HERO } from '../../../theme/brand';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1rem;

  h1 {
    font-family: ${FONT_HERO};
    font-size: clamp(2rem, 4vw, 2.75rem);
    font-weight: 800;
    color: ${INK};
    margin: 0;
    letter-spacing: -0.02em;
  }

  p {
    font-size: 0.75rem;
    font-weight: 700;
    color: ${NAVY_ACCENT};
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin: 0 0 0.5rem 0;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem 1.25rem;

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem 1.5rem;
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${LINE};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px -8px rgba(37, 60, 90, 0.15);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #fbfbf9;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  ${Card}:hover img {
    transform: scale(1.05);
  }
`;

const RemoveBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid ${LINE};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${INK};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  z-index: 2;

  &:hover {
    color: #dc2626;
    background: #fff;
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Info = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  border-top: 1px solid ${LINE};
`;

const CollectionLabel = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: ${NAVY_ACCENT};
  text-transform: uppercase;
  letter-spacing: 0.12em;
`;

const Name = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${INK};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;

  &:hover {
    color: ${NAVY_ACCENT};
  }
`;

const Price = styled.span`
  font-family: ${FONT_HERO};
  font-size: 1.1rem;
  font-weight: 800;
  color: ${INK};
  margin-top: 0.25rem;
`;

const ActionButton = styled.button`
  width: calc(100% - 2.5rem);
  margin: 0 1.25rem 1.25rem;
  padding: 0.85rem;
  background: ${(props) => (props.$success ? '#10B981' : NAVY_ACCENT)};
  color: white;
  border: none;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$success ? '#059669' : '#1b2c42')};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  background: white;
  border-radius: 16px;
  border: 1px dashed ${LINE};
  text-align: center;

  h3 {
    font-family: ${FONT_HERO};
    font-size: 1.5rem;
    color: ${INK};
    margin: 1rem 0 0.5rem 0;
  }
  p {
    font-size: 0.95rem;
    color: #666;
    margin-bottom: 2rem;
  }

  button {
    background: ${NAVY_ACCENT};
    color: white;
    border: none;
    padding: 0.85rem 2.25rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.2s ease;

    &:hover {
      background: #1b2c42;
    }
  }
`;

const Wishlist = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ['userWishlist'],
    queryFn: async () => {
      const res = await apiClient.get('/users/wishlist');
      return res.data;
    },
  });

  const items = response?.data || [];

  const removeMutation = useMutation({
    mutationFn: async (productId) => {
      await apiClient.post('/users/wishlist/toggle', { productId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userWishlist']);
    },
  });

  const [addedId, setAddedId] = React.useState(null);

  const addToCartMutation = useMutation({
    mutationFn: async (productId) => {
      await apiClient.post('/cart', { productId, quantity: 1 });
    },
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries(['userCart']);
      setAddedId(productId);
      setTimeout(() => setAddedId(null), 2000);
    },
  });

  const handleRemove = (productId) => {
    removeMutation.mutate(productId);
  };

  const handleAddToCart = (productId) => {
    addToCartMutation.mutate(productId);
  };

  if (isLoading) {
    return (
      <ProfileLayout>
        <div style={{ padding: '2rem', width: '100%' }}>
          <ProductGridSkeleton count={4} />
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <div style={{ flex: 1 }}>
        <Header>
          <div>
            <p>SAVED FOOTWEAR</p>
            <h1>My Wishlist</h1>
          </div>
          <p>{items.length} PAIRS SAVED</p>
        </Header>

        {items.length > 0 ? (
          <Grid>
            {items.map((wishlistItem) => {
              const product = wishlistItem.product;
              if (!product) return null;

              const imageUrl = product.images?.[0]?.image?.url || '/items/black-loafers/black-loafers-1.png';
              const isAdded = addedId === product.id;

              return (
                <Card key={wishlistItem.id}>
                  <ImageWrapper onClick={() => navigate(`/product/${product.id}`)}>
                    <img src={imageUrl} alt={product.name} />
                    <RemoveBtn
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(product.id);
                      }}
                      disabled={removeMutation.isPending && removeMutation.variables === product.id}
                      aria-label="Remove item"
                    >
                      {removeMutation.isPending && removeMutation.variables === product.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <X size={14} strokeWidth={2.5} />
                      )}
                    </RemoveBtn>
                  </ImageWrapper>

                  <Info>
                    <CollectionLabel>{product.category?.name || 'FOOTWEAR'}</CollectionLabel>
                    <Name onClick={() => navigate(`/product/${product.id}`)}>{product.name}</Name>
                    <Price><Currency amount={product.price} /></Price>
                  </Info>

                  <ActionButton
                    type="button"
                    $success={isAdded}
                    onClick={() => handleAddToCart(product.id)}
                    disabled={addToCartMutation.isPending && addToCartMutation.variables === product.id}
                  >
                    <ShoppingBag size={14} />
                    {addToCartMutation.isPending && addToCartMutation.variables === product.id
                      ? 'Adding...'
                      : isAdded
                      ? 'Added to Bag'
                      : 'Add to Bag'}
                  </ActionButton>
                </Card>
              );
            })}
          </Grid>
        ) : (
          <EmptyState>
            <Heart size={48} color={NAVY_ACCENT} strokeWidth={1.5} />
            <h3>Your Wishlist is Empty</h3>
            <p>Save pieces you love to build your personal footwear collection.</p>
            <button type="button" onClick={() => navigate('/shop')}>Browse Footwear Catalog</button>
          </EmptyState>
        )}
      </div>
    </ProfileLayout>
  );
};

export default Wishlist;