import type { Metadata } from 'next';
import Script from 'next/script';
import { Playfair_Display, Source_Sans_3, Special_Elite } from 'next/font/google';
import { WebsiteJsonLd, OrganizationJsonLd } from '@/components/seo/JsonLd';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
});

const specialElite = Special_Elite({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-special-elite',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'The Gridiron | CFB Social — College Football\'s Social Home',
    template: '%s | CFB Social',
  },
  description:
    'The Gridiron is the home for college football fans. Stake your claims, call your shots, debate rivalries, track the transfer portal, and build your dynasty across 653 schools.',
  keywords: [
    'college football', 'CFB', 'college football social media', 'college football forum',
    'CFB predictions', 'college football rivalry', 'transfer portal tracker',
    'college football community', 'CFB debate', 'college football takes',
  ],
  openGraph: {
    type: 'website',
    siteName: 'CFB Social',
    title: 'The Gridiron | CFB Social — College Football\'s Social Home',
    description: 'The home for college football fans. Stake claims, debate rivalries, track the transfer portal, and build your dynasty.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Gridiron | CFB Social',
    description: 'College football\'s social home. Stakes. Receipts. Dynasty.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${sourceSans.variable} ${specialElite.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('cfb-theme')==='dark')document.documentElement.classList.add('dark');if(localStorage.getItem('cfb-font-pref')==='modern')document.documentElement.setAttribute('data-font','modern')}catch(e){}})()`,
          }}
        />
        <WebsiteJsonLd />
        <OrganizationJsonLd />
      </head>
      <body className="min-h-screen bg-paper text-ink antialiased">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6K18TPL4B2"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-6K18TPL4B2');`}
        </Script>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){function u(){var m=document.querySelector('.masthead');var s=document.querySelector('.scores-ribbon');var mh=m?m.offsetHeight:80;var sh=s?s.offsetHeight:42;document.documentElement.style.setProperty('--masthead-h',mh+'px');document.documentElement.style.setProperty('--header-total-h',(mh+sh)+'px')}if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',u)}else{u()}window.addEventListener('resize',u)})()`,
          }}
        />
      </body>
    </html>
  );
}
