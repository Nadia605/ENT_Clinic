'use client';

import { CalendarClock, Phone } from 'lucide-react';
import { clinicPhones, dayNames, formatHour, formatPhone, type Lang } from '@/lib/clinic';
import { useClinicStatus } from './useClinicStatus';

const copy = {
  en: { label: 'Closest next appointment', openNow: 'Open now', until: 'until', today: 'Today', tomorrow: 'Tomorrow', from: 'from', callToBook: 'Book by phone' },
  ar: { label: 'أقرب موعد متاح', openNow: 'العيادة مفتوحة الآن', until: 'حتى', today: 'اليوم', tomorrow: 'غداً', from: 'من', callToBook: 'احجز بالتليفون' },
};

export default function NextAppointmentCard({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const clock = useClinicStatus();

  let headline = '';
  let detail = '';
  if (clock) {
    const { status } = clock;
    if (status.kind === 'open') {
      headline = t.openNow;
      detail = `${t.until} ${formatHour(status.close, lang)}`;
    } else {
      const dayLabel = status.dayOffset === 0 ? t.today : status.dayOffset === 1 ? t.tomorrow : dayNames[lang][status.day];
      headline = `${dayLabel} · ${formatHour(status.open, lang)}`;
      detail = `${formatHour(status.open, lang)} – ${formatHour(status.close, lang)}`;
    }
  }

  const isOpen = clock?.status.kind === 'open';

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/12 bg-[#06171e]/80 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200">
          <CalendarClock className="size-5" aria-hidden="true" />
        </span>
        <div aria-live="polite">
          <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[.14em] text-cyan-200/75">
            <span className={`size-1.5 rounded-full ${isOpen ? 'ent-pulse bg-emerald-300' : 'bg-cyan-300'}`} aria-hidden="true" />
            {t.label}
          </p>
          {clock ? (
            <>
              <p className="mt-0.5 text-lg font-semibold text-white">{headline}</p>
              <p className="text-xs text-white/50">{detail}</p>
            </>
          ) : (
            <div className="mt-1.5 h-10 w-40 animate-pulse rounded-md bg-white/10" aria-hidden="true" />
          )}
        </div>
      </div>
      <a
        href={`tel:${clinicPhones[0]}`}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[.06] px-4 text-sm font-semibold text-white transition hover:bg-white/[.1]"
      >
        <Phone className="size-4 text-cyan-200" aria-hidden="true" />
        {t.callToBook}
        <span dir="ltr" className="text-white/60">{formatPhone(clinicPhones[0], lang)}</span>
      </a>
    </div>
  );
}
