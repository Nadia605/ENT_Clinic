'use client';

import { Clock, MapPin, MessageCircleOff, Navigation, Phone, PhoneCall } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CONSULTATION_BOOKING,
  PHONE_BOOKING_START,
  clinicAddress,
  clinicMapUrl,
  clinicPhones,
  dayNames,
  formatHour,
  formatPhone,
  weekOrder,
  weeklyHours,
  type Lang,
} from '@/lib/clinic';
import { useClinicStatus } from './useClinicStatus';

const copy = {
  en: {
    eyebrow: 'Appointments & contact',
    title: 'Clinic hours & booking',
    thanks: 'Thank you for contacting Dr. Mohamed Khalil ENT Clinic.',
    hours: 'Opening hours',
    hoursNote: 'Open every day except Friday.',
    closed: 'Closed',
    today: 'Today',
    booking: 'How to book',
    phoneBooking: 'Phone booking',
    phoneBookingDesc: `Daily from ${formatHour(PHONE_BOOKING_START, 'en')}`,
    consultation: 'Consultation (follow-up) booking',
    consultationDesc: `From ${formatHour(CONSULTATION_BOOKING.start, 'en')} to ${formatHour(CONSULTATION_BOOKING.end, 'en')}`,
    noWhatsapp: 'No booking via WhatsApp',
    noWhatsappDesc: 'Please call one of the numbers below to reserve.',
    linesOpen: 'Booking lines open now',
    linesClosed: 'Booking lines closed now',
    call: 'Call',
    address: 'Address',
    directions: 'Get directions',
  },
  ar: {
    eyebrow: 'المواعيد والتواصل',
    title: 'مواعيد العيادة والحجز',
    thanks: 'شكراً لتواصلك مع عيادة دكتور محمد خليل.',
    hours: 'مواعيد العيادة',
    hoursNote: 'كل يوم ما عدا الجمعة.',
    closed: 'مغلق',
    today: 'اليوم',
    booking: 'طريقة الحجز',
    phoneBooking: 'الحجز عبر الهاتف',
    phoneBookingDesc: `يومياً من ${formatHour(PHONE_BOOKING_START, 'ar')}`,
    consultation: 'حجز الاستشارة',
    consultationDesc: `من ${formatHour(CONSULTATION_BOOKING.start, 'ar')} إلى ${formatHour(CONSULTATION_BOOKING.end, 'ar').replace('مساءً', 'ظهراً')}`,
    noWhatsapp: 'لا يوجد حجز عبر الواتساب',
    noWhatsappDesc: 'برجاء الاتصال بأحد الأرقام التالية للحجز.',
    linesOpen: 'خطوط الحجز متاحة الآن',
    linesClosed: 'خطوط الحجز مغلقة الآن',
    call: 'اتصل',
    address: 'العنوان',
    directions: 'الاتجاهات على الخريطة',
  },
};

export default function ClinicInfo({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const clock = useClinicStatus();

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative z-10 scroll-mt-20 px-6 py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1280px]">
        <p className="text-[11px] font-semibold uppercase tracking-[.2em] text-cyan-200/75">{t.eyebrow}</p>
        <h2 id="contact-title" className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{t.title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">{t.thanks}</p>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[.035] p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-base font-semibold text-white">
                <Clock className="size-4 text-cyan-200" aria-hidden="true" /> {t.hours}
              </h3>
              <span className="text-xs text-white/45">{t.hoursNote}</span>
            </div>
            <ul className="mt-5 divide-y divide-white/[.07]">
              {weekOrder.map((day) => {
                const hours = weeklyHours[day];
                const isToday = clock?.today === day;
                return (
                  <li
                    key={day}
                    className={cn('flex items-center justify-between rounded-xl px-3 py-3 text-sm', isToday && 'bg-cyan-300/[.08]')}
                    aria-current={isToday ? 'date' : undefined}
                  >
                    <span className={cn('flex items-center gap-2', isToday ? 'font-semibold text-white' : 'text-white/70')}>
                      {dayNames[lang][day]}
                      {isToday ? <span className="rounded-full bg-cyan-300/15 px-2 py-0.5 text-[10px] font-semibold text-cyan-100">{t.today}</span> : null}
                    </span>
                    {hours ? (
                      <span className={cn('tabular-nums', isToday ? 'text-white' : 'text-white/60')}>
                        {formatHour(hours.open, lang)} – {formatHour(hours.close, lang)}
                      </span>
                    ) : (
                      <span className="text-rose-200/80">{t.closed}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-3xl border border-white/10 bg-white/[.035] p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-base font-semibold text-white">
                  <PhoneCall className="size-4 text-cyan-200" aria-hidden="true" /> {t.booking}
                </h3>
                {clock ? (
                  <span className={cn('flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium', clock.phoneOpen ? 'bg-emerald-400/10 text-emerald-200' : 'bg-white/[.06] text-white/50')}>
                    <span className={cn('size-1.5 rounded-full', clock.phoneOpen ? 'bg-emerald-300' : 'bg-white/40')} aria-hidden="true" />
                    {clock.phoneOpen ? t.linesOpen : t.linesClosed}
                  </span>
                ) : null}
              </div>
              <dl className="mt-5 space-y-4 text-sm">
                <div className="flex gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-teal-200" aria-hidden="true" />
                  <div><dt className="font-medium text-white">{t.phoneBooking}</dt><dd className="text-white/55">{t.phoneBookingDesc}</dd></div>
                </div>
                <div className="flex gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-teal-200" aria-hidden="true" />
                  <div><dt className="font-medium text-white">{t.consultation}</dt><dd className="text-white/55">{t.consultationDesc}</dd></div>
                </div>
                <div className="flex gap-3 rounded-xl border border-amber-300/20 bg-amber-300/[.06] p-3">
                  <MessageCircleOff className="mt-0.5 size-4 shrink-0 text-amber-200" aria-hidden="true" />
                  <div><dt className="font-medium text-amber-50">{t.noWhatsapp}</dt><dd className="text-amber-100/70">{t.noWhatsappDesc}</dd></div>
                </div>
              </dl>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {clinicPhones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-200 to-teal-300 px-4 text-sm font-semibold text-[#04252d] transition hover:brightness-105"
                  >
                    <Phone className="size-4" aria-hidden="true" />
                    <span className="sr-only">{t.call}</span>
                    <span dir="ltr" className="tabular-nums">{formatPhone(phone, lang)}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[.035] p-6">
              <h3 className="flex items-center gap-2 text-base font-semibold text-white">
                <MapPin className="size-4 text-cyan-200" aria-hidden="true" /> {t.address}
              </h3>
              <address className="mt-3 text-sm not-italic leading-6 text-white/65">{clinicAddress[lang]}</address>
              <a
                href={clinicMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 text-sm font-medium text-white transition hover:bg-white/[.06]"
              >
                <Navigation className="size-4 text-cyan-200" aria-hidden="true" /> {t.directions}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
