import React, { createContext, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Heart,
  Home,
  LayoutDashboard,
  LayoutGrid,
  Loader2,
  Menu,
  Package,
  Search,
  ShoppingCart,
  User,
  X,
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/axios';
import { useSession, signOut } from '../api/authClient';
import { guestCartCount, mergeGuestCart } from '../utils/cart';
import BuyyLogo from './BuyyLogo';
import GoModeNav from './GoModeNav';
import CartDrawer from './CartDrawer';
import Footer from './Footer';
import { MarkedPrice } from './ProductMarks';
import {
  CANVAS,
  FONT_FAMILY,
  INK,
  LINE,
  MUTED,
  SHADOW_VIOLET,
  VIOLET,
} from '../theme/brand';
import { media } from '../theme/breakpoints';

export const SearchContext = createContext({ openSearch: () => {} });
export const useStoreSearch = () => useContext(SearchContext);

const Frame = styled.div`
  min-height: 100vh;
  background: ${CANVAS};
  font-family: ${FONT_FAMILY};
  color: ${INK};
`;

const Rail = styled.aside`
  display: none;

  @media ${media.tabletUp} {
    display: ${(props) => (props.$isHome ? 'none' : 'flex')};
    position: fixed;
    z-index: 40;
    top: 0;
    left: 0;
    bottom: 0;
    width: 64px;
    background: #fff;
    flex-direction: column;
    align-items: center;
    padding: 1.25rem 0 1rem;
  }
`;

const RailNav = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
`;

const railItem = `
  width: 48px;
  height: 48px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${MUTED};
  text-decoration: none;
  position: relative;
  border: none;
  background: transparent;
  cursor: pointer;

  &.active,
  &:hover {
    background: ${CANVAS};
    color: ${INK};
  }
`;

const RailButton = styled(NavLink)`
  ${railItem}
`;

const RailIcon = styled.button`
  ${railItem}
`;

const FloatCart = styled.button`
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  z-index: 40;
  width: 52px;
  height: 52px;
  border: 1px solid ${INK};
  background: #fff;
  color: ${INK};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  @media ${media.small} {
    right: 1rem;
    bottom: 1rem;
    width: 48px;
    height: 48px;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: ${VIOLET};
  color: #fff;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.$count > 0 ? 1 : 0)};
`;

const AccountSlot = styled.div`
  position: relative;

  &:hover .rail-dash,
  &:focus-within .rail-dash {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }
`;

const RailAccount = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: ${MUTED};
  text-decoration: none;
  font-size: 9px;
  letter-spacing: -0.04em;
`;

const AccountMenu = styled.div`
  position: absolute;
  left: 100%;
  bottom: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  min-width: 156px;
  background: #fff;
  border: 1px solid ${LINE};
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
`;

const AccountMenuLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.7rem 0.85rem;
  color: ${INK};
  text-decoration: none;
  font-size: 13px;
  letter-spacing: -0.02em;

  &:hover {
    background: ${CANVAS};
  }
`;

const Avatar = styled.span`
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid ${LINE};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${CANVAS};
`;

const MobileBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 30;
  display: ${(props) => (props.$isHome ? 'none' : 'flex')};
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: rgba(242, 244, 245, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${LINE};

  @media ${media.tabletUp} {
    display: none;
  }
`;

const IconButton = styled.button`
  border: none;
  background: transparent;
  color: ${INK};
  padding: 0;
  display: flex;
  cursor: pointer;
`;

const Stage = styled.div`
  min-height: 100vh;

  @media ${media.tabletUp} {
    padding-left: ${(props) => (props.$isHome ? '0' : '64px')};
  }
`;

const DrawerScrim = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 45;

  @media ${media.tabletUp} {
    display: none;
  }
`;

const Drawer = styled.aside`
  position: fixed;
  z-index: 50;
  top: 0;
  left: 0;
  bottom: 0;
  width: min(240px, 86vw);
  background: #fff;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transform: translateX(${(props) => (props.$open ? '0' : '-100%')});
  transition: transform 0.3s ease;

  @media ${media.tabletUp} {
    display: none;
  }
`;

const DrawerButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem 0.75rem;
  border-radius: 16px;
  color: ${INK};
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  font: inherit;
  font-size: 16px;
  letter-spacing: -0.02em;

  &:hover {
    background: ${CANVAS};
  }
`;

const DrawerLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem 0.75rem;
  border-radius: 16px;
  color: ${INK};
  text-decoration: none;
  font-size: 16px;
  letter-spacing: -0.02em;

  &.active,
  &:hover {
    background: ${CANVAS};
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(242, 244, 245, 0.96);
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  opacity: ${(props) => (props.$open ? 1 : 0)};
  visibility: ${(props) => (props.$open ? 'visible' : 'hidden')};
  transition: opacity 0.2s ease;
`;

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #fff;
  border: 1px solid ${LINE};
  border-radius: 9999px;
  height: 64px;
  padding: 0 0.5rem 0 1.25rem;
  max-width: 720px;
  width: 100%;
  margin: 1rem auto 0;

  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font: inherit;
    font-size: 16px;
    letter-spacing: -0.02em;
    color: ${INK};

    &::placeholder {
      color: ${MUTED};
    }
  }
`;

const Go = styled.button`
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 999px;
  background: ${VIOLET};
  color: #fff;
  box-shadow: ${SHADOW_VIOLET};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Results = styled.div`
  max-width: 960px;
  width: 100%;
  margin: 1.5rem auto 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  overflow: auto;

  @media ${media.tabletUp} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${media.desktop} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const ResultCard = styled(Link)`
  background: #fff;
  border-radius: 28px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1);
  padding: 8px;

  img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 20px;
    background: ${CANVAS};
  }

  h3 {
    margin: 0.6rem 0.4rem 0.15rem;
    font-size: 14px;
    font-weight: 600;
  }

  p {
    margin: 0 0.4rem 0.5rem;
    font-size: 12px;
    color: ${MUTED};
  }
`;

const StoreShell = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { data: session } = useSession();
  const loggedIn = !!session;
  const queryClient = useQueryClient();
  const [guestCount, setGuestCount] = useState(guestCartCount);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setQuery('');
  }, [location.pathname]);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const sync = () => setGuestCount(guestCartCount());
    window.addEventListener('guest-cart', sync);
    return () => window.removeEventListener('guest-cart', sync);
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    mergeGuestCart(apiClient)
      .then(() => queryClient.invalidateQueries({ queryKey: ['userCart'] }))
      .catch(() => {});
  }, [loggedIn, queryClient]);

  const { data: cartResponse } = useQuery({
    queryKey: ['userCart'],
    queryFn: async () => (await apiClient.get('/cart')).data,
    enabled: loggedIn,
  });
  const accountCount = cartResponse?.data?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const cartCount = loggedIn ? accountCount : guestCount;

  const { data: searchResponse, isLoading } = useQuery({
    queryKey: ['storefrontSearch', debounced],
    queryFn: async () => (await apiClient.get(`/search/storefront?q=${debounced}`)).data,
    enabled: debounced.length > 0,
  });
  const results = searchResponse?.data || [];
  const { data: saleResponse } = useQuery({
    queryKey: ['storefrontSale'],
    queryFn: async () => (await apiClient.get('/sales')).data,
    staleTime: 60 * 1000,
  });
  const sale = saleResponse?.data;

  const accountTo = loggedIn ? '/profile' : '/login';
  const isAdmin = session?.user?.role?.toUpperCase() === 'ADMIN';

  return (
    <SearchContext.Provider value={{ openSearch: () => setSearchOpen(true) }}>
      <Frame>
        <GoModeNav
          cartCount={cartCount}
          onOpenCart={() => setCartOpen(true)}
        />

        <Stage>
          <Outlet />
          <Footer />
        </Stage>

        <Overlay $open={searchOpen}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}>
              <X size={24} />
            </IconButton>
          </div>
          <SearchRow>
            <Search size={20} color={MUTED} />
            <input
              autoFocus={searchOpen}
              placeholder="What are you shopping for today?"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Go type="button" aria-label="Search" onClick={() => query && setDebounced(query)}>
              {isLoading ? <Loader2 size={18} /> : <ArrowRight size={18} />}
            </Go>
          </SearchRow>
          <Results>
            {results.map((product) => {
              const img = product.images?.[0]?.image?.url;
              return (
                <ResultCard key={product.id} to={`/product/${product.id}`} onClick={() => setSearchOpen(false)}>
                  {img && <img src={img} alt={product.name} />}
                  <h3>{product.name}</h3>
                  <p><MarkedPrice product={product} sale={sale} /></p>
                </ResultCard>
              );
            })}
          </Results>
        </Overlay>

        <FloatCart type="button" aria-label="Open bag" onClick={() => setCartOpen(true)}>
          <ShoppingCart size={22} strokeWidth={1.5} />
          <Badge $count={cartCount}>{cartCount}</Badge>
        </FloatCart>
        <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      </Frame>
    </SearchContext.Provider>
  );
};

export default StoreShell;
