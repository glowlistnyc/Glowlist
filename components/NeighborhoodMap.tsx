'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { SalonPin } from '@/lib/salonPins';
import styles from './NeighborhoodMap.module.css';

interface Props { pins: SalonPin[] }

export default function NeighborhoodMap({ pins }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const hoveredPin = pins.find((p) => p.id === hovered);

  return (
    <div className={styles.wrap}>
      <div className={styles.mapBox}>
        <svg viewBox="0 0 360 420" className={styles.svg} role="img" aria-label="Map of Glowlist NYC salon locations">
          {/* ── Manhattan（実座標を投影した簡略形）── */}
          <path
            d="M147,30
               C190,28 245,28 261,30
               C262,55 250,90 237,124
               C224,158 200,175 189,187
               C178,200 163,218 156,234
               C148,252 140,266 135,280
               C128,296 112,305 105,312
               C99,318 53,325 51,312
               C49,300 55,287 57,280
               C61,266 60,253 63,234
               C66,217 78,200 84,187
               C90,174 78,156 100,124
               C115,99 100,72 123,30
               C130,18 140,28 147,30 Z"
            className={styles.borough}
          />
          {/* ── Brooklyn（簡略形）── */}
          <path
            d="M218,300 C235,288 260,283 280,290
               C300,297 312,318 310,340
               C308,362 290,382 268,392
               C248,400 228,396 218,382
               C210,368 212,350 213,335
               C214,322 213,310 218,300 Z"
            className={styles.borough}
          />
          {/* ── Queens / Long Island City（簡略形）── */}
          <path
            d="M225,195 C240,188 262,190 275,200
               C285,208 286,222 276,229
               C264,237 246,235 233,226
               C223,219 218,204 225,195 Z"
            className={styles.borough}
          />

          <text x="155" y="170" className={styles.boroughLabel}>MANHATTAN</text>
          <text x="240" y="345" className={styles.boroughLabel}>BROOKLYN</text>
          <text x="232" y="213" className={styles.boroughLabelSmall}>QUEENS</text>

          {/* ── Salon pins（実座標 or エリア代表座標）── */}
          {pins.map((pin) => {
            const isHovered = hovered === pin.id;
            return (
              <g
                key={pin.id}
                onMouseEnter={() => setHovered(pin.id)}
                onMouseLeave={() => setHovered(null)}
                className={styles.dotGroup}
              >
                <Link href={`/salon/${pin.slug}`} aria-label={pin.name}>
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r={isHovered ? 6 : 4.5}
                    className={`${styles.dot} ${isHovered ? styles.dotHover : ''}`}
                  />
                  {isHovered && (
                    <circle cx={pin.x} cy={pin.y} r="4.5" className={styles.dotPulse} />
                  )}
                </Link>
              </g>
            );
          })}

          {/* ── Tooltip ── */}
          {hoveredPin && (
            <g>
              <rect
                x={Math.min(Math.max(hoveredPin.x - 60, 4), 360 - 124)}
                y={Math.max(hoveredPin.y - 40, 4)}
                width="120"
                height="30"
                rx="2"
                className={styles.tooltipBg}
              />
              <text
                x={Math.min(Math.max(hoveredPin.x, 64), 360 - 64)}
                y={Math.max(hoveredPin.y - 25, 19)}
                className={styles.tooltipText}
                textAnchor="middle"
              >
                {hoveredPin.name}
              </text>
              <text
                x={Math.min(Math.max(hoveredPin.x, 64), 360 - 64)}
                y={Math.max(hoveredPin.y - 14, 30)}
                className={styles.tooltipSub}
                textAnchor="middle"
              >
                {hoveredPin.area}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* ── Legend ── */}
      <div className={styles.legend}>
        <p className={styles.legendTitle}>{pins.length} spots on the map</p>
        <div className={styles.legendList}>
          {pins
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((pin) => (
              <Link
                key={pin.id}
                href={`/salon/${pin.slug}`}
                className={styles.legendItem}
                onMouseEnter={() => setHovered(pin.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className={styles.legendDot} />
                <span className={styles.legendLabel}>{pin.name}</span>
                <span className={styles.legendArea}>{pin.area}</span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
