import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  ChevronDown,
  Image as ImageIcon,
  Plus,
  ExternalLink,
  HelpCircle,
  X,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import ImageSelectorModal from '../../../components/admin/ImageSelectorModal'; 
import Currency from '../../../utils/Currency'; 
import { CANVAS, NAVY_ACCENT, INK, LINE, FONT_HERO } from '../../../theme/brand';

// --- Zod Validation Schema ---
const productSchema = z.object({
  name: z.string().min(2, 'Product title is required'),
  categoryId: z.string().min(1, 'Please select a category'),
  description: z.string().optional(),
  price: z.preprocess((val) => parseFloat(val), z.number().min(0, 'Price must be valid')),
  stock: z.preprocess((val) => parseInt(val, 10), z.number().min(0, 'Stock must be valid'))
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
  position: relative;

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
      text-transform: uppercase;
      
      @media (max-width: 768px) { font-size: 2.2rem; }
    }
  }

  div.actions {
    display: flex;
    gap: 1rem;
    @media (max-width: 600px) { width: 100%; }
  }
`;

const SecondaryBtn = styled.button`
  background: white;
  color: ${INK};
  border: 1px solid ${LINE};
  font-family: ${FONT_HERO};
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { border-color: ${NAVY_ACCENT}; color: ${NAVY_ACCENT}; }
  @media (max-width: 600px) { flex: 1; padding: 1rem; }
`;

const PrimaryBtn = styled.button`
  background: ${props => props.disabled ? '#9CA3AF' : NAVY_ACCENT};
  color: white;
  border: none;
  font-family: ${FONT_HERO};
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  box-shadow: ${props => props.disabled ? 'none' : '0 8px 20px rgba(37, 60, 90, 0.25)'};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover { 
    opacity: ${props => props.disabled ? 1 : 0.9}; 
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'}; 
  }
  @media (max-width: 600px) { flex: 1; padding: 1rem; }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr; 
  gap: 2.5rem;

  @media (max-width: 1100px) { grid-template-columns: 1fr; }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const Row2Col = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;

  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  border: 1px solid ${props => props.$hasError ? '#ef4444' : LINE};
  display: flex;
  flex-direction: column;
  transition: border 0.2s;

  @media (max-width: 600px) { padding: 1.5rem; }
