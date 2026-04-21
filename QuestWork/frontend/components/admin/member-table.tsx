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
      case "ACTIVE": return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "INACTIVE": return "bg-rose-50 text-rose-700 border-rose-200"
      case "DELETED": return "bg-slate-50 text-slate-700 border-slate-200"
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
        <Card className="border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>회원 정보</TableHead>
                <TableHead>권한</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>가입일</TableHead>
                <TableHead>최근 접속</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                  <TableRow key={member.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-sm font-semibold text-primary">{member.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getRoleBadgeStyle(member.role)}>
                        {getRoleLabel(member.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeStyle(member.status)}>
                        {member.status === "ACTIVE" ? "활성화" : "비활성화"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{member.joinDate}</TableCell>
                    <TableCell className="text-muted-foreground">{member.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>회원 관리</DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          {/* 권한 변경 서브 메뉴 */}
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <Shield className="mr-2 h-4 w-4" /> 권한 변경
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => onRoleChange(member.id, "ADMIN")}>관리자</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onRoleChange(member.id, "MANAGER")}>매니저</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onRoleChange(member.id, "MEMBER")}>일반 회원</DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>

                          {/* 상태 변경 서브 메뉴 */}
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <CheckCircle className="mr-2 h-4 w-4" /> 상태 변경
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => onStatusChange(member.id, "ACTIVE")}>활성화</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onStatusChange(member.id, "INACTIVE")}>비활성화</DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>

                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteClick(member)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> 회원 삭제
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