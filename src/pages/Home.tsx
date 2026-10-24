import React, { lazy } from 'react';
import Hero from '../components/sections/Hero';
import StepsStrip from '../components/sections/StepsStrip';
import LazySection from '../components/motion/LazySection';

// Below-the-fold sections are code-split and loaded as visitor scrolls near them
const ServicesSection = lazy(() => import('../components/sections/ServicesSection'));
const AboutTrust = lazy(() => import('../components/sections/AboutTrust'));
const DoctorsSection = lazy(() => import('../components/sections/DoctorsSection'));
const TestimonialsSection = lazy(() => import('../components/sections/TestimonialsSection'));
const LatestBlogSection = lazy(() => import('../components/sections/LatestBlogSection'));
const AskAISection = lazy(() => import('../components/sections/AskAISection'));
const ContactSection = lazy(() => import('../components/sections/ContactSection'));

export const Home: React.FC = () => {
  return (
    <main className="min-h-screen">
      {/* 1. Hero: Above-the-fold, never waits for scroll */}
      <Hero />

      {/* 2. Steps Strip: How it works (Check, Plan, Treat, Care) */}
      <StepsStrip />

      {/* 3. Services: Card grid with plain words and ETB price guidance */}
      <LazySection component={ServicesSection} minHeight={600} id="services" />

      {/* 4. About Us + Trust Numbers (binary-to-decimal CountUp) */}
      <LazySection component={AboutTrust} minHeight={580} id="about" />

      {/* 5. Our Experts: Doctors with credentials and booking */}
      <LazySection component={DoctorsSection} minHeight={600} id="doctors" />

      {/* 6. Happy Smiles: Testimonials with Before/After Slider */}
      <LazySection component={TestimonialsSection} minHeight={580} id="testimonials" />

      {/* 7. Latest Blog: Home shows ONLY the latest article as mandated */}
      <LazySection component={LatestBlogSection} minHeight={440} id="blog" />

      {/* 8. Ask AI: Knowledge assistant with dark navy glow */}
      <LazySection component={AskAISection} minHeight={440} id="ask-ai" />

      {/* 9. Contact: Google Maps style card + Landmark directions */}
      <LazySection component={ContactSection} minHeight={680} id="contact" />
    </main>
  );
};

export default Home;
