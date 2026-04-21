import type { Metadata, Viewport } from 'next'
import { Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from './providers'
import './globals.css'

/**
 * Pretendard is loaded via CDN — best Korean + Latin coverage.
 * Geist Mono is used for code / monospace contexts.
 */
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'QuestWork — 퀘스트 기반 프리랜서 마켓플레이스',
    template: '%s | QuestWork',
  },
  description:
    '기업이 문제를 퀘스트로 등록하면 프리랜서가 솔루션을 제출하고 보상을 받는 경쟁형 프리랜서 플랫폼입니다.',
  keywords: ['프리랜서', '퀘스트', '마켓플레이스', '개발', '외주', 'QuestWork'],
  authors: [{ name: 'QuestWork' }],
  creator: 'QuestWork',
  metadataBase: new URL('https://questwork.io'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'QuestWork',
    title: 'QuestWork — 퀘스트 기반 프리랜서 마켓플레이스',
    description:
      '기업이 문제를 퀘스트로 등록하면 프리랜서가 솔루션을 제출하고 보상을 받는 경쟁형 프리랜서 플랫폼입니다.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuestWork',
    description: '퀘스트 기반 경쟁형 프리랜서 플랫폼',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#6D28D9',
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className="bg-background">
      {/* Pretendard CDN — supports Korean + Latin */}
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className={`${geistMono.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
