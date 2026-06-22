'use client';
import { useEffect, useRef } from 'react';
import type { SalonPin } from '@/lib/salonPins';

interface Props {
  pins: SalonPin[];
  height?: string;
  activeAreaSlug?: string | null;
}

const SERVICE_LABEL: Record<string, string> = {
  nails:  'Gel Nails',
  lashes: 'Lashes / Lash Lift',
  both:   'Nails & Lashes',
};

export default function MapClient({ pins, height = '500px', activeAreaSlug }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    Promise.all([
      import('leaflet'),
      import('leaflet/dist/leaflet.css' as any),
    ]).then(([L]) => {
      if (!containerRef.current || mapRef.current) return;

      const map = L.default.map(containerRef.current, {
        center: [40.758, -73.985],
        zoom: 13,
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: false,
      });
      mapRef.current = map;

      L.default.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        { subdomains: 'abcd', maxZoom: 19 }
      ).addTo(map);

      L.default.control.attribution({ prefix: false })
        .addAttribution('© <a href="https://www.openstreetmap.org/copyright" style="color:#a08a68">OpenStreetMap</a> © <a href="https://carto.com/attributions" style="color:#a08a68">CARTO</a>')
        .addTo(map);

      pins.forEach((pin) => {
        const topTags = pin.tags.slice(0, 3).join(' · ');
        const serviceLabel = SERVICE_LABEL[pin.category] || pin.category;

        const marker = L.default.circleMarker([pin.lat, pin.lng], {
          radius: 7,
          fillColor: '#c4a882',
          color: '#1a2035',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.92,
        });

        marker.on('mouseover', () => marker.setStyle({ fillColor: '#e0d4bc', radius: 9 }));
        marker.on('mouseout', () => marker.setStyle({ fillColor: '#c4a882', radius: 7 }));

        marker.bindPopup(
          `<div style="font-family:'DM Sans',sans-serif;min-width:170px;line-height:1.55">
            <p style="font-family:'Cormorant Garamond',serif;font-size:1.05rem;color:#e0d4bc;margin:0 0 .15rem;font-weight:400">${pin.name}</p>
            <p style="font-size:.71rem;color:#c4a882;margin:0 0 .12rem;letter-spacing:.06em;font-weight:500">${serviceLabel}</p>
            <p style="font-size:.64rem;color:#a08a68;margin:0 0 .1rem">${topTags}</p>
            <p style="font-size:.63rem;color:#a08a68;margin:0 0 .65rem">${pin.area}</p>
            <a href="/salon/${pin.slug}" style="font-size:.64rem;letter-spacing:.1em;text-transform:uppercase;color:#c4a882;border-bottom:1px solid rgba(196,168,130,.5);text-decoration:none">View details →</a>
          </div>`,
          { className: 'glowlist-popup', maxWidth: 230 }
        );

        marker.addTo(map);
      });

      if (pins.length > 0) {
        const bounds = L.default.latLngBounds(pins.map((p) => [p.lat, p.lng] as [number, number]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // pinsが変わったとき（フィルター切り替え時）にマップを再フィット
  useEffect(() => {
    if (!mapRef.current || pins.length === 0) return;

    import('leaflet').then((L) => {
      if (!mapRef.current) return;
      const bounds = L.default.latLngBounds(pins.map((p) => [p.lat, p.lng] as [number, number]));
      mapRef.current.flyToBounds(bounds, { padding: [40, 40], maxZoom: 14, duration: 0.8 });
    });
  }, [pins]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={containerRef} style={{ height, width: '100%', background: '#1a2035' }} />;
}
