'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Clock3,
  Eye,
  Heart,
  Search,
  Sparkles,
} from 'lucide-react'
import {
  getAllBlogPosts,
  getBlogTags,
  getFeaturedBlogPosts,
  getNeighborBlogPosts,
  getPopularBlogPosts,
} from '@/lib/mock-blog-data'
import { GlobalNav } from '@/components/global-nav'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const allPosts = getAllBlogPosts()
const popularPosts = getPopularBlogPosts(3)
const featuredPosts = getFeaturedBlogPosts(3)
const neighborPosts = getNeighborBlogPosts(4)
const tags = getBlogTags()

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function BlogHomePage() {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string>('전체')

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return allPosts.filter((post) => {
      const matchesTag =
        activeTag === '전체' || post.tags.some((tag) => tag === activeTag)
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [post.title, post.excerpt, post.author.name, ...post.tags]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)

      return matchesTag && matchesQuery
    })
  }, [activeTag, query])

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <main className="px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8">
          <section className="overflow-hidden rounded-[28px] border border-primary/15 bg-[linear-gradient(135deg,rgba(109,40,217,0.08),rgba(255,255,255,0.95)_42%,rgba(167,139,250,0.16))]">
            <div className="grid gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.85fr)] lg:px-10 lg:py-10">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/80 px-3 py-1 text-sm font-medium text-primary">
                  <Sparkles className="size-4" />
                  개발자들의 문제 해결 기록
                </div>
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    블로그
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-foreground-muted sm:text-lg">
                    개발자들의 문제 해결 과정과 기술 인사이트를 살펴보세요.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-foreground-subtle" />
                    <Input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="제목, 작성자, 태그로 검색해보세요"
                      className="h-12 rounded-full border-border bg-background pl-11 shadow-sm"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="h-12 rounded-full border-primary/20 bg-background px-5 text-primary hover:bg-primary-light"
                    onClick={() => {
                      setQuery('')
                      setActiveTag('전체')
                    }}
                  >
                    필터 초기화
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTag('전체')}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      activeTag === '전체'
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-foreground-muted hover:border-primary/30 hover:text-primary'
                    }`}
                  >
                    전체
                  </button>
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setActiveTag(tag)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                        activeTag === tag
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-foreground-muted hover:border-primary/30 hover:text-primary'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <Card className="gap-4 border border-primary/10 bg-white/85 p-6 shadow-[0_24px_60px_rgba(109,40,217,0.08)] backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-primary">이번 주 인기글</p>
                    <h2 className="mt-1 text-xl font-semibold text-foreground">
                      가장 많이 읽힌 글
                    </h2>
                  </div>
                  <Eye className="size-5 text-primary" />
                </div>
                <div className="space-y-3">
                  {popularPosts.map((post, index) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.id}`}
                      className="group block rounded-2xl border border-border bg-background px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                    >
                      <div className="relative z-10 flex items-start gap-4">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary">
                          {index + 1}
                        </div>
                        <div className="min-w-0 pt-0.5">
                          <p className="line-clamp-2 font-semibold text-foreground group-hover:text-primary">
                            {post.title}
                          </p>
                          <p className="mt-1 text-sm text-foreground-muted">
                            {post.author.name} · 조회수 {post.views.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            </div>
          </section>

          <section className="grid gap-8 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.95fr)]">
            <div className="space-y-8">
              <div>
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <p className="text-sm font-semibold text-primary">Latest Posts</p>
                    <h2 className="mt-1 text-2xl font-bold text-foreground">
                      최신 글 목록
                    </h2>
                  </div>
                  <p className="text-sm text-foreground-muted">
                    {filteredPosts.length}개의 글
                  </p>
                </div>

                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.id}`} className="block">
                      <Card className="gap-0 border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {post.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="bg-primary-light text-primary"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <h3 className="mt-4 text-xl font-semibold text-foreground">
                              {post.title}
                            </h3>
                            <p className="mt-3 line-clamp-2 text-sm leading-6 text-foreground-muted">
                              {post.excerpt}
                            </p>
                            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground-muted">
                              <span>{post.author.name}</span>
                              <span>{formatDate(post.publishedAt)}</span>
                              <span className="inline-flex items-center gap-1">
                                <Clock3 className="size-4" />
                                {post.readTime}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Eye className="size-4" />
                                {post.views.toLocaleString()}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Heart className="size-4" />
                                {post.likes}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm font-medium text-primary">
                            읽어보기
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}

                  {filteredPosts.length === 0 ? (
                    <Card className="border border-dashed border-border bg-surface p-8 text-center">
                      <h3 className="text-lg font-semibold text-foreground">
                        검색 결과가 없습니다
                      </h3>
                      <p className="mt-2 text-sm text-foreground-muted">
                        다른 태그를 선택하거나 검색어를 바꿔보세요.
                      </p>
                    </Card>
                  ) : null}
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <Card className="gap-4 border border-border bg-card p-6">
                <div>
                  <p className="text-sm font-semibold text-primary">Editor&apos;s Pick</p>
                  <h2 className="mt-1 text-xl font-semibold text-foreground">
                    추천 글
                  </h2>
                </div>
                <div className="space-y-3">
                  {featuredPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.id}`}
                      className="block rounded-2xl border border-border bg-background px-5 py-4 transition-colors hover:border-primary/30 hover:bg-primary-light/30"
                    >
                      <div className="relative z-10">
                        <p className="font-semibold text-foreground">{post.title}</p>
                        <p className="mt-2 text-sm text-foreground-muted">
                          {post.author.name} · {post.readTime}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>

              <Card className="gap-4 border border-border bg-card p-6">
                <div>
                  <p className="text-sm font-semibold text-primary">Neighbors</p>
                  <h2 className="mt-1 text-xl font-semibold text-foreground">
                    이웃 새글
                  </h2>
                </div>
                <div className="space-y-3">
                  {neighborPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.id}`}
                      className="block rounded-2xl border border-border bg-background px-5 py-4 transition-colors hover:border-primary/30 hover:bg-surface"
                    >
                      <div className="relative z-10 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="line-clamp-2 font-semibold text-foreground">
                            {post.title}
                          </p>
                          <p className="mt-1 text-sm text-foreground-muted">
                            {post.author.name} · {formatDate(post.publishedAt)}
                          </p>
                        </div>
                        <div className="shrink-0 rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
                          {post.tags[0]}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            </aside>
          </section>
        </div>
      </main>
    </div>
  )
}
