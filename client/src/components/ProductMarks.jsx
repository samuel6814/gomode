import React from 'react';
import styled from 'styled-components';
import Currency from '../utils/Currency';
import { isOnSale, saleUnitPrice } from '../utils/sale';
import { MUTED, NAVY_ACCENT } from '../theme/brand';

const Row = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 0.4rem;
  flex-wrap: wrap;
`;

const Was = styled.span`
  color: ${MUTED};
  font-weight: 500;
  text-decoration: line-through;
`;

export const BrandMark = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  background: ${NAVY_ACCENT};
  color: #fff;
  padding: 0.28rem 0.55rem;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-radius: 2px;
`;

export function BuyyTag({ product }) {
  if (!product?.tags?.includes('gomode') && !product?.tags?.includes('buyy') && !product?.tags?.includes('styleghana') && !product?.tags?.includes('sneakergarden') && !product?.tags?.includes('official')) return null;
  return <BrandMark>GOMODE</BrandMark>;
}

export function CjTag() {
  return null;
}

export function MarkedPrice({ product, sale }) {
  if (!product) return null;
  const onSale = isOnSale(product, sale);
  return (
    <Row>
      {onSale && (
        <Was>
          <Currency amount={product.price} />
        </Was>
      )}
      <Currency amount={saleUnitPrice(product, sale)} />
    </Row>
  );
}

