"use client"

import { useState, useEffect, useMemo } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronDown, ChevronRight, Search, Trash2, BanIcon } from "lucide-react"

type QuestStatus = "OPEN" | "CLOSED" | "IN_PROCESS" | "FINISHED" | "PICKED" | "CANCELED" | "COMPLETED"

const STATUS_LABEL: Record<QuestStatus, string> = {
  OPEN: "모집 중",
  CLOSED: "모집 완료",
  IN_PROCESS: "진행 중",
  FINISHED: "종료",
  PICKED: "신청 완료",
  CANCELED: "취소됨",
  COMPLETED: "정산 완료",
}

const STATUS_COLOR: Record<QuestStatus, string> = {
  OPEN: "bg-green-100 text-green-800",
  CLOSED: "bg-blue-100 text-blue-800",
  IN_PROCESS: "bg-yellow-100 text-yellow-800",
  FINISHED: "bg-gray-100 text-gray-800",
  PICKED: "bg-purple-100 text-purple-800",
  CANCELED: "bg-red-100 text-red-800",
  COMPLETED: "bg-indigo-100 text-indigo-800",
}

interface AdminQuest {
  questId: number
  title: string
  status: QuestStatus
  rewardAmount: number | null
  deadline: string
  createdAt: string
  managerProfileId: number
  managerUserId: number
  managerName: string | null
  companyName: string | null
}

interface ManagerGroup {
  managerProfileId: number
  managerUserId: number
  managerName: string
  companyName: string
  quests: AdminQuest[]
}

export default function AdminQuestManagementPage() {
  const [quests, setQuests] = useState<AdminQuest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedManagers, setExpandedManagers] = useState<Set<number>>(new Set())

  useEffect(() => {
    fetchQuests()
  }, [])

  const fetchQuests = async () => {
    setLoading(true)
    try {
      const res = await fetch("http://localhost:8000/api/admin/quests")
      if (!res.ok) throw new Error("퀘스트 목록 로드 실패")
      const data: AdminQuest[] = await res.json()
      setQuests(data)
      // 초기 전체 펼침
      const ids = new Set<number>(data.map((q) => q.managerProfileId))
      setExpandedManagers(ids)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // 매니저별 그룹핑
  const managerGroups = useMemo<ManagerGroup[]>(() => {
    const map = new Map<number, ManagerGroup>()
    quests.forEach((q) => {
      if (!map.has(q.managerProfileId)) {
        map.set(q.managerProfileId, {
          managerProfileId: q.managerProfileId,
          managerUserId: q.managerUserId,
          managerName: q.managerName ?? "이름 없음",
          companyName: q.companyName ?? "-",
          quests: [],
        })
      }
      map.get(q.managerProfileId)!.quests.push(q)
    })
    return Array.from(map.values())
  }, [quests])

  // 검색 필터
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return managerGroups
    const q = searchQuery.toLowerCase()
    return managerGroups
      .map((group) => ({
        ...group,
        quests: group.quests.filter(
          (quest) =>
            quest.title.toLowerCase().includes(q) ||
            group.managerName.toLowerCase().includes(q) ||
            (group.companyName && group.companyName.toLowerCase().includes(q))
        ),
      }))
      .filter((group) => group.quests.length > 0)
  }, [managerGroups, searchQuery])

  const toggleManager = (id: number) => {
    setExpandedManagers((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleDeactivate = async (questId: number) => {
    if (!confirm("이 퀘스트를 비활성화(CANCELED) 하시겠습니까?")) return
    try {
      const res = await fetch(`http://localhost:8000/api/admin/quests/${questId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify("CANCELED"),
      })
      if (!res.ok) throw new Error()
      setQuests((prev) =>
        prev.map((q) => (q.questId === questId ? { ...q, status: "CANCELED" } : q))
      )
    } catch {
      alert("비활성화 실패. 서버 로그를 확인하세요.")
    }
  }

  const handleDelete = async (questId: number) => {
    if (!confirm("이 퀘스트를 완전히 삭제하시겠습니까? 되돌릴 수 없습니다.")) return
    try {
      const res = await fetch(`http://localhost:8000/api/admin/quests/${questId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error()
      setQuests((prev) => prev.filter((q) => q.questId !== questId))
    } catch {
      alert("삭제 실패. 서버 로그를 확인하세요.")
    }
  }

  const totalCount = quests.length
  const canceledCount = quests.filter((q) => q.status === "CANCELED").length

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader activeTab="quest-management" />

      <main className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">퀘스트 관리</h1>
          <p className="text-sm text-muted-foreground mt-1">
            전체 {totalCount}개 · 비활성 {canceledCount}개
          </p>
        </div>

        {/* 검색 */}
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="퀘스트명 또는 매니저 검색..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 퀘스트 목록 (매니저별 그룹) */}
        {loading ? (
          <p className="text-center text-muted-foreground py-20">불러오는 중...</p>
        ) : filteredGroups.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">퀘스트가 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {filteredGroups.map((group) => (
              <div key={group.managerProfileId} className="rounded-lg border border-border bg-card overflow-hidden">
                {/* 매니저 헤더 */}
                <button
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
                  onClick={() => toggleManager(group.managerProfileId)}
                >
                  <div className="flex items-center gap-3">
                    {expandedManagers.has(group.managerProfileId) ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div className="text-left">
                      <p className="font-semibold text-foreground">
                        {group.managerName}
                        {group.companyName && group.companyName !== "-" && (
                          <span className="ml-2 text-sm text-muted-foreground font-normal">
                            ({group.companyName})
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        유저 ID: {group.managerUserId} · 퀘스트 {group.quests.length}개
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {group.quests.length}개
                  </Badge>
                </button>

                {/* 퀘스트 테이블 */}
                {expandedManagers.has(group.managerProfileId) && (
                  <div className="border-t border-border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/20">
                          <TableHead className="w-12 text-center">ID</TableHead>
                          <TableHead>퀘스트명</TableHead>
                          <TableHead className="w-28 text-center">상태</TableHead>
                          <TableHead className="w-32 text-right">보상금</TableHead>
                          <TableHead className="w-40 text-center">마감일</TableHead>
                          <TableHead className="w-40 text-center">등록일</TableHead>
                          <TableHead className="w-28 text-center">관리</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.quests.map((quest) => (
                          <TableRow key={quest.questId} className={quest.status === "CANCELED" ? "opacity-50" : ""}>
                            <TableCell className="text-center text-xs text-muted-foreground">
                              {quest.questId}
                            </TableCell>
                            <TableCell className="font-medium">{quest.title}</TableCell>
                            <TableCell className="text-center">
                              <span
                                className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[quest.status] ?? "bg-gray-100 text-gray-800"}`}
                              >
                                {STATUS_LABEL[quest.status] ?? quest.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {quest.rewardAmount != null
                                ? `₩${quest.rewardAmount.toLocaleString()}`
                                : "-"}
                            </TableCell>
                            <TableCell className="text-center text-sm text-muted-foreground">
                              {quest.deadline ? quest.deadline.split(" ")[0] : "-"}
                            </TableCell>
                            <TableCell className="text-center text-sm text-muted-foreground">
                              {quest.createdAt ? quest.createdAt.split(" ")[0] : "-"}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2 text-xs"
                                  disabled={quest.status === "CANCELED"}
                                  onClick={() => handleDeactivate(quest.questId)}
                                  title="비활성화"
                                >
                                  <BanIcon className="h-3 w-3 mr-1" />
                                  비활성화
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="h-7 px-2 text-xs"
                                  onClick={() => handleDelete(quest.questId)}
                                  title="삭제"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
