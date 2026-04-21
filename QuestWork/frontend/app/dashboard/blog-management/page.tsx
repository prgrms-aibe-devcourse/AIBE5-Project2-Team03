'use client'

import Link from 'next/link'
import { GlobalNav } from '@/components/global-nav'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { StatCard } from '@/components/dashboard/stat-card'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const POSTS = [
  {
    id: '1',
    title: 'Next.js App Router에서 데이터 흐름 정리하기',
    status: '게시됨',
    date: '2024-04-10',
    views: '1,240',
  },
  {
    id: '2',
    title: 'React 성능 최적화 체크리스트',
    status: '게시됨',
    date: '2024-04-05',
    views: '860',
  },
  {
    id: '3',
    title: 'TypeScript 타입 설계 노트',
    status: '초안',
    date: '2024-03-28',
    views: '0',
  },
  {
    id: '4',
    title: 'Spring Boot API 문서화 경험',
    status: '게시됨',
    date: '2024-03-20',
    views: '510',
  },
]

export default function BlogManagementPage() {
  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">Blog Management</p>
              <h1 className="mt-1 text-3xl font-bold text-foreground">
                내가 쓴 글 관리
              </h1>
              <p className="mt-2 text-foreground-muted">
                포트폴리오에 연결되는 기술 글과 초안을 관리하세요.
              </p>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary-hover">
              새 글 작성
            </Button>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <StatCard label="전체 글" value="4개" subtext="게시 3개 · 초안 1개" />
            <StatCard label="이번 달 조회수" value="2,610" subtext="지난달보다 18% 증가" />
            <StatCard label="초안" value="1개" subtext="마무리가 필요한 글" />
          </div>

          <Card className="border border-border">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-foreground">글 목록</h2>

              <div className="mt-4 space-y-3">
                {POSTS.map((post) => (
                  <div
                    key={post.id}
                    className="flex flex-col gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-surface md:flex-row md:items-center md:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {post.title}
                        </h3>
                        <Badge
                          className={
                            post.status === '게시됨'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-surface-raised text-foreground-muted'
                          }
                        >
                          {post.status}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-foreground-muted">
                        {post.date} · 조회수 {post.views}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/blog/${post.id}`}>보기</Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        수정
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}
