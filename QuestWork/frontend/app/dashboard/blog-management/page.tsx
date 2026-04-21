'use client'

import Link from 'next/link'
import { GlobalNav } from '@/components/global-nav'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { StatCard } from '@/components/dashboard/stat-card'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getManagedBlogPosts } from '@/lib/mock-blog-data'

const POSTS = getManagedBlogPosts('kim-dev')

const totalPosts = POSTS.length
const publishedPosts = POSTS.filter((post) => post.status === '게시됨')
const draftPosts = POSTS.filter((post) => post.status === '초안')
const totalViews = publishedPosts.reduce((sum, post) => {
  return sum + Number(post.views.replaceAll(',', ''))
}, 0)

export default function BlogManagementPage() {
  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <DashboardShell>
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">Blog Management</p>
              <h1 className="mt-1 text-3xl font-bold text-foreground">
                내가 쓴 글 관리
              </h1>
              <p className="mt-2 text-foreground-muted">
                포트폴리오에 연결되는 기술 글과 초안을 한곳에서 관리해보세요.
              </p>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary-hover">
              새 글 작성
            </Button>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <StatCard
              label="전체 글"
              value={`${totalPosts}개`}
              subtext={`게시 ${publishedPosts.length}개 · 초안 ${draftPosts.length}개`}
            />
            <StatCard
              label="누적 조회수"
              value={totalViews.toLocaleString()}
              subtext="공개된 글 기준으로 집계한 수치입니다."
            />
            <StatCard
              label="공개 블로그"
              value="운영 중"
              subtext="프로필과 블로그 상세 페이지에 연결됩니다."
            />
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
                      {post.status === '게시됨' ? (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/blog/${post.id}`}>보기</Link>
                        </Button>
                      ) : null}
                      <Button variant="outline" size="sm">
                        수정
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
      </DashboardShell>
    </div>
  )
}
