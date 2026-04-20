"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { MemberTable } from "@/components/admin/member-table"
import { MemberStats } from "@/components/admin/member-stats"
import { SearchFilter } from "@/components/admin/search-filter"

export type Role = "ADMIN" | "MEMBER" | "MANAGER" // 💡 대문자로 변경
export type Status = "ACTIVE" | "INACTIVE" | "DELETED"

export interface Member {
  id: string
  name: string
  email: string
  role: Role
  status: Status
  joinDate: string
  lastLogin: string
}

export default function AdminPage() {
  // 초기 상태는 빈 배열로 설정합니다.
  const [members, setMembers] = useState<Member[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<Role | "전체">("전체")
  const [statusFilter, setStatusFilter] = useState<Status | "전체">("전체")

  // 1. 컴포넌트 마운트 시 백엔드에서 회원 목록 로드
  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/users?page=0&size=100")
      if (!response.ok) throw new Error("데이터를 가져오는데 실패했습니다.")

      const data = await response.json() // Page<AdminUserResponseDto> 수신

      // 백엔드 DTO(id, nickname, status 등)를 리액트 Member 인터페이스로 변환
      const mappedMembers: Member[] = data.content.map((user: any) => ({
        id: user.id.toString(),
        name: user.nickname,
        email: user.email,
        // ✅ 서버 DTO의 roleName을 사용합니다.
        role: user.roleName || "MEMBER",
        status: user.status || "ACTIVE",
        joinDate: user.createdAt ? user.createdAt.split("T")[0] : "-",
        lastLogin: "-",
      }))

      setMembers(mappedMembers)
    } catch (error) {
      console.error("회원 로드 중 오류 발생:", error)
    }
  }

  // 2. 상태 변경 (활성화/비활성화) 백엔드 연동

  const handleStatusChange = async (memberId: string, newLabel: Status) => {
    // 백엔드 Status enum과 일치
    const backendStatus = newLabel;

    try {
      const response = await fetch(`http://localhost:8000/api/admin/users/${memberId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        // 핵심: 객체 {status: ...}가 아니라 "ACTIVE"라는 문자열 자체를 JSON화해서 보냄
        body: JSON.stringify(backendStatus),
      });

      if (response.ok) {
        // 2. 서버 변경 성공 시 화면(UI)의 멤버 상태 업데이트
        setMembers((prev) =>
            prev.map((member) =>
                member.id === memberId ? { ...member, status: newLabel } : member
            )
        );
        console.log(`유저 ${memberId}의 상태가 ${newLabel}로 변경되었습니다.`);
      } else {
        alert("상태 변경에 실패했습니다. 서버 로그를 확인하세요.");
      }
    } catch (error) {
      console.error("통신 에러:", error);
      alert("서버와 연결할 수 없습니다.");
    }
  };

  // 3. 권한 변경 백엔드 연동
  const handleRoleChange = async (memberId: string, newRole: Role) => {
    // 💡 토글 방식이 아니라, 드롭다운에서 선택한 newRole을 그대로 사용해야 합니다.
    try {
      const response = await fetch(`http://localhost:8000/api/admin/users/${memberId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleName: newRole }), // 선택된 권한 그대로 전달
      });

      if (response.ok) {
        setMembers((prev) =>
            prev.map((member) =>
                member.id === memberId ? { ...member, role: newRole } : member
            )
        );
      } else {
        alert("권한 변경 실패");
      }
    } catch (error) {
      console.error("통신 에러:", error);
    }
  }
  // 4. 회원 소프트 삭제 (DELETED 상태로 변경)
  const handleDeleteMember = async (memberId: string) => {
    if(confirm("정말로 이 회원을 삭제하시겠습니까?")) {
      await handleStatusChange(memberId, "DELETED");
    }
  }

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "전체" || member.role === roleFilter
    const matchesStatus = statusFilter === "전체" || member.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  // AdminPage.tsx 내부의 stats 부분 수정
  const stats = {
    total: members.length,
    active: members.filter((m) => m.status === "ACTIVE").length,
    inactive: members.filter((m) => m.status === "INACTIVE").length,
    deleted: members.filter((m) => m.status === "DELETED").length,

    // 💡 아래 필드명과 비교 값을 수정합니다.
    admins: members.filter((m) => m.role === "ADMIN").length,
    managers: members.filter((m) => m.role === "MANAGER").length,
    users: members.filter((m) => m.role === "MEMBER").length,
  }

  return (
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">회원 관리</h1>
            <p className="mt-2 text-muted-foreground">
              실시간 데이터베이스 연동 중입니다.
            </p>
          </div>

          <MemberStats stats={stats} />

          <SearchFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              roleFilter={roleFilter}
              onRoleFilterChange={setRoleFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
          />

          <MemberTable
              members={filteredMembers}
              onRoleChange={handleRoleChange}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteMember}
          />

        </main>
      </div>
  )
}