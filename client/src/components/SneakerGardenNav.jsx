import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  LayoutGrid,
  Menu,
  X,
  Package,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import { useSession, signOut } from '../api/authClient';
import { useStoreSearch } from './StoreShell';
import {
  NAVY_ACCENT,
  INK,
  MUTED,
  LINE,
  CANVAS,
  WHITE,
} from '../theme/brand';

const NavHeader = styled.header`
  position: relative;
  width: 100%;
  z-index: 50;
  background: transparent;
  padding: 1.5rem 2rem 1rem;

  @media (min-width: 1024px) {
    padding: 2rem 3.5rem 1rem;
  }
`;

const NavContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const LeftLinks = styled.nav`
  display: none;
  align-items: center;
  gap: 2rem;
  flex: 1;

  @media (min-width: 1150px) {
    display: flex;
  }
`;

const NavItem = styled(NavLink)`
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${INK};
  text-decoration: none;
  position: relative;
  transition: color 0.2s ease;
  padding: 0.25rem 0;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0%;
    height: 1.5px;
    background: ${NAVY_ACCENT};
    transition: width 0.25s ease;
  }

  &:hover {
    color: ${NAVY_ACCENT};
    &::after {
      width: 100%;
    }
  }

  &.active {
    color: ${NAVY_ACCENT};
    &::after {
      width: 100%;
    }
  }
`;

const CenterLogo = styled(Link)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  z-index: 10;
  pointer-events: auto;

  img {
    height: 105px;
    width: auto;
    object-fit: contain;
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.09));
    transition: transform 0.25s ease;

    @media (min-width: 1024px) {
      height: 125px;
    }

    @media (max-width: 899px) {
      height: 80px;
    }
  }

  &:hover img {
    transform: scale(1.08);
  }
`;

const RightCluster = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1.25rem;
  flex: 1;

  @media (min-width: 1024px) {
    gap: 1.5rem;
  }
`;

const ActionIcon = styled.button`
  background: transparent;
  border: none;
  color: ${INK};
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: color 0.2s ease, transform 0.15s ease;

  &:hover {
    color: ${NAVY_ACCENT};
    transform: translateY(-1px);
  }

  @media (max-width: 1149px) {
    display: ${(props) => (props.$hideMobile ? 'none' : 'flex')};
  }
`;

const DrawerSearchBar = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  background: ${CANVAS};
  border: 1px solid ${LINE};
  padding: 0.75rem 1rem;
  color: ${MUTED};
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:hover {
    border-color: ${NAVY_ACCENT};
    color: ${INK};
  }

  span {
    flex: 1;
    text-align: left;
    letter-spacing: 0.04em;
  }
`;

const ActionLink = styled(Link)`
  color: ${INK};
  text-decoration: none;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: color 0.2s ease, transform 0.15s ease;

  &:hover {
    color: ${NAVY_ACCENT};
    transform: translateY(-1px);
  }

  @media (max-width: 1149px) {
    display: ${(props) => (props.$hideMobile ? 'none' : 'flex')};
  }
