import { geocodeAddress, sleep } from './geocode';
import { projectToSvg, AREA_FALLBACK } from './mapProjection';
import type { Salon } from '@/types';

export interface SalonPin {
  id: string;
  name: string;
  slug: string;
  area: string;
  x: number;
  y: number;
  usedFallback: boolean; // true = 実住所ではなくエリア代表座標を使用
}

/**
 * 全サロンの座標を解決してSVGピンの配列を返す。
 *
 * - Contentfulの address フィールドがあれば実際にジオコーディングして正確な位置を表示
 * - address が無い、またはジオコーディングに失敗した場合はエリアの代表座標にフォールバック
 * - ジオコーディング結果は30日間キャッシュされるため、毎回APIを叩くわけではない
 */
export async function resolveSalonPins(salons: Salon[]): Promise<SalonPin[]> {
  const pins: SalonPin[] = [];

  for (const salon of salons) {
    const { name, slug, address, area, areaSlug } = salon.fields;
    let point: { lat: number; lng: number } | null = null;
    let usedFallback = false;

    if (address && address.trim()) {
      point = await geocodeAddress(`${address}, New York, NY`);
      // Nominatim利用ポリシー: 1秒1リクエストまで。
      // キャッシュ済みの住所はネットワークを叩かないため実質ノーコスト。
      await sleep(1000);
    }

    if (!point) {
      const fallback = AREA_FALLBACK[areaSlug];
      if (fallback) {
        point = { lat: fallback.lat, lng: fallback.lng };
        usedFallback = true;
      }
    }

    if (!point) continue; // エリア情報も無い場合はマップに表示しない

    const { x, y } = projectToSvg(point.lat, point.lng);
    pins.push({ id: salon.sys.id, name, slug, area, x, y, usedFallback });
  }

  return pins;
}
