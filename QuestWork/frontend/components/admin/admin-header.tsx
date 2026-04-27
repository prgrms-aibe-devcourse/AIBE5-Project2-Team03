"use client"

import { Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type AdminTab = "member" | "settlement-management" | "quest-management" | "statistics"

interface AdminHeaderProps {
  activeTab?: AdminTab
}

export function AdminHeader({ activeTab }: AdminHeaderProps) {
  const navItems: { label: string; href: string; tab: AdminTab }[] = [
    { label: "회원 관리", href: "/admin", tab: "member" },
    { label: "정산 관리", href: "/admin/settlement-management", tab: "settlement-management" },
    { label: "퀘스트 관리", href: "/admin/quest-management", tab: "quest-management" },
    { label: "통계", href: "/admin/statistics", tab: "statistics" },
  ]

  return (
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
          {navItems.map((item) => (
            <Link
              key={item.tab}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeTab === item.tab
                  ? "border-b-2 border-primary pb-0.5 text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">관리자</span>
        </div>
      </div>
    </header>
  )
}
