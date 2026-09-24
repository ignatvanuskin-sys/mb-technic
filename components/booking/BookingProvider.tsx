"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type OpenOptions = { service?: string };

type BookingContextValue = {
  isOpen: boolean;
  presetService?: string;
  openBooking: (options?: OpenOptions) => void;
  closeBooking: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [presetService, setPresetService] = useState<string | undefined>(undefined);

  const openBooking = useCallback((options?: OpenOptions) => {
    setPresetService(options?.service);
    setIsOpen(true);
  }, []);

  const closeBooking = useCallback(() => setIsOpen(false), []);

  /* Lock the page behind the modal so background scrolling never leaks. */
  useEffect(() => {
    if (!isOpen) return;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [isOpen]);

  const value = useMemo(
    () => ({ isOpen, presetService, openBooking, closeBooking }),
    [isOpen, presetService, openBooking, closeBooking],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}

/** Shared CTA — keeps one primary action across the whole site. */
export function BookButton({
  children = "Записаться",
  service,
  className = "btn btn-primary",
  ...rest
}: {
  children?: React.ReactNode;
  service?: string;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">) {
  const { openBooking } = useBooking();
  return (
    <button
      type="button"
      className={className}
      onClick={() => openBooking({ service })}
      {...rest}
    >
      {children}
    </button>
  );
}
