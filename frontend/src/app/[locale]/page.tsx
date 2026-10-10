import { setRequestLocale } from 'next-intl/server';
import WelcomeExperience from '@/components/landing/WelcomeExperience';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <WelcomeExperience locale={locale} />;
}
