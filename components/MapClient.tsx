'use client';
import { useEffect, useRef } from 'react';
import type { SalonPin } from '@/lib/salonPins';

interface Props {
  pins: SalonPin[];
  height?: string;
}

export default function MapClient({ pins, height = '500px' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Dynamic import — LeafletはSSRで使えないため必ずclientで動的import
    Promise.all([
      import('leaflet'),
      import('leaflet/dist/leaflet.css' as any),
    ]).then(([L]) => {
      if (!containerRef.current || mapRef.current) return;

      // NYC中心（Midtown）でズーム13
      const map = L.default.map(containerRef.current, {
        center: [40.758, -73.985],
        zoom: 13,
        scrollWheelZoom: false,      // ページスクロール中の誤操作防止
        zoomControl: true,
        attributionControl: false,   // カスタム位置に表示
      });

      mapRef.current = map;

      // ── CartoDB Dark Matter（無料・APIキー不要・ダークエレガント）──
      L.default.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(map);

      // カスタムアトリビューション（右下）
      L.default.control.attribution({ prefix: false })
        .addAttribution('© <a href="https://www.openstreetmap.org/copyright" style="color:#a08a68">OpenStreetMap</a> © <a href="https://carto.com/attributions" style="color:#a08a68">CARTO</a>')
        .addTo(map);

      // ── カスタムサロンピン ──
      pins.forEach((pin) => {
        // circleMarker で画像不要のピン
        const marker = L.default.circleMarker([pin.lat, pin.lng], {
          radius: 7,
          fillColor: '#c4a882',     // --beige-s
          color: '#1a2035',          // --navy
          weight: 2,
          opacity: 1,
          fillOpacity: 0.92,
        });

        // ホバーエフェクト
        marker.on('mouseover', function () {
          marker.setStyle({ fillColor: '#e0d4bc', radius: 9 });
        });
        marker.on('mouseout', function () {
          marker.setStyle({ fillColor: '#c4a882', radius: 7 });
        });

        // ポップアップ（サロン名・エリア・リンク）
        marker.bindPopup(
          `<div style="font-family:'DM Sans',sans-serif;min-width:140px;line-height:1.5">
            <p style="font-family:'Cormorant Garamond',serif;font-size:1rem;color:#e0d4bc;margin:0 0 .2rem;font-weight:400">${pin.name}</p>
            <p style="font-size:.72rem;color:#a08a68;margin:0 0 .6rem;letter-spacing:.04em">${pin.area}</p>
            <a href="/salon/${pin.slug}" style="font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:#c4a882;border-bottom:1px solid #c4a882;text-decoration:none">View details →</a>
          </div>`,
          {
            className: 'glowlist-popup',
            maxWidth: 200,
          }
        );

        marker.addTo(map);
      });

      // 全ピンが収まるようにフィット（ピンが少なくない場合）
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

  return (
    <div
      ref={containerRef}
      style={{ height, width: '100%', background: '#1a2035' }}
    />
  );
}
