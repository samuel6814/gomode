import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import apiClient from '../../../api/axios';
import { getGalleryItemImage } from '../../../theme/styled';
import {
  PAPER_BG,
  GRAPHITE_DARK,
  GRAPHITE_MID,
  ACCENT_COLOR,
  PAPER_DARK,
  FONT_FAMILY,
} from '../../../theme/brand';
import ScrollReveal, { refreshScrollTriggers } from '../../../components/ScrollReveal';
import { ProductSkeleton } from '../../../components/ui/Skeleton';
import { GALLERY_FALLBACK_CONFIG } from '../../../data/homeFallbacks';
import { media } from '../../../theme/breakpoints';

const Section = styled.section`
  padding: 3.5rem 1.25rem;
  background: ${PAPER_BG};
  font-family: ${FONT_FAMILY};

  @media ${media.tabletUp} {
    padding: 5rem 1.5rem;
  }
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const Title = styled.h2`
  margin: 0 0 0.5rem;
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: ${GRAPHITE_DARK};
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${GRAPHITE_MID};
  font-size: 1.1rem;
  max-width: 32rem;
`;

const ViewAll = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${ACCENT_COLOR};
  text-decoration: none;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.8rem;
  border-bottom: 2px solid ${ACCENT_COLOR};
  padding-bottom: 0.25rem;

  &:hover {
    opacity: 0.75;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media ${media.tabletUp} {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  @media ${media.desktop} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-decoration: none;
  color: inherit;
`;

const CardImage = styled.img`
  width: 100%;
  aspect-ratio: 4/5;
  object-fit: cover;
  border: 1px solid ${PAPER_DARK};
  transition: opacity 0.2s;

  ${Card}:hover & {
    opacity: 0.9;
  }
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${GRAPHITE_DARK};
`;

const CardCaption = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${GRAPHITE_MID};
`;

const fetchGallery = async () => {
  const res = await apiClient.get('/gallery');
  return res.data;
};

const GallerySection = () => {
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['galleryFront'],
    queryFn: fetchGallery,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const apiConfig = response?.data;
  const apiFeatured = (apiConfig?.items || [])
    .filter((item) => item.isFeatured)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 4);

  const useFallback = isError || (!isLoading && apiFeatured.length === 0);
  const config = useFallback ? GALLERY_FALLBACK_CONFIG : (apiConfig || GALLERY_FALLBACK_CONFIG);
  const featured = useFallback
    ? GALLERY_FALLBACK_CONFIG.items
    : apiFeatured.length > 0
      ? apiFeatured
      : GALLERY_FALLBACK_CONFIG.items;

  useEffect(() => {
    if (!isLoading && featured.length > 0) {
      refreshScrollTriggers();
    }
  }, [isLoading, featured.length]);

  return (
    <Section>
      <Inner>
        <ScrollReveal>
          <Header>
            <div>
              <Title>{config.title || 'Gallery'}</Title>
              <Subtitle>{config.subtitle || 'Graphite portraits and pencil studies'}</Subtitle>
            </div>
            <ViewAll to="/gallery">
              View Full Gallery <ArrowRight size={16} />
            </ViewAll>
          </Header>
        </ScrollReveal>

        {isLoading ? (
          <Grid>
            {[...Array(4)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </Grid>
        ) : (
          <ScrollReveal stagger={0.12} as={Grid}>
            {featured.map((item) => {
              const img = getGalleryItemImage(item);
              if (!img?.url) return null;

              return (
                <Card key={item.id} to="/gallery">
                  <CardImage
                    src={img.url}
                    alt={item.title}
                    width={400}
                    height={500}
                    loading="lazy"
                    decoding="async"
                  />
                  <div>
                    <CardTitle>{item.title}</CardTitle>
                    {item.caption && <CardCaption>{item.caption}</CardCaption>}
                  </div>
                </Card>
              );
            })}
          </ScrollReveal>
        )}
      </Inner>
    </Section>
  );
};

export default GallerySection;
export { fetchGallery };
