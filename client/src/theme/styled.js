/** Shared styled primitives using brand tokens */
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  ACCENT_COLOR,
  PAPER_BG,
  GRAPHITE_DARK,
  GRAPHITE_MID,
  PAPER_DARK,
  FONT_FAMILY,
} from './brand';

export { FONT_FAMILY };

export const PageBackground = styled.div`
  background: ${PAPER_BG};
  min-height: 100vh;
  color: ${GRAPHITE_DARK};
`;

export const PrimaryButton = styled.button`
  background: ${ACCENT_COLOR};
  color: ${PAPER_BG};
  border: none;
  padding: 0.85rem 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PrimaryLink = styled(Link)`
  display: inline-block;
  background: ${ACCENT_COLOR};
  color: ${PAPER_BG};
  padding: 0.85rem 1.4rem;
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
`;

export const SecondaryLink = styled(Link)`
  border: 1px solid ${GRAPHITE_DARK};
  color: ${GRAPHITE_DARK};
  padding: 0.85rem 1.4rem;
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.75;
  }
`;

export const AccentLink = styled(Link)`
  color: ${ACCENT_COLOR};
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.75;
  }
`;

export const AccentText = styled.span`
  color: ${ACCENT_COLOR};
`;

export const MutedText = styled.p`
  color: ${GRAPHITE_MID};
  line-height: 1.6;
`;

export const InputField = styled.input`
  border: 1px solid ${PAPER_DARK};
  border-radius: 8px;
  padding: 0.65rem 0.85rem;
  font-size: 0.95rem;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${ACCENT_COLOR};
  }
`;

export const TextAreaField = styled.textarea`
  border: 1px solid ${PAPER_DARK};
  border-radius: 8px;
  padding: 0.65rem 0.85rem;
  font-size: 0.95rem;
  width: 100%;
  box-sizing: border-box;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${ACCENT_COLOR};
  }
`;

/** Resolve gallery item image with backward compat for old dual-image shape */
export function getGalleryItemImage(item) {
  if (!item) return null;
  if (item.image?.url) return item.image;
  if (item.fineArtImage?.url) return item.fineArtImage;
  if (item.alterEgoImage?.url) return item.alterEgoImage;
  return null;
}
