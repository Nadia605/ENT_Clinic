import { setRequestLocale, getTranslations } from 'next-intl/server';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { Link } from '@/i18n/navigation';

function ResonanceMark({ light = false }: { light?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 72" className="size-10 shrink-0">
      <path d="M8 68V27C8 12 19 4 32 4s24 8 24 23v41" fill="none" stroke={light ? '#BFE3D6' : '#0E6F77'} strokeWidth="3" />
      <path d="M37 52c-11 0-17-6-17-15s7-15 16-15c9 0 15 5 15 12 0 7-5 11-11 11-5 0-8-3-8-7 0-4 3-7 7-7" fill="none" stroke={light ? '#F2A25C' : '#F2A25C'} strokeWidth="2" strokeLinecap="round" />
      <path d="M59 18c3 3 4 6 4 10M59 7c5 5 7 11 7 17" fill="none" stroke={light ? '#BFE3D6' : '#0E6F77'} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const roles = [
  { href: '/patient', label: 'Patient', arabic: 'مريض', detail: 'Your visits, history, and prescriptions', tone: 'bg-mint' },
  { href: '/doctor', label: 'Doctor', arabic: 'طبيب', detail: 'Clinical care and clinic management', tone: 'bg-blush' },
  { href: '/reception', label: 'Receptionist', arabic: 'الاستقبال', detail: 'Bookings, check-in, and the queue', tone: 'bg-sand' },
  { href: '/assistant', label: 'Assistant', arabic: 'مساعد الطبيب', detail: 'Rooms, vitals, and exam uploads', tone: 'bg-apricot/40' },
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main className="grain min-h-screen overflow-hidden">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="focus-ring flex items-center gap-3" aria-label="Dr. Mohamed Khalil ENT Clinic home">
          <ResonanceMark />
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold text-ink">عيادة دكتور محمد خليل</span>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-ink-soft">Dr. Mohamed Khalil · ENT</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link href="/login" className="focus-ring hidden rounded-full border border-ink px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-cream sm:inline-flex">{t('auth.login')}</Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-8 lg:grid-cols-[1.02fr_.98fr] lg:px-10 lg:pb-28 lg:pt-14">
        <div className="order-2 lg:order-1">
          <div className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-lagoon">
            <span className="inline-block size-2 rounded-full bg-apricot" /> A quieter kind of care
          </div>
          <h1 className="max-w-2xl font-display text-5xl leading-[.98] tracking-[-0.04em] text-ink sm:text-7xl">
            Your ears, nose and throat, cared for with time and attention.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-ink-soft">A calm, considered clinic experience for every voice, every breath, and every small question.</p>
          <p className="mt-3 font-arabic text-lg leading-9 text-ink-soft" dir="rtl">رعاية هادئة وعناية دقيقة لكل أذن، وكل نفس، وكل سؤال صغير.</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/login" className="focus-ring inline-flex items-center justify-center rounded-full bg-abyss px-6 py-3.5 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5">{t('auth.login')}</Link>
            <Link href="/login" className="focus-ring inline-flex items-center justify-center rounded-full border border-sand bg-cream px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-lagoon">Create an account <span aria-hidden="true" className="ms-2">↗</span></Link>
          </div>
          <div className="mt-14 border-t border-sand pt-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">What we care for</p>
            <div className="flex max-w-lg flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-ink">
              {['Ear & hearing', 'Nose & sinuses', 'Throat & voice', 'Children’s ENT', 'Balance'].map((item) => <span key={item} className="flex items-center gap-2"><span className="text-apricot">○</span>{item}</span>)}
            </div>
          </div>
        </div>

        <div className="order-1 relative min-h-[480px] lg:order-2">
          <div className="absolute -end-20 -top-20 size-80 rounded-full bg-apricot/20 blur-3xl" />
          <div className="absolute end-4 top-0 hidden font-display text-[13rem] leading-none text-lagoon/10 lg:block">◉</div>
          <div className="arch relative mx-auto h-[470px] max-w-[390px] overflow-hidden bg-sand shadow-[0_24px_60px_rgba(7,42,49,.15)]">
            {/* Replace this warm consultation-room slot with the clinic's real photograph. */}
            <img src="/placeholder.svg?height=760&width=540&query=bright%20modern%20ENT%20consultation%20room%20warm%20wood%20paneling%20soft%20daylight%20doctor%20holding%20an%20otoscope%20editorial%20photography" alt="A bright, welcoming ENT consultation room" className="size-full object-cover sepia-[.18]" />
            <div className="absolute inset-0 bg-gradient-to-t from-abyss/75 via-transparent to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-7 text-cream">
              <p className="text-xs uppercase tracking-[0.2em] text-mint">Next available</p>
              <p className="mt-1 font-display text-3xl">Today, 5:30 PM</p>
              <p className="mt-1 text-sm text-cream/75">Cairo · New Cairo clinic</p>
            </div>
          </div>
          <div className="absolute -start-3 bottom-10 flex items-center gap-3 rounded-2xl border border-sand bg-cream px-4 py-3 shadow-lg sm:-start-8">
            <span className="flex size-10 items-center justify-center rounded-full bg-mint text-xl text-abyss">≈</span>
            <div><p className="text-xs text-ink-soft">Listening closely</p><p className="text-sm font-semibold text-ink">Since 2014</p></div>
          </div>
        </div>
      </section>

      <section className="bg-abyss px-6 py-14 text-cream lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 border-b border-cream/15 pb-7 sm:flex-row sm:items-end">
            <div><p className="text-xs uppercase tracking-[0.2em] text-mint">A shared front desk</p><h2 className="mt-2 font-display text-3xl sm:text-4xl">Explore the demo as</h2></div>
            <p className="max-w-sm text-sm leading-6 text-cream/60">Choose a view to see how the clinic stays in step, from first booking to follow-up.</p>
          </div>
          <div className="grid gap-px overflow-hidden border-s border-cream/15 bg-cream/15 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((role) => <Link key={role.href} href={role.href} className="focus-ring group min-h-48 bg-abyss p-6 transition-colors hover:bg-lagoon">
              <div className={`mb-10 flex size-11 items-center justify-center rounded-t-full rounded-b-md ${role.tone} text-lg font-display text-abyss`}>{role.arabic.slice(0, 1)}</div>
              <div className="flex items-end justify-between gap-3"><div><h3 className="font-display text-xl">{role.label}</h3><p className="mt-1 text-xs leading-5 text-cream/55">{role.detail}</p></div><span className="text-xl text-apricot transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">↗</span></div>
            </Link>)}
          </div>
        </div>
      </section>
      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between lg:px-10"><span className="font-arabic">للأنف والأذن والحنجرة</span><span>Mohamed Khalil ENT Clinic · Cairo, Egypt</span></footer>
    </main>
  );
}
