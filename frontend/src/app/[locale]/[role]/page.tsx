import Link from 'next/link';
import { ArrowLeft, ClipboardList, Ear, ShieldCheck, Stethoscope, UserRound, CalendarDays } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import AuthPanel, { type Role } from '@/components/auth/AuthPanel';

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
  const roleKey: Role = role === 'reception' ? 'receptionist' : role in roles ? (role as Role) : 'patient';
  const content = roles[roleKey];
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
          <div className="max-w-2xl"><div className="mb-6 inline-flex items-center gap-3 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-cyan-200"><Icon aria-hidden="true" className="size-4" /> {label}</div><h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{title}</h1><p className="mt-5 max-w-lg text-base leading-7 text-cream/60">{description}</p><p className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-cyan-200/80"><ShieldCheck aria-hidden="true" className="size-4" /> {workspace}</p></div>
          <AuthPanel lang={isArabic ? 'ar' : 'en'} fixedRole={roleKey} />
        </section>
      </div>
    </main>
  );
}
