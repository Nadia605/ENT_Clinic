'use client';

import { useState } from 'react';
import { Activity, ArrowUpRight, CalendarDays, ClipboardList, Ear, Eye, Headphones, HeartPulse, Languages, LockKeyhole, Stethoscope, UserRound, UsersRound } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

type Locale = 'en' | 'ar';

const copy = {
  en: {
    eyebrow: 'Advanced ENT Care · Smart Clinic System', title: 'Care that listens.', intro: 'A calmer way to manage every appointment, diagnosis, and follow-up at Dr. Mohamed Khalil ENT Clinic.', choose: 'Choose your portal', sub: 'Select your role to continue', signIn: 'Sign in', create: 'Create account', secure: 'Private & secure clinic access', ear: 'Ear & hearing', nose: 'Nose & sinuses', throat: 'Throat & voice', availability: 'Next available', time: 'Today · 5:30 PM', location: 'ENT clinic', patient: 'Patient', patientDesc: 'Book appointments and view your records', doctor: 'Doctor', doctorDesc: 'Manage patients, diagnoses and prescriptions', receptionist: 'Receptionist', receptionistDesc: 'Bookings, check-ins and the queue', assistant: 'Assistant', assistantDesc: 'Support rooms, vitals and exam records', footer: 'A more thoughtful ENT experience.'
  },
  ar: {
    eyebrow: 'رعاية متقدمة للأنف والأذن والحنجرة · نظام عيادة ذكي', title: 'رعاية تنصت إليك.', intro: 'طريقة أكثر هدوءاً لإدارة كل موعد وتشخيص في عيادة دكتور محمد خليل.', choose: 'اختر بوابتك', sub: 'حدد دورك للمتابعة', signIn: 'تسجيل الدخول', create: 'إنشاء حساب', secure: 'دخول خاص وآمن للعيادة', ear: 'الأذن والسمع', nose: 'الأنف والجيوب الأنفية', throat: 'الحلق والصوت', availability: 'أقرب موعد متاح', time: 'اليوم · ٥:٣٠ مساءً', location: 'عيادة الأنف والأذن والحنجرة', patient: 'المريض', patientDesc: 'احجز المواعيد واطلع على سجلك الطبي', doctor: 'الطبيب', doctorDesc: 'إدارة المرضى والتشخيصات والوصفات', receptionist: 'الاستقبال', receptionistDesc: 'الحجوزات وتسجيل الوصول وقائمة الانتظار', assistant: 'مساعد الطبيب', assistantDesc: 'دعم الغرف والقياسات والسجلات', footer: 'تجربة أكثر عناية للأنف والأذن والحنجرة.'
  }
} as const;

const roleData = [
  { key: 'patient', icon: UserRound, accent: 'cyan' },
  { key: 'doctor', icon: Stethoscope, accent: 'teal' },
  { key: 'receptionist', icon: CalendarDays, accent: 'violet' },
  { key: 'assistant', icon: ClipboardList, accent: 'amber' },
] as const;

