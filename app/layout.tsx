import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import '@/styles/globals.css';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://glowlistnyc.com';
const GTM_ID = 'GTM-W98ZCH5Z';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1a2035',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Glowlist NYC — Curated Beauty Guide for New York',
    template: '%s | Glowlist NYC',
  },
  description:
    'A curated guide to Asian-inspired nails, lashes, and beauty spots in New York. Find places by style, vibe, language, and area.',
  openGraph: {
    type: 'website',
    siteName: 'Glowlist NYC',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>

        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { page_path: window.location.pathname });
            `}</Script>
          </>
        )}
      </head>

      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}