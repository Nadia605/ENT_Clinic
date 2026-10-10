'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="flex items-center gap-2 bg-surface border border-gray-200 rounded-md p-1">
      <button
        onClick={() => switchLocale('en')}
        disabled={isPending}
        className={cn(
          "px-2 py-1 text-sm rounded-sm transition-colors",
          locale === 'en' ? "bg-brand text-white" : "text-gray-600 hover:bg-gray-100"
        )}
      >
        English
      </button>
      <span className="text-gray-300">|</span>
      <button
        onClick={() => switchLocale('ar')}
        disabled={isPending}
        className={cn(
          "px-2 py-1 text-sm rounded-sm transition-colors",
          locale === 'ar' ? "bg-brand text-white" : "text-gray-600 hover:bg-gray-100"
        )}
      >
        العربية
      </button>
    </div>
  );
}
