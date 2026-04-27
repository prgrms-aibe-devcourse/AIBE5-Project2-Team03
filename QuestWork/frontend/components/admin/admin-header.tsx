"use client"

import { Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function AdminHeader() {
  return (
      // bg-white를 사용하고, 뒤에 !를 붙여서(important) 강제로 불투명하게 만들었습니다.
      // 만약 다크모드라면 bg-slate-950 같은 어두운 색을 써보세요.
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-2xl px-1 py-1 transition-opacity hover:opacity-90"
            aria-label="QuestWork home"
          >
            <Image
              src="/logos/questworkLogo.png"
              alt="QuestWork"
              width={44}
              height={44}
              priority
              className="h-11 w-11 rounded-xl object-cover shadow-[0_10px_24px_-16px_rgba(109,40,217,0.75)]"
            />
            <div className="flex flex-col justify-center">
              <span className="text-lg font-bold leading-none tracking-[-0.03em] text-foreground sm:text-xl">
                QuestWork
              </span>
              <span className="mt-1 hidden text-[11px] font-medium uppercase tracking-[0.24em] text-foreground-muted sm:block">
                Developer Marketplace
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
                href="/admin"
                className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              회원 관리
            </Link>
            <Link
                href="/admin/settlement-management"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              정산 관리
            </Link>
            <Link
                href="#"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              퀘스트 관리
            </Link>
            <Link
                href="/admin/statistics"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              통계
            </Link>
          </nav>

          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">관리자</span>
          </div>
        </div>
      </header>
  )
}
