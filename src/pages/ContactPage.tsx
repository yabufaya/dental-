import React from 'react';
import ContactSection from '../components/sections/ContactSection';
import { useLanguage } from '../context/LanguageContext';

export const ContactPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <main className="pt-20">
      <ContactSection />
    </main>
  );
};

export default ContactPage;
