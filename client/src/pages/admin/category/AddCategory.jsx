import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  CloudUpload,
  Search,
  ChevronDown,
  Loader2,
  CheckCircle,
  Image as ImageIcon // Added ImageIcon
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../api/axios';
import ImageSelectorModal from '../../../components/admin/ImageSelectorModal'; // Imported the Modal
import { CANVAS, NAVY_ACCENT, INK, LINE, FONT_HERO } from '../../../theme/brand';

// --- Zod Validation Schema ---
const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

// --- Styled Components ---
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box; 
  padding: 2.5rem 3rem;
  background: ${CANVAS};
  min-height: 100vh;

  @media (max-width: 1024px) { padding: 2rem; }
  @media (max-width: 768px) { padding: 1.5rem; }
`;

const HeaderSection = styled.div`
  margin-bottom: 3rem;

  span.overline {
    font-size: 0.65rem;
    font-weight: 800;
    color: ${NAVY_ACCENT};
    text-transform: uppercase;
    letter-spacing: 2px;
    display: block;
    margin-bottom: 0.5rem;
  }

  h1 {
    font-family: ${FONT_HERO};
    font-size: 3rem;
    font-weight: 900;
    color: ${INK};
    margin: 0;
    letter-spacing: -1.5px;
    
    @media (max-width: 768px) { font-size: 2.2rem; }
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  border: 1px solid ${LINE};
  display: flex;
  flex-direction: column;

  @media (max-width: 600px) { padding: 1.5rem; }
`;

const DarkCard = styled(Card)`
  background: ${NAVY_ACCENT};
  color: white;
  border: none;
`;

const SectionLabel = styled.h3`
  font-size: 0.65rem;
  font-weight: 800;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0 0 2rem 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${props => props.$noMargin ? '0' : '2rem'};

  label {
    font-size: 0.65rem;
    font-weight: 800;
    color: #6B7280;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 0.75rem;
  }

  span.error {
    color: #ef4444;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    margin-top: 0.5rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 0;
  border: none;
  border-bottom: 1px solid ${props => props.$hasError ? '#ef4444' : LINE};
  font-family: ${FONT_HERO};
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
  outline: none;
  background: transparent;
  transition: border-color 0.2s;

  &::placeholder { color: #D1D5DB; font-weight: 500; }
  &:focus { border-bottom-color: ${props => props.$hasError ? '#ef4444' : NAVY_ACCENT}; }
`;

const InputPill = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 1px solid ${LINE};
  border-radius: 8px;
  font-size: 0.9rem;
  color: #111827;
  background: #F5F3EF;
  outline: none;
  transition: box-shadow 0.2s;

  &::placeholder { color: #9CA3AF; }
  &:focus { box-shadow: 0 0 0 2px rgba(37, 60, 90, 0.2); }
`;

const TextAreaPill = styled.textarea`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 1px solid ${LINE};
  border-radius: 8px;
  font-size: 0.9rem;
  color: #111827;
  background: #F5F3EF;
  outline: none;
  min-height: 120px;
  resize: vertical;
  transition: box-shadow 0.2s;

  &::placeholder { color: #9CA3AF; }
  &:focus { box-shadow: 0 0 0 2px rgba(37, 60, 90, 0.2); }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const UploadBox = styled.div`
  border: 2px dashed ${LINE};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 250px;
  transition: all 0.2s;
  padding: 1rem;
  text-align: center;

  svg.icon-main { color: #9CA3AF; margin-bottom: 1rem; }

  span.main { font-size: 0.75rem; font-weight: 800; color: #1A1A1A; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.25rem;}
  span.sub { font-size: 0.65rem; font-weight: 600; color: #9CA3AF; margin-bottom: 1rem; }

  &:hover { border-color: ${NAVY_ACCENT}; background: #F9FAFB; }
`;

const PreviewBox = styled.div`
  border-radius: 12px;
  background-image: url(${props => props.$bgImage || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop'});
  background-size: cover;
  background-position: center;
  min-height: 250px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(17, 24, 39, 0.8) 0%, rgba(0,0,0,0) 50%);
    border-radius: 12px;
    z-index: 1;
  }

  div {
    position: relative;
    z-index: 2;
    color: white;

    span.label { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.7); display: block; margin-bottom: 0.25rem;}
    h4 { font-family: ${FONT_HERO}; font-size: 1.3rem; font-weight: 700; margin: 0; }
  }
`;

const ToggleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  div {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    h5 { font-size: 0.85rem; font-weight: 800; color: white; margin: 0; }
    p { font-size: 0.65rem; font-weight: 600; color: #9CA3AF; margin: 0; text-transform: uppercase; letter-spacing: 1px;}
  }
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  flex-shrink: 0;

  input { opacity: 0; width: 0; height: 0; }

  span {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: ${props => props.$checked ? 'rgba(255,255,255,0.35)' : '#1B2B40'};
    transition: .3s;
    border-radius: 34px;
    
    &:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .3s;
      border-radius: 50%;
    }
  }
  
  input:checked + span:before { transform: translateX(18px); }
`;

const PrimaryBtn = styled.button`
  width: 100%;
  background: ${props => props.disabled ? 'rgba(255,255,255,0.2)' : 'white'};
  color: ${props => props.disabled ? 'rgba(255,255,255,0.5)' : NAVY_ACCENT};
  font-family: ${FONT_HERO};
  border: none;
  padding: 1rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  margin-top: 1rem;
  margin-bottom: 1rem;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  &:hover { 
    opacity: ${props => props.disabled ? 1 : 0.92}; 
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'}; 
  }
`;

const OutlineBtn = styled.button`
  width: 100%;
  background: transparent;
  color: white;
  border: 1px solid #374151;
  padding: 1rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { border-color: white; background: rgba(255,255,255,0.05); }
`;

const SelectWrapper = styled.div`
  position: relative;
  
  select {
    width: 100%;
    padding: 1rem 1.25rem;
    border: none;
    border-radius: 8px;
    font-family: sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: #111827;
    background: #F4F1EB;
    appearance: none;
    outline: none;
    cursor: pointer;
  }

  svg {
    position: absolute;
    right: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6B7280;
    pointer-events: none;
  }
`;

const SliderWrapper = styled.div`
  width: 100%;
  margin-top: 1rem;

  input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    background: transparent;
    
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background: #1A1A1A;
      cursor: pointer;
      margin-top: -6px;
    }
    
    &::-webkit-slider-runnable-track {
      width: 100%;
      height: 4px;
      cursor: pointer;
      background: #E5E7EB;
      border-radius: 4px;
    }
  }

  div.labels {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
    span { font-size: 0.55rem; font-weight: 800; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px;}
  }
`;

const ChangesList = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 2px solid #E5E7EB;
  margin-left: 0.5rem;
  padding-left: 1rem;

  div.item {
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      left: -1.15rem; 
      top: 0.25rem;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #1A1A1A;
    }

    h6 { font-size: 0.8rem; font-weight: 800; color: #111827; margin: 0 0 0.25rem 0;}
    span { font-size: 0.65rem; color: #9CA3AF; }
  }
`;


const AddCategory = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Custom UI State
  const [isPublic, setIsPublic] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 🚨 Modal State

  // Initialize React Hook Form with Zod Validation
  const {
    register,
    handleSubmit,
    watch,
    setValue, // 🚨 Extracted setValue
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(categorySchema),
  });

  const watchImage = watch('image', '');

  const mutation = useMutation({
    mutationFn: async (newCategory) => {
      const response = await apiClient.post('/categories', newCategory);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCategories']);
      setTimeout(() => {
        navigate('/admin/category');
      }, 1000);
    },
    onError: (error) => {
      setServerError(error.response?.data?.message || 'Failed to create category. Please check your network connection.');
    }
  });

  const onSubmit = (data) => {
    setServerError(null);
    const payload = {
      name: data.name,
      description: data.description,
      image: data.image,
      status: isPublic ? 'ACTIVE' : 'HIDDEN',
    };
    mutation.mutate(payload);
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <HeaderSection>
          <div className="text">
            <span className="overline">INVENTORY MANAGEMENT</span>
            <h1>New Category</h1>
          </div>
          {serverError && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef2f2', border: '1px solid #ef4444', color: '#b91c1c', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
              {serverError}
            </div>
          )}
        </HeaderSection>

        <MainGrid>
          {/* LEFT COLUMN */}
          <Column>
            <Card>
              <SectionLabel>BASIC IDENTIFICATION</SectionLabel>
              
              <FormGroup>
                <label>CATEGORY NAME</label>
                <Input 
                  type="text" 
                  placeholder="e.g. Autumnal Outerwear" 
                  {...register('name')}
                  $hasError={!!errors.name}
                />
                {errors.name && <span className="error">{errors.name.message}</span>}
              </FormGroup>

              <FormGroup $noMargin>
                <label>NARRATIVE DESCRIPTION</label>
                <TextAreaPill 
                  placeholder="Craft a compelling story for this collection..." 
                  {...register('description')}
                />
              </FormGroup>
            </Card>

            <ImageGrid>
              <UploadBox>
                <CloudUpload className="icon-main" size={28} strokeWidth={2}/>
                <span className="main">FEATURED IMAGE URL</span>
                <span className="sub">Paste a link or browse your library</span>
                
                {/* 🚨 Updated UI with BROWSE button */}
                <div style={{ display: 'flex', width: '100%', gap: '0.5rem', marginTop: '1rem', padding: '0 1rem', boxSizing: 'border-box' }}>
                  <InputPill 
                    type="text" 
                    placeholder="https://..." 
                    style={{ flex: 1, minWidth: 0 }}
                    {...register('image')}
                  />
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(true)}
                    style={{ background: '#1A1A1A', color: 'white', border: 'none', borderRadius: '8px', padding: '0 1rem', cursor: 'pointer', fontWeight: 800, fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap', transition: 'background 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#333333'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#1A1A1A'}
                  >
                    <ImageIcon size={14} /> BROWSE
                  </button>
                </div>

                {errors.image && <span className="error" style={{marginTop: '0.5rem'}}>{errors.image.message}</span>}
              </UploadBox>

              <PreviewBox $bgImage={watchImage}>
                <div>
                  <span className="label">PREVIEW MODE</span>
                  <h4>Visual Context</h4>
                </div>
              </PreviewBox>
            </ImageGrid>



          </Column>

          {/* RIGHT COLUMN */}
          <Column>
            <DarkCard>
              <SectionLabel style={{color: '#6B7280'}}>STATUS & VISIBILITY</SectionLabel>
              
              <ToggleRow>
                <div>
                  <h5>Public Release</h5>
                  <p>{isPublic ? 'VISIBLE TO CUSTOMERS' : 'HIDDEN FROM STOREFRONT'}</p>
                </div>
                <Switch $checked={isPublic}>
                  <input type="checkbox" checked={isPublic} onChange={() => setIsPublic(!isPublic)} />
                  <span />
                </Switch>
              </ToggleRow>

              <ToggleRow>
                <div>
                  <h5>Featured Header</h5>
                  <p>{isFeatured ? 'SHOWING IN MENU' : 'HIDDEN FROM MENU'}</p>
                </div>
                <Switch $checked={isFeatured}>
                  <input type="checkbox" checked={isFeatured} onChange={() => setIsFeatured(!isFeatured)} />
                  <span />
                </Switch>
              </ToggleRow>

              <PrimaryBtn type="submit" disabled={isSubmitting || isSubmitSuccessful}>
                {isSubmitting ? (
                  <><Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }}/> PUBLISHING...</>
                ) : isSubmitSuccessful ? (
                  <><CheckCircle size={16} /> PUBLISHED!</>
                ) : (
                  'PUBLISH CATEGORY'
                )}
              </PrimaryBtn>
              
              <OutlineBtn type="button" onClick={() => navigate('/admin/category')}>CANCEL</OutlineBtn>
            </DarkCard>

            <Card>
              <SectionLabel>TAXONOMY</SectionLabel>
              
              <FormGroup>
                <label>PARENT CATEGORY</label>
                <SelectWrapper>
                  <select>
                    <option>None (Top Level)</option>
                    <option>Clothing</option>
                    <option>Accessories</option>
                  </select>
                  <ChevronDown size={16} />
                </SelectWrapper>
              </FormGroup>

              <FormGroup $noMargin>
                <label>SORT WEIGHT</label>
                <SliderWrapper>
                  <input type="range" min="1" max="100" defaultValue="50" />
                  <div className="labels">
                    <span>LOWER (FIRST)</span>
                    <span>HIGHER (LAST)</span>
                  </div>
                </SliderWrapper>
              </FormGroup>
            </Card>



          </Column>
        </MainGrid>
      </form>

      <ImageSelectorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={(url) => {
          // Drop the URL into React Hook Form and force it to re-render the preview box
          setValue('image', url, { shouldValidate: true, shouldDirty: true });
        }} 
      />
    </Container>
  );
};

export default AddCategory;