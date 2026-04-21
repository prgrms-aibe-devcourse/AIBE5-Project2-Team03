'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { getBlogPostSummariesByUsername } from '@/lib/mock-blog-data'

interface PortfolioBlogSectionProps {
  posts: ReturnType<typeof getBlogPostSummariesByUsername>
}

export function PortfolioBlogSection({ posts }: PortfolioBlogSectionProps) {
  return (
    <Card className="border border-border">
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">기술 블로그</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/blog-management">글 관리</Link>
          </Button>
        </div>

        {posts.length === 0 ? (
          <p className="text-sm text-foreground-muted">
            아직 작성한 블로그 글이 없습니다.
          </p>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <div className="group rounded-lg border border-border p-4 transition-colors hover:bg-surface">
                  <h3 className="line-clamp-2 font-semibold text-foreground group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-foreground-muted">
                    {post.excerpt}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-foreground-subtle">
                    <span>{post.date}</span>
                    <span>{post.readTime} 읽음</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
