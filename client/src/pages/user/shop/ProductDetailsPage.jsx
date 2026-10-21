import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Heart, ChevronDown, ChevronUp, Loader2, AlertCircle, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import { useSession } from '../../../api/authClient';
import { addToCart } from '../../../utils/cart';
import { saleUnitPrice, useSale } from '../../../utils/sale';
import { BuyyTag, MarkedPrice } from '../../../components/ProductMarks';
import Suggestions from '../../../components/Suggestions';
import { ProductSkeleton, TextStackSkeleton } from '../../../components/ui/Skeleton';
import SEO from '../../../components/SEO';
import { media } from '../../../theme/breakpoints';
import { CANVAS, NAVY_ACCENT, INK, LINE, FONT_HERO } from '../../../theme/brand';

const PageWrapper = styled.div`
  background: ${CANVAS};
  min-height: calc(100vh - 80px);
  padding: 2rem 1rem 6rem;

  @media ${media.tablet} {
    padding: 3rem 2rem 6rem;
  }
`;

const Container = styled.div`
  max-width: 1360px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;

  @media ${media.tablet} {
    gap: 3.5rem;
  }

  @media ${media.desktop} {
    grid-template-columns: 1.15fr 1fr;
    gap: 4.5rem;
  }
`;

/* --- LEFT: GALLERY --- */
const GallerySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const MainImageBox = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #fff;
  border: 1px solid ${LINE};
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }

  &:hover img {
    transform: scale(1.03);
  }
`;

const Thumbnails = styled.div`
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

const ThumbBox = styled.button`
  width: 76px;
  height: 76px;
  border-radius: 10px;
  background: #fff;
  border: 2px solid ${(props) => (props.$active ? NAVY_ACCENT : LINE)};
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    border-color: ${NAVY_ACCENT};
  }
`;

/* --- RIGHT: DETAILS --- */
const DetailsSection = styled.div`
  display: flex;
  flex-direction: column;
  align-self: start;
  max-width: 100%;

  @media ${media.desktop} {
    position: sticky;
    top: 32px;
  }
`;

const CategoryPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${NAVY_ACCENT};
  margin-bottom: 0.65rem;
`;

const Title = styled.h1`
  font-family: ${FONT_HERO};
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  font-weight: 800;
  color: ${INK};
  margin: 0 0 1rem 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
`;

const PriceRow = styled.div`
  font-family: ${FONT_HERO};
  font-size: 1.6rem;
  font-weight: 800;
  color: ${INK};
  margin-bottom: 1.75rem;
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
`;

const SectionHeading = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${INK};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 0.75rem;
  display: block;
`;

const Description = styled.p`
  font-size: 0.95rem;
  line-height: 1.75;
  color: #444;
  margin: 0 0 2rem 0;
  background: #fff;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  border: 1px solid ${LINE};
`;

const OptionsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const OptionButton = styled.button`
  height: 40px;
  min-width: 44px;
  padding: 0 1rem;
  border-radius: 8px;
  border: 1.5px solid ${(props) => (props.$active ? NAVY_ACCENT : LINE)};
  background: ${(props) => (props.$active ? NAVY_ACCENT : '#fff')};
  color: ${(props) => (props.$active ? '#fff' : INK)};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${NAVY_ACCENT};
  }
`;

