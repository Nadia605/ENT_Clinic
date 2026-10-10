'use client';

import { useState } from 'react';
import { Activity, Ear, Headphones, LogIn, ShieldCheck, Stethoscope, UserPlus, Wind } from 'lucide-react';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import AuthPanel, { type AuthMode } from '@/components/auth/AuthPanel';
import { clinicAddress, type Lang } from '@/lib/clinic';
import NextAppointmentCard from './NextAppointmentCard';
import ClinicInfo from './ClinicInfo';

const copy = {
  en: {
    clinic: 'Dr. Mohamed Khalil',
    clinicSub: 'Ear, Nose & Throat Clinic',
    navServices: 'Services',
    navContact: 'Hours & contact',
    signIn: 'Sign in',
    newUser: 'New user',
    eyebrow: 'Ear · Nose · Throat specialist',
    title: 'Specialist ENT care in El Badrashein.',
    intro: 'Accurate diagnosis and attentive treatment for ear, nose, and throat conditions — with a secure portal for patients and the clinic team.',
    trust: ['Hearing assessment', 'Nasal endoscopy', 'Voice & throat care'],
    servicesEyebrow: 'What we treat',
    servicesTitle: 'Complete care for ear, nose and throat',
    services: [
      { title: 'Ear & hearing', desc: 'Ear infections, wax removal, tinnitus, vertigo and hearing assessment.', img: '/images/ent-hearing.png', alt: 'Patient wearing headphones during a hearing test' },
      { title: 'Nose & sinuses', desc: 'Sinusitis, nasal allergy, polyps and deviated septum with endoscopic evaluation.', img: '/images/ent-endoscopy.png', alt: 'Doctor performing a nasal endoscopy' },
      { title: 'Throat & voice', desc: 'Tonsils, adenoids, hoarseness, snoring and swallowing difficulties.', img: '/images/ent-doctor-exam.png', alt: 'ENT doctor examining a patient' },
    ],
    imageAlt: 'Dr. Mohamed Khalil examining a patient with an otoscope',
    footer: 'Dr. Mohamed Khalil ENT Clinic',
  },
  ar: {
    clinic: 'دكتور محمد خليل',
    clinicSub: 'عيادة الأنف والأذن والحنجرة',
    navServices: 'الخدمات',
    navContact: 'المواعيد والتواصل',
    signIn: 'تسجيل الدخول',
    newUser: 'مستخدم جديد',
    eyebrow: 'أخصائي الأنف والأذن والحنجرة',
    title: 'رعاية متخصصة للأنف والأذن والحنجرة في البدرشين.',
    intro: 'تشخيص دقيق وعلاج باهتمام لكل مشاكل الأنف والأذن والحنجرة، مع بوابة آمنة للمرضى وفريق العيادة.',
    trust: ['قياس السمع', 'منظار الأنف', 'علاج الحلق والصوت'],
    servicesEyebrow: 'ماذا نعالج',
    servicesTitle: 'رعاية متكاملة للأنف والأذن والحنجرة',
    services: [
      { title: 'الأذن والسمع', desc: 'التهابات الأذن، تنظيف الشمع، الطنين، الدوخة وقياس السمع.', img: '/images/ent-hearing.png', alt: 'مريض يرتدي سماعات أثناء اختبار السمع' },
      { title: 'الأنف والجيوب الأنفية', desc: 'التهاب الجيوب، حساسية الأنف، اللحمية والزوائد وانحراف الحاجز بالمنظار.', img: '/images/ent-endoscopy.png', alt: 'طبيب يجري منظار للأنف' },
      { title: 'الحلق والصوت', desc: 'اللوز، اللحمية، بحة الصوت، الشخير وصعوبة البلع.', img: '/images/ent-doctor-exam.png', alt: 'طبيب أنف وأذن يفحص مريضة' },
    ],
    imageAlt: 'دكتور محمد خليل يفحص أذن مريضة بالمنظار',
    footer: 'عيادة دكتور محمد خليل للأنف والأذن والحنجرة',
  },
} as const;

const serviceIcons = [Headphones, Wind, Activity];

