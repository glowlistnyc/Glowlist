import { geocodeAddress, sleep } from './geocode';
import { projectToSvg, AREA_FALLBACK } from './mapProjection';
import type { Salon } from '@/types';

export interface SalonPin {
  id: string;
  name: string;
  slug: string;
  area: string;
  lat: number;   // 実際の緯度（Leaflet用）
  lng: number;   // 実際の経度（Leaflet用）
  x: number;     // SVG座標（後方互換）
  y: number;     // SVG座標（後方互換）
  usedFallback: boolean;
}

export async function resolveSalonPins(salons: Salon[]): Promise<SalonPin[]> {
  const pins: SalonPin[] = [];

  for (const salon of salons) {
    const { name, slug, address, area, areaSlug } = salon.fields;
    let point: { lat: number; lng: number } | null = null;
    let usedFallback = false;

    if (address && address.trim()) {
      point = await geocodeAddress(`${address}, New York, NY`);
      await sleep(1000);
    }

    if (!point) {
      const fallback = AREA_FALLBACK[areaSlug];
      if (fallback) {
        point = { lat: fallback.lat, lng: fallback.lng };
        usedFallback = true;
      }
    }

    if (!point) continue;

    const { x, y } = projectToSvg(point.lat, point.lng);
    pins.push({
      id: salon.sys.id,
      name, slug, area,
      lat: point.lat,
      lng: point.lng,
      x, y,
      usedFallback,
    });
  }

  return pins;
}
