"use client"

import { Users, UserCheck, UserX, Shield, UserCog, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatsProps {
  stats: {
    total: number
    active: number
    inactive: number
    deleted: number
    admins: number
    managers: number
    users: number
  }
}

export function MemberStats({ stats }: StatsProps) {
  const statItems = [
    {
      label: "전체 회원",
      value: stats.total,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "활성화",
      value: stats.active,
      icon: UserCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "비활성화",
      value: stats.inactive,
      icon: UserX,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
    {
      label: "삭제됨",
      value: stats.deleted,
      icon: UserX,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
    },
    {
      label: "관리자",
      value: stats.admins,
      icon: Shield,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "매니저",
      value: stats.managers,
      icon: UserCog,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      label: "일반 사용자",
      value: stats.users,
      icon: User,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
    },
  ]

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {statItems.map((item) => (
        <Card key={item.label} className="border-border bg-card shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-3">
            <div className="flex flex-col items-center text-center space-y-1">
              <div className={`rounded-full p-2 ${item.bgColor} shadow-inner`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                <p className="text-xl font-bold tracking-tight text-foreground">{item.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
