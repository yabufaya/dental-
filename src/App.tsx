import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { BookingProvider } from './context/BookingContext';
import ScrollManager from './components/layout/ScrollManager';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileBookBar from './components/layout/MobileBookBar';
import ChatLauncher from './components/chat/ChatLauncher';
import BookingModal from './components/booking/BookingModal';

// Pages
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

export default function App() {
  return (
    <LanguageProvider>
      <BookingProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#2ba8c9]/30 selection:text-slate-900">
            {/* Scroll Restoration & Anchor Manager */}
            <ScrollManager />

            {/* Sticky Navigation Header */}
            <Navbar />

            {/* Main Route Content */}
            <div className="flex-1">
              <Suspense
                fallback={
                  <div className="min-h-screen flex items-center justify-center bg-white" aria-busy="true">
                    <div className="w-10 h-10 border-3 border-[#2ba8c9] border-t-transparent rounded-full animate-spin" />
                  </div>
                }
              >
                <Routes>
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
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </div>

            {/* Reassuring Footer */}
            <Footer />

            {/* Mobile Bottom Booking Bar (visible on small devices) */}
            <MobileBookBar />

            {/* Floating AI Chat Assistant Launcher with 3-Ring Water Waves */}
            <ChatLauncher />

            {/* Global Appointment Booking Modal */}
            <BookingModal />
          </div>
        </BrowserRouter>
      </BookingProvider>
    </LanguageProvider>
  );
}
