import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { 
  ArrowRight, ArrowUpRight, Mail, ArrowDown,
  Loader2, CheckCircle2, Image as ImageIcon, Plus, Trash2, Edit3, Save, X
} from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/axios';
import ImageSelectorModal from '../../../components/admin/ImageSelectorModal';

// --- Shared Storefront Styled Components (Visual Replica) ---
const slowZoom = keyframes`
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
`;

const PageWrapper = styled.div`
  padding: 2rem;
  background: #F8F9FA;
  min-height: 100vh;
`;

const HeaderSection = styled.div`
  display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem;
  h1 { font-family: 'Times New Roman', Times, serif; font-size: 3rem; margin: 0; }
  span.overline { font-size: 0.65rem; font-weight: 800; color: #1A1A1A; text-transform: uppercase; letter-spacing: 2px; }
`;

const PrimaryBtn = styled.button`
  background: ${props => props.disabled ? '#9CA3AF' : '#1A1A1A'}; color: white; border: none; padding: 0.85rem 1.5rem; border-radius: 50px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'}; display: flex; align-items: center; gap: 0.5rem;
  &:hover { background: ${props => props.disabled ? '#9CA3AF' : '#333333'}; }
`;

const EditorLabel = styled.div`
  position: absolute; top: 1rem; left: 1rem; background: rgba(0,0,0,0.6); color: white; padding: 0.5rem 1rem; border-radius: 50px; font-size: 0.7rem; font-weight: 800; letter-spacing: 1px; display: flex; align-items: center; gap: 0.5rem; z-index: 50; backdrop-filter: blur(5px);
`;

const BentoGrid = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(2, 400px); gap: 1.5rem; width: 100%; max-width: 1600px; margin: 0 auto;
  @media (max-width: 1280px) { grid-template-rows: repeat(2, 350px); }
  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); grid-template-rows: 500px 350px 350px; }
  @media (max-width: 768px) { display: flex; flex-direction: column; gap: 1rem; }
