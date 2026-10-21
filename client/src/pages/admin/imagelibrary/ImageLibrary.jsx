import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Filter, 
  Plus, 
  Trash2, 
  Download,
  PlusCircle,
  CheckCircle2,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/axios';

// --- Helper Functions ---
const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// --- Styled Components ---
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box; 
  padding: 2.5rem 3rem;
  background: #F8F9FA;
  min-height: 100vh;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;

  @media (max-width: 1024px) { padding: 2rem; }
  @media (max-width: 768px) { padding: 1.5rem; }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;

  div.text {
    h1 {
      font-family: 'Times New Roman', Times, serif;
      font-size: 3rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
      letter-spacing: -1px;
      
      @media (max-width: 768px) { font-size: 2.2rem; }
    }
    p {
      font-size: 0.65rem;
      font-weight: 800;
      color: #9CA3AF;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin: 0;
    }
  }

  div.actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    @media (max-width: 600px) { width: 100%; }
  }
`;

const OutlineBtn = styled.button`
  background: white;
  color: #111827;
  border: 1px solid #E5E7EB;
  padding: 0.85rem 1.5rem;
  border-radius: 50px; 
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover { border-color: #111827; }
  @media (max-width: 600px) { flex: 1; justify-content: center; }
`;

const PrimaryBtn = styled.button`
  background: #1A1A1A;
  color: white;
  border: none;
  padding: 0.85rem 1.5rem;
  border-radius: 50px; 
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: ${props => props.disabled ? 'none' : '0 8px 20px rgba(79, 70, 229, 0.3)'};
  transition: all 0.2s;
  opacity: ${props => props.disabled ? 0.7 : 1};

  &:hover { 
    background: ${props => props.disabled ? '#1A1A1A' : '#333333'}; 
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'}; 
  }
  @media (max-width: 600px) { flex: 1; justify-content: center; }
`;

const Toolbar = styled.div`
  background: white;
  border-radius: 12px; 
  padding: 1.25rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem 1.5rem;
  }

  div.left {
    display: flex;
    align-items: center;
    gap: 1.5rem;

    label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.7rem;
      font-weight: 800;
      color: #4B5563;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;

      input {
        width: 16px;
        height: 16px;
        cursor: pointer;
        accent-color: #1A1A1A;
        border-radius: 4px; 
      }
    }

    div.divider { width: 1px; height: 20px; background: #E5E7EB; }

    button {
      background: transparent;
      border: none;
      color: #EF4444;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      cursor: pointer;
      padding: 0;
      transition: opacity 0.2s;
      
      &:hover { opacity: 0.7; }
      &:disabled { opacity: 0.4; cursor: not-allowed; }
    }
  }

  div.right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.65rem;
    font-weight: 800;
    color: #9CA3AF;
    text-transform: uppercase;
    letter-spacing: 1px;

    select {
      border: none;
      background: transparent;
      font-size: 0.7rem;
      font-weight: 800;
      color: #111827;
      text-transform: uppercase;
      letter-spacing: 1px;
      outline: none;
      cursor: pointer;
      appearance: none;
      padding-right: 1.2rem;
    }
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  align-items: flex-start;

  @media (max-width: 1100px) { grid-template-columns: 1fr; }
`;

const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
  grid-auto-rows: 280px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    grid-auto-rows: 200px;
    gap: 1rem;
  }
`;

