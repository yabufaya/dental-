import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { BookingProvider } from './context/BookingContext';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { DataProvider } from './context/DataContext';
import ScrollManager from './components/layout/ScrollManager';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileBookBar from './components/layout/MobileBookBar';
import ChatLauncher from './components/chat/ChatLauncher';
import BookingModal from './components/booking/BookingModal';

// Public pages
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import DoctorsPage from './pages/DoctorsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import AboutPage from './pages/AboutPage';
import FaqPricingPage from './pages/FaqPricingPage';
import ContactPage from './pages/ContactPage';
import PrivacyTermsPage from './pages/PrivacyTermsPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin / staff zone
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import BookingsPage from './pages/admin/BookingsPage';
import ResourcePage from './pages/admin/ResourcePage';
import SettingsPage from './pages/admin/SettingsPage';
import ContactInfoPage from './pages/admin/ContactInfoPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';

/** The public marketing site shell: navbar, footer, chat, booking modal. */
const PublicShell: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#2ba8c9]/30 selection:text-slate-900">
    <ScrollManager />
    <Navbar />
    <div className="flex-1">
      <Outlet />
    </div>
    <Footer />
    <MobileBookBar />
    <ChatLauncher />
    <BookingModal />
  </div>
);

export default function App() {
  return (
    <LanguageProvider>
      <BookingProvider>
        <AuthProvider>
          <SettingsProvider>
          <DataProvider>
          <BrowserRouter>
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-white" aria-busy="true">
                  <div className="w-10 h-10 border-3 border-[#2ba8c9] border-t-transparent rounded-full animate-spin" />
                </div>
              }
            >
              <Routes>
                {/* 🌍 Public zone — anyone */}
                <Route element={<PublicShell />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/services/:slug" element={<ServiceDetailPage />} />
                  <Route path="/doctors" element={<DoctorsPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/faq-pricing" element={<FaqPricingPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/privacy-terms" element={<PrivacyTermsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>

                {/* 🔒 Staff zone — session + admin allowlist required */}
                <Route path="/admin" element={<ProtectedRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="bookings" element={<BookingsPage />} />
                    <Route path="services" element={<ResourcePage resourceKey="services" />} />
                    <Route path="doctors" element={<ResourcePage resourceKey="doctors" />} />
                    <Route path="testimonials" element={<ResourcePage resourceKey="testimonials" />} />
                    <Route path="blog" element={<ResourcePage resourceKey="blog" />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="contact" element={<ContactInfoPage />} />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
          </DataProvider>
          </SettingsProvider>
        </AuthProvider>
      </BookingProvider>
    </LanguageProvider>
  );
}
