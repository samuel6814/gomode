import React from 'react'
import '../index.css';
import { createRoot } from 'react-dom/client'; // 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

// Admin Components
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const ProductPage = React.lazy(() => import('./pages/admin/product/ProductPage'));
const ProductDetailPageAdmin = React.lazy(() => import('./pages/admin/product/ProductDetailPageAdmin'));
const OrdersPage = React.lazy(() => import('./pages/admin/orders/OrdersPage'));
const OrdersDetailPage = React.lazy(() => import('./pages/admin/orders/OrdersDetailPage'));
const CategoryPageAdmin = React.lazy(() => import('./pages/admin/category/CategoryPageAdmin'));
const AddCategory = React.lazy(() => import('./pages/admin/category/AddCategory'));
const AddProducts = React.lazy(() => import('./pages/admin/product/AddProducts'));
const CustomerPage = React.lazy(() => import('./pages/admin/customer/CustomerPage'));
const CustomerDetailPage = React.lazy(() => import('./pages/admin/customer/CustomerDetailPage'));
const Settings = React.lazy(() => import('./pages/admin/Settings'));
const DeliverySettings = React.lazy(() => import('./pages/admin/DeliverySettings'));
const SalesPage = React.lazy(() => import('./pages/admin/SalesPage'));

const AnalyticsPage = React.lazy(() => import('./pages/admin/analytics/AnalyticsPage'));
const EditCategory = React.lazy(() => import('./pages/admin/category/EditCategory'));
const ImageLibrary = React.lazy(() => import('./pages/admin/imagelibrary/ImageLibrary'));
const HeroConfiguration = React.lazy(() => import('./pages/admin/heroconfiguration/PencilHeroConfiguration'));
const GalleryConfiguration = React.lazy(() => import('./pages/admin/gallery/GalleryConfiguration'));

import GlobalLoader from './components/GlobalLoader';
import HomeLayout from './pages/user/home/HomeLayout';
// User Components
const Wishlist = React.lazy(() => import('./pages/user/profile/Wishlist'));
const CartPage = React.lazy(() => import('./pages/user/shop/CartPage'));
const OrderConfirmationPage = React.lazy(() => import('./pages/user/profile/OrderConfirmationPage'));
const TrackOrderPage = React.lazy(() => import('./pages/user/shop/TrackOrderPage'));

const Shop = React.lazy(() => import('./pages/user/shop/Shop'));
const ProductDetailPage = React.lazy(() => import('./pages/user/shop/ProductDetailsPage'));
const Auth = React.lazy(() => import('./pages/auth/Auth'));
const ForgotPassword = React.lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/auth/ResetPassword'));
const CategoryPage = React.lazy(() => import('./pages/user/shop/CategoryPage'));
const Policies = React.lazy(() => import('./pages/user/others/Policies'));
const ContactUs = React.lazy(() => import('./pages/user/others/ContactUs'));
const AboutPage = React.lazy(() => import('./pages/user/others/AboutPage'));
const GalleryPage = React.lazy(() => import('./pages/user/others/GalleryPage'));
const CommissionsPage = React.lazy(() => import('./pages/user/others/CommissionsPage'));
const AdminCommissionsPage = React.lazy(() => import('./pages/admin/commissions/CommissionsPage'));
const AdminCommissionDetailPage = React.lazy(() => import('./pages/admin/commissions/CommissionsDetailPage'));
const PrivacyPolicy = React.lazy(() => import('./pages/user/others/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./pages/user/others/TermsOfService'));
const ShippingInfo = React.lazy(() => import('./pages/user/others/ShippingInfo'));
const Refunds = React.lazy(() => import('./pages/user/others/Refunds'));
const ProfileSettings = React.lazy(() => import('./pages/user/profile/ProfileSettings'));
const UserOrdersPage = React.lazy(() => import('./pages/user/profile/UserOrdersPage'));
const UserOrderDetailsPage = React.lazy(() => import('./pages/user/profile/UserOrderDetailsPage'));
const NotificationSettings = React.lazy(() => import('./pages/user/profile/NotificationSettings'));
const CheckoutPage = React.lazy(() => import('./pages/user/shop/CheckoutPage'));
const ErrorPage = React.lazy(() => import('./pages/others/ErrorPage'));
const AlertsPage = React.lazy(() => import('./pages/user/others/AlertsPage'));

import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import AuthCallback from './pages/auth/AuthCallback';
import StoreShell from './components/StoreShell';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch data just because the user clicked away
      retry: 1, 
      staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes before refetching
    },
  },
});

// <-- Fixed Render Call below
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
        <ScrollToTop/>
        <React.Suspense fallback={<GlobalLoader />}>
          <Routes>

          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/login" element={<Auth/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/reset-password" element={<ResetPassword/>} />

          <Route element={<StoreShell />}>
            <Route path="/" element={<HomeLayout/>} />
            <Route path="/home" element={<HomeLayout/>} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/categories" element={<CategoryPage/>} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage/>} />
            <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
            <Route path="/track" element={<TrackOrderPage />} />

            <Route path="/policies" element={<Policies />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/commissions" element={<CommissionsPage />} />
            <Route path="/shipping" element={<ShippingInfo />} />
            <Route path="/refunds" element={<Refunds />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfileSettings />} />
              <Route path="/orders" element={<UserOrdersPage />} />
              <Route path="/orders/:id" element={<UserOrderDetailsPage />} />
              <Route path="/notifications" element={<NotificationSettings />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/alerts" element={<AlertsPage />} />
            </Route>
          </Route>

        {/* --- STRICT ADMIN ROUTES (Must be logged in AND be an Admin) --- */}
        {/* We pass allowedRoles={['ADMIN']} so customers get kicked out */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<App />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            <Route path="products" element={<ProductPage/>} />
            <Route path="products/add" element={<AddProducts/>} />
            <Route path="products/edit/:id" element={<ProductDetailPageAdmin/>} />

            <Route path="category" element={<CategoryPageAdmin/>} />
            <Route path="category/add" element={<AddCategory/>} />
            <Route path="category/edit/:id" element={<EditCategory />} />

            <Route path="orders" element={<OrdersPage/>} />
            <Route path="orders/:id" element={<OrdersDetailPage />} />

            <Route path="commissions" element={<AdminCommissionsPage />} />
            <Route path="commissions/:id" element={<AdminCommissionDetailPage />} />

            <Route path="customers" element={<CustomerPage/>} />
            <Route path="customers/:id" element={<CustomerDetailPage/>} />

            <Route path="library" element={<ImageLibrary/>} />
            <Route path="heroconfig" element={<HeroConfiguration />} />
            <Route path="gallery" element={<GalleryConfiguration />} />
            <Route path="analytics" element={<AnalyticsPage/>} />
            <Route path="settings" element={<Settings/>} />
            <Route path="delivery" element={<DeliverySettings />} />
            <Route path="sales" element={<SalesPage />} />
          </Route>
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
      </React.Suspense>
      </BrowserRouter>
    </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);