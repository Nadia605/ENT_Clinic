import Link from 'next/link';
import { ArrowLeft, ClipboardList, Ear, ShieldCheck, Stethoscope, UserRound, CalendarDays } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';

const roles = {
  patient: { en: ['Patient portal', 'Your care, in one calmer place.', 'Book a visit, review your care plan, and stay connected with the clinic team.', 'Your care journey'], ar: ['بوابة المريض', 'رعايتك في مكان أكثر هدوءاً.', 'احجز زيارتك وراجع خطتك العلاجية وتواصل مع فريق العيادة.', 'رحلة رعايتك'], icon: UserRound },
  doctor: { en: ['Doctor portal', 'A clearer view of every patient.', 'Review today’s schedule, clinical notes, and follow-up priorities securely.', 'Your clinical workspace'], ar: ['بوابة الطبيب', 'رؤية أوضح لكل مريض.', 'راجع جدول اليوم والملاحظات الطبية وأولويات المتابعة بأمان.', 'مساحتك الطبية'], icon: Stethoscope },
  receptionist: { en: ['Reception portal', 'Keep every visit moving smoothly.', 'Manage appointments, arrivals, and patient communication from one focused workspace.', 'Your front desk workspace'], ar: ['بوابة الاستقبال', 'اجعل كل زيارة تسير بسلاسة.', 'أدر المواعيد والوصول وتواصل المرضى من مساحة عمل واضحة.', 'مساحتك في الاستقبال'], icon: CalendarDays },
  assistant: { en: ['Clinical assistant portal', 'Make every consultation feel prepared.', 'Organize room readiness, patient preparation, and the clinical day at a glance.', 'Your clinical support space'], ar: ['بوابة مساعد الطبيب', 'اجعل كل كشف مستعداً بشكل أفضل.', 'نظّم تجهيز الغرف وتحضير المرضى ويوم العمل الطبي في لمحة.', 'مساحتك للدعم الطبي'], icon: ClipboardList },
} as const;

export default async function RolePortal({ params }: { params: Promise<{ locale: string; role: string }> }) {
  const { locale, role } = await params;
  setRequestLocale(locale);
  const isArabic = locale === 'ar';
  const content = roles[role as keyof typeof roles] ?? roles.patient;
  const [label, title, description, workspace] = content[isArabic ? 'ar' : 'en'];
  const Icon = content.icon;
  return (
    <main dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen bg-abyss px-6 py-6 text-cream sm:px-10 lg:px-16">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col">
        <header className="flex items-center justify-between border-b border-cream/10 pb-5">
          <Link href={`/${locale}`} className="focus-ring flex items-center gap-2 text-sm text-cream/70 hover:text-cream"><ArrowLeft aria-hidden="true" /> {isArabic ? 'العودة للترحيب' : 'Back to welcome'}</Link>
          <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cream/45"><Ear aria-hidden="true" /> ENT clinic</span>
        </header>
        <section className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
          <div className="max-w-2xl"><div className="mb-8 inline-flex items-center gap-3 rounded-full border border-lagoon/40 bg-lagoon/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-lagoon"><Icon aria-hidden="true" /> {label}</div><h1 className="font-display text-5xl leading-[.96] tracking-[-.045em] sm:text-7xl">{title}</h1><p className="mt-7 max-w-lg text-lg leading-7 text-cream/60">{description}</p><div className="mt-10 flex flex-wrap gap-3"><button type="button" className="focus-ring rounded-full bg-apricot px-6 py-3 text-sm font-semibold text-abyss">{isArabic ? 'تسجيل الدخول' : 'Sign in'}</button><button type="button" className="focus-ring rounded-full border border-cream/20 px-6 py-3 text-sm text-cream">{isArabic ? 'مستخدم جديد' : 'New user'}</button></div></div>
          <div className="relative min-h-[340px] overflow-hidden rounded-[2rem] border border-cream/10 bg-gradient-to-br from-lagoon/25 via-abyss to-violet/20 p-8"><div className="relative flex h-full min-h-[275px] flex-col justify-between"><div className="flex size-16 items-center justify-center rounded-3xl bg-cream text-abyss"><Icon aria-hidden="true" className="size-8" /></div><div><div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-lagoon"><ShieldCheck aria-hidden="true" /> {isArabic ? 'دخول خاص وآمن' : 'Private access'}</div><p className="max-w-sm font-display text-2xl leading-tight">{workspace}</p></div></div></div>
        </section>
      </div>
    </main>
  );
}
