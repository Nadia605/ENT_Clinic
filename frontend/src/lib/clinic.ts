export type Lang = 'en' | 'ar';

export const CLINIC_TIMEZONE = 'Africa/Cairo';

export const clinicPhones = ['01055968484', '01102560550'] as const;

export const clinicAddress = {
  ar: 'البدرشين، شارع النيل السعيد، أمام فودافون، برج الحمد، الدور الأول',
  en: 'Al-Hamd Tower, 1st floor, El-Nil El-Saeed St., opposite Vodafone, El Badrashein, Giza',
};

export const clinicMapUrl =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('برج الحمد شارع النيل السعيد البدرشين الجيزة');

/** Opening hours per weekday (0 = Sunday … 6 = Saturday), 24h clock in Cairo time. */
export const weeklyHours: Record<number, { open: number; close: number } | null> = {
  0: { open: 16, close: 21 },
  1: { open: 16, close: 21 },
  2: { open: 16, close: 21 },
  3: { open: 16, close: 21 },
  4: { open: 14, close: 18 },
  5: null,
  6: { open: 16, close: 21 },
};

export const PHONE_BOOKING_START = 11;
export const CONSULTATION_BOOKING = { start: 11, end: 14 };

/** Display order of the clinic week, starting Saturday. */
export const weekOrder = [6, 0, 1, 2, 3, 4, 5];

export const dayNames: Record<Lang, string[]> = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  ar: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
};

export function formatHour(hour: number, lang: Lang) {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  if (lang === 'ar') {
    const period = hour < 12 ? 'صباحاً' : 'مساءً';
    return `${h12.toLocaleString('ar-EG')} ${period}`;
  }
  return `${h12}:00 ${hour < 12 ? 'AM' : 'PM'}`;
}

export function formatPhone(phone: string, lang: Lang) {
  return lang === 'ar' ? phone.replace(/\d/g, (d) => Number(d).toLocaleString('ar-EG')) : phone;
}

export function getCairoNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: CLINIC_TIMEZONE,
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return {
    day: weekdays.indexOf(get('weekday')),
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  };
}

export type ClinicStatus =
  | { kind: 'open'; day: number; open: number; close: number }
  | { kind: 'upcoming'; day: number; dayOffset: number; open: number; close: number };

export function getClinicStatus(date = new Date()): ClinicStatus {
  const { day, minutes } = getCairoNow(date);
  const today = weeklyHours[day];

  if (today && minutes >= today.open * 60 && minutes < today.close * 60) {
    return { kind: 'open', day, ...today };
  }
  if (today && minutes < today.open * 60) {
    return { kind: 'upcoming', day, dayOffset: 0, ...today };
  }
  for (let offset = 1; offset <= 7; offset++) {
    const next = (day + offset) % 7;
    const hours = weeklyHours[next];
    if (hours) return { kind: 'upcoming', day: next, dayOffset: offset, ...hours };
  }
  throw new Error('Clinic schedule has no open days');
}

export function isPhoneBookingOpen(date = new Date()) {
  const { day, minutes } = getCairoNow(date);
  const hours = weeklyHours[day];
  return Boolean(hours) && minutes >= PHONE_BOOKING_START * 60 && minutes < (hours?.close ?? 0) * 60;
}