export default function WelcomeExperience({ locale }: { locale: string }) {
  const isArabic = locale === 'ar';
  const lang: Locale = isArabic ? 'ar' : 'en';
  const t = copy[lang];
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  function continueToRole(role: string) {
    setSelected(role);
    const routes: Record<string, string> = { patient: '/patient', doctor: '/doctor', receptionist: '/reception', assistant: '/assistant' };
    window.setTimeout(() => router.push(routes[role]), 260);
  }

  return (
    <main dir={isArabic ? 'rtl' : 'ltr'} className="ent-shell min-h-screen overflow-hidden bg-[#07151d] text-white">
      <div className="ent-aurora" aria-hidden="true" />
      <div className="ent-grid" aria-hidden="true" />
      <header className="relative z-10 mx-auto flex max-w-[1480px] items-center justify-between px-6 py-6 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="ent-mark"><Ear /></div>
          <div><p className="text-sm font-semibold tracking-tight">Dr. Mohamed Khalil</p><p className="text-[10px] uppercase tracking-[.22em] text-white/45">ENT Clinic</p></div>
        </div>
        <div className="flex items-center gap-3"><LanguageSwitcher /><div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3 py-2 text-[11px] text-white/55 sm:flex"><LockKeyhole className="size-3" /> {t.secure}</div></div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-[1480px] gap-10 px-6 pb-12 pt-3 lg:grid-cols-[.92fr_1.08fr] lg:items-center lg:px-12 lg:pb-20 lg:pt-8">
        <div className={isArabic ? 'text-right' : ''}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[.07] px-3 py-2 text-[10px] font-semibold uppercase tracking-[.18em] text-cyan-200"><span className="ent-pulse size-1.5 rounded-full bg-cyan-300" /> {t.eyebrow}</div>
          <h1 className="max-w-2xl text-balance text-6xl font-semibold leading-[.92] tracking-[-.07em] text-white sm:text-8xl">{t.title}</h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-white/60 sm:text-lg">{t.intro}</p>
          <div className="mt-8 flex flex-wrap gap-2 text-xs text-white/55"><span className="ent-chip"><Headphones /> {t.ear}</span><span className="ent-chip"><Eye /> {t.nose}</span><span className="ent-chip"><Activity /> {t.throat}</span></div>
          <div className="mt-10 flex items-center gap-3"><button onClick={() => document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' })} className="ent-primary"><UsersRound /> {t.choose} <ArrowUpRight /></button><span className="text-xs text-white/35">{t.sub}</span></div>
        </div>

        <div className="relative min-h-[400px] lg:min-h-[500px]">
          <div className="ent-ring ent-ring-one" /><div className="ent-ring ent-ring-two" />
          <div className="ent-anatomy-card"><img src="/images/ent-ear-hero.png" alt={isArabic ? 'تصوير واقعي للأذن' : 'Photorealistic ear anatomy'} /><div className="absolute inset-0 bg-gradient-to-t from-[#07151d] via-transparent to-transparent" /><div className="absolute bottom-6 start-6 end-6 flex items-end justify-between"><div><p className="text-[10px] uppercase tracking-[.2em] text-cyan-200/70">{t.availability}</p><p className="mt-1 text-2xl font-semibold tracking-tight">{t.time}</p><p className="mt-1 text-xs text-white/45">{t.location}</p></div><div className="rounded-2xl border border-white/10 bg-black/20 p-3 backdrop-blur"><HeartPulse className="size-5 text-cyan-200" /></div></div></div>
          <div className="ent-floating-note start-0 top-16"><span className="ent-note-icon"><Ear /></span><span><b>360°</b><small>{isArabic ? 'رعاية متخصصة' : 'specialist care'}</small></span></div>
          <div className="ent-floating-note bottom-20 end-0"><span className="ent-note-icon teal"><Activity /></span><span><b>{isArabic ? '٣٦٠°' : '360°'}</b><small>{isArabic ? 'رعاية متخصصة' : 'specialist care'}</small></span></div>
        </div>
      </section>

      <section id="roles" className="relative z-10 border-t border-white/10 bg-black/10 px-6 py-7 backdrop-blur-sm lg:px-12 lg:py-10"><div className="mx-auto max-w-[1480px]"><div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-[10px] uppercase tracking-[.22em] text-cyan-200/70">{t.sub}</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.04em]">{t.choose}</h2></div><p className="max-w-sm text-sm leading-6 text-white/40">{isArabic ? 'بوابة واحدة، مصممة لكل شخص في رحلة الرعاية.' : 'One calm portal, designed for every person in the care journey.'}</p></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{roleData.map(({ key, icon: Icon, accent }) => <button key={key} onClick={() => continueToRole(key)} className={`ent-role ent-${accent} ${selected === key ? 'ent-selected' : ''}`}><div className="ent-role-icon"><Icon /></div><div className="flex-1 text-start"><h3 className="text-base font-semibold">{t[key as keyof typeof t]}</h3><p className="mt-1 text-xs leading-5 text-white/45">{t[`${key}Desc` as keyof typeof t]}</p></div><ArrowUpRight className="ent-arrow" /></button>)}</div></div></section>
      <footer className="relative z-10 mx-auto flex max-w-[1480px] items-center justify-between px-6 py-6 text-xs text-white/30 lg:px-12"><span>{t.footer}</span><span className="hidden sm:block">Giza · Egypt</span></footer>
    </main>
  );
}
