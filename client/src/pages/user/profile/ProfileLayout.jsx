import React from 'react';
import styled from 'styled-components';
import { media } from '../../../theme/breakpoints';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Package, Heart, Bell, LogOut } from 'lucide-react';
import { useSession, authClient } from '../../../api/authClient';
import { CANVAS, NAVY_ACCENT, INK, LINE, FONT_HERO } from '../../../theme/brand';

const PageWrapper = styled.div`
  background: ${CANVAS};
  min-height: calc(100vh - 80px);
  padding-top: 2rem;
  padding-bottom: 5rem;
`;

const Container = styled.div`
  max-width: 1360px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media ${media.desktop} {
    flex-direction: row;
    gap: 3.5rem;
    padding: 2.5rem 2rem;
  }
`;

/* --- SIDEBAR --- */
const Sidebar = styled.aside`
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;

  @media ${media.desktop} {
    width: 260px;
    position: sticky;
    top: 32px;
  }
`;

const SidebarHeader = styled.div`
  margin-bottom: 2rem;

  span {
    font-size: 0.75rem;
    font-weight: 700;
    color: ${NAVY_ACCENT};
    letter-spacing: 0.12em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 0.35rem;
  }

  h2 {
    font-family: ${FONT_HERO};
    font-size: 1.85rem;
    font-weight: 800;
    color: ${INK};
    margin: 0;
    letter-spacing: -0.02em;
  }
`;

const NavMenu = styled.nav`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media ${media.desktop} {
    flex-direction: column;
    overflow: visible;
    padding-bottom: 0;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1.15rem;
  border-radius: 10px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  transition: all 0.2s ease;
  white-space: nowrap;

  color: ${(props) => (props.$active ? '#fff' : INK)};
  background: ${(props) => (props.$active ? NAVY_ACCENT : '#fff')};
  border: 1px solid ${(props) => (props.$active ? NAVY_ACCENT : LINE)};

  svg {
    color: ${(props) => (props.$active ? '#fff' : NAVY_ACCENT)};
    transition: color 0.2s ease;
  }

  &:hover {
    background: ${(props) => (props.$active ? NAVY_ACCENT : '#f2f0ea')};
  }

  @media ${media.desktop} {
    white-space: normal;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1.15rem;
  border: 1px solid #fee2e2;
  background: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #dc2626;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s ease;
  margin-top: 1.5rem;

  svg {
    color: #dc2626;
  }

  &:hover {
    background: #fef2f2;
    border-color: #fca5a5;
  }
`;

const MainContent = styled.main`
  flex: 1;
  min-width: 0;
`;

const ProfileLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: session } = useSession();
  const userName = session?.user?.name ? session.user.name.split(' ')[0] : 'Guest';

  const navItems = [
    { label: 'Profile Details', path: '/profile', icon: User },
    { label: 'My Orders', path: '/orders', icon: Package },
    { label: 'Saved Wishlist', path: '/wishlist', icon: Heart },
    { label: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <PageWrapper>
      <Container>
        <Sidebar>
          <SidebarHeader>
            <span>CLIENT ACCOUNT</span>
            <h2>Hi, {userName}</h2>
          </SidebarHeader>

          <NavMenu>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink key={item.path} to={item.path} $active={isActive}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            <LogoutButton type="button" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Sign Out</span>
            </LogoutButton>
          </NavMenu>
        </Sidebar>

        <MainContent>{children}</MainContent>
      </Container>
    </PageWrapper>
  );
};

export default ProfileLayout;