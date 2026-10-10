import { setRequestLocale, getTranslations } from 'next-intl/server';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { Link } from '@/i18n/navigation';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="absolute top-4 end-4">
        <LanguageSwitcher />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-brand mb-4">{t('common.appName')}</h1>
        <p className="text-xl mb-8">{t('common.poweredBy')}</p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-50 bg-brand text-white hover:bg-brand-dark h-10 px-4 py-2"
        >
          {t('auth.login')}
        </Link>
      </div>
    </main>
  );
}
