import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Clock3,
  Eye,
  Heart,
  MessageCircle,
} from 'lucide-react'
import {
  getAdjacentPosts,
  getBlogPostById,
  getBlogPostsByUsername,
  getPublicProfileByUsername,
  getRelatedPosts,
} from '@/lib/mock-blog-data'
import { GlobalNav } from '@/components/global-nav'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

function AuthorBlogPage({ username }: { username: string }) {
  const author = getPublicProfileByUsername(username)

  if (!author) {
    notFound()
  }

  const posts = getBlogPostsByUsername(username)

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <main className="px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="overflow-hidden rounded-[28px] border border-primary/15 bg-[linear-gradient(135deg,rgba(109,40,217,0.08),rgba(255,255,255,1)_38%,rgba(167,139,250,0.12))]">
            <div className="grid gap-8 px-6 py-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:px-10">
              <img
                src={author.profileImage}
                alt={author.name}
                className="size-24 rounded-full border-4 border-white bg-white object-cover shadow-md"
              />
              <div>
                <p className="text-sm font-semibold text-primary">Public Blog</p>
                <h1 className="mt-1 text-3xl font-bold text-foreground">
                  {author.name}의 블로그
                </h1>
                <p className="mt-3 max-w-3xl text-base leading-7 text-foreground-muted">
                  {author.bio}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {author.techStack.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="bg-primary-light text-primary"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-foreground-muted">
                  <span>@{author.username}</span>
                  <span>작성 글 {posts.length}개</span>
                  <Link
                    href={`/profile/${author.username}`}
                    className="font-medium text-primary hover:underline"
                  >
                    프로필 보기
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_320px]">
            <div>
              <div className="mb-4">
                <p className="text-sm font-semibold text-primary">Latest Writing</p>
                <h2 className="mt-1 text-2xl font-bold text-foreground">
                  작성한 블로그 글
                </h2>
              </div>
              <div className="space-y-4">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.id}`}>
                    <Card className="gap-0 border border-border p-6 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-surface-raised text-foreground-muted"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="mt-4 text-xl font-semibold text-foreground">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-foreground-muted">
                        {post.excerpt}
                      </p>
                      <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-foreground-muted">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span>{post.readTime}</span>
                        <span>조회수 {post.views.toLocaleString()}</span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            <aside className="space-y-6">
              <Card className="border border-border p-6">
                <div>
                  <p className="text-sm font-semibold text-primary">About</p>
                  <h2 className="mt-1 text-lg font-semibold text-foreground">
                    한 줄 소개
                  </h2>
                </div>
                <p className="text-sm leading-6 text-foreground-muted">
                  {author.shortIntro}
                </p>
              </Card>

              <Card className="border border-border p-6">
                <div>
                  <p className="text-sm font-semibold text-primary">Series</p>
                  <h2 className="mt-1 text-lg font-semibold text-foreground">
                    시리즈
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {author.series.map((series) => (
                    <Badge key={series} variant="outline" className="bg-background">
                      {series}
                    </Badge>
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

function BlogDetailPage({ id }: { id: string }) {
  const post = getBlogPostById(id)

  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(post, 3)
  const authorPosts = getBlogPostsByUsername(post.author.username)
    .filter((authorPost) => authorPost.id !== post.id)
    .slice(0, 3)
  const { previous, next } = getAdjacentPosts(post.id)

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <main className="px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground-muted transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            블로그 메인으로 돌아가기
          </Link>

          <section className="grid gap-8 xl:grid-cols-[minmax(0,1.55fr)_320px]">
            <article className="space-y-6">
              <div className="rounded-[28px] border border-border bg-card p-6 sm:p-8">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-primary-light text-primary"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <h1 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {post.title}
                </h1>

                <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-border bg-surface px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={post.author.profileImage}
                      alt={post.author.name}
                      className="size-14 rounded-full border border-border bg-white object-cover"
                    />
                    <div>
                      <Link
                        href={`/blog/${post.author.username}`}
                        className="font-semibold text-foreground transition-colors hover:text-primary"
                      >
                        {post.author.name}
                      </Link>
                      <p className="text-sm text-foreground-muted">
                        {formatDate(post.publishedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-foreground-muted">
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
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle className="size-4" />
                      {post.comments}
                    </span>
                  </div>
                </div>

                <div className="mt-8 space-y-5 text-[15px] leading-8 text-foreground-muted sm:text-base">
                  {post.content.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {previous ? (
                  <Link href={`/blog/${previous.id}`}>
                    <Card className="gap-2 border border-border p-5 transition-colors hover:border-primary/30">
                      <p className="text-sm font-semibold text-primary">이전 글</p>
                      <p className="font-semibold text-foreground">{previous.title}</p>
                    </Card>
                  </Link>
                ) : (
                  <Card className="gap-2 border border-dashed border-border p-5">
                    <p className="text-sm font-semibold text-primary">이전 글</p>
                    <p className="text-sm text-foreground-muted">
                      더 이전 글은 없습니다.
                    </p>
                  </Card>
                )}

                {next ? (
                  <Link href={`/blog/${next.id}`}>
                    <Card className="gap-2 border border-border p-5 transition-colors hover:border-primary/30">
                      <p className="text-sm font-semibold text-primary">다음 글</p>
                      <p className="font-semibold text-foreground">{next.title}</p>
                    </Card>
                  </Link>
                ) : (
                  <Card className="gap-2 border border-dashed border-border p-5">
                    <p className="text-sm font-semibold text-primary">다음 글</p>
                    <p className="text-sm text-foreground-muted">
                      더 최신 글은 없습니다.
                    </p>
                  </Card>
                )}
              </div>
            </article>

            <aside className="space-y-6">
              <Card className="border border-border p-6">
                <div className="flex items-center gap-2">
                  <BookOpenText className="size-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-primary">Author</p>
                    <h2 className="mt-1 text-lg font-semibold text-foreground">
                      작성자 다른 글 보기
                    </h2>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {authorPosts.map((authorPost) => (
                    <Link
                      key={authorPost.id}
                      href={`/blog/${authorPost.id}`}
                      className="block rounded-2xl border border-border bg-background px-4 py-4 transition-colors hover:border-primary/30 hover:bg-surface"
                    >
                      <p className="font-medium text-foreground">{authorPost.title}</p>
                      <p className="mt-1 text-sm text-foreground-muted">
                        {authorPost.readTime} · {formatDate(authorPost.publishedAt)}
                      </p>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/blog/${post.author.username}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  {post.author.name}의 공개 블로그 보기
                  <ArrowRight className="size-4" />
                </Link>
              </Card>

              <Card className="border border-border p-6">
                <div>
                  <p className="text-sm font-semibold text-primary">Related Posts</p>
                  <h2 className="mt-1 text-lg font-semibold text-foreground">
                    관련 글
                  </h2>
                </div>
                <div className="mt-4 space-y-3">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.id}`}
                      className="block rounded-2xl border border-border bg-background px-4 py-4 transition-colors hover:border-primary/30 hover:bg-surface"
                    >
                      <p className="font-medium text-foreground">
                        {relatedPost.title}
                      </p>
                      <p className="mt-1 text-sm text-foreground-muted">
                        {relatedPost.author.name} · {relatedPost.tags[0]}
                      </p>
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

export default async function BlogSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  if (/^\d+$/.test(slug)) {
    return <BlogDetailPage id={slug} />
  }

  return <AuthorBlogPage username={slug} />
}
