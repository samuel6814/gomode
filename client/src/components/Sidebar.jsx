import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart2, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  Truck,
  LogOut,
  Layers, 
  ChevronDown,
  ChevronRight,
  X,
  ChevronsLeft,
  ChevronsRight,
  ImageIcon,
  PanelTop,
  MessageSquare,
  Percent,
  Boxes
} from 'lucide-react';
import { authClient } from '../api/authClient';
import { NAVY_ACCENT, INK, LINE, FONT_HERO, BRAND_NAME } from '../theme/brand';
import { media } from '../theme/breakpoints';

// --- Theme ---
const theme = {
  primary: NAVY_ACCENT,
  primarySoft: '#F5F3EF',
  textMain: '#555', 
  textDark: INK,
  bg: '#FFFFFF',
  white: '#FFFFFF',
};


// --- Styled Components ---

const SidebarContainer = styled.aside`
  background: ${theme.bg};
  /* Manage width based on collapsed state */
  width: ${({ $isCollapsed }) => ($isCollapsed ? '90px' : '280px')}; 
  height: 100vh;
  padding: ${({ $isCollapsed }) => ($isCollapsed ? '2rem 1rem' : '2rem 1.5rem')};
  display: flex;
  flex-direction: column;
  border-right: 1px solid #E5E7EB;
  position: relative; 
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow-y: auto;
  overflow-x: hidden;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;

  /* Hide scrollbar for cleaner look */
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media ${media.tablet} {
    width: ${({ $isCollapsed }) => ($isCollapsed ? '90px' : '220px')};
    padding: ${({ $isCollapsed }) => ($isCollapsed ? '1.5rem 0.75rem' : '1.5rem 1rem')};
  }

  @media ${media.mobile} {
    width: 280px;
    padding: 2rem 1.5rem;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000; 
    transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(-100%)')};
    box-shadow: ${({ $isOpen }) => ($isOpen ? '10px 0 30px rgba(0,0,0,0.1)' : 'none')};
  }
`;

/* Internal Close Button (Mobile Only) */
const SidebarToggle = styled.button`
  display: none;
  position: absolute;
  top: 1.5rem; 
  right: 1.5rem;
  background: transparent;
  color: ${theme.textMain};
  border: none;
  cursor: pointer;
  z-index: 10;
  padding: 0.5rem;

  &:hover { color: #111827; }

  @media ${media.mobile} {
    display: block;
  }
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ $isCollapsed }) => ($isCollapsed ? 'center' : 'flex-start')};
  margin-bottom: 2rem;
  padding-left: ${({ $isCollapsed }) => ($isCollapsed ? '0' : '0.5rem')};
  transition: all 0.3s ease;
`;

const LogoGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const LogoText = styled.h2`
  font-family: ${FONT_HERO};
  font-size: 1.35rem;
  font-weight: 800;
  color: ${theme.textDark};
  margin: 0;
  letter-spacing: -0.02em;
  display: ${({ $isCollapsed }) => ($isCollapsed ? 'none' : 'block')};
`;

const SubText = styled.span`
  font-size: 0.65rem;
  font-weight: 700;
  color: ${NAVY_ACCENT};
  text-transform: uppercase;
  letter-spacing: 0.14em;
  line-height: 1.4;
  display: ${({ $isCollapsed }) => ($isCollapsed ? 'none' : 'block')};
`;

const CollapsePanel = styled.button`
  background: ${({ $isCollapsed }) => ($isCollapsed ? 'transparent' : '#F5F3EF')};
  color: ${theme.textDark};
  border: 1px solid ${LINE};
  padding: ${({ $isCollapsed }) => ($isCollapsed ? '0.75rem' : '0.85rem 1.25rem')};
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  display: flex;
  align-items: center;
  justify-content: ${({ $isCollapsed }) => ($isCollapsed ? 'center' : 'space-between')};
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 2rem;

  &:hover {
    background: #EAE7E1;
  }


  @media ${media.mobile} {
    display: none; 
  }
`;

