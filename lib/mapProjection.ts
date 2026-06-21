// ── NYC座標投影（緯度経度 → SVG座標）──
// 表示範囲: Manhattan (Battery〜86th St), Williamsburg/Brooklyn, Long Island City

export const NYC_BOUNDS = {
  latMin: 40.685,
  latMax: 40.80,
  lngMin: -74.02,
  lngMax: -73.92,
};

export const SVG_WIDTH = 360;
export const SVG_HEIGHT = 420;
const PADDING = 30;

export function projectToSvg(lat: number, lng: number): { x: number; y: number } {
  const x =
    PADDING +
    ((lng - NYC_BOUNDS.lngMin) / (NYC_BOUNDS.lngMax - NYC_BOUNDS.lngMin)) *
      (SVG_WIDTH - PADDING * 2);
  const y =
    PADDING +
    ((NYC_BOUNDS.latMax - lat) / (NYC_BOUNDS.latMax - NYC_BOUNDS.latMin)) *
      (SVG_HEIGHT - PADDING * 2);
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

// ── エリアごとの代表座標（Contentfulに住所未入力、またはジオコーディング失敗時のフォールバック）──
export const AREA_FALLBACK: Record<string, { lat: number; lng: number; label: string }> = {
  'upper-west-side':  { lat: 40.787, lng: -73.977, label: 'Upper West Side' },
  'upper-east-side':  { lat: 40.773, lng: -73.955, label: 'Upper East Side' },
  'midtown':          { lat: 40.754, lng: -73.984, label: 'Midtown' },
  'midtown-east':     { lat: 40.752, lng: -73.972, label: 'Midtown East / Murray Hill' },
  'k-town':           { lat: 40.748, lng: -73.989, label: 'K-Town' },
  'nomad':            { lat: 40.744, lng: -73.989, label: 'NoMad' },
  'chelsea':          { lat: 40.746, lng: -74.001, label: 'Chelsea / Flatiron' },
  'union-square':     { lat: 40.736, lng: -73.991, label: 'Union Square' },
  'east-village':     { lat: 40.727, lng: -73.984, label: 'East Village' },
  'soho':             { lat: 40.723, lng: -74.003, label: 'SoHo / West Village' },
  'lower-east-side':  { lat: 40.715, lng: -73.984, label: 'Lower East Side' },
  'tribeca':          { lat: 40.716, lng: -74.009, label: 'Tribeca' },
  'lower-manhattan':  { lat: 40.708, lng: -74.011, label: 'Lower Manhattan' },
  'williamsburg':     { lat: 40.714, lng: -73.957, label: 'Williamsburg' },
  'brooklyn':         { lat: 40.693, lng: -73.990, label: 'Brooklyn' },
  'long-island-city': { lat: 40.745, lng: -73.949, label: 'Long Island City' },
};
