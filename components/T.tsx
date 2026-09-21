// T.tsx — サーバーコンポーネント内でも使える翻訳ヘルパー（クライアント側で言語を反映）
'use client';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { translations } from '@/lib/i18n/translations';

// deep get: "sections.spotsNYC" → translations[lang].sections.spotsNYC
function get(obj: Record<string, unknown>, path: string): string {
  return path.split('.').reduce((o: unknown, k: string) =>
    (o && typeof o === 'object' ? (o as Record<string,unknown>)[k] : undefined), obj) as string ?? path;
}

export default function T({ k }: { k: string }) {
  const { lang } = useLanguage();
  return <>{get(translations[lang] as unknown as Record<string,unknown>, k)}</>;
}
