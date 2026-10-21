import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import CartDrawer from './CartDrawer';
import KickzLogo from './KickzLogo';
import { useSession, signOut } from '../api/authClient';
import apiClient from '../api/axios';
import Currency from '../utils/Currency';
import {
  ACCENT_COLOR,
  BLUE,
  FONT_FAMILY,
  INK,
  LINE,
  MUTED,
} from '../theme/brand';

const ANNOUNCEMENTS = [
  'Free shipping on all sneakers',
  'New arrivals, made for the streets',
  'Honest materials, built to last',
];

const Shell = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  font-family: ${FONT_FAMILY};
`;

const Announcement = styled.div`
  height: 36px;
  background: ${BLUE};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  font-size: 12px;
  letter-spacing: 0.02em;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const AnnouncementButton = styled.button`
  background: transparent;
  border: none;
  color: inherit;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    opacity: 0.75;
  }
`;

const NavBar = styled.nav`
  height: 60px;
  background: #ffffff;
  border-bottom: 1px solid ${LINE};
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  @media (min-width: 768px) {
    height: 72px;
  }
`;

const LeftCluster = styled.div`
  display: flex;
  align-items: center;
  gap: 1.75rem;
  min-width: 0;
`;

const RightCluster = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const DesktopLinks = styled.div`
  display: none;
  align-items: center;
  gap: 1.5rem;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const NavLink = styled(Link)`
  color: #000000;
  text-decoration: none;
  font-size: 13px;

  &:hover {
    color: ${MUTED};
  }
`;

const MenuButton = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  color: #000000;
  cursor: pointer;
  display: flex;

  @media (min-width: 768px) {
    display: none;
  }
`;

const LogoLink = styled(Link)`
  display: none;
  align-items: center;
  text-decoration: none;
  color: #000000;
  flex-shrink: 0;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const MobileMark = styled(Link)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  color: #000000;
  text-decoration: none;

  @media (min-width: 768px) {
    display: none;
  }
`;

const Meta = styled.div`
  display: none;
  align-items: center;
  gap: 1rem;
  margin-right: 0.5rem;
  font-size: 13px;
  color: #000000;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  color: #000000;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;

  &:hover {
    color: ${MUTED};
  }
`;

const AccountLink = styled(Link)`
  color: #000000;
  display: none;
  align-items: center;
  position: relative;

  &:hover {
    color: ${MUTED};
  }

  @media (min-width: 768px) {
    display: flex;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -6px;
  right: -8px;
  background: ${BLUE};
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  opacity: ${(props) => (props.$count > 0 ? 1 : 0)};
`;

