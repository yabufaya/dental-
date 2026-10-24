import React, { createContext, useContext, useState } from 'react';

interface BookingContextType {
  isBookingOpen: boolean;
  selectedServiceId?: string;
  selectedDoctorId?: string;
  openBooking: (serviceId?: string, doctorId?: string) => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>();
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>();

  const openBooking = (serviceId?: string, doctorId?: string) => {
    setSelectedServiceId(serviceId);
    setSelectedDoctorId(doctorId);
    setIsBookingOpen(true);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
    setSelectedServiceId(undefined);
    setSelectedDoctorId(undefined);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  };

  return (
    <BookingContext.Provider
      value={{
        isBookingOpen,
        selectedServiceId,
        selectedDoctorId,
        openBooking,
        closeBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
