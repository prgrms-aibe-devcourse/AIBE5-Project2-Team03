import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Noto_Sans_KR } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans-kr',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'QuestWork | 퀘스트 기반 개발자 협업 플랫폼',
    template: '%s | QuestWork',
  },
  description:
    'QuestWork는 기업의 문제를 퀘스트로 등록하고, 개발자가 해결 과정과 결과를 제안하는 협업형 개발 플랫폼입니다.',
  keywords: [
    'QuestWork',
    '개발자 플랫폼',
    '프리랜서',
    '퀘스트',
    '협업',
    '포트폴리오',
  ],
  authors: [{ name: 'QuestWork' }],
  creator: 'QuestWork',
  metadataBase: new URL('https://questwork.io'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'QuestWork',
    title: 'QuestWork | 퀘스트 기반 개발자 협업 플랫폼',
    description:
      '기업의 문제를 퀘스트로 등록하고, 개발자가 해결 과정과 결과를 제안하는 협업형 개발 플랫폼입니다.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuestWork',
    description: '퀘스트 기반 개발자 협업 플랫폼',
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
      <body
        className={`${notoSansKr.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
