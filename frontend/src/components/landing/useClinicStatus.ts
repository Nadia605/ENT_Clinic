'use client';

import { useEffect, useState } from 'react';
import { getClinicStatus, getCairoNow, type ClinicStatus } from '@/lib/clinic';

interface ClinicClock {
  status: ClinicStatus;
  today: number;
}

function read(): ClinicClock {
  const now = new Date();
  return { status: getClinicStatus(now), today: getCairoNow(now).day };
}

/** Clinic status depends on the visitor's current time, so it is resolved after mount to avoid hydration mismatches. */
export function useClinicStatus() {
  const [clock, setClock] = useState<ClinicClock | null>(null);

  useEffect(() => {
    setClock(read());
    const timer = window.setInterval(() => setClock(read()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return clock;
}