const ProfileContainer = styled.div`
  position: relative;
  display: none;
  align-items: center;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.85rem;
  background: white;
  min-width: 220px;
  padding: 0.5rem 0;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid ${LINE};
  border-radius: 12px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  z-index: 1100;

  &::before {
    content: '';
    position: absolute;
    top: -0.85rem;
    left: 0;
    right: 0;
    height: 0.85rem;
  }

  ${ProfileContainer}:hover & {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const DropdownItem = styled(Link)`
  text-decoration: none;
  color: ${MUTED};
  padding: 0.75rem 1.25rem;
  font-size: 13px;
  font-weight: 500;

  &:hover {
    background: #f4f4f4;
    color: ${INK};
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: ${LINE};
  margin: 0.35rem 0;
`;

const MobileMenuOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: white;
  z-index: 2000;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transition: transform 0.35s ease;
  transform: ${(props) => (props.$isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  overflow-y: auto;
`;

const MobileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const MobileLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const MobileLink = styled(Link)`
  font-size: 16px;
  font-weight: 500;
  color: ${INK};
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    color: ${MUTED};
  }
`;

const SkeletonCircle = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${LINE};
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
`;

const SearchOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.98);
  z-index: 3000;
  display: flex;
  flex-direction: column;
  padding: 4rem 10%;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? 'visible' : 'hidden')};
  transform: ${(props) => (props.$isOpen ? 'translateY(0)' : 'translateY(-12px)')};
  transition: all 0.25s ease;

  @media (max-width: 768px) {
    padding: 2rem 5%;
  }
`;

const SearchHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${LINE};
  padding-bottom: 1rem;
  margin-bottom: 2rem;

  input {
    flex: 1;
    border: none;
    background: transparent;
    font-family: ${FONT_FAMILY};
    font-size: 2rem;
    color: ${INK};
    outline: none;

    &::placeholder {
      color: ${MUTED};
    }

    @media (max-width: 768px) {
      font-size: 1.35rem;
    }
  }

  button {
    background: transparent;
    border: none;
    cursor: pointer;
    color: ${INK};
  }
`;

const SearchResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  overflow-y: auto;
  padding-bottom: 4rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SearchResultCard = styled(Link)`
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  color: inherit;

  .img-box {
    width: 100%;
    aspect-ratio: 4/5;
    background: #f4f4f4;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  h4 {
    font-size: 15px;
    font-weight: 500;
    color: ${INK};
    margin: 0;
  }

  p {
    font-size: 13px;
    color: ${MUTED};
    margin: 0;
  }
`;

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery('');
  }, [location]);

  const { data: session, isPending } = useSession();
  const IS_LOGGED_IN = !!session;
  const IS_ADMIN = session?.user?.role?.toUpperCase() === 'ADMIN';

  const handleLogout = async () => {
    await signOut();
    navigate('/home');
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchResponse, isLoading: isSearching } = useQuery({
    queryKey: ['storefrontSearch', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return null;
      const res = await apiClient.get(`/search/storefront?q=${debouncedQuery}`);
      return res.data;
    },
    enabled: debouncedQuery.length > 0,
  });

  const searchResults = searchResponse?.data || [];

  const { data: cartResponse } = useQuery({
    queryKey: ['userCart'],
    queryFn: async () => {
      const res = await apiClient.get('/cart');
      return res.data;
    },
    enabled: IS_LOGGED_IN,
  });

  const cartCount = cartResponse?.data?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const { data: notifResponse } = useQuery({
    queryKey: ['userNotifications'],
    queryFn: async () => {
      const res = await apiClient.get('/users/notifications');
      return res.data;
    },
    enabled: IS_LOGGED_IN,
  });

  const notifications = notifResponse?.data || [];
  const notifCount = notifications.length;

  const cycleAnnouncement = (direction) => {
    setAnnouncementIndex((current) => {
      const next = current + direction;
      if (next < 0) return ANNOUNCEMENTS.length - 1;
      if (next >= ANNOUNCEMENTS.length) return 0;
      return next;
    });
  };

  return (
    <>
      <Shell>
        <Announcement>
          <AnnouncementButton
            type="button"
            aria-label="Previous announcement"
            onClick={() => cycleAnnouncement(-1)}
          >
            <ChevronLeft size={16} />
          </AnnouncementButton>
          <span>{ANNOUNCEMENTS[announcementIndex]}</span>
          <AnnouncementButton
            type="button"
            aria-label="Next announcement"
            onClick={() => cycleAnnouncement(1)}
          >
            <ChevronRight size={16} />
          </AnnouncementButton>
        </Announcement>

        <NavBar>
          <LeftCluster>
            <MenuButton type="button" aria-label="Open menu" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </MenuButton>
            <LogoLink to="/" aria-label="Kickz Sneakers">
              <KickzLogo />
            </LogoLink>
            <DesktopLinks>
              <NavLink to="/shop">Shop</NavLink>
              <NavLink to="/shop">Campaigns</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Loyalty</NavLink>
            </DesktopLinks>
          </LeftCluster>

          <MobileMark to="/" aria-label="Kickz Sneakers">
            <KickzLogo variant="mark" scale={1.35} />
          </MobileMark>

          <RightCluster>
            <Meta>
              <span>GHC</span>
              <span>EN</span>
            </Meta>
            <IconButton type="button" aria-label="Search" onClick={() => setIsSearchOpen(true)}>
              <Search size={20} strokeWidth={1.5} />
            </IconButton>

            {isPending ? (
              <SkeletonCircle />
            ) : IS_LOGGED_IN ? (
              <ProfileContainer>
                <IconButton as="div" aria-label="Account">
                  <User size={20} strokeWidth={1.5} />
                  {notifCount > 0 && <NotificationBadge $count={notifCount}>{notifCount}</NotificationBadge>}
                </IconButton>
                <DropdownMenu>
                  <DropdownItem as="div" style={{ cursor: 'default', color: MUTED }}>
                    Hi, {session.user.name?.split(' ')[0]}
                  </DropdownItem>
                  <DropdownDivider />
                  {IS_ADMIN && (
                    <>
                      <DropdownItem to="/admin/dashboard">Admin Dashboard</DropdownItem>
                      <DropdownDivider />
                    </>
                  )}
                  <DropdownItem to="/profile">Profile Settings</DropdownItem>
                  <DropdownItem to="/orders">My Orders</DropdownItem>
                  <DropdownItem to="/wishlist">Wishlist</DropdownItem>
                  <DropdownItem to="/alerts">
                    Notifications{notifCount > 0 ? ` (${notifCount})` : ''}
                  </DropdownItem>
                  <DropdownDivider />
                  <div onClick={handleLogout} style={{ cursor: 'pointer' }}>
                    <DropdownItem as="span" style={{ color: '#b42318' }}>
                      Log Out
                    </DropdownItem>
                  </div>
                </DropdownMenu>
              </ProfileContainer>
            ) : (
              <AccountLink to="/login" aria-label="Account">
                <User size={20} strokeWidth={1.5} />
              </AccountLink>
            )}

            <IconButton type="button" aria-label="Cart" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart size={20} strokeWidth={1.5} />
              <NotificationBadge $count={cartCount}>{cartCount}</NotificationBadge>
            </IconButton>
          </RightCluster>
        </NavBar>
      </Shell>

      <SearchOverlay $isOpen={isSearchOpen}>
        <SearchHeader>
          <input
            type="text"
            placeholder="Search sneakers"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus={isSearchOpen}
          />
          <button type="button" aria-label="Close search" onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}>
            <X size={28} strokeWidth={1.5} />
          </button>
        </SearchHeader>

        {isSearching ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
            <Loader2 size={32} className="animate-spin" color={ACCENT_COLOR} />
          </div>
        ) : searchResults.length > 0 ? (
          <SearchResultsGrid>
            {searchResults.map((product) => {
              const imgUrl = product.images?.[0]?.image?.url;
              return (
                <SearchResultCard key={product.id} to={`/product/${product.id}`} onClick={() => setIsSearchOpen(false)}>
                  <div className="img-box">
                    {imgUrl && <img src={imgUrl} alt={product.name} />}
                  </div>
                  <div>
                    <h4>{product.name}</h4>
                    <p><Currency amount={product.price} /></p>
                  </div>
                </SearchResultCard>
              );
            })}
          </SearchResultsGrid>
        ) : debouncedQuery ? (
          <div style={{ textAlign: 'center', marginTop: '3rem', color: MUTED }}>
            <p style={{ fontSize: '1.1rem' }}>No results found for &ldquo;{debouncedQuery}&rdquo;</p>
            <Link
              to="/shop"
              onClick={() => setIsSearchOpen(false)}
              style={{ color: INK, fontWeight: 500, fontSize: '14px', textDecoration: 'none', marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              Browse all sneakers <ArrowRight size={14} />
            </Link>
          </div>
        ) : null}
      </SearchOverlay>

      <MobileMenuOverlay $isOpen={isMobileMenuOpen}>
        <MobileHeader>
          <LogoLink to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex' }}>
            <KickzLogo />
          </LogoLink>
          <IconButton type="button" aria-label="Close menu" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </IconButton>
        </MobileHeader>

        <MobileLinks>
          <MobileLink to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop</MobileLink>
          <MobileLink to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Campaigns</MobileLink>
          <MobileLink to="/about" onClick={() => setIsMobileMenuOpen(false)}>About</MobileLink>
          <MobileLink to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Loyalty</MobileLink>

          <DropdownDivider />

          {isPending ? (
            <div style={{ color: MUTED, fontSize: '14px' }}>Loading...</div>
          ) : IS_LOGGED_IN ? (
            <>
              <MobileLink to="/profile" onClick={() => setIsMobileMenuOpen(false)}>My Account</MobileLink>
              <MobileLink to="/orders" onClick={() => setIsMobileMenuOpen(false)}>My Orders</MobileLink>
              <MobileLink to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>Wishlist</MobileLink>
              <MobileLink to="/alerts" onClick={() => setIsMobileMenuOpen(false)}>
                Notifications
              </MobileLink>
              {IS_ADMIN && (
                <MobileLink to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  Admin Dashboard
                </MobileLink>
              )}
              <MobileLink
                as="button"
                onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                style={{ color: '#b42318', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
              >
                Log Out
              </MobileLink>
            </>
          ) : (
            <MobileLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              Log In / Register
            </MobileLink>
          )}
        </MobileLinks>
      </MobileMenuOverlay>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
