import React from 'react';
import SingleRowSettings from './SingleRowSettings';
import { contactSettingsFields } from '../../admin/resources';

/** Contact Info = phones, WhatsApp/Telegram, address, map embed, social links
 *  + the friendly opening-hours editor (no JSON). Same clinic_settings row. */
const ContactInfoPage: React.FC = () => (
  <SingleRowSettings
    title="Contact Info & Social"
    description="Phones, messaging, address, map, opening hours and social media links shown across the site and footer."
    fields={contactSettingsFields}
    includeHours
  />
);

export default ContactInfoPage;
