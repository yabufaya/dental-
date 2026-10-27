import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ClinicSettings } from '../types/clinic';
import { clinicSettings as fallback } from '../data/clinicData';

/**
 * Loads the single clinic_settings row (id=1) once and exposes it site-wide.
 * Anything not set in the row (or any fetch failure) falls back to the
 * static defaults in src/data/clinicData.ts — the site never blanks out.
 */
const SettingsContext = createContext<ClinicSettings>(fallback);

type Row = Record<string, unknown>;
const str = (row: Row, key: string, fb: string): string =>
  typeof row[key] === 'string' && (row[key] as string).trim() !== '' ? (row[key] as string) : fb;

function mapRow(row: Row): ClinicSettings {
  return {
    ...fallback,
    name: str(row, 'name', fallback.name),
    nameAm: str(row, 'name_am', fallback.nameAm),
    slogan: str(row, 'slogan', fallback.slogan),
    sloganAm: str(row, 'slogan_am', fallback.sloganAm),
    sloganSub: str(row, 'slogan_sub', fallback.sloganSub),
    sloganSubAm: str(row, 'slogan_sub_am', fallback.sloganSubAm),
    phone: str(row, 'phone', fallback.phone),
    emergencyPhone: str(row, 'emergency_phone', fallback.emergencyPhone),
    whatsapp: str(row, 'whatsapp', fallback.whatsapp),
    telegram: str(row, 'telegram', fallback.telegram),
    email: str(row, 'email', fallback.email),
    address: str(row, 'address', fallback.address),
    addressAm: str(row, 'address_am', fallback.addressAm),
    landmark: str(row, 'landmark', fallback.landmark),
    landmarkAm: str(row, 'landmark_am', fallback.landmarkAm),
    mapEmbedUrl: str(row, 'map_embed_url', fallback.mapEmbedUrl ?? ''),
    registrationNumber: str(row, 'registration_number', fallback.registrationNumber),
    hours: (row.hours as ClinicSettings['hours']) ?? fallback.hours,
    paymentMethods: Array.isArray(row.payment_methods)
      ? (row.payment_methods as string[]).filter((p) => typeof p === 'string')
      : fallback.paymentMethods,
    accessibility: Array.isArray(row.accessibility)
      ? (row.accessibility as string[]).filter((p) => typeof p === 'string')
      : fallback.accessibility,
    // Socials: empty columns → link hidden on the site (default undefined/empty).
    facebookUrl: typeof row.facebook_url === 'string' ? row.facebook_url : fallback.facebookUrl,
    instagramUrl: typeof row.instagram_url === 'string' ? row.instagram_url : fallback.instagramUrl,
    linkedinUrl: typeof row.linkedin_url === 'string' ? row.linkedin_url : fallback.linkedinUrl,
    tiktokUrl: typeof row.tiktok_url === 'string' ? row.tiktok_url : fallback.tiktokUrl,
    youtubeUrl: typeof row.youtube_url === 'string' ? row.youtube_url : fallback.youtubeUrl,
    xUrl: typeof row.x_url === 'string' ? row.x_url : fallback.xUrl,
    // Trust numbers pulled off the same settings row (undefined → static fallback)
    satisfactionRate: typeof row.satisfaction_rate === 'number' ? row.satisfaction_rate : undefined,
    smilesTransformed: typeof row.smiles_transformed === 'number' ? row.smiles_transformed : undefined,
    patientRating: typeof row.patient_rating === 'number' ? row.patient_rating : undefined,
    yearsExperience: typeof row.years_experience === 'number' ? row.years_experience : undefined,
    specialistCount: typeof row.specialist_count === 'number' ? row.specialist_count : undefined,
  };
}

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ClinicSettings>(fallback);

  // Fetch-on-load AND the handler for Realtime change events.
  const refetch = async () => {
    try {
      const { data, error } = await supabase
        .from('clinic_settings')
        .select('*')
        .eq('id', 1)
        .single();
      if (!error && data) setSettings(mapRow(data as Row));
    } catch {
      /* offline / no env → static fallback already in place */
    }
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Phase 2 ⚡: edit phones/hours/socials/hero in admin → every open
  // visitor's screen updates without reload.
  useEffect(() => {
    const channel = supabase
      .channel('clinic-settings-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'clinic_settings' },
        refetch,
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
};

/** Current clinic settings — live DB row with static clinicData fallback. */
export const useSettings = () => useContext(SettingsContext);
