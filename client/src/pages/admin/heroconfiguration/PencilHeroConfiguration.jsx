import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save } from 'lucide-react';
import apiClient from '../../../api/axios';
import PencilHero from '../../user/home/PencilHero';
import { ACCENT_COLOR } from '../../../theme/brand';

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

const EditorGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const PreviewBox = styled.div`
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  pointer-events: none;
  transform: scale(0.85);
  transform-origin: top center;
`;

const FormPanel = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

  input,
  textarea {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 0.65rem 0.85rem;
    font-size: 0.9rem;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: ${ACCENT_COLOR};
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

const PencilHeroConfiguration = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const { data: response, isLoading } = useQuery({
    queryKey: ['heroConfig'],
    queryFn: async () => {
      const res = await apiClient.get('/hero');
      return res.data;
    },
  });

  useEffect(() => {
    if (response?.data) reset(response.data);
  }, [response, reset]);

  const mutation = useMutation({
    mutationFn: (data) => apiClient.put('/hero', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroConfig'] });
      queryClient.invalidateQueries({ queryKey: ['heroConfigFront'] });
    },
  });

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
          <h1>Hero Configuration</h1>
        </div>
        <PrimaryBtn
          disabled={mutation.isPending}
          onClick={handleSubmit((data) => mutation.mutate(data))}
        >
          {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Changes
        </PrimaryBtn>
      </HeaderSection>

      <EditorGrid>
        <PreviewBox>
          <PencilHero />
        </PreviewBox>

        <FormPanel>
          <Field>
            <label>Eyebrow</label>
            <input {...register('eyebrow')} />
          </Field>
          <Field>
            <label>Headline</label>
            <input {...register('headline')} />
          </Field>
          <Field>
            <label>Headline Italic Word</label>
            <input {...register('headlineItalic')} />
          </Field>
          <Field>
            <label>Headline End</label>
            <input {...register('headlineEnd')} />
          </Field>
          <Field>
            <label>Description</label>
            <textarea {...register('description')} />
          </Field>
          <Field>
            <label>Primary CTA Text</label>
            <input {...register('ctaPrimary.text')} />
          </Field>
          <Field>
            <label>Primary CTA Link</label>
            <input {...register('ctaPrimary.href')} />
          </Field>
          <Field>
            <label>Secondary CTA Text</label>
            <input {...register('ctaSecondary.text')} />
          </Field>
          <Field>
            <label>Secondary CTA Link</label>
            <input {...register('ctaSecondary.href')} />
          </Field>
        </FormPanel>
      </EditorGrid>
    </PageWrapper>
  );
};

export default PencilHeroConfiguration;