const NavMenu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1.5rem; 
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: ${({ $isCollapsed }) => ($isCollapsed ? 'center' : 'flex-start')};
  gap: 1rem;
  padding: ${({ $isCollapsed }) => ($isCollapsed ? '1rem' : '0.8rem 1rem')};
  border-radius: 8px; 
  text-decoration: none;
  
  font-size: 1.05rem; 
  font-weight: ${props => props.$active ? '800' : '600'};
  
  color: ${({ $active }) => ($active ? theme.primary : theme.textMain)};
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;

  svg {
    color: ${({ $active }) => ($active ? theme.primary : '#9CA3AF')};
    transition: color 0.2s ease;
    flex-shrink: 0;
  }

  /* Left border line effect on active */
  &::before {
    content: '';
    position: absolute;
    left: ${({ $isCollapsed }) => ($isCollapsed ? '-1rem' : '-1.5rem')};
    top: 50%;
    transform: translateY(-50%);
    height: 100%;
    width: 3px;
    background: ${theme.primary};
    opacity: ${({ $active }) => ($active ? 1 : 0)};
    transition: all 0.2s ease;

    @media ${media.tablet} { left: ${({ $isCollapsed }) => ($isCollapsed ? '-1rem' : '-1.25rem')}; }
    @media ${media.mobile} { left: -1.5rem; }
  }

  &:hover {
    color: ${theme.primary};
    background: ${({ $isCollapsed }) => ($isCollapsed ? theme.primarySoft : 'transparent')};
    svg { color: ${theme.primary}; }
  }
`;

const NavDivider = styled.div`
  height: 1px;
  background: #E5E7EB;
  margin: 0.5rem 0;
  width: 100%;
`;

const ParentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${({ $isCollapsed }) => ($isCollapsed ? 'center' : 'space-between')};
  padding: ${({ $isCollapsed }) => ($isCollapsed ? '1rem' : '0.8rem 1rem')};
  border-radius: 8px; 
  
  font-size: 1.05rem;
  font-weight: ${props => props.$active ? '800' : '600'};
  
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  color: ${({ $active }) => ($active ? theme.primary : theme.textMain)};

  svg {
    color: ${({ $active }) => ($active ? theme.primary : '#9CA3AF')};
    flex-shrink: 0;
  }

  &::before {
    content: '';
    position: absolute;
    left: ${({ $isCollapsed }) => ($isCollapsed ? '-1rem' : '-1.5rem')};
    top: 50%;
    transform: translateY(-50%);
    height: 100%;
    width: 3px;
    background: ${theme.primary};
    opacity: ${({ $active }) => ($active ? 1 : 0)};
    transition: all 0.2s ease;

    @media ${media.tablet} { left: ${({ $isCollapsed }) => ($isCollapsed ? '-1rem' : '-1.25rem')}; }
    @media ${media.mobile} { left: -1.5rem; }
  }

  &:hover {
    color: ${theme.primary};
    background: ${({ $isCollapsed }) => ($isCollapsed ? theme.primarySoft : 'transparent')};
    svg { color: ${theme.primary}; }
  }

  div.label {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

const SubMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.25rem;
  margin-bottom: 0.75rem;
  padding-left: 3rem; 
`;

const SubItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  text-decoration: none;
  
  font-size: 0.95rem;
  font-weight: ${props => props.$active ? '700' : '600'};
  
  color: ${({ $active }) => ($active ? theme.primary : '#9CA3AF')};
  transition: color 0.2s ease;
  
  &:hover {
    color: ${theme.primary};
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: ${({ $isCollapsed }) => ($isCollapsed ? 'center' : 'flex-start')};
  gap: 1rem;
  padding: ${({ $isCollapsed }) => ($isCollapsed ? '1rem' : '0.8rem 1rem')};
  border-radius: 8px;
  border: none;
  background: transparent;
  color: ${theme.textMain};
  font-family: 'Times New Roman', Times, serif; 
  font-size: 1.2rem; 
  font-style: italic;
  font-weight: 400;
  transition: all 0.2s ease;
  cursor: pointer;
  width: 100%;
  text-align: left;
  
  svg { color: #9CA3AF; transition: color 0.2s; flex-shrink: 0; }

  &:hover { 
    color: #EF4444; 
    background: ${({ $isCollapsed }) => ($isCollapsed ? '#FEF2F2' : 'transparent')};
    svg { color: #EF4444; }
  }
`;

// --- Overlay for Mobile ---
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.4);
  backdrop-filter: blur(2px);
  z-index: 999;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease-in-out;

  @media (min-width: 769px) {
    display: none;
  }
`;

const Sidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Set initial state to false so they are closed by default
  const [expanded, setExpanded] = useState({
    categories: false,
    products: false
  });

  const toggleMenu = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleParentClick = (key) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setExpanded(prev => ({ ...prev, [key]: true }));
    } else {
      toggleMenu(key);
    }
  };

  return (
    <>
      <SidebarContainer $isOpen={isOpen} $isCollapsed={isCollapsed}>
        
        {/* Internal Close Button (Mobile Only) */}
        <SidebarToggle onClick={closeSidebar}>
          <X size={24} strokeWidth={2} />
        </SidebarToggle>

        <LogoSection $isCollapsed={isCollapsed}>
          <LogoGroup>
            <BuyyLogo size={26} />
          </LogoGroup>
          <SubText $isCollapsed={isCollapsed}>
            MANAGEMENT <br/> CONSOLE
          </SubText>
        </LogoSection>

        <CollapsePanel onClick={() => setIsCollapsed(!isCollapsed)} $isCollapsed={isCollapsed}>
          {!isCollapsed && <span>Collapse Panel</span>}
          {isCollapsed ? <ChevronsRight size={20} strokeWidth={2.5} /> : <ChevronsLeft size={20} strokeWidth={2.5} />}
        </CollapsePanel>

        <NavMenu>
          <NavItem 
            to="/admin/dashboard" 
            $active={location.pathname === '/admin/dashboard'}
            $isCollapsed={isCollapsed}
            onClick={closeSidebar}
          >
            <LayoutDashboard size={22} strokeWidth={2} />
            {!isCollapsed && <span>Dashboard</span>}
          </NavItem>

          <NavDivider />

          <NavItem 
            to="/admin/analytics" 
            $active={location.pathname === '/admin/analytics'}
            $isCollapsed={isCollapsed}
            onClick={closeSidebar}
          >
            <BarChart2 size={22} strokeWidth={2} />
            {!isCollapsed && <span>Analytics</span>}
          </NavItem>

          {/* Categories */}
          <ParentItem 
            onClick={() => handleParentClick('categories')} 
            $active={location.pathname.includes('/category')}
            $isCollapsed={isCollapsed}
          >
            <div className="label">
              <Layers size={22} strokeWidth={2} />
              {!isCollapsed && <span>Categories</span>}
            </div>
            {!isCollapsed && (expanded.categories ? <ChevronDown size={18} strokeWidth={2.5} /> : <ChevronRight size={18} strokeWidth={2.5} />)}
          </ParentItem>
          
          {!isCollapsed && expanded.categories && (
            <SubMenuContainer>
              <SubItem 
                to="/admin/category" 
                $active={location.pathname === '/admin/category'}
                onClick={closeSidebar}
              >
                All Categories
              </SubItem>
              <SubItem 
                to="/admin/category/add" 
                $active={location.pathname === '/admin/category/add'}
                onClick={closeSidebar}
              >
                Add New
              </SubItem>
            </SubMenuContainer>
          )}

          {/* Products */}
          <ParentItem 
            onClick={() => handleParentClick('products')} 
            $active={location.pathname.includes('/products')}
            $isCollapsed={isCollapsed}
          >
            <div className="label">
              <Package size={22} strokeWidth={2} />
              {!isCollapsed && <span>Products</span>}
            </div>
            {!isCollapsed && (expanded.products ? <ChevronDown size={18} strokeWidth={2.5} /> : <ChevronRight size={18} strokeWidth={2.5} />)}
          </ParentItem>

          {!isCollapsed && expanded.products && (
            <SubMenuContainer>
              <SubItem 
                to="/admin/products" 
                $active={location.pathname === '/admin/products'}
                onClick={closeSidebar}
              >
                All Products
              </SubItem>
              <SubItem 
                to="/admin/products/add" 
                $active={location.pathname === '/admin/products/add'}
                onClick={closeSidebar}
              >
                Add New
              </SubItem>
            </SubMenuContainer>
          )}

            <NavItem 
            to="/admin/library" 
            $active={location.pathname.includes('/library')}
            $isCollapsed={isCollapsed}
            onClick={closeSidebar}
            >
            <ImageIcon size={22} strokeWidth={2} />
            {!isCollapsed && <span>Image Library</span>}
           </NavItem>

           <NavItem 
            to="/admin/gallery" 
            $active={location.pathname.includes('/admin/gallery')}
            $isCollapsed={isCollapsed}
            onClick={closeSidebar}
          >
            <ImageIcon size={22} strokeWidth={2} />
            {!isCollapsed && <span>Gallery</span>}
          </NavItem>

           <NavItem 
            to="/admin/heroconfig" 
            $active={location.pathname.includes('/admin/heroconfig')}
            $isCollapsed={isCollapsed}
            onClick={closeSidebar}
          >
            <PanelTop size={22} strokeWidth={2} />
            {!isCollapsed && <span>Hero Config</span>}
          </NavItem>

          <NavItem 
            to="/admin/orders" 
            $active={location.pathname.includes('/orders')}
            $isCollapsed={isCollapsed}
            onClick={closeSidebar}
          >
            <ShoppingCart size={22} strokeWidth={2} />
            {!isCollapsed && <span>Orders</span>}
          </NavItem>

          <NavItem 
            to="/admin/commissions" 
            $active={location.pathname.includes('/commissions')}
            $isCollapsed={isCollapsed}
            onClick={closeSidebar}
          >
            <MessageSquare size={22} strokeWidth={2} />
            {!isCollapsed && <span>{SERVICE_NAME}</span>}
          </NavItem>

          <NavItem 
            to="/admin/customers" 
            $active={location.pathname.includes('/customers')}
            $isCollapsed={isCollapsed}
            onClick={closeSidebar}
          >
            <Users size={22} strokeWidth={2} />
            {!isCollapsed && <span>Customers</span>}
          </NavItem>

          <NavItem 
            to="/admin/settings" 
            $active={location.pathname === '/admin/settings'}
            $isCollapsed={isCollapsed}
            onClick={closeSidebar}
          >
            <Settings size={22} strokeWidth={2} />
            {!isCollapsed && <span>Settings</span>}
          </NavItem>

          <NavItem 
            to="/admin/sales" 
            $active={location.pathname === '/admin/sales'}
            $isCollapsed={isCollapsed}
            onClick={closeSidebar}
          >
            <Percent size={22} strokeWidth={2} />
            {!isCollapsed && <span>Sales</span>}
          </NavItem>

          <NavItem 
            to="/admin/delivery" 
            $active={location.pathname === '/admin/delivery'}
            $isCollapsed={isCollapsed}
            onClick={closeSidebar}
          >
            <Truck size={22} strokeWidth={2} />
            {!isCollapsed && <span>Delivery</span>}
          </NavItem>

          <NavDivider />

          <LogoutButton 
            onClick={async () => {
              try {
                await authClient.signOut();
              } catch (e) {
                console.error('Logout error:', e);
              }
              navigate('/login');
            }} 
            $isCollapsed={isCollapsed}
          >
            <LogOut size={22} strokeWidth={2} />
            {!isCollapsed && <span>Log Out</span>}
          </LogoutButton>

        </NavMenu>
      </SidebarContainer>

      {/* Clickable Overlay for Mobile Drawer */}
      <Overlay $isOpen={isOpen} onClick={closeSidebar} />
    </>
  );
};

export default Sidebar;