import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { CANVAS, INK, LINE, NAVY_ACCENT, WHITE, FONT_HERO } from '../../../../theme/brand';
import { media } from '../../../../theme/breakpoints';

const Section = styled.section`
  max-width: 1600px;
  margin: 0 auto;
  padding: 4rem 1.5rem 3rem;

  @media ${media.tabletUp} {
    padding: 5.5rem 2.5rem 4rem;
  }

  @media ${media.desktop} {
    padding: 6.5rem 3.5rem 4.5rem;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2.5rem;

  @media ${media.tabletUp} {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 3.5rem;
  }
`;

const TitleBlock = styled.div`
  .eyebrow {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${NAVY_ACCENT};
    margin-bottom: 0.5rem;
    display: block;
  }

  h2 {
    font-family: ${FONT_HERO};
    font-size: clamp(1.8rem, 4vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: ${INK};
    line-height: 1.05;
    margin: 0;
    text-transform: uppercase;
  }
`;

const ViewAllLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${INK};
  text-decoration: none;
  border-bottom: 1.5px solid ${INK};
  padding-bottom: 2px;
  transition: all 0.2s ease;
  align-self: flex-start;

  &:hover {
    color: ${NAVY_ACCENT};
    border-color: ${NAVY_ACCENT};
    transform: translateX(3px);
  }

  @media ${media.tabletUp} {
    align-self: auto;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;

  @media ${media.tabletOnly} {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media ${media.desktop} {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
`;

const CategoryCard = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 380px;
  background: #EBE8E1;
  border: 1px solid ${LINE};
  padding: 1.75rem;
  text-decoration: none;
  color: ${INK};
  overflow: hidden;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: ${NAVY_ACCENT};
    box-shadow: 0 16px 32px rgba(37, 60, 90, 0.08);

    .card-img {
      transform: scale(1.06) translateY(-4px);
    }

    .arrow-icon {
      background: ${NAVY_ACCENT};
      color: ${WHITE};
      transform: translate(2px, -2px);
    }
  }

  @media ${media.tabletUp} {
    min-height: 440px;
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
  z-index: 2;

  .meta-num {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    color: ${NAVY_ACCENT};
  }
`;

const ArrowBadge = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid ${LINE};
  background: ${WHITE};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${INK};
  transition: all 0.25s ease;
`;

const ImageArea = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1.5rem 0;
  z-index: 1;

  .card-img {
    max-height: 100%;
    max-width: 90%;
    object-fit: contain;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    filter: drop-shadow(0 12px 20px rgba(17, 20, 24, 0.12));
  }
`;

const CardBottom = styled.div`
  position: relative;
  z-index: 2;

  h3 {
    font-family: ${FONT_HERO};
    font-size: 1.1875rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    text-transform: uppercase;
    color: ${INK};
    margin: 0 0 0.25rem;
  }

  p {
    font-size: 0.78125rem;
    font-weight: 500;
    color: #555e6b;
    margin: 0;
    letter-spacing: 0.02em;
  }
`;

const CATEGORIES = [
  {
    num: '01',
    name: 'Outerwear',
    sub: 'Aviator Bombers & Heavyweight Layers',
    href: '/shop?category=Outerwear%20%26%20Jackets',
    image: '/new-items/Bomber jacket.avif',
  },
  {
    num: '02',
    name: 'Denim & Jeans',
    sub: '90s Loose, Relaxed & Baggy Cuts',
    href: '/shop?category=Denim%20%26%20Jeans',
    image: '/new-items/JJICHRIS JJORIGINAL SQ 071 Relaxed Fit Jeans.avif',
  },
  {
    num: '03',
    name: 'Knitwear & Polos',
    sub: 'Textured Wool Polos & Argyle Knits',
    href: '/shop?category=Sweaters%20%26%20Knits',
    image: '/new-items/Plain Knitted poloPlain Knitted polo.avif',
  },
  {
    num: '04',
    name: 'Accessories & Carry',
    sub: 'Canvas Commuters, Belts & Beanies',
    href: '/shop?category=Bags%20%26%20Accessories',
    image: '/new-items/jackjones-jacpascalbackpackln-black.avif',
  },
];

const CategoryShowcase = () => {
  return (
    <Section>
      <HeaderRow>
        <TitleBlock>
          <span className="eyebrow">Curated Collections</span>
          <h2>Explore by Category</h2>
        </TitleBlock>
        <ViewAllLink to="/shop">
          <span>View All Apparel</span>
          <ArrowUpRight size={16} />
        </ViewAllLink>
      </HeaderRow>

      <Grid>
        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat.num} to={cat.href}>
            <CardTop>
              <span className="meta-num">{cat.num}</span>
              <ArrowBadge className="arrow-icon">
                <ArrowUpRight size={16} />
              </ArrowBadge>
            </CardTop>

            <ImageArea>
              <img src={cat.image} alt={cat.name} className="card-img" />
            </ImageArea>

            <CardBottom>
              <h3>{cat.name}</h3>
              <p>{cat.sub}</p>
            </CardBottom>
          </CategoryCard>
        ))}
      </Grid>
    </Section>
  );
};

export default CategoryShowcase;