`;

const SectionHeader = styled.div`
  font-size: 0.7rem;
  font-weight: 800;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span.num { color: ${NAVY_ACCENT}; }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${props => props.$noMargin ? '0' : '1.5rem'};
  flex: 1;

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
    margin-top: 0.5rem;
    text-transform: uppercase;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 1px solid ${props => props.$hasError ? '#ef4444' : LINE};
  border-radius: 4px;
  font-family: sans-serif;
  font-size: 0.95rem;
  color: #111827;
  outline: none;
  transition: border-color 0.2s;

  &::placeholder { color: #D1D5DB; }
  &:focus { border-color: ${props => props.$hasError ? '#ef4444' : NAVY_ACCENT}; }
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 1px solid ${props => props.$hasError ? '#ef4444' : LINE};
  border-radius: 4px;
  font-family: sans-serif;
  font-size: 1.5rem;
  color: #111827;
  outline: none;
  transition: border-color 0.2s;

  &::placeholder { color: #D1D5DB; }
  &:focus { border-color: ${props => props.$hasError ? '#ef4444' : NAVY_ACCENT}; }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1.5rem;
  border: 1px solid ${props => props.$hasError ? '#ef4444' : 'transparent'};
  border-radius: 8px;
  font-family: sans-serif;
  font-size: 0.95rem;
  color: #111827;
  background: #F9FAFB;
  outline: none;
  min-height: 150px;
  resize: vertical;
  line-height: 1.6;

  &::placeholder { color: #9CA3AF; }
  &:focus { box-shadow: inset 0 0 0 1px ${props => props.$hasError ? '#ef4444' : NAVY_ACCENT}; }
`;

const SelectWrapper = styled.div`
  position: relative;
  
  select {
    width: 100%;
    padding: 1rem;
    border: 1px solid ${props => props.$hasError ? '#ef4444' : '#E5E7EB'};
    border-radius: 4px;
    font-family: sans-serif;
    font-size: 0.95rem;
    color: #111827;
    background: white;
    appearance: none;
    outline: none;
    cursor: pointer;
  }

  svg {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6B7280;
    pointer-events: none;
  }
`;

const PriceInputWrapper = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  border-bottom: 2px solid ${props => props.$hasError ? '#ef4444' : LINE};
  padding-bottom: 0.5rem;
  transition: border-color 0.2s;
  
  span { font-size: 1.5rem; font-weight: 800; color: #9CA3AF; }

  input {
    border: none;
    outline: none;
    font-size: 2.5rem;
    font-weight: 900;
    color: #111827;
    width: 100%;
    background: transparent;
    letter-spacing: -1px;
    &::placeholder { color: #D1D5DB; }
  }

  &:focus-within { border-bottom-color: ${props => props.$hasError ? '#ef4444' : NAVY_ACCENT}; }
`;

const ToggleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;

  span { font-size: 0.8rem; font-weight: 600; color: #4B5563; }
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
    background-color: white;
    border: 2px solid ${props => props.$checked ? NAVY_ACCENT : LINE};
    background-color: ${props => props.$checked ? NAVY_ACCENT : 'white'};
    transition: .3s;
    border-radius: 34px;
    
    &:before {
      position: absolute;
      content: "";
      height: 14px;
      width: 14px;
      left: 3px;
      bottom: 3px;
      background-color: ${props => props.$checked ? 'white' : '#D1D5DB'};
      transition: .3s;
      border-radius: 50%;
    }
  }
  input:checked + span:before { transform: translateX(20px); }
`;

const SubtitleText = styled.span`
  font-size: 0.65rem;
  font-weight: 800;
  color: #9CA3AF;
  font-style: italic;
  float: right;
  text-transform: none;
  letter-spacing: 0;
`;

const VisualGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 160px);
  gap: 1.5rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  }
`;

const PrimaryAsset = styled.div`
  grid-column: 1 / 3;
  grid-row: 1 / 3;
  background-color: #E5E7EB; 
  background-image: url(${props => props.$src || ''});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed ${props => props.$hasError ? '#ef4444' : (props.$src ? 'transparent' : '#9CA3AF')};
  
  @media (max-width: 600px) {
    grid-column: 1 / -1;
    height: 300px;
  }

  button {
    background: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    font-size: 0.65rem;
    font-weight: 800;
    color: #111827;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: transform 0.2s;

    &:hover { transform: scale(1.05); }
  }
`;

const AssetSlot = styled.div`
  background: #F9FAFB;
  border: 1px dashed #D1D5DB;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #D1D5DB;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: #F3F4F6; color: #9CA3AF; border-color: #9CA3AF; }

  @media (max-width: 600px) { height: 120px; }
`;

const BlueCard = styled.div`
  background: #1A1A1A; 
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(75, 118, 252, 0.2);
  display: flex;
  flex-direction: column;

  @media (max-width: 600px) { padding: 1.5rem; }
`;

const StatusOption = styled.label`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: ${props => props.$active ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'};
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background 0.2s;
  border: 1px solid ${props => props.$active ? 'rgba(255,255,255,0.3)' : 'transparent'};

  &:last-child { margin-bottom: 0; }
  &:hover { background: rgba(255,255,255,0.15); }

  div.radio {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &::after {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: white;
      opacity: ${props => props.$active ? 1 : 0};
      transition: opacity 0.2s;
    }
  }

  div.text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    h4 { font-size: 0.85rem; font-weight: 800; color: white; margin: 0; text-transform: uppercase; letter-spacing: 1px;}
    p { font-size: 0.7rem; color: rgba(255,255,255,0.7); margin: 0; }
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const TagChip = styled.div`
  background: #EEF2FF;
  color: #1A1A1A;
  padding: 0.4rem 0.8rem;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  button {
    background: transparent;
    border: none;
    color: #1A1A1A;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0;
    &:hover { opacity: 0.7; }
  }
`;

const TagInput = styled.input`
  width: 100%;
  padding: 0.85rem;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  font-size: 0.85rem;
  outline: none;
  &::placeholder { color: #9CA3AF; }
  &:focus { border-color: #1A1A1A; }
`;

const PreviewCard = styled(Card)`
  padding: 0;
  overflow: hidden;
  position: relative;

  div.icon-top {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1A1A1A;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    cursor: pointer;
    z-index: 10;
  }

  div.image-area {
    height: 300px;
    background: #E5E7EB;
    background-image: url(${props => props.$src || ''});
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%);
    }

    span.watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 2rem;
      font-weight: 900;
      color: rgba(255,255,255,0.2);
      letter-spacing: -1px;
      z-index: 1;
    }
  }

  div.details {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    span.label { font-size: 0.65rem; font-weight: 800; color: #1A1A1A; text-transform: uppercase; letter-spacing: 2px; }
    h3 { font-size: 1.5rem; font-weight: 900; color: #111827; margin: 0; letter-spacing: -0.5px; text-transform: uppercase; line-height: 1.2; word-wrap: break-word;}
    span.price { font-size: 1.1rem; font-weight: 800; color: #1A1A1A; margin-top: 0.5rem; }
  }
`;

const HelpButton = styled.button`
  position: fixed;
  bottom: 2.5rem;
  right: 2.5rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #111827;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  transition: transform 0.2s;
  z-index: 100;

  &:hover { transform: scale(1.05); }

  @media (max-width: 768px) {
    bottom: 1.5rem;
    right: 1.5rem;
  }
`;

const AddProduct = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Custom UI State
  const [visibility, setVisibility] = useState('public');
  const [isTaxable, setIsTaxable] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [colors, setColors] = useState([]);
  const [isOutOfStock, setIsOutOfStock] = useState(false);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      price: '',
      stock: ''
    }
  });

  // Watch fields for the Live Preview Panel
  const watchName = watch('name', 'PRODUCT PREVIEW');
  const watchPrice = watch('price', 0);

  // 1. Fetch Categories for the Dropdown
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['adminCategories'],
    queryFn: async () => {
      const res = await apiClient.get('/categories');
      return res.data;
    }
  });
  const categories = categoriesData?.data || [];

  // 2. Create Product Mutation
  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.post('/products', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProducts']);
      navigate('/admin/products');
    },
    onError: (error) => {
      setServerError(error.response?.data?.message || 'Failed to create product.');
    }
  });

  const onSubmit = (data) => {
    if (images.length === 0) {
      setServerError('A primary image is required. Please upload at least one image.');
      return;
    }
    setServerError(null);
    createMutation.mutate({
      ...data,
      stock: isOutOfStock ? 0 : data.stock,
      tags,
      colors,
      images,
      isActive: visibility === 'public'
    });
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 1. Header */}
        <HeaderSection>
          <div className="text">
            <span className="overline">PRODUCT CURATION</span>
            <h1>ADD PRODUCT.</h1>
          </div>
          <div className="actions">
            <SecondaryBtn type="button" onClick={() => navigate('/admin/products')}>DISCARD</SecondaryBtn>
            <PrimaryBtn type="submit" disabled={isSubmitting || createMutation.isPending}>
              {(isSubmitting || createMutation.isPending) ? (
                 <><Loader2 size={16} className="animate-spin" /> PUBLISHING...</>
              ) : 'PUBLISH ENTITY'}
            </PrimaryBtn>
          </div>
        </HeaderSection>

        {serverError && (
          <div style={{ marginBottom: '2rem', padding: '1rem', background: '#fef2f2', border: '1px solid #ef4444', color: '#b91c1c', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
            {serverError}
          </div>
        )}

        <MainGrid>
          {/* LEFT COLUMN */}
          <Column>
            
            {/* Basic Info */}
            <Card>
              <SectionHeader>
                <span className="num">01</span> — BASIC INFORMATION
              </SectionHeader>
              
              <FormGroup>
                <label>PRODUCT TITLE <span style={{color: '#ef4444'}}>*</span></label>
                <TitleInput 
                  type="text" 
                  placeholder="e.g. Architectural Wool Coat" 
                  {...register('name')}
                  $hasError={!!errors.name}
                />
                {errors.name && <span className="error">{errors.name.message}</span>}
              </FormGroup>

              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <FormGroup $noMargin>
                  <label>CATEGORY <span style={{color: '#ef4444'}}>*</span></label>
                  <SelectWrapper $hasError={!!errors.categoryId}>
                    <select {...register('categoryId')} defaultValue="">
                      <option value="" disabled>Select a Category</option>
                      {isLoadingCategories ? (
                        <option disabled>Loading...</option>
                      ) : (
                        categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))
                      )}
                    </select>
                    <ChevronDown size={16} />
                  </SelectWrapper>
                  {errors.categoryId && <span className="error">{errors.categoryId.message}</span>}
                </FormGroup>
                
                <FormGroup $noMargin>
                  <label>DESIGNER / BRAND (Mock)</label>
                  <Input type="text" defaultValue="House of Curator" disabled style={{background: '#FAFAFA', color: '#9CA3AF'}}/>
                </FormGroup>
              </div>

              <FormGroup $noMargin>
                <label>DESCRIPTION</label>
                <TextArea 
                  placeholder="Crafted with precision, this piece embodies the intersection of form and utility..." 
                  {...register('description')}
                />
              </FormGroup>
            </Card>

            {/* Pricing & Inventory Row */}
            <Row2Col>
              <Card>
                <SectionHeader>
                  <span className="num">02</span> — PRICING
                </SectionHeader>
                
                <FormGroup>
                  <label>BASE PRICE <span style={{color: '#ef4444'}}>*</span></label>
                  <PriceInputWrapper $hasError={!!errors.price}>
                    {/* 🚨 Updated to GHC */}
                    <span>GHC</span>
                    <input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...register('price')}
                    />
                  </PriceInputWrapper>
                  {errors.price && <span className="error">{errors.price.message}</span>}
                </FormGroup>

                <ToggleRow>
                  <span>Taxable Product</span>
                  <Switch $checked={isTaxable}>
                    <input type="checkbox" checked={isTaxable} onChange={() => setIsTaxable(!isTaxable)} />
                    <span />
                  </Switch>
                </ToggleRow>
              </Card>

              <Card>
                <SectionHeader>
                  <span className="num">03</span> — INVENTORY
                </SectionHeader>

                <ToggleRow style={{marginTop: 0, marginBottom: '1.5rem'}}>
                  <span>Mark as Out of Stock</span>
                  <Switch $checked={isOutOfStock}>
                    <input type="checkbox" checked={isOutOfStock} onChange={() => setIsOutOfStock(!isOutOfStock)} />
                    <span />
                  </Switch>
                </ToggleRow>
                
                <FormGroup $noMargin>
                  <label>STOCK QUANTITY</label>
                  <TitleInput 
                    type="number" 
                    placeholder="0" 
                    style={{fontFamily: 'sans-serif', fontSize: '1.5rem', fontWeight: 800, background: isOutOfStock ? '#F3F4F6' : 'white', color: isOutOfStock ? '#9CA3AF' : '#111827'}} 
                    disabled={isOutOfStock}
                    {...register('stock')}
                    $hasError={!!errors.stock}
                  />
                  {errors.stock && <span className="error">{errors.stock.message}</span>}
                </FormGroup>
              </Card>
            </Row2Col>

            <Card>
              <SectionHeader style={{marginBottom: '1.5rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                  <span><span className="num">04</span> — VISUAL ASSETS (Required: 1, Max: 4)</span>
                  <SubtitleText>Preferred 3:4 Editorial Aspect Ratio</SubtitleText>
                </div>
              </SectionHeader>

              <VisualGrid>
                {images.length > 0 ? (
                  <PrimaryAsset $src={images[0].url}>
                    <button type="button" onClick={() => setIsModalOpen(true)}>
                      <ImageIcon size={14} /> ADD IMAGE
                    </button>
                    <button type="button" onClick={() => setImages([])} style={{position: 'absolute', top: 10, right: 10, padding: '0.5rem', background: '#ef4444', color: 'white'}}>
                      <X size={14} />
                    </button>
                  </PrimaryAsset>
                ) : (
                  <PrimaryAsset>
                    <button type="button" onClick={() => setIsModalOpen(true)}>
                      <ImageIcon size={14} /> SELECT PRIMARY ASSET
                    </button>
                  </PrimaryAsset>
                )}
                
                {[1, 2, 3].map((index) => (
                  images[index] ? (
                    <AssetSlot key={index} style={{backgroundImage: `url(${images[index].url})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'}}>
                      <button type="button" onClick={() => setImages(images.filter((_, i) => i !== index))} style={{position: 'absolute', top: 5, right: 5, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', padding: '0.2rem', cursor: 'pointer'}}>
                        <X size={12} />
                      </button>
                    </AssetSlot>
                  ) : (
                    <AssetSlot key={index} onClick={() => images.length > 0 && images.length === index ? setIsModalOpen(true) : null} style={{cursor: images.length === index ? 'pointer' : 'not-allowed', opacity: images.length === index ? 1 : 0.5}}>
                      <Plus size={24} strokeWidth={1} />
                    </AssetSlot>
                  )
                ))}
              </VisualGrid>
            </Card>

          </Column>

          {/* RIGHT COLUMN */}
          <Column>
            
            {/* Visibility Status */}
            <BlueCard>
              <SectionHeader style={{color: 'white', marginBottom: '1.5rem'}}>
                VISIBILITY STATUS
              </SectionHeader>
              
              <StatusOption $active={visibility === 'public'} onClick={() => setVisibility('public')}>
                <div className="radio" />
                <div className="text">
                  <h4>ONLINE / PUBLIC</h4>
                  <p>Visible to all customers immediately.</p>
                </div>
              </StatusOption>

              <StatusOption $active={visibility === 'hidden'} onClick={() => setVisibility('hidden')}>
                <div className="radio" />
                <div className="text">
                  <h4>DRAFT / HIDDEN</h4>
                  <p>Only visible in administrative views.</p>
                </div>
              </StatusOption>
            </BlueCard>

            {/* Organization */}
            <Card>
              <SectionHeader>ORGANIZATION</SectionHeader>

              <FormGroup>
                <label>TAGS (e.g. NEW ARRIVAL, LIMITED OFFER)</label>
                <TagContainer>
                  {tags.map((tag, i) => (
                    <TagChip key={i}>{tag} <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))}><X size={12}/></button></TagChip>
                  ))}
                </TagContainer>
                <TagInput 
                  type="text" 
                  placeholder="Type tag and press enter..." 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (e.target.value.trim() && !tags.includes(e.target.value.toUpperCase())) {
                        setTags([...tags, e.target.value.toUpperCase()]);
                        e.target.value = '';
                      }
                    }
                  }}
                />
              </FormGroup>

              <FormGroup $noMargin>
                <label>AVAILABLE COLORS</label>
                <TagContainer>
                  {colors.map((color, i) => (
                    <TagChip key={i}>{color} <button type="button" onClick={() => setColors(colors.filter(c => c !== color))}><X size={12}/></button></TagChip>
                  ))}
                </TagContainer>
                <TagInput 
                  type="text" 
                  placeholder="Type color and press enter..." 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (e.target.value.trim() && !colors.includes(e.target.value.toUpperCase())) {
                        setColors([...colors, e.target.value.toUpperCase()]);
                        e.target.value = '';
                      }
                    }
                  }}
                />
              </FormGroup>
            </Card>

            {/* Live Preview Card */}
            <PreviewCard>
              <div className="icon-top">
                <ExternalLink size={18} strokeWidth={2.5}/>
              </div>
              
              <div className="image-area" style={{backgroundImage: images.length > 0 ? `url(${images[0].url})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                {images.length === 0 && <span className="watermark">no image</span>}
              </div>

              <div className="details">
                <span className="label">LIVE PREVIEW</span>
                <h3>{watchName || 'Product Title'}</h3>
                
                {/* 🚨 Updated to use your Currency component! */}
                <span className="price">
                  <Currency amount={watchPrice || 0} />
                </span>
                
              </div>
            </PreviewCard>

          </Column>
        </MainGrid>
      </form>

      <HelpButton title="Need help? Contact support or check the documentation for managing your catalog.">
        <HelpCircle size={24} />
      </HelpButton>

      <ImageSelectorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={(imageObj) => {
          if (images.length < 4) {
            setImages([...images, { url: imageObj.url, public_id: imageObj.public_id, isPrimary: images.length === 0 }]);
          } else {
            alert('Maximum 4 images allowed');
          }
        }} 
      />

    </Container>
  );
};

export default AddProduct;