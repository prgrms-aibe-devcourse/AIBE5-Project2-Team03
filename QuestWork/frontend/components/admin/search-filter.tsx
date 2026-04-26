"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Role, Status } from "@/app/admin/page"

interface SearchFilterProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  roleFilter: Role | "전체"
  onRoleFilterChange: (value: Role | "전체") => void
  statusFilter: Status | "전체"
  onStatusFilterChange: (value: Status | "전체") => void
}

export function SearchFilter({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
}: SearchFilterProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="이름 또는 이메일로 검색..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-3">
        <Select
          value={roleFilter}
          onValueChange={(value) => onRoleFilterChange(value as Role | "전체")}
        >
          <SelectTrigger className="w-[140px] bg-card border-border">
            <SelectValue placeholder="권한 필터" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border shadow-md">
            <SelectItem value="전체">전체 권한</SelectItem>
            <SelectItem value="ADMIN">관리자</SelectItem>
            <SelectItem value="MANAGER">매니저</SelectItem>
            <SelectItem value="MEMBER">일반 사용자</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(value) => onStatusFilterChange(value as Status | "전체")}
        >
          <SelectTrigger className="w-[140px] bg-card border-border">
            <SelectValue placeholder="상태 필터" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border shadow-md">
            <SelectItem value="전체">전체 상태</SelectItem>
            <SelectItem value="ACTIVE">활성화</SelectItem>
            <SelectItem value="INACTIVE">비활성화</SelectItem>
            <SelectItem value="DELETED">삭제됨</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
