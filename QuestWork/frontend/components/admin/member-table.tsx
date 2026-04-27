"use client"

import { useState } from "react"
import { MoreHorizontal, Trash2, Shield, UserCog, User, CheckCircle, XCircle } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent } from "@/components/ui/card"
// AdminPage에서 정의한 타입을 가져옵니다.
import type { Member, Role, Status } from "@/app/admin/page"

interface MemberTableProps {
  members: Member[]
  onRoleChange: (memberId: string, newRole: Role) => void
  onStatusChange: (memberId: string, newStatus: Status) => void
  onDelete: (memberId: string) => void
}

export function MemberTable({
                              members,
                              onRoleChange,
                              onStatusChange,
                              onDelete,
                            }: MemberTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null)

  const handleDeleteClick = (member: Member) => {
    setMemberToDelete(member)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (memberToDelete) {
      onDelete(memberToDelete.id)
    }
    setDeleteDialogOpen(false)
    setMemberToDelete(null)
  }

  // UI 스타일 헬퍼 함수들
  const getRoleBadgeStyle = (role: Role) => {
    switch (role.toUpperCase()) {
      case "ADMIN": return "bg-purple-50 text-purple-700 border-purple-200"
      case "MANAGER": return "bg-amber-50 text-amber-700 border-amber-200"
      case "MEMBER": return "bg-blue-50 text-blue-700 border-blue-200"
      default: return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const getStatusBadgeStyle = (status: Status) => {
    switch (status.toUpperCase()) {
      case "ACTIVE": return "bg-emerald-50 text-emerald-700 border-emerald-200" // 활성화
      case "INACTIVE": return "bg-slate-50 text-slate-700 border-slate-200"      // 비활성화
      case "DELETED": return "bg-rose-50 text-rose-700 border-rose-200"         // ✅ 삭제됨 (빨간색 계열)
      default: return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const getRoleLabel = (role: Role) => {
    switch (role.toUpperCase()) {
      case "ADMIN": return "관리자"
      case "MANAGER": return "매니저"   // ✅ MANAGER가 매니저로 나오게 수정
      case "MEMBER": return "회원"     // ✅ MEMBER가 회원으로 나오게 수정
      default: return role
    }
  }

  if (members.length === 0) {
    return (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 rounded-full bg-muted p-4">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium">검색 결과가 없습니다</p>
          </CardContent>
        </Card>
    )
  }

  return (
      <>
        <Card className="border-border overflow-hidden bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 border-b border-border">
                {/* 넓이를 재조정했습니다 */}
                <TableHead className="w-[350px] py-3 pl-6 font-semibold">회원 정보</TableHead>
                <TableHead className="w-[120px] text-center font-semibold">권한</TableHead>
                <TableHead className="w-[120px] text-center font-semibold">상태</TableHead>
                <TableHead className="w-[180px] text-center font-semibold">가입일</TableHead>
                {/* 최근 접속 컬럼 삭제 */}
                <TableHead className="w-[80px] pr-6 text-right font-semibold">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                  <TableRow key={member.id} className="hover:bg-muted/20 transition-colors border-b border-border last:border-0">
                    <TableCell className="py-3 pl-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 shadow-sm">
                          <span className="text-sm font-bold text-primary">{member.name.charAt(0)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <Badge variant="outline" className={`px-2.5 py-0.5 font-medium ${getRoleBadgeStyle(member.role)}`}>
                        {getRoleLabel(member.role)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <Badge variant="outline" className={`px-2.5 py-0.5 font-medium ${getStatusBadgeStyle(member.status)}`}>
                        {member.status === "ACTIVE" && "활성화"}
                        {member.status === "INACTIVE" && "비활성화"}
                        {member.status === "DELETED" && "삭제됨"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-center text-sm text-muted-foreground">{member.joinDate}</TableCell>

                    <TableCell className="py-3 pr-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted">
                            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        {/* 포털을 제거하거나 구조를 단순화하여 이벤트 오류 방지 */}
                        <DropdownMenuContent align="end" className="w-56 bg-white border border-border shadow-lg p-1.5 z-[60]">
                          <DropdownMenuLabel className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">회원 관리</DropdownMenuLabel>
                          <DropdownMenuSeparator className="my-1" />

                          {/* 권한 변경: onClick이 확실히 작동하도록 MenuItem 구조 확인 */}
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="cursor-pointer px-3 py-2.5 rounded-md focus:bg-primary focus:text-primary-foreground">
                              <Shield className="mr-3 h-4 w-4" />
                              <span className="font-medium">권한 변경</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent className="bg-white border border-border shadow-md min-w-[140px] p-1.5">
                                {["ADMIN", "MANAGER", "MEMBER"].map((role) => (
                                    <DropdownMenuItem
                                        key={role}
                                        className="cursor-pointer px-3 py-2 rounded-md focus:bg-primary focus:text-primary-foreground font-medium"
                                        onClick={(e) => {
                                          e.stopPropagation(); // 이벤트 전파 방지 추가
                                          onRoleChange(member.id, role as Role);
                                        }}
                                    >
                                      {getRoleLabel(role as Role)}
                                    </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>

                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="cursor-pointer px-3 py-2.5 rounded-md focus:bg-primary focus:text-primary-foreground">
                              <CheckCircle className="mr-3 h-4 w-4" />
                              <span className="font-medium">상태 변경</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent className="bg-white border border-border shadow-md min-w-[140px] p-1.5">
                                <DropdownMenuItem className="cursor-pointer px-3 py-2 rounded-md focus:bg-primary focus:text-primary-foreground" onClick={() => onStatusChange(member.id, "ACTIVE")}>활성화</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer px-3 py-2 rounded-md focus:bg-primary focus:text-primary-foreground" onClick={() => onStatusChange(member.id, "INACTIVE")}>비활성화</DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>

                          <DropdownMenuSeparator className="my-1" />
                          <DropdownMenuItem
                              onClick={() => handleDeleteClick(member)}
                              className="text-destructive cursor-pointer px-3 py-2.5 rounded-md focus:bg-destructive focus:text-destructive-foreground font-medium"
                          >
                            <Trash2 className="mr-3 h-4 w-4" />
                            <span>회원 삭제</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        {/* 삭제 확인 모달 */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>회원을 삭제하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>
                {memberToDelete?.name} 회원을 삭제합니다. 이 작업은 되돌릴 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">삭제</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
  )
}
