import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import SEO from '../../../components/SEO';
import apiClient from '../../../api/axios';
import { getGalleryItemImage } from '../../../theme/styled';
import {
  BRAND_NAME,
  PAPER_BG,
  GRAPHITE_DARK,
  GRAPHITE_MID,
  PAPER_DARK,
  SITE_URL,
} from '../../../theme/brand';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${PAPER_BG};
  padding-top: 1.5rem;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 5rem;
`;

const Title = styled.h1`
  margin: 0 0 0.75rem;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: ${GRAPHITE_DARK};
`;

const Subtitle = styled.p`
  margin: 0 0 3rem;
  color: ${GRAPHITE_MID};
  font-size: 1.15rem;
  max-width: 40rem;
  line-height: 1.6;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2.5rem;
`;

const Card = styled.button`
  background: none;
  border: none;
  padding: 0;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CardImage = styled.img`
  width: 100%;
  aspect-ratio: 4/5;
  object-fit: cover;
  border: 1px solid ${PAPER_DARK};
  transition: opacity 0.2s;

  ${Card}:hover & {
    opacity: 0.92;
  }
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${GRAPHITE_DARK};
`;

const CardCaption = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${GRAPHITE_MID};
`;

const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(26, 26, 26, 0.92);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LightboxInner = styled.div`
  position: relative;
  max-width: 700px;
  width: 100%;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: -3rem;
  right: 0;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0.5rem;
`;

const LightboxImage = styled.img`
  width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border: 1px solid ${PAPER_DARK};
`;

const LightboxMeta = styled.div`
  margin-top: 1rem;
  color: #fff;
  text-align: center;

  h2 {
    margin: 0 0 0.25rem;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  p {
    margin: 0;
    opacity: 0.7;
    font-size: 0.9rem;
  }
`;

const GalleryPage = () => {
  const [lightboxItem, setLightboxItem] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['galleryPage'],
    queryFn: async () => {
      const res = await apiClient.get('/gallery');
      return res.data;
    },
  });

  const config = response?.data || {};
  const items = [...(config.items || [])].sort((a, b) => a.sortOrder - b.sortOrder);

  const lightboxImage = lightboxItem ? getGalleryItemImage(lightboxItem) : null;

  return (
    <>
      <SEO
        title={`Gallery | ${BRAND_NAME}`}
        description={config.subtitle || `A look at pieces from ${BRAND_NAME}`}
        url={`${SITE_URL}/gallery`}
      />
      <PageWrapper>
        <Container>
          <Title>{config.title || 'Gallery'}</Title>
          <Subtitle>
            {config.subtitle || 'A closer look at pieces from the catalog.'}
          </Subtitle>

          {isLoading ? (
            <p style={{ color: GRAPHITE_MID }}>Loading gallery...</p>
          ) : items.length === 0 ? (
            <p style={{ color: GRAPHITE_MID }}>No works in the gallery yet.</p>
          ) : (
            <Grid>
              {items.map((item) => {
                const img = getGalleryItemImage(item);
                if (!img?.url) return null;

                return (
                  <Card key={item.id} type="button" onClick={() => setLightboxItem(item)}>
                    <CardImage src={img.url} alt={item.title} loading="lazy" />
                    <div>
                      <CardTitle>{item.title}</CardTitle>
                      {item.caption && <CardCaption>{item.caption}</CardCaption>}
                    </div>
                  </Card>
                );
              })}
            </Grid>
          )}
        </Container>
      </PageWrapper>

      {lightboxItem && lightboxImage?.url && (
        <Lightbox onClick={() => setLightboxItem(null)}>
          <LightboxInner onClick={(e) => e.stopPropagation()}>
            <CloseBtn type="button" onClick={() => setLightboxItem(null)} aria-label="Close">
              <X size={28} />
            </CloseBtn>
            <LightboxImage src={lightboxImage.url} alt={lightboxItem.title} />
            <LightboxMeta>
              <h2>{lightboxItem.title}</h2>
              {lightboxItem.caption && <p>{lightboxItem.caption}</p>}
            </LightboxMeta>
          </LightboxInner>
        </Lightbox>
      )}
    </>
  );
};

export default GalleryPage;
