'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { Salon, Area } from '@/types';
import styles from './AdvancedSearch.module.css';

interface Service { fields: { slug: string; name: string } }

interface Props {
  salons: Salon[];
  areas: Area[];
  services: Service[];
}

export default function AdvancedSearch({ salons, areas, services }: Props) {
  const { t, lang } = useLanguage();
  const [areaVal,    setAreaVal]    = useState('');
  const [serviceVal, setServiceVal] = useState('');
  const [query,      setQuery]      = useState('');
  const [open,       setOpen]       = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOut(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onOut);
    return () => document.removeEventListener('mousedown', onOut);
  }, []);

  const results = useMemo(() => {
    const hasFilter = areaVal || serviceVal || query.trim();
    if (!hasFilter) return [];
    const q = query.trim().toLowerCase();
    return salons.filter(s => {
      const { name, area, category, tags } = s.fields;
      const areaOk    = !areaVal    || area === areaVal;
      const serviceOk = !serviceVal || category === serviceVal
        || tags.some(tag => tag.toLowerCase().includes(serviceVal.toLowerCase()));
      const textOk    = !q || name.toLowerCase().includes(q)
        || area.toLowerCase().includes(q)
        || tags.some(t => t.toLowerCase().includes(q));
      return areaOk && serviceOk && textOk;
    }).slice(0, 8);
  }, [salons, areaVal, serviceVal, query]);

  const showResults = open && results.length > 0;
  const showEmpty   = open && (areaVal || serviceVal || query.trim()) && results.length === 0;

  // Placeholder translations
  const ph = {
    area:    lang === 'ja' ? 'エリア' : lang === 'ko' ? '지역' : lang === 'zh-TW' ? '地區' : lang === 'zh-CN' ? '地区' : 'Area',
    service: lang === 'ja' ? 'サービス' : lang === 'ko' ? '서비스' : lang === 'zh-TW' ? '服務' : lang === 'zh-CN' ? '服务' : 'Service',
    text:    lang === 'ja' ? 'キーワード検索...' : lang === 'ko' ? '키워드 검색...' : lang === 'zh-TW' ? '關鍵字搜索...' : lang === 'zh-CN' ? '关键字搜索...' : 'Search keywords…',
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <div className={styles.fields}>
        {/* エリア */}
        <select
          className={styles.select}
          value={areaVal}
          onChange={e => { setAreaVal(e.target.value); setOpen(true); }}
          aria-label={ph.area}
        >
          <option value="">{ph.area}</option>
          {areas.map(a => (
            <option key={a.fields.slug} value={a.fields.name}>
              {a.fields.name}
            </option>
          ))}
        </select>

        <span className={styles.divider} />

        {/* サービス */}
        <select
          className={styles.select}
          value={serviceVal}
          onChange={e => { setServiceVal(e.target.value); setOpen(true); }}
          aria-label={ph.service}
        >
          <option value="">{ph.service}</option>
          {services.map(s => (
            <option key={s.fields.slug} value={s.fields.slug}>
              {s.fields.name}
            </option>
          ))}
        </select>

        <span className={styles.divider} />

        {/* フリーワード */}
        <div className={styles.textWrap}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="7" /><path d="M16.5 16.5l4 4" strokeLinecap="round" />
          </svg>
          <input
            className={styles.textInput}
            type="search"
            placeholder={ph.text}
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            autoComplete="off"
          />
          {(areaVal || serviceVal || query) && (
            <button className={styles.clear} onClick={() => { setAreaVal(''); setServiceVal(''); setQuery(''); setOpen(false); }} aria-label="Clear">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 検索結果ドロップダウン */}
      {showResults && (
        <ul className={styles.results} role="listbox">
          {results.map(s => (
            <li key={s.sys.id} role="option">
              <Link href={`/salon/${s.fields.slug}`} className={styles.result} onClick={() => setOpen(false)}>
                <span className={styles.rName}>{s.fields.name}</span>
                <span className={styles.rMeta}>{s.fields.area} · {s.fields.category}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {showEmpty && (
        <div className={styles.noResult}>No results found</div>
      )}
    </div>
  );
}