/* Actions */
const ActionStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
`;

const AddToCartBtn = styled.button`
  width: 100%;
  background: ${(props) => (props.$success ? '#10B981' : NAVY_ACCENT)};
  color: #fff;
  border: none;
  padding: 1.15rem;
  border-radius: 9999px;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  box-shadow: 0 4px 14px rgba(37, 60, 90, 0.2);

  &:hover {
    background: ${(props) => (props.$success ? '#059669' : '#1b2c42')};
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(37, 60, 90, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const BuyNowBtn = styled.button`
  width: 100%;
  background: #fff;
  color: ${NAVY_ACCENT};
  border: 1.5px solid ${NAVY_ACCENT};
  padding: 1.15rem;
  border-radius: 9999px;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #F0EEE8;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const WishlistBtn = styled.button`
  width: 100%;
  background: transparent;
  color: ${(props) => (props.$active ? '#DC2626' : INK)};
  border: 1px solid ${(props) => (props.$active ? '#F87171' : LINE)};
  padding: 0.9rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${NAVY_ACCENT};
    color: ${NAVY_ACCENT};
    background: #fff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding: 1.25rem;
  background: #fff;
  border: 1px solid ${LINE};
  border-radius: 12px;
`;

const FeatureItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.4rem;
  color: ${INK};

  svg {
    color: ${NAVY_ACCENT};
  }

  span {
    font-size: 11px;
    font-weight: 600;
    line-height: 1.3;
  }
`;

/* Accordions */
const Accordion = styled.div`
  border-top: 1px solid ${LINE};
  border-bottom: ${(props) => (props.$last ? `1px solid ${LINE}` : 'none')};
`;

const AccordionHeader = styled.button`
  width: 100%;
  background: transparent;
  border: none;
  padding: 1.25rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 800;
  color: ${INK};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  transition: color 0.15s ease;

  &:hover {
    color: ${NAVY_ACCENT};
  }
`;

const AccordionContent = styled.div`
  padding-bottom: ${(props) => (props.$isOpen ? '1.25rem' : '0')};
  font-size: 0.9rem;
  color: #555;
  line-height: 1.65;
  max-height: ${(props) => (props.$isOpen ? '500px' : '0')};
  overflow: hidden;
  transition: all 0.25s ease;
  opacity: ${(props) => (props.$isOpen ? '1' : '0')};
`;

const ErrorState = styled.div`
  padding: 8rem 2rem;
  text-align: center;
  background: #fff;
  border-radius: 16px;
  border: 1px solid ${LINE};
  max-width: 600px;
  margin: 3rem auto;

  h3 {
    font-family: ${FONT_HERO};
    font-size: 1.6rem;
    font-weight: 700;
    color: ${INK};
    margin: 1rem 0;
  }

  p {
    color: #666;
    font-size: 0.95rem;
    margin-bottom: 2rem;
  }

  button {
    background: ${NAVY_ACCENT};
    color: white;
    padding: 0.9rem 2rem;
    border: none;
    border-radius: 9999px;
    font-weight: 700;
    cursor: pointer;
  }
`;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const IS_LOGGED_IN = !!session;
  const sale = useSale();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [openCare, setOpenCare] = useState(false);
  const [openShipping, setOpenShipping] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // 1. Fetch single product
  const { data: productResponse, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await apiClient.get(`/products/${id}`);
      return res.data;
    },
  });

  // Track product view
  useEffect(() => {
    if (id) {
      apiClient.post(`/products/${id}/view`).catch((err) => console.error('Failed to track view:', err));
    }
  }, [id]);

  // 2. Fetch Wishlist
  const { data: wishlistResponse } = useQuery({
    queryKey: ['userWishlist'],
    queryFn: async () => {
      const res = await apiClient.get('/users/wishlist');
      return res.data;
    },
    enabled: IS_LOGGED_IN,
  });

  const product = productResponse?.data;
  const isWishlisted = wishlistResponse?.data?.some((item) => (item.product?.id || item.productId) === id);

  // Extract available sizes from tags (e.g., "size:42")
  const availableSizes = (product?.tags || [])
    .filter((tag) => tag.startsWith('size:'))
    .map((tag) => tag.slice(5));

  const availableColors = product?.colors || [];

  useEffect(() => {
    if (availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(availableSizes[0]);
    }
    if (availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0]);
    }
  }, [availableSizes, availableColors]);

  // 3. Add to Cart Mutation
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      await addToCart(apiClient, session, product, 1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userCart']);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    },
  });

  // 4. Toggle Wishlist Mutation
  const toggleWishlistMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post('/users/wishlist/toggle', { productId: id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userWishlist']);
    },
  });

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    addToCartMutation.mutate();
  };

  const handleBuyNow = async () => {
    if (!product || product.stock === 0 || addToCartMutation.isPending) return;
    await addToCart(apiClient, session, product, 1);
    queryClient.invalidateQueries({ queryKey: ['userCart'] });
    navigate('/checkout');
  };

  const handleWishlist = () => {
    if (!IS_LOGGED_IN) return navigate('/login');
    toggleWishlistMutation.mutate();
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div style={{ maxWidth: 1360, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 520px) 1fr', gap: '3rem' }}>
          <ProductSkeleton />
          <TextStackSkeleton />
        </div>
      </PageWrapper>
    );
  }

  if (isError || !product) {
    return (
      <PageWrapper>
        <ErrorState>
          <AlertCircle size={44} color="#DC2626" style={{ margin: '0 auto' }} />
          <h3>Footwear Piece Not Found</h3>
          <p>This design may be temporarily out of stock or retired from the catalog.</p>
          <button onClick={() => navigate('/shop')}>Browse GoMode Catalog</button>
        </ErrorState>
      </PageWrapper>
    );
  }

  const productImages = product.images?.map((img) => img.image.url) || [];
  const displayImages = productImages.length > 0 ? productImages : ['/items/black-loafers/black-loafers-1.png'];
  const activeImage = displayImages[activeImageIdx] || displayImages[0];

  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: displayImages,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'GoMode',
    },
    offers: {
      '@type': 'Offer',
      url: `https://sneakergarden.com/product/${product.id}`,
      priceCurrency: 'GHS',
      price: saleUnitPrice(product, sale),
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  const dynamicDescription = `Discover the ${product.name} at GoMode. ${product.description.substring(0, 120)}... Handcrafted luxury footwear with fast Ghana delivery.`;

  return (
    <>
      <SEO
        title={`${product.name} | GoMode`}
        description={dynamicDescription}
        schema={productSchema}
        image={displayImages[0]}
        url={`/product/${product.id}`}
      />

      <PageWrapper>
        <Container>
          {/* LEFT: Gallery */}
          <GallerySection>
            <MainImageBox>
              <img src={activeImage} alt={product.name} />
              <BuyyTag product={product} />
            </MainImageBox>
            {displayImages.length > 1 && (
              <Thumbnails>
                {displayImages.map((img, idx) => (
                  <ThumbBox
                    key={idx}
                    type="button"
                    $active={activeImageIdx === idx}
                    onClick={() => setActiveImageIdx(idx)}
                  >
                    <img src={img} alt={`${product.name} view ${idx + 1}`} />
                  </ThumbBox>
                ))}
              </Thumbnails>
            )}
          </GallerySection>

          {/* RIGHT: Details */}
          <DetailsSection>
            <CategoryPill>{product.category?.name || 'FOOTWEAR'}</CategoryPill>
            <Title>{product.name}</Title>
            <PriceRow>
              <MarkedPrice product={product} sale={sale} />
            </PriceRow>

            {availableSizes.length > 0 && (
              <>
                <SectionHeading>Select Footwear Size</SectionHeading>
                <OptionsGrid>
                  {availableSizes.map((s) => (
                    <OptionButton
                      key={s}
                      type="button"
                      $active={selectedSize === s}
                      onClick={() => setSelectedSize(s)}
                    >
                      EU {s}
                    </OptionButton>
                  ))}
                </OptionsGrid>
              </>
            )}

            {availableColors.length > 0 && (
              <>
                <SectionHeading>Colour Option</SectionHeading>
                <OptionsGrid>
                  {availableColors.map((c) => (
                    <OptionButton
                      key={c}
                      type="button"
                      $active={selectedColor === c}
                      onClick={() => setSelectedColor(c)}
                    >
                      {c}
                    </OptionButton>
                  ))}
                </OptionsGrid>
              </>
            )}

            <SectionHeading>Description</SectionHeading>
            <Description>{product.description}</Description>

            <ActionStack>
              <AddToCartBtn
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending || product.stock === 0}
                $success={addedToCart}
              >
                {addToCartMutation.isPending ? (
                  <><Loader2 size={18} className="animate-spin" /> Processing...</>
                ) : addedToCart ? (
                  <><Check size={18} /> Added to Bag</>
                ) : product.stock === 0 ? (
                  'Out of Stock'
                ) : (
                  'Add to Bag'
                )}
              </AddToCartBtn>

              <BuyNowBtn type="button" onClick={handleBuyNow} disabled={product.stock === 0}>
                Buy Now
              </BuyNowBtn>

              <WishlistBtn
                onClick={handleWishlist}
                disabled={toggleWishlistMutation.isPending}
                $active={isWishlisted}
              >
                {toggleWishlistMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Heart size={16} fill={isWishlisted ? '#DC2626' : 'none'} strokeWidth={2.2} />
                )}
                {isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
              </WishlistBtn>
            </ActionStack>

            <FeatureGrid>
              <FeatureItem>
                <Truck size={20} />
                <span>Express Ghana Delivery</span>
              </FeatureItem>
              <FeatureItem>
                <ShieldCheck size={20} />
                <span>Guaranteed Authentic</span>
              </FeatureItem>
              <FeatureItem>
                <RotateCcw size={20} />
                <span>Seamless Exchanges</span>
              </FeatureItem>
            </FeatureGrid>

            {/* Accordions */}
            <Accordion>
              <AccordionHeader onClick={() => setOpenCare(!openCare)}>
                Craftsmanship & Care
                {openCare ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </AccordionHeader>
              <AccordionContent $isOpen={openCare}>
                <p><strong>Stock Status:</strong> {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} pairs left` : 'Sold Out'}</p>
                <p style={{ marginTop: '0.5rem' }}>Constructed with premium supple leathers, precision stitching, and cushioned ergonomic insoles. Wipe gently with a soft dry cloth.</p>
              </AccordionContent>
            </Accordion>

            <Accordion $last>
              <AccordionHeader onClick={() => setOpenShipping(!openShipping)}>
                Shipping & Delivery in Ghana
                {openShipping ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </AccordionHeader>
              <AccordionContent $isOpen={openShipping}>
                Fast, reliable courier delivery across Greater Accra, Ashanti, and all regions of Ghana. Orders dispatched with tracking updates via SMS and email.
              </AccordionContent>
            </Accordion>
          </DetailsSection>
        </Container>

        <Suggestions currentProductId={product.id} categoryId={product.categoryId} />
      </PageWrapper>
    </>
  );
};

export default ProductDetailPage;