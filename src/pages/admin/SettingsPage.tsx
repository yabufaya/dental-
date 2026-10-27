import React from 'react';
import SingleRowSettings from './SingleRowSettings';
import { coreSettingsFields } from '../../admin/resources';

/** Site Settings = branding, hero block, trust numbers & about-strip facts.
 *  Contact details, hours, map & social links live under /admin/contact. */
const SettingsPage: React.FC = () => (
  <SingleRowSettings
    title="Site Settings"
    description="Branding, hero block, trust numbers and payment/accessibility facts — one row in clinic_settings."
    fields={coreSettingsFields}
  />
);

export default SettingsPage;
