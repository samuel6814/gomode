import React, { useState } from 'react';
import styled from 'styled-components';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/axios';
import { ACCENT_COLOR, PAPER_BG } from '../../theme/brand';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const ModalBox = styled.div`
  background: #FAFAFA;
  width: 100%;
  max-width: 900px;
  max-height: 85vh;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  overflow: hidden;
`;

const Header = styled.div`
  padding: 1.5rem 2rem;
  background: white;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 { margin: 0; font-family: 'Times New Roman', Times, serif; font-size: 1.5rem; color: #111827; }
  
  button.close {
    background: transparent;
    border: none;
    color: #9CA3AF;
    cursor: pointer;
    transition: color 0.2s;
    &:hover { color: #111827; }
  }
`;

const GalleryGrid = styled.div`
  padding: 2rem;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  grid-auto-rows: 220px;
  flex: 1;
`;

const ImageCard = styled.div`
  position: relative;
  background: #E5E7EB;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid ${props => props.$active ? ACCENT_COLOR : 'transparent'};
  transition: all 0.2s;

  img { width: 100%; height: 100%; object-fit: cover; }

  div.overlay {
    position: absolute;
    inset: 0;
    background: ${props => props.$active ? 'rgba(26, 26, 26, 0.15)' : 'rgba(0,0,0,0.0)'};
    transition: background 0.2s;
  }

  &:hover { div.overlay { background: rgba(0,0,0,0.1); } }
`;

const Footer = styled.div`
  padding: 1.5rem 2rem;
  background: white;
  border-top: 1px solid #E5E7EB;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  button {
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;
  }

  button.cancel { background: transparent; color: #6B7280; border: 1px solid #E5E7EB; }
  button.cancel:hover { border-color: #111827; color: #111827; }

  button.confirm { background: ${ACCENT_COLOR}; color: white; border: none; }
  button.confirm:hover { background: #333333; }
  button.confirm:disabled { background: #9CA3AF; cursor: not-allowed; }
`;

const ImageSelectorModal = ({ isOpen, onClose, onSelect }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['adminImages'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/images');
      return res.data;
    },
    enabled: isOpen, // Only fetch if the modal is actually open
  });

  if (!isOpen) return null;

  const images = response?.data || [];

  const handleConfirm = () => {
    if (selectedImage) {
      onSelect(selectedImage); // Send the Cloudinary URL back to the form
      onClose(); // Close modal
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <Header>
          <h3>Select from Library</h3>
          <button className="close" onClick={onClose}><X size={20} /></button>
        </Header>

        <GalleryGrid>
          {isLoading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>
              <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto' }} />
            </div>
          ) : images.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6B7280', fontSize: '0.85rem' }}>
              No images found. Upload some in the Image Library first!
            </div>
          ) : (
            images.map(img => (
              <ImageCard 
                key={img.id} 
                $active={selectedImage?.id === img.id}
                onClick={() => setSelectedImage(img)}
              >
                <img src={img.url} alt="Library Asset" />
                <div className="overlay">
                  {selectedImage?.id === img.id && (
                    <CheckCircle2 size={24} color="white" fill={ACCENT_COLOR} style={{position: 'absolute', top: 10, right: 10}} />
                  )}
                </div>
              </ImageCard>
            ))
          )}
        </GalleryGrid>

        <Footer>
          <button className="cancel" onClick={onClose}>CANCEL</button>
          <button className="confirm" disabled={!selectedImage} onClick={handleConfirm}>
            USE IMAGE
          </button>
        </Footer>
      </ModalBox>
    </Overlay>
  );
};

export default ImageSelectorModal;