`;

const CartButton = styled.button`
  background: transparent;
  border: none;
  color: ${INK};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 6px;
  transition: color 0.2s ease, transform 0.15s ease;

  &:hover {
    color: ${NAVY_ACCENT};
    transform: translateY(-1px);
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -2px;
  right: -4px;
  background: ${NAVY_ACCENT};
  color: ${WHITE};
  font-size: 0.625rem;
  font-weight: 700;
  min-width: 17px;
  height: 17px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  line-height: 1;
`;

const MobileMenuToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: ${INK};
  cursor: pointer;
  padding: 6px;

  @media (min-width: 1150px) {
    display: none;
  }
`;

const MobileDrawer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(17, 20, 24, 0.4);
  backdrop-filter: blur(4px);
  opacity: ${(props) => (props.$open ? 1 : 0)};
  visibility: ${(props) => (props.$open ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const DrawerContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: min(320px, 85vw);
  background: ${WHITE};
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
  transform: translateX(${(props) => (props.$open ? '0%' : '-100%')});
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${LINE};

  img {
    height: 64px;
    width: auto;
  }
`;

const DrawerNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex: 1;
`;

const DrawerItem = styled(Link)`
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${INK};
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  transition: color 0.2s ease;

  &:hover {
    color: ${NAVY_ACCENT};
  }
`;

const DrawerFooter = styled.div`
  border-top: 1px solid ${LINE};
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GoModeNav = ({ cartCount = 0, onOpenCart }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const { openSearch } = useStoreSearch();
  const navigate = useNavigate();

  const loggedIn = !!session?.user;
  const isAdmin = session?.user?.role?.toUpperCase() === 'ADMIN';

  const handleSearchClick = () => {
    if (typeof openSearch === 'function') {
      openSearch();
    }
  };

  return (
    <>
      <NavHeader>
        <NavContainer>
          {/* Left Category Links */}
          <LeftLinks>
            <NavItem to="/shop?category=Sneakers">SNEAKERS</NavItem>
            <NavItem to="/shop?category=Boots">BOOTS</NavItem>
            <NavItem to="/shop?category=Essentials">ESSENTIALS</NavItem>
            <NavItem to="/shop?category=Collabs">COLLABS</NavItem>
          </LeftLinks>

          {/* Mobile Menu Button */}
          <MobileMenuToggle
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={24} />
          </MobileMenuToggle>

          {/* Center Brand Icon (logo-nobg.png only, no text) */}
          <CenterLogo to="/" aria-label="GoMode Home">
            <img src="/logo-nobg.png" alt="GoMode" />
          </CenterLogo>

          {/* Right Action Icons */}
          <RightCluster>
            <ActionIcon
              type="button"
              aria-label="Search catalog"
              onClick={handleSearchClick}
              $hideMobile
            >
              <Search size={20} strokeWidth={1.8} />
            </ActionIcon>

            <ActionLink
              to={loggedIn ? '/profile' : '/login'}
              aria-label="Account"
            >
              <User size={20} strokeWidth={1.8} />
            </ActionLink>

            <ActionLink
              to="/shop/categories"
              aria-label="Categories"
              $hideMobile
            >
              <LayoutGrid size={20} strokeWidth={1.8} />
            </ActionLink>

            <ActionLink
              to="/wishlist"
              aria-label="Wishlist"
              $hideMobile
            >
              <Heart size={20} strokeWidth={1.8} />
            </ActionLink>

            <CartButton
              type="button"
              aria-label={`Open Cart (${cartCount} items)`}
              onClick={onOpenCart}
            >
              <ShoppingBag size={20} strokeWidth={1.8} />
              {cartCount > 0 && <Badge>{cartCount}</Badge>}
            </CartButton>
          </RightCluster>
        </NavContainer>
      </NavHeader>

      {/* Mobile Drawer */}
      <MobileDrawer $open={mobileOpen} onClick={() => setMobileOpen(false)}>
        <DrawerContent
          $open={mobileOpen}
          onClick={(e) => e.stopPropagation()}
        >
          <DrawerHeader>
            <img src="/logo-nobg.png" alt="GoMode" />
            <ActionIcon
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            >
              <X size={24} />
            </ActionIcon>
          </DrawerHeader>

          {/* Search bar inside hamburger menu */}
          <DrawerSearchBar
            type="button"
            aria-label="Search footwear & collections"
            onClick={() => {
              setMobileOpen(false);
              handleSearchClick();
            }}
          >
            <Search size={18} color={MUTED} />
            <span>Search footwear & collections...</span>
          </DrawerSearchBar>

          <DrawerNav>
            <DrawerItem
              to="/shop?category=Sneakers"
              onClick={() => setMobileOpen(false)}
            >
              Sneakers
            </DrawerItem>
            <DrawerItem
              to="/shop?category=Clogs%20%26%20Slip-Ons"
              onClick={() => setMobileOpen(false)}
            >
              Clogs & Slip-Ons
            </DrawerItem>
            <DrawerItem
              to="/shop?category=Sandals"
              onClick={() => setMobileOpen(false)}
            >
              Sandals
            </DrawerItem>
            <DrawerItem
              to="/shop?category=Slip-Ons%20%26%20Flats"
              onClick={() => setMobileOpen(false)}
            >
              Slip-Ons & Flats
            </DrawerItem>
            <DrawerItem
              to="/shop"
              onClick={() => setMobileOpen(false)}
            >
              All Footwear
            </DrawerItem>
            <DrawerItem
              to="/wishlist"
              onClick={() => setMobileOpen(false)}
            >
              Wishlist
            </DrawerItem>
            <DrawerItem
              to="/track"
              onClick={() => setMobileOpen(false)}
            >
              Track an Order
            </DrawerItem>
            <DrawerItem
              to="/about"
              onClick={() => setMobileOpen(false)}
            >
              Our Story
            </DrawerItem>
          </DrawerNav>

          <DrawerFooter>
            {loggedIn ? (
              <>
                {isAdmin && (
                  <DrawerItem
                    to="/admin/dashboard"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>Dashboard</span>
                    <LayoutDashboard size={18} />
                  </DrawerItem>
                )}
                <DrawerItem
                  to="/orders"
                  onClick={() => setMobileOpen(false)}
                >
                  <span>Orders</span>
                  <Package size={18} />
                </DrawerItem>
                <DrawerItem
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                >
                  <span>Profile</span>
                  <User size={18} />
                </DrawerItem>
                <ActionIcon
                  type="button"
                  style={{ justifyContent: 'flex-start', padding: '0.5rem 0', gap: '0.5rem' }}
                  onClick={async () => {
                    await signOut();
                    setMobileOpen(false);
                    navigate('/');
                  }}
                >
                  <LogOut size={18} />
                  <span>Log out</span>
                </ActionIcon>
              </>
            ) : (
              <DrawerItem
                to="/login"
                onClick={() => setMobileOpen(false)}
              >
                <span>Sign In / Register</span>
                <User size={18} />
              </DrawerItem>
            )}
          </DrawerFooter>
        </DrawerContent>
      </MobileDrawer>
    </>
  );
};

export default GoModeNav;
