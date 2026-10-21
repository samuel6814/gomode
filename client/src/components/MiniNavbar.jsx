import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import {
  Search, ExternalLink, Bell, ShoppingBag, X, CheckCircle2, Loader2,
  Users, Box, Folder
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/axios';
import Currency from '../utils/Currency';
import BuyyLogo from './BuyyLogo';
import { NAVY_ACCENT, LINE, FONT_HERO, BRAND_NAME } from '../theme/brand';

// --- Styled Components ---

const NavWrapper = styled.nav`
  background: white;
  height: 80px;
  border-bottom: 1px solid ${LINE};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 3rem;
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) { padding: 0 2rem; }
  @media (max-width: 768px) { padding: 0 1.5rem; height: 70px; }
`;

/* --- LEFT: BRAND --- */
const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const BrandLink = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.2s;
  &:hover { opacity: 0.8; }
`;

const BrandText = styled.h1`
  font-family: ${FONT_HERO};
  font-size: 1.3rem;
  font-weight: 800;
  color: ${NAVY_ACCENT};
  margin: 0;
  letter-spacing: 0.5px;
  @media (max-width: 480px) { font-size: 1.1rem; }
`;

/* --- CENTER: COMMAND PALETTE (SEARCH) --- */
const CenterSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 2rem;
  position: relative;
  @media (max-width: 768px) { display: none; }
`;

const SearchBox = styled.div`
  position: relative;
  width: 100%;
  max-width: 520px;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1.25rem;
  color: #9CA3AF;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 50px;
  padding: 0.85rem 3.5rem 0.85rem 3rem; 
  font-size: 0.9rem;
  color: #111827;
  outline: none;
  transition: all 0.2s;

  &::placeholder { color: #9CA3AF; font-weight: 500; }
  &:focus {
    background: white;
    border-color: ${NAVY_ACCENT};
    box-shadow: 0 0 0 3px rgba(37, 60, 90, 0.12);
  }
`;

const ShortcutHint = styled.div`
  position: absolute;
  right: 1.25rem;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  padding: 0.2rem 0.4rem;
  font-size: 0.65rem;
  font-weight: 800;
  color: #9CA3AF;
  pointer-events: none;
`;

const SearchDropdown = styled.div`
  position: absolute;
  top: calc(100% + 15px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  border: 1px solid #F3F4F6;
  max-height: 450px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  z-index: 100;
  animation: slideDown 0.2s ease-out;

  /* Custom Scrollbar */
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
`;

const SearchSection = styled.div`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #F3F4F6;
  &:last-child { border-bottom: none; }
`;

const SectionTitle = styled.h4`
  font-size: 0.65rem;
  font-weight: 800;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0 0 0.75rem 0;
`;

const SearchResultItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  text-decoration: none;
  color: #111827;
  transition: background 0.2s;

  &:hover { background: #F9FAFB; }

  div.icon-wrapper {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #F5F3EF;
    color: ${NAVY_ACCENT};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  div.details {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;

    span.primary { font-size: 0.85rem; font-weight: 600; }
    span.secondary { font-size: 0.65rem; color: #6B7280; text-transform: uppercase; letter-spacing: 1px;}
  }
`;

/* --- RIGHT: ACTIONS --- */
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  @media (max-width: 768px) { gap: 1rem; }
`;

const StoreLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #111827;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  padding: 0.6rem 1.25rem;
  border-radius: 50px;
  border: 1px solid #E5E7EB;
  transition: all 0.2s;

  &:hover { border-color: ${NAVY_ACCENT}; color: ${NAVY_ACCENT}; background: #FAFAFA; }
  svg { width: 14px; height: 14px; }
  @media (max-width: 768px) {
    padding: 0.6rem;
    border-radius: 50%;
    span.text { display: none; }
    svg { width: 16px; height: 16px; margin: 0; }
  }
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6B7280;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem;
  border-radius: 50%;
  transition: all 0.2s;
  &:hover { color: ${NAVY_ACCENT}; background: #F3F4F6; }
`;

const NotificationContainer = styled.div`
  position: relative;
`;

const NotificationDot = styled.span`
  position: absolute;
  top: 4px;
  right: 6px;
  width: 8px;
  height: 8px;
  background: #EF4444; 
  border-radius: 50%;
  border: 2px solid white;
`;

const AdminAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #F5F3EF;
  color: ${NAVY_ACCENT};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${FONT_HERO};
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  flex-shrink: 0;
  border: 1px solid ${LINE};
  transition: all 0.2s;

  &:hover { border-color: ${NAVY_ACCENT}; }
`;

/* --- DROPDOWN --- */
const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 15px);
  right: -10px;
  width: 340px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  border: 1px solid #F3F4F6;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 100;
  transform-origin: top right;
  animation: slideDown 0.2s ease-out;

  @keyframes slideDown {
    from { opacity: 0; transform: scale(0.95) translateY(-10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
`;

const DropdownHeader = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid #F3F4F6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FAFAFA;

  h3 { font-size: 0.75rem; font-weight: 800; color: #111827; margin: 0; text-transform: uppercase; letter-spacing: 1px;}
  button { background: none; border: none; color: #9CA3AF; cursor: pointer; padding: 0; display: flex; &:hover{color: #111827;} }
`;

const DropdownList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const NotificationItem = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid #F3F4F6;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  transition: background 0.2s;
  cursor: pointer;
  position: relative;

  &:hover { background: #FAFAFA; }
  &:last-child { border-bottom: none; }

  div.icon {
    background: #F5F3EF; color: ${NAVY_ACCENT}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }

  div.content {
    flex: 1;
    padding-right: 1.5rem; 
    h4 { font-size: 0.85rem; font-weight: 600; color: #111827; margin: 0 0 0.25rem 0; line-height: 1.3; }
    span { font-size: 0.65rem; font-weight: 800; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; }
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #D1D5DB;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover { color: #10B981; background: #ECFDF5; }
`;

const DropdownFooter = styled(Link)`
  padding: 1rem;
  text-align: center;
  background: white;
  border-top: 1px solid #F3F4F6;
  color: ${NAVY_ACCENT};
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-decoration: none;
  transition: background 0.2s;
  &:hover { background: #F9FAFB; }
`;

const timeAgo = (dateInput) => {
  const date = new Date(dateInput);
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " HOURS AGO";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " MINS AGO";
  return "JUST NOW";
};


const MiniNavbar = () => {
  // Notification State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const notifRef = useRef(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const queryClient = useQueryClient();

  // Handle global clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard Shortcut Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounce the search input (waits 300ms after you stop typing to fetch)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // --- QUERY: Unread Notifications ---
  const { data: notifResponse } = useQuery({
    queryKey: ['adminUnreadNotifications'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/notifications/unread');
      return res.data;
    },
    refetchInterval: 15000
  });
  const unreadOrders = notifResponse?.data || [];

  const markReadMutation = useMutation({
    mutationFn: async (orderId) => {
      await apiClient.put(`/admin/notifications/mark-read/${orderId}`);
    },
    onSuccess: () => queryClient.invalidateQueries(['adminUnreadNotifications'])
  });

  const handleMarkRead = (e, orderId) => {
    e.preventDefault();
    e.stopPropagation();
    markReadMutation.mutate(orderId);
  };

  // --- QUERY: Command Palette Search ---
  const { data: searchResponse, isLoading: isSearching } = useQuery({
    queryKey: ['adminSearch', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return null;
      const res = await apiClient.get(`/search/admin?q=${debouncedQuery}`);
      return res.data;
    },
    enabled: debouncedQuery.length > 0
  });

  const searchResults = searchResponse?.data;
  const hasResults = searchResults && (
    searchResults.products.length > 0 ||
    searchResults.users.length > 0 ||
    searchResults.orders.length > 0 ||
    searchResults.categories.length > 0
  );

  return (
    <NavWrapper>
      <LeftSection>
        <BrandLink to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center' }}>
          <BuyyLogo size={26} />
        </BrandLink>
      </LeftSection>

      <CenterSection>
        <SearchBox ref={searchContainerRef}>
          <SearchIcon size={18} />
          <SearchInput
            type="text"
            placeholder="Search orders, clients, or products..."
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => { if (searchQuery) setIsSearchOpen(true); }}
          />
          <ShortcutHint>⌘K</ShortcutHint>

          {/* SEARCH RESULTS DROPDOWN */}
          {isSearchOpen && debouncedQuery && (
            <SearchDropdown>
              {isSearching ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF' }}>
                  <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 1rem auto', color: '#1A1A1A' }} />
                  <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Searching database...</p>
                </div>
              ) : !hasResults ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF' }}>
                  <Search size={32} style={{ margin: '0 auto 1rem auto', color: '#D1D5DB' }} />
                  <p style={{ fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>No results found for "{debouncedQuery}"</p>
                </div>
              ) : (
                <>
                  {/* 🚨 UPDATED ORDERS RESULTS */}
                  {searchResults.orders.length > 0 && (
                    <SearchSection>
                      <SectionTitle>Orders</SectionTitle>
                      {searchResults.orders.map(order => {
                        const customerId = order.user?.name || order.user?.email || 'Guest';
                        const firstItem = order.items?.[0]?.productName || 'Unknown Item';
                        const extraItems = order.items?.length > 1 ? ` (+${order.items.length - 1})` : '';

                        return (
                          <SearchResultItem to={`/admin/orders/${order.id}`} key={order.id} onClick={() => setIsSearchOpen(false)}>
                            <div className="icon-wrapper"><ShoppingBag size={16} /></div>
                            <div className="details">
                              <span className="primary">#{order.id.substring(0, 8).toUpperCase()} • {customerId}</span>
                              <span className="secondary" style={{ color: '#1A1A1A' }}>{firstItem}{extraItems}</span>
                            </div>
                          </SearchResultItem>
                        );
                      })}
                    </SearchSection>
                  )}

                  {/* CUSTOMERS RESULTS */}
                  {searchResults.users.length > 0 && (
                    <SearchSection>
                      <SectionTitle>Customers</SectionTitle>
                      {searchResults.users.map(user => (
                        <SearchResultItem to={`/admin/customers/${user.id}`} key={user.id} onClick={() => setIsSearchOpen(false)}>
                          <div className="icon-wrapper"><Users size={16} /></div>
                          <div className="details">
                            <span className="primary">{user.name}</span>
                            <span className="secondary">{user.email}</span>
                          </div>
                        </SearchResultItem>
                      ))}
                    </SearchSection>
                  )}

                  {/* PRODUCTS RESULTS */}
                  {searchResults.products.length > 0 && (
                    <SearchSection>
                      <SectionTitle>Products</SectionTitle>
                      {searchResults.products.map(product => (
                        <SearchResultItem to={`/admin/products`} key={product.id} onClick={() => setIsSearchOpen(false)}>
                          <div className="icon-wrapper"><Box size={16} /></div>
                          <div className="details">
                            <span className="primary">{product.name}</span>
                            <span className="secondary">INVENTORY: {product.stock} UNITS</span>
                          </div>
                        </SearchResultItem>
                      ))}
                    </SearchSection>
                  )}

                  {/* CATEGORIES RESULTS */}
                  {searchResults.categories.length > 0 && (
                    <SearchSection>
                      <SectionTitle>Categories</SectionTitle>
                      {searchResults.categories.map(category => (
                        <SearchResultItem to={`/admin/categories`} key={category.id} onClick={() => setIsSearchOpen(false)}>
                          <div className="icon-wrapper"><Folder size={16} /></div>
                          <div className="details">
                            <span className="primary">{category.name}</span>
                          </div>
                        </SearchResultItem>
                      ))}
                    </SearchSection>
                  )}
                </>
              )}
            </SearchDropdown>
          )}

        </SearchBox>
      </CenterSection>

      <RightSection>
        <StoreLink to="/" target="_blank">
          <span className="text">LIVE STORE</span>
          <ExternalLink />
        </StoreLink>

        <NotificationContainer ref={notifRef}>
          <IconButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <Bell size={20} />
            {unreadOrders.length > 0 && <NotificationDot />}
          </IconButton>

          {isDropdownOpen && (
            <DropdownMenu>
              <DropdownHeader>
                <h3>Activity Feed</h3>
                <button onClick={() => setIsDropdownOpen(false)}><X size={16} /></button>
              </DropdownHeader>
              <DropdownList>
                {unreadOrders.length === 0 ? (
                  <div style={{ padding: '3rem 2rem', textAlign: 'center', color: '#9CA3AF' }}>
                    <CheckCircle2 size={32} style={{ margin: '0 auto 1rem auto', color: '#D1D5DB' }} />
                    <p style={{ fontSize: '0.8rem', fontStyle: 'italic', margin: 0, fontWeight: 500 }}>
                      You're all caught up!
                    </p>
                  </div>
                ) : (
                  unreadOrders.map(order => (
                    <Link to={`/admin/orders/${order.id}`} style={{ textDecoration: 'none' }} key={order.id} onClick={() => setIsDropdownOpen(false)}>
                      <NotificationItem>
                        <div className="icon"><ShoppingBag size={14} /></div>
                        <div className="content">
                          <h4>New order from {order.user?.name || 'Guest'}</h4>
                          <span>{timeAgo(order.createdAt)} • <Currency amount={order.totalAmount} /></span>
                        </div>
                        <ClearButton onClick={(e) => handleMarkRead(e, order.id)} title="Mark as done">
                          {markReadMutation.isPending && markReadMutation.variables === order.id ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={18} />
                          )}
                        </ClearButton>
                      </NotificationItem>
                    </Link>
                  ))
                )}
              </DropdownList>
              <DropdownFooter to="/admin/orders" onClick={() => setIsDropdownOpen(false)}>
                View All Orders
              </DropdownFooter>
            </DropdownMenu>
          )}
        </NotificationContainer>

        <Link to="/admin/settings" style={{ textDecoration: 'none' }}>
          <AdminAvatar>A</AdminAvatar>
        </Link>
      </RightSection>
    </NavWrapper>
  );
};

export default MiniNavbar;