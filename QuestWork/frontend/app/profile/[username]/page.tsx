'use client'

import Link from 'next/link'
import { useMemo, useState, type ChangeEvent } from 'react'
import { GlobalNav } from '@/components/global-nav'
import { QuestCard, type Quest } from '@/components/quest-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  getBlogPostSummariesByUsername,
  getPublicProfileByUsername,
} from '@/lib/mock-blog-data'

interface FreelancerProfile {
  username: string
  name: string
  profileImage: string
  bio: string
  experienceLevel: string
  completedQuestsCount: number
  totalEarnings: string
  techStack: string[]
  completedQuests: Quest[]
  blogPosts: ReturnType<typeof getBlogPostSummariesByUsername>
}

interface ProfileDraft {
  name: string
  profileImage: string
  bio: string
  techStackText: string
}

const COMPLETED_QUESTS: Quest[] = [
  {
    id: '1',
    title: 'React Admin Dashboard Performance Optimization',
    description:
      'Improved rendering performance and reduced bundle size in a React admin dashboard.',
    techStack: ['React', 'Next.js', 'TypeScript'],
    reward: '₩1,000,000',
    deadline: '완료',
    participants: 15,
  },
  {
    id: '2',
    title: 'REST API for Microservices Architecture',
    description:
      'Designed and implemented a robust REST API with authentication, rate limiting, and comprehensive documentation.',
    techStack: ['Node.js', 'Express', 'MongoDB'],
    reward: '₩1,500,000',
    deadline: '완료',
    participants: 22,
  },
  {
    id: '3',
    title: 'Spring Boot REST Service',
    description:
      'Built a scalable Spring Boot application with database integration, caching, and API documentation.',
    techStack: ['Java', 'Spring', 'PostgreSQL'],
    reward: '₩1,200,000',
    deadline: '완료',
    participants: 18,
  },
  {
    id: '4',
    title: 'Next.js E-commerce Platform',
    description:
      'Built a full-stack e-commerce platform with payment integration, product management, and order tracking.',
    techStack: ['Next.js', 'React', 'Stripe'],
    reward: '₩2,500,000',
    deadline: '완료',
    participants: 28,
  },
]

function createProfile(username: string): FreelancerProfile {
  const author = getPublicProfileByUsername(username) ?? getPublicProfileByUsername('kim-dev')

  if (!author) {
    throw new Error('Default profile data is missing.')
  }

  return {
    username: author.username,
    name: author.name,
    profileImage: author.profileImage,
    bio: author.bio,
    experienceLevel: 'Senior',
    completedQuestsCount: COMPLETED_QUESTS.length + 20,
    totalEarnings: '₩8,450,000',
    techStack: author.techStack,
    completedQuests: COMPLETED_QUESTS,
    blogPosts: getBlogPostSummariesByUsername(author.username),
  }
}

function createDraft(profile: FreelancerProfile): ProfileDraft {
  return {
    name: profile.name,
    profileImage: profile.profileImage,
    bio: profile.bio,
    techStackText: profile.techStack.join(', '),
  }
}

function parseTechStack(value: string) {
  return value
    .split(',')
    .map((tech) => tech.trim())
    .filter(Boolean)
}