const ImageCard = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: #E5E7EB;
  border-radius: 12px; 
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${props => props.$active ? '#1A1A1A' : 'transparent'};
  transition: all 0.2s;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover { div.overlay { opacity: 1; } }

  div.overlay {
    position: absolute;
    inset: 0;
    background: ${props => props.$active ? 'rgba(79, 70, 229, 0.1)' : 'rgba(0,0,0,0.2)'};
    opacity: ${props => props.$active ? 1 : 0};
    transition: opacity 0.2s;
  }

  div.checkbox-mock {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    width: 18px;
    height: 18px;
    border-radius: 6px; 
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.5);
    z-index: 10;
  }

  div.actions {
    position: absolute;
    bottom: 0.75rem;
    left: 0.75rem;
    right: 0.75rem;
    display: flex;
    justify-content: flex-end; 

    button {
      width: 32px;
      height: 32px;
      border-radius: 50%; 
      background: white;
      border: none;
      color: #6B7280;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      transition: all 0.2s;

      &:hover { color: #111827; transform: scale(1.05); }
      &.delete:hover { color: #EF4444; }
    }
  }
`;

const Sidebar = styled.div`
  background: white;
  border-radius: 12px; 
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 2.5rem;

  @media (max-width: 1100px) { position: relative; top: 0; }
`;

const SidebarHeader = styled.div`
  padding: 2rem;
  border-bottom: 1px solid #F3F4F6;

  h2 {
    font-family: 'Times New Roman', Times, serif;
    font-size: 1.8rem;
    font-weight: 400;
    color: #111827;
    margin: 0;
  }
`;

const SidebarContent = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PreviewImage = styled.div`
  width: 100%;
  aspect-ratio: 4/3;
  background: #E5E7EB;
  border-radius: 8px; 
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain; 
    background: #F3F4F6;
  }
`;

const MetaData = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  div.row {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    overflow: hidden;

    span.label { font-size: 0.6rem; font-weight: 800; color: #9CA3AF; text-transform: uppercase; letter-spacing: 2px;}
    span.val { font-size: 0.85rem; font-weight: 500; color: #111827; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
  }

  div.grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.6rem;
    font-weight: 800;
    color: #9CA3AF;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #E5E7EB;
  border-radius: 8px; 
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 0.85rem;
  color: #111827;
  background: #F9FAFB;
  outline: none;
  min-height: 80px;
  resize: vertical;
  line-height: 1.5;
  transition: border-color 0.2s;

  &:focus { border-color: #1A1A1A; background: white; }
`;

const SidebarFooter = styled.div`
  padding: 2rem;
  border-top: 1px solid #F3F4F6;
  display: flex;
  gap: 1rem;

  button.save {
    flex: 1;
    background: #1A1A1A;
    color: white;
    border: none;
    padding: 1rem;
    border-radius: 50px; 
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    cursor: pointer;
    transition: background 0.2s;
    &:hover { background: #333333; }
  }

  button.icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid #E5E7EB;
    background: white;
    color: #6B7280;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
    &:hover { border-color: #111827; color: #111827; }
  }
`;

const EmptyState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: #9CA3AF;
  
  p { font-size: 0.85rem; line-height: 1.6;}
`;

const ImageLibrary = () => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeImageId, setActiveImageId] = useState(null); 
  const [uploadProgress, setUploadProgress] = useState(0);
  const progressIntervalRef = useRef(null);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  // 1. Fetch Images from Backend
  const { data: response, isLoading: isFetching } = useQuery({
    queryKey: ['adminImages'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/images');
      return res.data;
    }
  });

  const images = response?.data || [];

  useEffect(() => {
    if (images.length > 0 && !activeImageId) {
      setActiveImageId(images[0].id);
    }
  }, [images, activeImageId]);

  const activeImage = images.find(img => img.id === activeImageId);

  // 2. Bulk Upload Mutation
  // 2. Bulk Upload Mutation (Using Native Fetch to bypass Axios interceptors)
  const uploadMutation = useMutation({
    mutationFn: async (filesArray) => {
      const formData = new FormData();
      
      // Loop through the array and append each file to the 'images' key
      for (let i = 0; i < filesArray.length; i++) {
        formData.append('images', filesArray[i]);
      }
      
      // 🚨 FIX: We use native fetch to guarantee FormData isn't tampered with
      const response = await fetch('/api/admin/images/upload', {
        method: 'POST',
        body: formData,
        // credentials: 'include' is handled automatically by the browser for same-origin (/api)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload images');
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['adminImages']);
      if (data.data && data.data.length === 1) {
        setActiveImageId(data.data[0].id);
      }
    },
    onError: (error) => {
      console.error("Upload Error:", error);
      alert(error.message || 'Failed to upload images.');
    }
  });
  
  // 3. Bulk Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (idsToDelete) => {
      // Sends { ids: ['id1', 'id2'] } to the backend bulk-delete route
      await apiClient.post('/admin/images/bulk-delete', { ids: idsToDelete });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminImages']);
      setSelectedIds([]); 
      setActiveImageId(null); 
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to delete images.');
    }
  });

  // --- Handlers ---
  const handleFileChange = (e) => {
    // 1. Instantly convert FileList to a standard Array to prevent it from disappearing
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    // Start fake progress
    setUploadProgress(0);
    progressIntervalRef.current = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) return prev; 
        const increment = prev < 50 ? 10 : (prev < 80 ? 5 : 2);
        return prev + increment;
      });
    }, 150);

    // 2. Trigger mutation with the copied array
    uploadMutation.mutate(files, {
      onSettled: () => {
        clearInterval(progressIntervalRef.current);
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 1500); // clear after 1.5s
        
        // 3. Reset the input only AFTER mutation is handled
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; 
        }
      }
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const toggleSelection = (e, id) => {
    e.stopPropagation(); 
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(images.map(img => img.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Permanently delete ${selectedIds.length} image(s)? This will remove them from Cloudinary too.`)) {
      deleteMutation.mutate(selectedIds);
    }
  };

  const handleDeleteSingle = (e, id) => {
    e.stopPropagation(); 
    if (window.confirm("Permanently delete this image?")) {
      deleteMutation.mutate([id]); 
    }
  };

  return (
    <Container>
      <HeaderSection>
        <div className="text">
          <h1>Image Library</h1>
          <p>CURATING THE VISUAL IDENTITY</p>
        </div>
        <div className="actions">
          <OutlineBtn>
            <Filter size={14} /> FILTERS
          </OutlineBtn>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/jpeg, image/png, image/webp" 
            multiple 
            style={{ display: 'none' }} 
          />
          
          <PrimaryBtn onClick={triggerFileInput} disabled={uploadMutation.isPending}>
            {uploadMutation.isPending ? (
              <><Loader2 size={14} className="animate-spin" /> UPLOADING... {uploadProgress}%</>
            ) : (
              <><Plus size={14} /> ADD NEW IMAGE</>
            )}
          </PrimaryBtn>
        </div>
      </HeaderSection>

      <Toolbar>
        <div className="left">
          <label>
            <input 
              type="checkbox" 
              checked={selectedIds.length === images.length && images.length > 0}
              onChange={handleSelectAll}
              disabled={images.length === 0}
            /> 
            SELECT ALL
          </label>
          <div className="divider" />
          <button 
            disabled={selectedIds.length === 0 || deleteMutation.isPending} 
            onClick={handleDeleteSelected}
          >
             {deleteMutation.isPending && selectedIds.length > 0 ? <Loader2 size={14} className="animate-spin"/> : <Trash2 size={14} />} 
             DELETE SELECTED
          </button>
        </div>
        <div className="right">
          SORT BY: 
          <select defaultValue="RECENTLY UPLOADED">
            <option>RECENTLY UPLOADED</option>
            <option>FILE SIZE</option>
          </select>
        </div>
      </Toolbar>

      <MainGrid>
        
        {/* GALLERY */}
        <Gallery>
          {isFetching ? (
            <div style={{gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', color: '#9CA3AF'}}>
              <Loader2 size={32} className="animate-spin" style={{margin: '0 auto 1rem auto'}} />
              <p style={{fontSize: '0.8rem', fontWeight: 800, letterSpacing: '2px'}}>LOADING ARCHIVE...</p>
            </div>
          ) : images.length === 0 ? (
            <div style={{gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', background: 'white', borderRadius: '12px'}}>
              <ImageIcon size={48} color="#D1D5DB" style={{margin: '0 auto 1rem auto'}} />
              <h3 style={{fontSize: '1.2rem', color: '#111827', marginBottom: '0.5rem'}}>Archive is empty</h3>
              <p style={{fontSize: '0.85rem', color: '#6B7280'}}>Upload high-resolution assets to begin curating your storefront.</p>
            </div>
          ) : (
            images.map(img => {
              const isActive = img.id === activeImageId;
              const isSelected = selectedIds.includes(img.id);

              return (
                <ImageCard 
                  key={img.id} 
                  $active={isActive} 
                  onClick={() => setActiveImageId(img.id)}
                >
                  <img src={img.url} alt={img.filename || 'Uploaded asset'} />
                  
                  <div className="overlay">
                    <div 
                      className="checkbox-mock" 
                      onClick={(e) => toggleSelection(e, img.id)}
                      style={{ background: isSelected ? '#1A1A1A' : 'rgba(0,0,0,0.3)', borderColor: isSelected ? '#1A1A1A' : 'rgba(255,255,255,0.5)' }}
                    >
                      {isSelected && <CheckCircle2 size={16} color="white" style={{position:'absolute', top:0, left:0}}/>}
                    </div>

                    <div className="actions">
                      <button 
                        className="delete" 
                        onClick={(e) => handleDeleteSingle(e, img.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </ImageCard>
              );
            })
          )}
        </Gallery>

        {/* SIDEBAR DETAILS */}
        <Sidebar>
          <SidebarHeader>
            <h2>Asset Details</h2>
          </SidebarHeader>
          
          {activeImage ? (
            <>
              <SidebarContent>
                <PreviewImage>
                  <img src={activeImage.url} alt={activeImage.filename} />
                </PreviewImage>

                <MetaData>
                  <div className="row">
                    <span className="label">FILENAME</span>
                    <span className="val" title={activeImage.filename || activeImage.public_id}>
                      {activeImage.filename || activeImage.public_id}
                    </span>
                  </div>
                  <div className="grid-2">
                    <div className="row">
                      <span className="label">SIZE</span>
                      <span className="val">{formatBytes(activeImage.size)}</span>
                    </div>
                    <div className="row">
                      <span className="label">FORMAT</span>
                      <span className="val" style={{textTransform: 'uppercase'}}>{activeImage.format?.split('/')[1] || activeImage.format}</span>
                    </div>
                  </div>
                  <div className="row">
                    <span className="label">UPLOAD DATE</span>
                    <span className="val">{formatDate(activeImage.createdAt)}</span>
                  </div>
                </MetaData>

                <FormGroup>
                  <label>ALT TEXT (Mock)</label>
                  <TextArea placeholder="Describe the image for accessibility..." />
                </FormGroup>

              </SidebarContent>
              
              <SidebarFooter>
                <button className="save" onClick={() => alert('Alt text not connected to DB yet!')}>SAVE CHANGES</button>
                <button className="icon" onClick={() => window.open(activeImage.url, '_blank')}><Download size={18} /></button>
              </SidebarFooter>
            </>
          ) : (
            <EmptyState>
              <p>Select an image from the gallery to view and edit its details here.</p>
            </EmptyState>
          )}
        </Sidebar>

      </MainGrid>
    </Container>
  );
};

export default ImageLibrary;