export default function WelcomeExperience({ locale }: { locale: string }) {
  const lang: Lang = locale === 'ar' ? 'ar' : 'en';
  const t = copy[lang];
  const [mode, setMode] = useState<AuthMode>('login');

  function openAuth(next: AuthMode) {
    setMode(next);
    const panel = document.getElementById('auth');
    panel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => panel?.querySelector<HTMLInputElement>('input:not([type=radio])')?.focus({ preventScroll: true }), 350);
  }

  return (
    <main dir={lang === 'ar' ? 'rtl' : 'ltr'} className="ent-shell min-h-screen overflow-x-hidden bg-[#07151d] text-white">
      <div className="ent-aurora" aria-hidden="true" />
      <div className="ent-grid" aria-hidden="true" />

      <header className="sticky top-0 z-30 border-b border-white/[.06] bg-[#07151d]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-6 py-3 lg:px-12">
          <a href="#top" className="flex items-center gap-3">
            <span className="ent-mark"><Ear aria-hidden="true" /></span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold tracking-tight">{t.clinic}</span>
              <span className="block text-[11px] text-white/45">{t.clinicSub}</span>
            </span>
          </a>
          <nav aria-label="Main" className="hidden items-center gap-1 text-sm text-white/60 md:flex">
            <a href="#services" className="flex items-center rounded-lg px-3 hover:text-white">{t.navServices}</a>
            <a href="#contact" className="flex items-center rounded-lg px-3 hover:text-white">{t.navContact}</a>
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block"><LanguageSwitcher /></div>
            <button type="button" onClick={() => openAuth('login')} className="hidden items-center gap-2 rounded-xl px-3 text-sm font-medium text-white/80 hover:bg-white/[.06] hover:text-white sm:inline-flex">
              <LogIn className="size-4" aria-hidden="true" /> {t.signIn}
            </button>
            <button type="button" onClick={() => openAuth('register')} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-200 to-teal-300 px-4 text-sm font-semibold text-[#04252d] transition hover:brightness-105">
              <UserPlus className="size-4" aria-hidden="true" /> {t.newUser}
            </button>
          </div>
        </div>
      </header>

      <section id="top" className="relative z-10 mx-auto grid max-w-[1280px] gap-6 px-6 pb-14 pt-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-x-12 lg:px-12 lg:pt-12">
        <div className="lg:col-start-1 lg:row-start-1">
          <div className="sm:hidden mb-4"><LanguageSwitcher /></div>
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[.07] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.14em] text-cyan-200">
            <Stethoscope className="size-3.5" aria-hidden="true" /> {t.eyebrow}
          </p>
          <h1 className="mt-4 max-w-xl text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{t.title}</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/60 sm:text-base">{t.intro}</p>
        </div>

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
          <AuthPanel id="auth" lang={lang} mode={mode} onModeChange={setMode} />
        </div>

        <div className="flex flex-col gap-4 lg:col-start-1 lg:row-start-2">
          <figure className="relative overflow-hidden rounded-3xl border border-white/10">
            <img src="/images/ent-doctor-exam.png" alt={t.imageAlt} className="aspect-[16/9] w-full object-cover object-[35%_center]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07151d]/85 via-[#07151d]/10 to-transparent" aria-hidden="true" />
            <figcaption className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
              {t.trust.map((item) => (
                <span key={item} className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-xs text-white/85 backdrop-blur">
                  <ShieldCheck className="size-3.5 text-cyan-200" aria-hidden="true" /> {item}
                </span>
              ))}
            </figcaption>
          </figure>
          <NextAppointmentCard lang={lang} />
        </div>
      </section>

      <section id="services" aria-labelledby="services-title" className="relative z-10 scroll-mt-20 border-t border-white/[.07] bg-black/15 px-6 py-16 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1280px]">
          <p className="text-[11px] font-semibold uppercase tracking-[.2em] text-cyan-200/75">{t.servicesEyebrow}</p>
          <h2 id="services-title" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{t.servicesTitle}</h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {t.services.map((service, index) => {
              const Icon = serviceIcons[index];
              return (
                <li key={service.title} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[.035] transition hover:border-cyan-300/30">
                  <div className="overflow-hidden">
                    <img src={service.img} alt={service.alt} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <h3 className="flex items-center gap-2 text-base font-semibold">
                      <Icon className="size-4 text-cyan-200" aria-hidden="true" /> {service.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/55">{service.desc}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <ClinicInfo lang={lang} />

      <footer className="relative z-10 border-t border-white/[.07]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-6 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between lg:px-12">
          <span>{t.footer}</span>
          <span>{clinicAddress[lang]}</span>
        </div>
      </footer>
    </main>
  );
}