export default function ProfilePage({
  params,
}: {
  params: { username: string }
}) {
  const initialProfile = useMemo(() => createProfile(params.username), [params.username])
  const [profile, setProfile] = useState(initialProfile)
  const [draft, setDraft] = useState<ProfileDraft>(() => createDraft(initialProfile))
  const [isEditing, setIsEditing] = useState(false)

  const previewTechStack = parseTechStack(draft.techStackText)

  const startEditing = () => {
    setDraft(createDraft(profile))
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setDraft(createDraft(profile))
    setIsEditing(false)
  }

  const saveProfile = () => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      name: draft.name.trim() || currentProfile.name,
      profileImage: draft.profileImage || currentProfile.profileImage,
      bio: draft.bio.trim() || currentProfile.bio,
      techStack:
        previewTechStack.length > 0 ? previewTechStack : currentProfile.techStack,
    }))
    setIsEditing(false)
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDraft((currentDraft) => ({
          ...currentDraft,
          profileImage: reader.result,
        }))
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <main>
        <section className="border-b border-border bg-surface px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-6">
              <div className="flex-shrink-0">
                <div className="relative w-fit">
                  <img
                    src={isEditing ? draft.profileImage : profile.profileImage}
                    alt={profile.name}
                    className="h-32 w-32 rounded-full border-4 border-primary object-cover shadow-lg"
                  />
                  {isEditing ? (
                    <Label
                      htmlFor="profile-image"
                      className="absolute inset-x-2 bottom-2 flex cursor-pointer justify-center rounded-md bg-background/90 px-2 py-1 text-xs font-semibold text-primary shadow-sm transition-colors hover:bg-primary-light"
                    >
                      이미지 변경
                    </Label>
                  ) : null}
                  <Input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    {isEditing ? (
                      <div className="max-w-xl space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="profile-name">이름</Label>
                          <Input
                            id="profile-name"
                            value={draft.name}
                            onChange={(event) =>
                              setDraft((currentDraft) => ({
                                ...currentDraft,
                                name: event.target.value,
                              }))
                            }
                            className="h-11 border-border bg-background"
                          />
                        </div>
                        <p className="text-foreground-muted">@{profile.username}</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-center gap-3">
                          <h1 className="text-4xl font-bold text-foreground">
                            {profile.name}
                          </h1>
                          <Badge className="bg-primary text-primary-foreground">
                            {profile.experienceLevel}
                          </Badge>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-foreground-muted">
                          <span>@{profile.username}</span>
                          <Link
                            href={`/blog/${profile.username}`}
                            className="font-medium text-primary hover:underline"
                          >
                            공개 블로그 보기
                          </Link>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          className="bg-primary text-primary-foreground hover:bg-primary-hover"
                          onClick={saveProfile}
                        >
                          저장
                        </Button>
                        <Button variant="outline" onClick={cancelEditing}>
                          취소
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" onClick={startEditing}>
                        프로필 수정
                      </Button>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="max-w-2xl space-y-2">
                    <Label htmlFor="profile-bio">소개</Label>
                    <Textarea
                      id="profile-bio"
                      value={draft.bio}
                      onChange={(event) =>
                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          bio: event.target.value,
                        }))
                      }
                      className="min-h-28 border-border bg-background leading-relaxed"
                    />
                  </div>
                ) : (
                  <p className="max-w-2xl leading-relaxed text-foreground-muted">
                    {profile.bio}
                  </p>
                )}

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border border-border bg-background p-4">
                    <p className="text-sm text-foreground-muted">완료한 퀘스트</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                      {profile.completedQuestsCount}개
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-4">
                    <p className="text-sm text-foreground-muted">작성한 글</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                      {profile.blogPosts.length}개
                    </p>
                  </div>
                  <div className="rounded-lg border border-primary/30 bg-primary-light p-4">
                    <p className="text-sm text-primary">총 누적 수익</p>
                    <p className="mt-1 text-2xl font-bold text-primary">
                      {profile.totalEarnings}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-12">
            <section>
              <div className="mb-6">
                <p className="text-sm font-semibold text-primary">Skills</p>
                <h2 className="mt-1 text-2xl font-bold text-foreground">
                  기술 스택
                </h2>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tech-stack">기술 스택</Label>
                    <Input
                      id="tech-stack"
                      value={draft.techStackText}
                      onChange={(event) =>
                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          techStackText: event.target.value,
                        }))
                      }
                      placeholder="React, Next.js, Java"
                      className="h-11 border-border bg-surface"
                    />
                    <p className="text-xs text-foreground-muted">
                      쉼표로 구분해서 입력해주세요.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {previewTechStack.map((tech) => (
                      <Badge
                        key={tech}
                        className="bg-secondary text-secondary-foreground"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {profile.techStack.map((tech) => (
                    <Badge
                      key={tech}
                      className="bg-secondary text-secondary-foreground"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="mb-6">
                <p className="text-sm font-semibold text-primary">Completed Work</p>
                <h2 className="mt-1 text-2xl font-bold text-foreground">
                  완료한 퀘스트
                </h2>
                <p className="mt-2 text-sm text-foreground-muted">
                  실제로 완료한 작업을 통해 프로젝트 경험과 강점을 보여줍니다.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {profile.completedQuests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </div>
            </section>

            <section>
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary">
                    Portfolio Blog
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-foreground">
                    작성한 블로그 글
                  </h2>
                  <p className="mt-2 text-sm text-foreground-muted">
                    문제 해결 방식과 기술 인사이트를 정리한 글입니다.
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/blog/${profile.username}`}>공개 블로그로 이동</Link>
                </Button>
              </div>
              <div className="space-y-4">
                {profile.blogPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.id}`}>
                    <Card className="border border-border p-6 transition-all hover:border-primary hover:bg-surface hover:shadow-md">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {post.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-foreground-muted">
                          {post.excerpt}
                        </p>
                        <div className="mt-3 flex items-center justify-between text-xs text-foreground-subtle">
                          <span>{post.date}</span>
                          <span>{post.readTime} 읽음</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
