import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Loader2, Save, Plus, Trash2, ChevronUp, ChevronDown, Image as ImageIcon, Star,
} from 'lucide-react';
import apiClient from '../../../api/axios';
import ImageSelectorModal from '../../../components/admin/ImageSelectorModal';
import { getGalleryItemImage } from '../../../theme/styled';
import { ACCENT_COLOR, PAPER_BG, PAPER_DARK } from '../../../theme/brand';

const PageWrapper = styled.div`
  padding: 2rem;
  background: #f8f9fa;
  min-height: 100vh;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  h1 {
    font-family: 'Times New Roman', Times, serif;
    font-size: 2.5rem;
    margin: 0;
  }

  span.overline {
    font-size: 0.65rem;
    font-weight: 800;
    color: ${ACCENT_COLOR};
    text-transform: uppercase;
    letter-spacing: 2px;
  }
`;

const PrimaryBtn = styled.button`
  background: ${(p) => (p.disabled ? '#9ca3af' : ACCENT_COLOR)};
  color: white;
  border: none;
  padding: 0.85rem 1.5rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SecondaryBtn = styled.button`
  background: white;
  color: ${ACCENT_COLOR};
  border: 1px solid ${ACCENT_COLOR};
  padding: 0.75rem 1.25rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormPanel = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  margin-bottom: 2rem;
  display: grid;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  label {
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #6b7280;
  }

  input {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 0.65rem 0.85rem;
    font-size: 0.9rem;

    &:focus {
      outline: none;
      border-color: ${ACCENT_COLOR};
    }
  }
`;

const ItemCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem;
  display: grid;
  gap: 1.5rem;

  @media (min-width: 900px) {
    grid-template-columns: 200px 1fr auto;
    align-items: start;
  }
`;

const PreviewThumb = styled.img`
  width: 100%;
  aspect-ratio: 4/5;
  object-fit: cover;
  border: 1px solid ${PAPER_DARK};
  border-radius: 8px;
`;

const PreviewPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 4/5;
  background: ${PAPER_BG};
  border: 1px dashed ${PAPER_DARK};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 0.75rem;
`;

const ItemActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const IconBtn = styled.button`
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #e5e7eb;
  }

  &.danger:hover {
    background: #fee2e2;
    color: #dc2626;
  }

  &.featured {
    color: ${(p) => (p.$active ? '#f59e0b' : '#9ca3af')};
  }
`;

const ImagePickBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  background: #fafafa;
  cursor: pointer;
  font-size: 0.75rem;
  margin-top: 0.35rem;

  img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
  }
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ItemFields = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const GalleryConfiguration = () => {
  const queryClient = useQueryClient();
  const [imageModalIndex, setImageModalIndex] = useState(null);
  const { register, handleSubmit, reset, control, setValue, watch } = useForm({
    defaultValues: { title: '', subtitle: '', items: [] },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'items',
  });

  const { data: response, isLoading } = useQuery({
    queryKey: ['galleryConfig'],
    queryFn: async () => {
      const res = await apiClient.get('/gallery');
      return res.data;
    },
  });

  useEffect(() => {
    if (response?.data) {
      const normalized = {
        ...response.data,
        items: (response.data.items || []).map((item, i) => ({
          ...item,
          image: item.image?.url
            ? item.image
            : item.fineArtImage?.url
              ? item.fineArtImage
              : { url: '', public_id: '' },
          sortOrder: item.sortOrder ?? i,
        })),
      };
      reset(normalized);
    }
  }, [response, reset]);

  const mutation = useMutation({
    mutationFn: (data) => apiClient.put('/gallery', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryConfig'] });
      queryClient.invalidateQueries({ queryKey: ['galleryFront'] });
      queryClient.invalidateQueries({ queryKey: ['galleryPage'] });
    },
  });

  const items = watch('items') || [];

  const onImageSelect = (img) => {
    if (imageModalIndex !== null) {
      setValue(`items.${imageModalIndex}.image`, { url: img.url, public_id: img.public_id });
    }
    setImageModalIndex(null);
  };

  const addItem = () => {
    append({
      id: `gallery-${Date.now()}`,
      title: 'New Portrait',
      caption: 'Graphite on paper',
      image: { url: '', public_id: '' },
      isFeatured: false,
      sortOrder: fields.length,
    });
  };

  if (isLoading) {
    return (
      <PageWrapper style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
        <Loader2 className="animate-spin" size={32} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <HeaderSection>
        <div>
          <span className="overline">Storefront</span>
          <h1>Gallery Manager</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <SecondaryBtn type="button" onClick={addItem}>
            <Plus size={16} /> Add Piece
          </SecondaryBtn>
          <PrimaryBtn
            disabled={mutation.isPending}
            onClick={handleSubmit((data) => mutation.mutate(data))}
          >
            {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Gallery
          </PrimaryBtn>
        </div>
      </HeaderSection>

      <FormPanel>
        <Field>
          <label>Gallery Title</label>
          <input {...register('title')} />
        </Field>
        <Field>
          <label>Gallery Subtitle</label>
          <input {...register('subtitle')} />
        </Field>
      </FormPanel>

      <ItemsList>
        {fields.map((field, index) => {
          const item = items[index] || {};
          const img = getGalleryItemImage(item);

          return (
            <ItemCard key={field.id}>
              {img?.url ? (
                <PreviewThumb src={img.url} alt={item.title} />
              ) : (
                <PreviewPlaceholder>No image selected</PreviewPlaceholder>
              )}

              <ItemFields>
                <Field>
                  <label>Title</label>
                  <input {...register(`items.${index}.title`)} />
                </Field>
                <Field>
                  <label>Caption</label>
                  <input {...register(`items.${index}.caption`)} />
                </Field>
                <Field>
                  <label>Image</label>
                  <ImagePickBtn type="button" onClick={() => setImageModalIndex(index)}>
                    {img?.url ? <img src={img.url} alt="" /> : <ImageIcon size={16} />}
                    {img?.url ? 'Change image' : 'Select image'}
                  </ImagePickBtn>
                </Field>
                <input type="hidden" {...register(`items.${index}.id`)} />
                <input type="hidden" {...register(`items.${index}.sortOrder`, { valueAsNumber: true })} />
              </ItemFields>

              <ItemActions>
                <IconBtn
                  type="button"
                  className="featured"
                  $active={item.isFeatured}
                  onClick={() => setValue(`items.${index}.isFeatured`, !item.isFeatured)}
                  title="Featured on home"
                >
                  <Star size={18} fill={item.isFeatured ? '#f59e0b' : 'none'} />
                </IconBtn>
                <IconBtn type="button" disabled={index === 0} onClick={() => move(index, index - 1)}>
                  <ChevronUp size={18} />
                </IconBtn>
                <IconBtn
                  type="button"
                  disabled={index === fields.length - 1}
                  onClick={() => move(index, index + 1)}
                >
                  <ChevronDown size={18} />
                </IconBtn>
                <IconBtn type="button" className="danger" onClick={() => remove(index)}>
                  <Trash2 size={18} />
                </IconBtn>
              </ItemActions>
            </ItemCard>
          );
        })}
      </ItemsList>

      <ImageSelectorModal
        isOpen={imageModalIndex !== null}
        onClose={() => setImageModalIndex(null)}
        onSelect={onImageSelect}
      />
    </PageWrapper>
  );
};

export default GalleryConfiguration;
