import Link from 'next/link';
import { ArrowLeft, ClipboardList, Ear, ShieldCheck, Stethoscope, UserRound, CalendarDays } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';

const roles = {
  patient: ['Patient portal', 'Your care, in one calmer place.', 'Book a visit, review your care plan, and stay connected with the clinic team.', UserRound],
  doctor: ['Doctor portal', 'A clearer view of every patient.', 'Review today’s schedule, clinical notes, and follow-up priorities securely.', Stethoscope],
  receptionist: ['Reception portal', 'Keep every visit moving smoothly.', 'Manage appointments, arrivals, and patient communication from one focused workspace.', CalendarDays],
  assistant: ['Clinical assistant portal', 'Make every consultation feel prepared.', 'Organize room readiness, patient preparation, and the clinical day at a glance.', ClipboardList],
} as const;

export default async function RolePortal({ params }: { params: Promise<{ locale: string; role: string }> }) {
  const { locale, role } = await params;
  setRequestLocale(locale);
  const [label, title, description, Icon] = roles[role as keyof typeof roles] ?? roles.patient;
  return (
    <main className="min-h-screen bg-abyss px-6 py-6 text-cream sm:px-10 lg:px-16">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col">
        <header className="flex items-center justify-between border-b border-cream/10 pb-5">
          <Link href={`/${locale}`} className="focus-ring flex items-center gap-2 text-sm text-cream/70 hover:text-cream"><ArrowLeft aria-hidden="true" /> Back to welcome</Link>
          <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cream/45"><Ear aria-hidden="true" /> ENT clinic</span>
        </header>
        <section className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl"><div className="mb-8 inline-flex items-center gap-3 rounded-full border border-lagoon/40 bg-lagoon/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-lagoon"><Icon aria-hidden="true" /> {label}</div><h1 className="font-display text-5xl leading-[0.96] tracking-[-0.045em] sm:text-7xl">{title}</h1><p className="mt-7 max-w-lg text-lg leading-7 text-cream/60">{description}</p><div className="mt-10 flex flex-wrap gap-3"><button type="button" className="focus-ring rounded-full bg-apricot px-6 py-3 text-sm font-semibold text-abyss">Sign in</button><button type="button" className="focus-ring rounded-full border border-cream/20 px-6 py-3 text-sm text-cream">Create account</button></div></div>
          <div className="relative min-h-[340px] overflow-hidden rounded-[2rem] border border-cream/10 bg-gradient-to-br from-lagoon/25 via-abyss to-violet/20 p-8"><div className="relative flex h-full min-h-[275px] flex-col justify-between"><div className="flex size-16 items-center justify-center rounded-3xl bg-cream text-abyss"><Icon aria-hidden="true" className="size-8" /></div><div><div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-lagoon"><ShieldCheck aria-hidden="true" /> Private access</div><p className="max-w-sm font-display text-2xl leading-tight">Designed around the way your clinic actually works.</p></div></div></div>
        </section>
      </div>
    </main>
  );
}