`;

const BaseCard = styled.div`
  border-radius: 32px; overflow: hidden; position: relative; background: #E5E7EB; cursor: pointer; transition: all 0.2s;
  &:hover { transform: scale(0.99); box-shadow: 0 0 0 4px #1A1A1A; }
`;

const BackgroundImg = styled.div`
  position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url(${props => props.$src}); background-size: cover; background-position: center; z-index: 1;
  &::after { content: ''; position: absolute; inset: 0; background: ${props => props.$overlay || 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.2) 100%)'}; }
`;

// Card 1
const LeftCard = styled(BaseCard)`
  grid-column: span 2; grid-row: span 2; color: white; display: flex; flex-direction: column; justify-content: space-between; padding: 2.5rem;
`;
const TopBadges = styled.div` position: relative; z-index: 10; display: flex; gap: 1rem; `;
const PillBadge = styled.span` border: 1px solid rgba(255, 255, 255, 0.4); backdrop-filter: blur(10px); padding: 0.5rem 1.2rem; border-radius: 50px; font-size: 0.8rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; `;
const BottomContent = styled.div` position: relative; z-index: 10; display: flex; justify-content: space-between; align-items: flex-end; `;
const MainTitle = styled.h1` font-size: 4.5rem; font-weight: 700; line-height: 1.1; margin: 0; font-family: 'Playfair Display', serif; `;
const NextUpButton = styled.button` background: #d8f3e5; color: #111; border: none; border-radius: 50px; padding: 1rem 1.5rem; display: flex; align-items: center; gap: 3rem; font-weight: 700; font-size: 0.85rem; `;

// Card 2
const TopRightCard = styled(BaseCard)`
  grid-column: span 2; grid-row: span 1; padding: 2.5rem; display: flex; flex-direction: column; justify-content: space-between; background: #E2F5EA; /* Mint background */
`;
const BannerContent = styled.div` position: relative; z-index: 10; height: 100%; display: flex; flex-direction: column; justify-content: space-between; `;
const BannerText = styled.h2` font-size: 2.8rem; font-weight: 900; color: #1a1a1a; line-height: 1.1; text-transform: uppercase; max-width: 90%; margin: 0; `;
const ButtonRow = styled.div` display: flex; gap: 1rem; `;
const ActionPill = styled.button`
  background: ${props => props.$dark ? '#1a1a1a' : 'white'}; color: ${props => props.$dark ? 'white' : '#1a1a1a'}; border: ${props => props.$dark ? 'none' : '1px solid #1a1a1a'}; border-radius: 50px; padding: 0.8rem 1.2rem; display: flex; align-items: center; gap: 1rem; font-size: 0.8rem; font-weight: 700; text-transform: uppercase;
  .icon-wrapper { background: ${props => props.$dark ? 'white' : '#1a1a1a'}; color: ${props => props.$dark ? '#1a1a1a' : 'white'}; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; }
`;

// Card 3
const BottomDarkCard = styled(BaseCard)`
  grid-column: span 1; grid-row: span 1; color: white; padding: 2rem; display: flex; flex-direction: column; justify-content: space-between;
`;
const TopRightIcon = styled.div` position: absolute; top: 1.5rem; right: 1.5rem; width: 40px; height: 40px; border-radius: 50%; background: white; color: black; display: flex; align-items: center; justify-content: center; z-index: 10; `;
const DarkCardText = styled.div`
  position: relative; z-index: 10;
  .subtitle { font-size: 1.2rem; font-family: monospace; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 0.5rem; margin-bottom: 2rem; display: inline-block; }
  .title { font-size: 2.2rem; font-weight: 700; line-height: 1.2; }
`;

// Card 4
const BottomImageCard = styled(BaseCard)`
  grid-column: span 1; grid-row: span 1; padding: 2rem; display: flex; flex-direction: column; justify-content: space-between;
`;

// --- Editor Modal Components ---
const EditorOverlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: flex-end; z-index: 100;
`;
const EditorPanel = styled.div`
  width: 450px; background: white; height: 100%; display: flex; flex-direction: column; box-shadow: -10px 0 30px rgba(0,0,0,0.1);
`;
const EditorHeader = styled.div`
  padding: 1.5rem; border-bottom: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center;
  h3 { margin: 0; font-size: 1rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
  button { background: none; border: none; cursor: pointer; color: #6B7280; }
`;
const EditorBody = styled.div` padding: 1.5rem; flex: 1; overflow-y: auto; `;
const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  label { display: block; font-size: 0.65rem; font-weight: 800; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem; }
  input, textarea { width: 100%; padding: 0.75rem; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 0.9rem; outline: none; box-sizing: border-box; }
  textarea { min-height: 80px; resize: vertical; }
`;
const ImageList = styled.div` display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; `;
const ImageRow = styled.div`
  display: flex; align-items: center; justify-content: space-between; padding: 0.5rem; border: 1px solid #E5E7EB; border-radius: 8px;
  img { width: 40px; height: 40px; object-fit: cover; border-radius: 4px; }
  button { background: none; border: none; color: #EF4444; cursor: pointer; }
`;
const AddBtn = styled.button`
  width: 100%; padding: 0.75rem; background: #F9FAFB; border: 1px dashed #D1D5DB; border-radius: 8px; color: #1A1A1A; font-size: 0.75rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  &:hover { background: #EEF2FF; border-color: #1A1A1A; }
`;

const defaultHeroData = {
  card1: { images: [{ url: '/h7.jpg', public_id: '' }], tags: [{text: 'Brand Edit'}, {text: '2026 Collection'}], headline: 'Your Style Speaks.', buttonText: 'SHOP' },
  card2: { images: [{ url: '/h2.jpg', public_id: '' }], text: 'Curate Your Everyday Look With Our New Essentials', button1Text: 'LEARN MORE', button2Text: 'CONTACT US' },
  card3: { images: [{ url: '/h9.jpg', public_id: '' }], subtitle: 'New Arrivals!', title: 'Daily Must-Haves' },
  card4: { images: [{ url: '/h3.jpg', public_id: '' }] }
};

const HeroConfiguration = () => {
  const queryClient = useQueryClient();
  const [activeEditorCard, setActiveEditorCard] = useState(null); // 'card1', 'card2', 'card3', 'card4'
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);

  const [activeSlide1, setActiveSlide1] = React.useState(0);
  const [activeSlide3, setActiveSlide3] = React.useState(0);
  const [activeSlide4, setActiveSlide4] = React.useState(0);

  const { register, control, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: defaultHeroData
  });

  // Watch entire form
  const formValues = watch();

  // Field Arrays for specific things
  const { fields: card1Images, append: addCard1Image, remove: removeCard1Image } = useFieldArray({ control, name: 'card1.images' });
  const { fields: card1Tags, append: addCard1Tag, remove: removeCard1Tag } = useFieldArray({ control, name: 'card1.tags' });
  const { fields: card3Images, append: addCard3Image, remove: removeCard3Image } = useFieldArray({ control, name: 'card3.images' });
  const { fields: card4Images, append: addCard4Image, remove: removeCard4Image } = useFieldArray({ control, name: 'card4.images' });

  // Add Slider Logic for Preview
  React.useEffect(() => {
    const s1Len = formValues.card1?.images?.length || 1;
    const s3Len = formValues.card3?.images?.length || 1;
    const s4Len = formValues.card4?.images?.length || 1;

    const int1 = setInterval(() => setActiveSlide1(p => (p + 1) % s1Len), 3000);
    const int3 = setInterval(() => setActiveSlide3(p => (p + 1) % s3Len), 3500);
    const int4 = setInterval(() => setActiveSlide4(p => (p + 1) % s4Len), 4000);

    return () => { clearInterval(int1); clearInterval(int3); clearInterval(int4); };
  }, [formValues.card1?.images?.length, formValues.card3?.images?.length, formValues.card4?.images?.length]);

  // 1. Fetch
  const { data: response, isLoading } = useQuery({
    queryKey: ['heroConfig'],
    queryFn: async () => {
      const res = await apiClient.get('/hero');
      return res.data;
    }
  });

  React.useEffect(() => {
    if (response?.data) {
      // If we have data, we merge it with default structures so old flat data doesn't break UI
      if (response.data.card1) {
        reset(response.data);
      } else {
        reset(defaultHeroData); // fallback if migrating from old flat format
      }
    }
  }, [response, reset]);

  // 2. Save
  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient.put('/hero', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['heroConfig']);
      alert('Storefront Hero Section updated successfully!');
    }
  });

  const onSubmit = (data) => updateMutation.mutate(data);

  if (isLoading) return <PageWrapper><Loader2 className="animate-spin" color="#1A1A1A" /></PageWrapper>;

  const handleImageSelect = (imageObj) => {
    if (activeEditorCard === 'card1') addCard1Image({ url: imageObj.url, public_id: imageObj.public_id });
    if (activeEditorCard === 'card3') addCard3Image({ url: imageObj.url, public_id: imageObj.public_id });
    if (activeEditorCard === 'card4') addCard4Image({ url: imageObj.url, public_id: imageObj.public_id });
  };

  return (
    <PageWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <HeaderSection>
          <div>
            <span className="overline">WYSIWYG EDITOR</span>
            <h1>Storefront Hero Configuration</h1>
            <p style={{color: '#6B7280', fontSize: '0.9rem'}}>Click on any section to edit its content and image slider.</p>
          </div>
          <div>
            <PrimaryBtn type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? <Loader2 size={16} className="animate-spin"/> : <><Save size={16}/> PUBLISH HERO</>}
            </PrimaryBtn>
          </div>
        </HeaderSection>

        {/* --- LIVE BENTO PREVIEW --- */}
        <BentoGrid>
          
          {/* Card 1 */}
          <LeftCard onClick={() => setActiveEditorCard('card1')}>
            <EditorLabel><Edit3 size={12}/> EDIT CARD 1</EditorLabel>
            {formValues.card1?.images?.map((img, idx) => (
              <BackgroundImg key={idx} $src={img.url} $active={idx === activeSlide1} />
            ))}
            <TopBadges>
              {formValues.card1?.tags?.map((tag, i) => <PillBadge key={i}>{tag.text}</PillBadge>)}
            </TopBadges>
            <BottomContent>
              <MainTitle>{formValues.card1?.headline || 'Your Style Speaks.'}</MainTitle>
              <NextUpButton>{formValues.card1?.buttonText || 'SHOP'} <ArrowRight size={18} /></NextUpButton>
            </BottomContent>
          </LeftCard>

          {/* Card 2 (NO IMAGE BG) */}
          <TopRightCard onClick={() => setActiveEditorCard('card2')}>
            <EditorLabel><Edit3 size={12}/> EDIT TEXT</EditorLabel>
            <BannerContent>
              <BannerText>{formValues.card2?.text}</BannerText>
              <ButtonRow>
                <ActionPill>{formValues.card2?.button1Text} <div className="icon-wrapper"><ArrowDown size={14} /></div></ActionPill>
                <ActionPill $dark>{formValues.card2?.button2Text} <div className="icon-wrapper" style={{background:'transparent',border:'1px solid black',color:'black'}}><Mail size={14} /></div></ActionPill>
              </ButtonRow>
            </BannerContent>
          </TopRightCard>

          {/* Card 3 */}
          <BottomDarkCard onClick={() => setActiveEditorCard('card3')}>
            <EditorLabel><Edit3 size={12}/> EDIT CARD 3</EditorLabel>
            {formValues.card3?.images?.map((img, idx) => (
              <BackgroundImg key={idx} $src={img.url} $active={idx === activeSlide3} $overlay="rgba(28, 28, 28, 0.8)" />
            ))}
            <TopRightIcon><ArrowUpRight size={20} /></TopRightIcon>
            <DarkCardText>
              <div className="subtitle">{formValues.card3?.subtitle}</div>
              <div className="title">{formValues.card3?.title}</div>
            </DarkCardText>
          </BottomDarkCard>

          {/* Card 4 */}
          <BottomImageCard onClick={() => setActiveEditorCard('card4')}>
            <EditorLabel><Edit3 size={12}/> EDIT CARD 4</EditorLabel>
            {formValues.card4?.images?.map((img, idx) => (
              <BackgroundImg key={idx} $src={img.url} $active={idx === activeSlide4} $overlay="rgba(0, 0, 0, 0.2)" />
            ))}
            <TopRightIcon style={{ background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(5px)' }}>
              <ArrowUpRight size={20} />
            </TopRightIcon>
          </BottomImageCard>

        </BentoGrid>
      </form>

      {/* --- EDITOR MODAL --- */}
      {activeEditorCard && (
        <EditorOverlay onClick={() => setActiveEditorCard(null)}>
          <EditorPanel onClick={e => e.stopPropagation()}>
            <EditorHeader>
              <h3>Editing {activeEditorCard.toUpperCase()}</h3>
              <button onClick={() => setActiveEditorCard(null)}><X size={20}/></button>
            </EditorHeader>
            <EditorBody>

              {/* IMAGE SLIDER COMMON TO CARDS 1, 3, 4 */}
              {activeEditorCard !== 'card2' && (
                <FormGroup>
                  <label>Slider Images (Multiple allowed)</label>
                  <ImageList>
                    {(activeEditorCard === 'card1' ? card1Images : activeEditorCard === 'card3' ? card3Images : card4Images).map((field, idx) => (
                      <ImageRow key={field.id}>
                        <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
                          <img src={field.url} alt="Slide" />
                          <span style={{fontSize:'0.75rem', fontWeight:600, color:'#6B7280'}}>Slide {idx + 1}</span>
                        </div>
                        <button type="button" onClick={() => {
                          if (activeEditorCard === 'card1') removeCard1Image(idx);
                          if (activeEditorCard === 'card3') removeCard3Image(idx);
                          if (activeEditorCard === 'card4') removeCard4Image(idx);
                        }}><Trash2 size={14}/></button>
                      </ImageRow>
                    ))}
                  </ImageList>
                  <AddBtn type="button" onClick={() => setIsImageSelectorOpen(true)}>
                    <Plus size={14}/> ADD SLIDE IMAGE
                  </AddBtn>
                </FormGroup>
              )}

              {activeEditorCard !== 'card2' && <div style={{height:'1px', background:'#E5E7EB', margin:'1.5rem 0'}}/>}

              {/* CARD 1 FIELDS */}
              {activeEditorCard === 'card1' && (
                <>
                  <FormGroup>
                    <label>Main Headline</label>
                    <textarea {...register('card1.headline')} />
                  </FormGroup>
                  <FormGroup>
                    <label>Tags</label>
                    <div style={{display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'0.5rem'}}>
                      {card1Tags.map((field, idx) => (
                        <div key={field.id} style={{display:'flex', gap:'0.5rem'}}>
                          <input {...register(`card1.tags.${idx}.text`)} />
                          <button type="button" onClick={() => removeCard1Tag(idx)} style={{background:'none',border:'none',color:'#EF4444',cursor:'pointer'}}><Trash2 size={16}/></button>
                        </div>
                      ))}
                    </div>
                    <AddBtn type="button" onClick={() => addCard1Tag({text: 'New Tag'})}>+ ADD TAG</AddBtn>
                  </FormGroup>
                  <FormGroup>
                    <label>Button Text</label>
                    <input type="text" {...register('card1.buttonText')} />
                  </FormGroup>
                </>
              )}

              {/* CARD 2 FIELDS */}
              {activeEditorCard === 'card2' && (
                <>
                  <FormGroup>
                    <label>Description Text</label>
                    <textarea {...register('card2.text')} />
                  </FormGroup>
                  <FormGroup>
                    <label>Button 1 Text</label>
                    <input type="text" {...register('card2.button1Text')} />
                  </FormGroup>
                  <FormGroup>
                    <label>Button 2 Text</label>
                    <input type="text" {...register('card2.button2Text')} />
                  </FormGroup>
                </>
              )}

              {/* CARD 3 FIELDS */}
              {activeEditorCard === 'card3' && (
                <>
                  <FormGroup>
                    <label>Subtitle (Monospace)</label>
                    <input type="text" {...register('card3.subtitle')} />
                  </FormGroup>
                  <FormGroup>
                    <label>Main Title</label>
                    <input type="text" {...register('card3.title')} />
                  </FormGroup>
                </>
              )}

              {/* CARD 4 HAS NO EXTRA FIELDS */}
              {activeEditorCard === 'card4' && (
                <p style={{fontSize:'0.8rem', color:'#6B7280'}}>This card only displays images and has no text content.</p>
              )}

            </EditorBody>
          </EditorPanel>
        </EditorOverlay>
      )}

      <ImageSelectorModal 
        isOpen={isImageSelectorOpen} 
        onClose={() => setIsImageSelectorOpen(false)} 
        onSelect={(imageObj) => {
          handleImageSelect(imageObj);
          setIsImageSelectorOpen(false); // Close selector after choosing
        }} 
      />
    </PageWrapper>
  );
};

export default HeroConfiguration;