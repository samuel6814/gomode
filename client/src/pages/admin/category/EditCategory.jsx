import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { 
  ChevronDown,
  Plus,
  Loader2,
  CheckCircle,
  Trash2,
  Image as ImageIcon 
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom'; 
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import ImageSelectorModal from '../../../components/admin/ImageSelectorModal'; // 🚨 Imported Modal
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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
  background: #FAFAFA;
  min-height: 100vh;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;

  @media (max-width: 1024px) { padding: 2rem; }
  @media (max-width: 768px) { padding: 1.5rem; }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1.5rem;

  div.text {
    span.overline {
      font-size: 0.65rem;
      font-weight: 800;
      color: #1A1A1A;
      text-transform: uppercase;
      letter-spacing: 2px;
      display: block;
      margin-bottom: 0.5rem;
    }

    h1 {
      font-family: 'Times New Roman', Times, serif;
      font-size: 3.5rem;
      font-weight: 900;
      color: #111827;
      margin: 0;
      letter-spacing: -1px;
      
      @media (max-width: 768px) { font-size: 2.5rem; }
    }
  }

  div.actions {
    display: flex;
    gap: 1rem;

    @media (max-width: 600px) { width: 100%; }
  }
`;

const SecondaryBtn = styled.button`
  background: transparent;
  color: #111827;
  border: 1px solid #E5E7EB;
  padding: 0.85rem 1.5rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { border-color: #111827; }
  @media (max-width: 600px) { flex: 1; }
`;

const PrimaryBtn = styled.button`
  background: ${props => props.disabled ? '#9CA3AF' : '#1A1A1A'};
  color: white;
  border: none;
  padding: 0.85rem 1.5rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  box-shadow: ${props => props.disabled ? 'none' : '0 4px 15px rgba(75, 118, 252, 0.3)'};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover { 
    background: ${props => props.disabled ? '#9CA3AF' : '#333333'}; 
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'}; 
  }
  @media (max-width: 600px) { flex: 1; justify-content: center; }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr; 
  gap: 2.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr; 
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  border: 1px solid #F3F4F6;
  display: flex;
  flex-direction: column;

  @media (max-width: 600px) { padding: 1.5rem; }
`;

const SectionTitle = styled.h3`
  font-family: 'Times New Roman', Times, serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: #111827;
  margin: 0;
`;

const Divider = styled.div`
  height: 1px;
  background: #E5E7EB;
  margin: 1.5rem 0 2rem 0;
  width: 100%;
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
    letter-spacing: 2px;
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

const InputPill = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-family: sans-serif;
  font-size: 0.9rem;
  color: #111827;
  background: #F9FAFB; 
  outline: none;
  border: 1px solid ${props => props.$hasError ? '#ef4444' : 'transparent'};
  transition: box-shadow 0.2s, border 0.2s;

  &::placeholder { color: #9CA3AF; font-style: italic; }
  &:focus { box-shadow: 0 0 0 2px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(75, 118, 252, 0.2)'}; }
`;

const TextAreaPill = styled.textarea`
  width: 100%;
  padding: 1rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-family: 'Times New Roman', Times, serif; 
  font-style: italic;
  font-size: 1rem;
  color: #111827;
  background: #F9FAFB;
  outline: none;
  min-height: 120px;
  resize: vertical;
  line-height: 1.6;
  transition: box-shadow 0.2s;

  &::placeholder { color: #9CA3AF; }
  &:focus { box-shadow: 0 0 0 2px rgba(75, 118, 252, 0.2); }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;

  @media (max-width: 600px) { grid-template-columns: 1fr; }
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
    font-weight: 500;
    color: #111827;
    background: #F9FAFB;
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

const ToggleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;

  span.label {
    font-size: 0.65rem;
    font-weight: 800;
    color: #6B7280;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;

  input { opacity: 0; width: 0; height: 0; }

  span {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: ${props => props.$checked ? '#1A1A1A' : '#E5E7EB'};
    transition: .3s;
    border-radius: 34px;
    
    &:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .3s;
      border-radius: 50%;
    }
  }
  
  input:checked + span:before { transform: translateX(20px); }
`;

const DangerZone = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2.5rem;
  margin-top: 1rem;
  border-top: 1px solid #E5E7EB;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;

    h4 { font-size: 0.65rem; font-weight: 800; color: #EF4444; text-transform: uppercase; letter-spacing: 2px; margin: 0;}
    p { font-size: 0.8rem; color: #6B7280; margin: 0; }
  }

  button {
    background: transparent;
    color: #EF4444;
    border: 1px solid #FECACA;
    padding: 0.85rem 1.5rem;
    border-radius: 50px;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;

    &:hover { background: #FEF2F2; border-color: #EF4444; }

    @media (max-width: 600px) { width: 100%; }
  }
`;

const ImagePreviewCard = styled.div`
  background: #111827;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
`;

const HeroImage = styled.div`
  width: 100%;
  aspect-ratio: 3/4;
  background-image: url(${props => props.src || 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1000&auto=format&fit=crop'});
  background-size: cover;
  background-position: center;
  position: relative;
  transition: background-image 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(17, 24, 39, 0.9) 0%, rgba(0,0,0,0) 40%);
    z-index: 1;
  }
`;

const AssetOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 2rem;
  z-index: 2;

  div.box {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    backdrop-filter: blur(8px);
    padding: 1.25rem 1.5rem;
    border-radius: 8px;

    span.label { font-size: 0.6rem; font-weight: 800; color: white; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 0.25rem;}
    p { font-size: 0.85rem; color: rgba(255,255,255,0.7); font-style: italic; margin: 0; }
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0 0 12px 12px;
  border: 1px solid #F3F4F6;
  border-top: none;
`;

const NoteBox = styled.div`
  margin-top: 1rem;
  padding: 0 0.5rem;

  h5 { font-size: 0.65rem; font-weight: 800; color: #111827; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 0.5rem 0;}
  p { font-family: 'Times New Roman', Times, serif; font-size: 0.95rem; font-style: italic; color: #6B7280; line-height: 1.5; margin: 0; }
`;

const FullScreenLoader = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #FAFAFA;
  color: #1A1A1A;
  gap: 1rem;
  
  p { color: #6B7280; font-size: 0.75rem; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; }
`;


const EditCategory = () => {
  const { id } = useParams(); // 1. Get ID from URL
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isActive, setIsActive] = useState(true);
  const [serverError, setServerError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 🚨 Modal State

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue, // 🚨 Extracted setValue
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(categorySchema),
  });

  const watchImage = watch('image');

  const { data: categoriesData, isLoading: isFetching } = useQuery({
    queryKey: ['adminCategories'],
    queryFn: async () => {
      const res = await apiClient.get('/categories');
      return res.data;
    }
  });

  useEffect(() => {
    if (categoriesData?.data) {
      const category = categoriesData.data.find(c => c.id === id);
      if (category) {
        reset({
          name: category.name,
          description: category.description || '',
          image: category.image || '',
        });
        setIsActive(category.status === 'ACTIVE');
      } else {
        setServerError("Category not found in database.");
      }
    }
  }, [categoriesData, id, reset]);

  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await apiClient.put(`/categories/${id}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCategories']);
      navigate('/admin/category');
    },
    onError: (error) => {
      setServerError(error.response?.data?.message || 'Failed to update category.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCategories']);
      navigate('/admin/category');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to delete category.');
    }
  });

  const onSubmit = (data) => {
    setServerError(null);
    updateMutation.mutate({
      ...data,
      status: isActive ? 'ACTIVE' : 'HIDDEN'
    });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to permanently delete this category?")) {
      deleteMutation.mutate();
    }
  };

  if (isFetching) {
    return (
      <div style={{padding: '2rem', width: '100%'}}><Skeleton count={1} height={200} borderRadius={12} style={{marginBottom: '2rem'}}/><Skeleton count={3} height={40} style={{marginBottom: '1rem'}}/></div>
    );
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <HeaderSection>
          <div className="text">
            <span className="overline">REFINING COLLECTION</span>
            <h1>Edit Category</h1>
            {serverError && <p style={{color: '#ef4444', fontSize: '0.8rem', fontWeight: 700, marginTop: '0.5rem'}}>{serverError}</p>}
          </div>
          <div className="actions">
            <SecondaryBtn type="button" onClick={() => navigate('/admin/category')}>DISCARD</SecondaryBtn>
            <PrimaryBtn type="submit" disabled={isSubmitting || updateMutation.isPending}>
              {(isSubmitting || updateMutation.isPending) ? (
                <><Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> SAVING...</>
              ) : 'SAVE CHANGES'}
            </PrimaryBtn>
          </div>
        </HeaderSection>

        <MainGrid>
          {/* LEFT COLUMN */}
          <Column>
            <Card>
              <SectionTitle>General Information</SectionTitle>
              <Divider />
              
              <FormGroup>
                <label>CATEGORY NAME</label>
                <InputPill 
                  type="text" 
                  placeholder="Category Name" 
                  {...register('name')} 
                  $hasError={!!errors.name}
                />
                {errors.name && <span className="error">{errors.name.message}</span>}
              </FormGroup>

              <FormGroup>
                <label>DESCRIPTION</label>
                <TextAreaPill 
                  placeholder="Describe this category..." 
                  {...register('description')} 
                />
              </FormGroup>

              {/* MOCK UI FOR TAXONOMY */}
              <Row>
                <FormGroup $noMargin>
                  <label>PARENT CATEGORY</label>
                  <SelectWrapper>
                    <select disabled>
                      <option>None (Top Level)</option>
                    </select>
                    <ChevronDown size={16} />
                  </SelectWrapper>
                </FormGroup>

                <FormGroup $noMargin>
                  <label>SORT ORDER</label>
                  <InputPill type="number" defaultValue={1} disabled style={{color: '#9CA3AF'}}/>
                </FormGroup>
              </Row>

              <ToggleRow>
                <span className="label">CATEGORY IS ACTIVE & VISIBLE</span>
                <Switch $checked={isActive}>
                  <input 
                    type="checkbox" 
                    checked={isActive} 
                    onChange={() => setIsActive(!isActive)} 
                  />
                  <span />
                </Switch>
              </ToggleRow>
            </Card>

            <Card>


              <DangerZone>
                <div>
                  <h4>DELETE CATEGORY</h4>
                  <p>This action is permanent and cannot be undone.</p>
                </div>
                <button type="button" onClick={handleDelete} disabled={deleteMutation.isPending}>
                  {deleteMutation.isPending ? 'DELETING...' : 'DELETE CATEGORY'}
                </button>
              </DangerZone>
            </Card>
          </Column>

          {/* RIGHT COLUMN */}
          <Column>
            <div>
              <SectionTitle style={{paddingLeft: '0.5rem'}}>Featured Imagery</SectionTitle>
              <Divider style={{marginBottom: '1.5rem'}}/>
              
              <ImagePreviewCard>
                <HeroImage src={watchImage}>
                  <AssetOverlay>
                    <div className="box">
                      <span className="label">PRIMARY ASSET</span>
                      <p>Linked via External URL</p>
                    </div>
                  </AssetOverlay>
                </HeroImage>
                
                <ImageGrid>
                   {/* 🚨 Updated UI with BROWSE button */}
                   <FormGroup $noMargin>
                    <label style={{fontSize: '0.55rem', color: '#111827'}}>UPDATE IMAGE URL</label>
                    <div style={{ display: 'flex', width: '100%', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <InputPill 
                        type="text" 
                        placeholder="Paste link or browse library..." 
                        style={{background: '#FAFAFA', border: '1px solid #E5E7EB', flex: 1, minWidth: 0}}
                        {...register('image')}
                        $hasError={!!errors.image}
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
                    {errors.image && <span className="error">{errors.image.message}</span>}
                  </FormGroup>
                </ImageGrid>
              </ImagePreviewCard>

              <NoteBox>
                <h5>CURATOR'S NOTE</h5>
                <p>Ensure all category imagery maintains high-contrast lighting and a consistent monochromatic grading to preserve the editorial visual language.</p>
              </NoteBox>
            </div>
          </Column>

        </MainGrid>
      </form>
      
      <ImageSelectorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={(url) => {
          setValue('image', url, { shouldValidate: true, shouldDirty: true });
        }} 
      />
    </Container>
  );
};

export default EditCategory;