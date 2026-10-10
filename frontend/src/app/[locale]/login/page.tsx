import { getTranslations, setRequestLocale } from 'next-intl/server';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { Button } from '@/components/ui/Button';

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-alt p-4">
      <div className="absolute top-4 end-4">
        <LanguageSwitcher />
      </div>
      
      <div className="w-full max-w-md bg-surface rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-brand">{t('common.appName')}</h1>
          <p className="text-sm text-gray-500 mt-2">{t('nav.clinical')}</p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{t('auth.loginTitle')}</h2>
          <p className="text-sm text-gray-500">{t('auth.loginSubtitle')}</p>
        </div>
        
        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('auth.email')}</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
              placeholder="doctor@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('auth.password')}</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
              placeholder="••••••••"
            />
          </div>
          
          <Button type="button" className="w-full">
            {t('auth.login')}
          </Button>
        </form>
      </div>
    </div>
  );
}
