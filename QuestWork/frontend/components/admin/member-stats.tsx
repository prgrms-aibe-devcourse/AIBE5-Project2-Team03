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
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statItems.map((item) => (
        <Card key={item.label} className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${item.bgColor}`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
