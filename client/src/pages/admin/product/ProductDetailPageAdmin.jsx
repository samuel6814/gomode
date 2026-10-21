import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  ChevronDown,
  X,
  Plus,
  ArrowLeft,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import ImageSelectorModal from '../../../components/admin/ImageSelectorModal';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// --- Zod Validation Schema ---
const productSchema = z.object({
  name: z.string().min(2, 'Product title is required'),
  categoryId: z.string().min(1, 'Please select a category'),
  description: z.string().optional(),
  stock: z.preprocess((val) => parseInt(val, 10), z.number().min(0, 'Stock must be valid'))
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

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: #6B7280;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1.5rem;
  transition: color 0.2s;
  width: fit-content;
  
  &:hover { color: #1A1A1A; }
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
      font-size: 3rem;
      font-weight: 900;
      color: #111827;
      margin: 0;
      letter-spacing: -1px;
      text-transform: uppercase;
      
      @media (max-width: 768px) { font-size: 2rem; }
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
  justify-content: center;
  gap: 0.5rem;

  &:hover { 
    background: ${props => props.disabled ? '#9CA3AF' : '#333333'}; 
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'}; 
  }
  @media (max-width: 600px) { flex: 1; }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2.5rem;

  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const Row2Col = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  border: 1px solid #F3F4F6;
  display: flex;
  flex-direction: column;

  @media (max-width: 600px) { padding: 1.5rem; }
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 2rem;

  span.label {
    font-size: 0.65rem;
    font-weight: 800;
    color: #1A1A1A;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 900;
    color: #111827;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: -0.5px;
  }
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

const InputPill = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 1px solid ${props => props.$hasError ? '#ef4444' : 'transparent'};
  border-radius: 8px;
  font-family: sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
  background: #F9FAFB;
  outline: none;
  transition: box-shadow 0.2s;

  &::placeholder { color: #D1D5DB; }
  &:focus { box-shadow: 0 0 0 2px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(75, 118, 252, 0.2)'}; }
`;

const PriceInputWrapper = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  background: #F9FAFB;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  border: 1px solid ${props => props.$hasError ? '#ef4444' : 'transparent'};
  transition: box-shadow 0.2s;
  
  span { font-size: 1.2rem; font-weight: 800; color: #9CA3AF; }

  input {
    border: none;
    outline: none;
    font-size: 1.5rem;
    font-weight: 800;
    color: #111827;
    width: 100%;
    background: transparent;
    &::placeholder { color: #D1D5DB; }
  }

  &:focus-within { box-shadow: 0 0 0 2px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(75, 118, 252, 0.2)'}; }
`;

const TextAreaPill = styled.textarea`
  width: 100%;
  padding: 1.5rem;
  border: 1px solid ${props => props.$hasError ? '#ef4444' : 'transparent'};
  border-radius: 8px;
  font-family: 'Times New Roman', Times, serif;
  font-size: 1.05rem;
  color: #111827;
  background: #F9FAFB;
  outline: none;
  min-height: 180px;
  resize: vertical;
  line-height: 1.6;
  transition: box-shadow 0.2s;

  &:focus { box-shadow: 0 0 0 2px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(75, 118, 252, 0.2)'}; }
`;

const SelectWrapper = styled.div`
  position: relative;
  
  select {
    width: 100%;
    padding: 1rem 1.25rem;
    border: 1px solid ${props => props.$hasError ? '#ef4444' : 'transparent'};
    border-radius: 8px;
    font-family: sans-serif;
    font-size: 0.9rem;
    font-weight: 800;
    color: #111827;
    background: #F9FAFB;
    appearance: none;
    outline: none;
    cursor: pointer;
    text-transform: uppercase;
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
  margin-top: 1.5rem;

  div.text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    
    span.title { font-size: 0.8rem; font-weight: 800; color: #111827; text-transform: uppercase; letter-spacing: 1px;}
    span.sub { font-size: 0.65rem; color: #6B7280; }
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
    background-color: white;
    border: 2px solid ${props => props.$checked ? '#1A1A1A' : '#E5E7EB'};
    background-color: ${props => props.$checked ? '#1A1A1A' : 'white'};
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

const StatusOption = styled.label`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: ${props => props.$active ? '#EEF2FF' : '#F9FAFB'};
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background 0.2s;
  border: 1px solid ${props => props.$active ? '#C7D2FE' : 'transparent'};

  &:last-child { margin-bottom: 0; }

  div.radio {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid ${props => props.$active ? '#1A1A1A' : '#D1D5DB'};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &::after {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #1A1A1A;
      opacity: ${props => props.$active ? 1 : 0};
      transition: opacity 0.2s;
    }
  }

  div.text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    h4 { font-size: 0.8rem; font-weight: 800; color: ${props => props.$active ? '#1A1A1A' : '#111827'}; margin: 0; text-transform: uppercase; letter-spacing: 1px;}
    p { font-size: 0.65rem; color: #9CA3AF; margin: 0; }
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  background: #F9FAFB;
  padding: 1rem;
  border-radius: 8px;
  align-items: center;
`;

const TagChip = styled.div`
  background: white;
  border: 1px solid #E5E7EB;
  color: #1A1A1A;
  padding: 0.4rem 0.8rem;
  border-radius: 50px;
  font-size: 0.65rem;
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
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.8rem;
  color: #111827;
  flex: 1;
  min-width: 100px;
  &::placeholder { color: #9CA3AF; }
`;

const ImagePreviewCard = styled(Card)`
  padding: 1.5rem;
`;

const MainImage = styled.div`
  width: 100%;
  aspect-ratio: 3/4;
  background-color: #E5E7EB;
  background-image: url(${props => props.$src});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 2px dashed ${props => props.$hasError ? '#ef4444' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

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
    opacity: 0.9;

    &:hover { transform: scale(1.05); opacity: 1; }
  }
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
`;

const AddThumbnailBtn = styled.button`
  aspect-ratio: 1;
  background: #FAFAFA;
  border: 1px dashed #D1D5DB;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #D1D5DB;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: #F9FAFB; border-color: #1A1A1A; color: #1A1A1A; }
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


const ProductDetailsPageAdmin = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [isTaxable, setIsTaxable] = useState(true);
  const [visibility, setVisibility] = useState('public');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [colors, setColors] = useState([]);
  const [isOutOfStock, setIsOutOfStock] = useState(false);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  // 1. Fetch Categories for Dropdown
  const { data: categoriesData } = useQuery({
    queryKey: ['adminCategories'],
    queryFn: async () => {
      const res = await apiClient.get('/categories');
      return res.data;
    }
  });
  const categories = categoriesData?.data || [];

  // 2. Fetch Single Product
  const { data: productData, isLoading: isFetching } = useQuery({
    queryKey: ['adminProduct', id],
    queryFn: async () => {
      const res = await apiClient.get(`/products/${id}`);
      return res.data;
    },
    enabled: !!id
  });

  // 3. Pre-fill form when data arrives
  useEffect(() => {
    if (productData?.data) {
      const product = productData.data;
      
      reset({
        name: product.name,
        categoryId: product.categoryId || '',
        description: product.description || '',
        price: product.price,
        stock: product.stock
      });
      
      setVisibility(product.isActive ? 'public' : 'hidden');
      setTags(product.tags || []);
      setColors(product.colors || []);
      setIsOutOfStock(product.stock === 0);
      
      if (product.images && product.images.length > 0) {
        setImages(product.images.map(img => ({
          url: img.image.url,
          public_id: img.image.public_id,
          isPrimary: img.isPrimary
        })));
      }
    }
  }, [productData, reset]);

  // 4. Update Product Mutation
  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient.put(`/products/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProducts']);
      queryClient.invalidateQueries(['adminProduct', id]);
      navigate('/admin/products');
    },
    onError: (error) => {
      setServerError(error.response?.data?.message || 'Failed to update product.');
    }
  });

  const onSubmit = (data) => {
    if (images.length === 0) {
      setServerError('A primary image is required. Please upload at least one image.');
      return;
    }
    setServerError(null);
    updateMutation.mutate({
      ...data,
      stock: isOutOfStock ? 0 : data.stock,
      tags,
      colors,
      images,
      isActive: visibility === 'public'
    });
  };

  if (isFetching) {
    return (
      <div style={{padding: '2rem', width: '100%'}}><Skeleton count={1} height={200} borderRadius={12} style={{marginBottom: '2rem'}}/><Skeleton count={3} height={40} style={{marginBottom: '1rem'}}/></div>
    );
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 1. Back Button */}
        <BackButton type="button" onClick={() => navigate('/admin/products')}>
          <ArrowLeft size={18} /> Back to Products
        </BackButton>

        {/* 2. Header */}
        <HeaderSection>
          <div className="text">
            <span className="overline">PRODUCT DETAILS</span>
            <h1>Edit Product</h1>
          </div>
          <div className="actions">
            <SecondaryBtn type="button" onClick={() => navigate('/admin/products')}>DISCARD</SecondaryBtn>
            <PrimaryBtn type="submit" disabled={isSubmitting || updateMutation.isPending}>
              {(isSubmitting || updateMutation.isPending) ? (
                <><Loader2 size={16} className="animate-spin" /> SAVING...</>
              ) : 'SAVE CHANGES'}
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
            
            <Card>
              <SectionHeader>
                <span className="label">CATEGORY</span>
                <h3>General Information</h3>
              </SectionHeader>

              <Row2Col>
                <FormGroup>
                  <label>PRODUCT NAME <span style={{color: '#ef4444'}}>*</span></label>
                  <InputPill 
                    type="text" 
                    placeholder="Product Name"
                    {...register('name')} 
                    $hasError={!!errors.name}
                  />
                  {errors.name && <span className="error">{errors.name.message}</span>}
                </FormGroup>

                <FormGroup>
                  <label>CATEGORY <span style={{color: '#ef4444'}}>*</span></label>
                  <SelectWrapper $hasError={!!errors.categoryId}>
                    <select {...register('categoryId')} defaultValue="">
                      <option value="" disabled>Select Category...</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} />
                  </SelectWrapper>
                  {errors.categoryId && <span className="error">{errors.categoryId.message}</span>}
                </FormGroup>
              </Row2Col>

              <FormGroup $noMargin>
                <label>DESCRIPTION</label>
                <TextAreaPill 
                  placeholder="Describe this product..."
                  {...register('description')} 
                />
              </FormGroup>
            </Card>

            <Card>
              <SectionHeader>
                <span className="label">FINANCE</span>
                <h3>Pricing & Tax</h3>
              </SectionHeader>

              <Row2Col>
                <FormGroup $noMargin>
                  <label>BASE PRICE <span style={{color: '#ef4444'}}>*</span></label>
                  <PriceInputWrapper $hasError={!!errors.price}>
                    {/* 🚨 Changed from $ to GHC */}
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

                {/* Mock Sale Price */}
                <FormGroup $noMargin>
                  <label>SALE PRICE (MOCK)</label>
                  <PriceInputWrapper>
                    {/* 🚨 Changed from $ to GHC */}
                    <span>GHC</span>
                    <input type="number" placeholder="0.00" disabled style={{color: '#9CA3AF'}}/>
                  </PriceInputWrapper>
                </FormGroup>
              </Row2Col>

              <ToggleRow>
                <div className="text">
                  <span className="title">Taxable Product</span>
                  <span className="sub">Apply standard regional sales tax to this item</span>
                </div>
                <Switch $checked={isTaxable}>
                  <input 
                    type="checkbox" 
                    checked={isTaxable} 
                    onChange={() => setIsTaxable(!isTaxable)} 
                  />
                  <span />
                </Switch>
              </ToggleRow>
            </Card>

              <Card>
                <SectionHeader>
                  <span className="label">LOGISTICS</span>
                  <h3>Inventory</h3>
                </SectionHeader>

                <ToggleRow style={{marginTop: 0, marginBottom: '1.5rem'}}>
                  <div className="text">
                    <span className="title">Mark as Out of Stock</span>
                    <span className="sub">Temporarily disable purchases for this item</span>
                  </div>
                  <Switch $checked={isOutOfStock}>
                    <input type="checkbox" checked={isOutOfStock} onChange={() => setIsOutOfStock(!isOutOfStock)} />
                    <span />
                  </Switch>
                </ToggleRow>

                <Row2Col>
                  <FormGroup $noMargin>
                    <label>STOCK QUANTITY</label>
                    <InputPill 
                      type="number" 
                      placeholder="0"
                      style={{fontWeight: 800, background: isOutOfStock ? '#F3F4F6' : '#F9FAFB', color: isOutOfStock ? '#9CA3AF' : '#111827'}}
                      disabled={isOutOfStock}
                      {...register('stock')}
                      $hasError={!!errors.stock}
                    />
                    {errors.stock && <span className="error">{errors.stock.message}</span>}
                  </FormGroup>

                  <FormGroup $noMargin>
                    <label>LOW STOCK ALERT</label>
                    <InputPill type="number" defaultValue={5} style={{fontWeight: 800}} disabled/>
                  </FormGroup>
                </Row2Col>
              </Card>

          </Column>

          {/* RIGHT COLUMN */}
          <Column>
            
            <Card>
              <SectionHeader style={{marginBottom: '1.5rem'}}>
                <span className="label" style={{color: '#9CA3AF'}}>VISIBILITY STATUS</span>
              </SectionHeader>

              <StatusOption $active={visibility === 'public'} onClick={() => setVisibility('public')}>
                <div className="radio" />
                <div className="text">
                  <h4>ONLINE / PUBLIC</h4>
                  <p>Visible to all customers</p>
                </div>
              </StatusOption>

              <StatusOption $active={visibility === 'hidden'} onClick={() => setVisibility('hidden')}>
                <div className="radio" />
                <div className="text">
                  <h4>DRAFT / HIDDEN</h4>
                  <p>Only visible to administrators</p>
                </div>
              </StatusOption>
            </Card>

            <Card>
              <SectionHeader style={{marginBottom: '1.5rem'}}>
                <span className="label" style={{color: '#9CA3AF'}}>ORGANIZATION</span>
              </SectionHeader>

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

            <ImagePreviewCard>
              <SectionHeader style={{marginBottom: '1.5rem'}}>
                <span className="label" style={{color: '#9CA3AF'}}>PRODUCT IMAGERY (Max: 4)</span>
              </SectionHeader>
              
              <MainImage $src={images.length > 0 ? images[0].url : ''}>
                <button type="button" onClick={() => setIsModalOpen(true)}>
                  <ImageIcon size={14} /> {images.length > 0 ? 'CHANGE PRIMARY' : 'SELECT IMAGE'}
                </button>
                {images.length > 0 && (
                  <button type="button" onClick={() => setImages([])} style={{position: 'absolute', top: 10, right: 10, padding: '0.5rem', background: '#ef4444', color: 'white'}}>
                    <X size={14} />
                  </button>
                )}
              </MainImage>
              
              <ThumbnailGrid>
                {[1, 2, 3].map(index => (
                  images[index] ? (
                    <div key={index} style={{aspectRatio: 1, borderRadius: 6, backgroundImage: `url(${images[index].url})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'}}>
                      <button type="button" onClick={() => setImages(images.filter((_, i) => i !== index))} style={{position: 'absolute', top: 2, right: 2, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', padding: '0.1rem', cursor: 'pointer'}}>
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <AddThumbnailBtn key={index} type="button" onClick={() => images.length > 0 && images.length === index ? setIsModalOpen(true) : null} style={{cursor: images.length === index ? 'pointer' : 'not-allowed', opacity: images.length === index ? 1 : 0.5}}>
                      <Plus size={16} />
                    </AddThumbnailBtn>
                  )
                ))}
              </ThumbnailGrid>
            </ImagePreviewCard>

          </Column>

        </MainGrid>
      </form>

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

export default ProductDetailsPageAdmin;