'use client'

<<<<<<< HEAD
import Link from 'next/link'
import { useMemo, useState, type ChangeEvent } from 'react'
import { GlobalNav } from '@/components/global-nav'
import { QuestCard, type Quest } from '@/components/quest-card'
=======
import { useState, useEffect, type ChangeEvent, use } from 'react'
import { GlobalNav } from '@/components/global-nav'
>>>>>>> origin/backup
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
<<<<<<< HEAD
import {
  getBlogPostSummariesByUsername,
  getPublicProfileByUsername,
} from '@/lib/mock-blog-data'
=======
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
>>>>>>> origin/backup

// Lucide 아이콘 (필요시 pnpm install lucide-react 필요, 없다면 텍스트로 대체 가능)
import { User, Briefcase, DollarSign, Award, Settings, Save, X, Link2 } from 'lucide-react'

// 인터페이스 정의 (기존과 동일)
interface FreelancerProfile {
  username: string
  nickname: string
  profileImageUrl: string | null
  intro: string | null
  portfolioUrl: string | null
  level: string
  totalCareerYears: number
  totalReward: number
  completedQuestsCount: number
  techStack: string[]
<<<<<<< HEAD
  completedQuests: Quest[]
  blogPosts: ReturnType<typeof getBlogPostSummariesByUsername>
=======
  badgeCount: number
>>>>>>> origin/backup
}

interface ProfileDraft {
  nickname: string
  profileImageUrl: string
  intro: string
  portfolioUrl: string
  level: string
  totalCareerYears: number
  techStackText: string
}

<<<<<<< HEAD
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
=======
const LEVEL_OPTIONS = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND']
>>>>>>> origin/backup

// 블로그 모의 데이터 (필요시 백엔드 연동)
const MOCK_BLOGS = [
  { id: 1, title: 'React Admin Dashboard 성능 최적화 경험기', date: '2024-04-10' },
  { id: 2, title: 'Next.js App Router에서 데이터 흐름 정리하기', date: '2024-04-05' },
  { id: 3, title: 'TypeScript 타입 설계 노트', date: '2024-03-28' },
]

<<<<<<< HEAD
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
=======
export default function ProfilePage({ params: paramsPromise }: { params: Promise<{ username: string }> }) {
  const params = use(paramsPromise);
  const [profile, setProfile] = useState<FreelancerProfile | null>(null)
  const [draft, setDraft] = useState<ProfileDraft | null>(null)
>>>>>>> origin/backup
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

<<<<<<< HEAD
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
=======
  useEffect(() => {
    const decodedUsername = decodeURIComponent(params.username);
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/user/${decodedUsername}`);
        if (!response.ok) throw new Error("프로필 로드 실패");
        const data: FreelancerProfile = await response.json();
        setProfile(data);
        setDraft({
          nickname: data.nickname || '',
          profileImageUrl: data.profileImageUrl || '',
          intro: data.intro || '',
          portfolioUrl: data.portfolioUrl || '',
          level: data.level || 'BRONZE',
          totalCareerYears: data.totalCareerYears || 0,
          techStackText: data.techStack ? data.techStack.join(', ') : ''
        });
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
>>>>>>> origin/backup
      }
    };
    fetchProfile();
  }, [params.username]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDraft(prev => prev ? { ...prev, [name]: value } : null)
  }

  const saveProfile = async () => {
    if (!draft || !profile) return;
    try {
      // 💡 여기서 실제 backend API (PATCH/PUT) 호출 필요
      setProfile({
        ...profile,
        nickname: draft.nickname,
        profileImageUrl: draft.profileImageUrl,
        intro: draft.intro,
        portfolioUrl: draft.portfolioUrl,
        level: draft.level,
        totalCareerYears: Number(draft.totalCareerYears),
        techStack: draft.techStackText.split(',').map(s => s.trim()).filter(s => s !== "")
      });
      setIsEditing(false);
    } catch (error) {
      alert("저장 실패");
    }
  }

  if (isLoading) return <div className="flex h-screen items-center justify-center font-bold text-xl">유저 데이터를 가져오는 중입니다...</div>
  if (!profile) return <div className="flex h-screen items-center justify-center font-bold text-red-500">유저 정보를 찾을 수 없습니다.</div>

  return (
      <div className="min-h-screen bg-background text-foreground">
        <GlobalNav />

<<<<<<< HEAD
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
=======
        {/* 💡 상단 프로필 헤더 비주얼 강화 */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background pt-16 pb-8 border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* 이미지 수정 부분 */}
              <div className="relative group">
                <img
                    src={isEditing ? (draft?.profileImageUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default') : (profile.profileImageUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default')}
                    alt="Profile Avatar"
                    className="h-40 w-40 rounded-3xl border-4 border-background object-cover shadow-2xl transition-transform duration-300 group-hover:rotate-3"
                />
                <Badge className="absolute -bottom-3 -right-3 px-4 py-1.5 shadow-xl text-lg font-black tracking-wider rotate-6 bg-yellow-400 text-yellow-950 hover:bg-yellow-400/90">{profile.level}</Badge>
                {isEditing && (
                    <div className="absolute inset-x-2 bottom-2">
                      <Input name="profileImageUrl" value={draft?.profileImageUrl} onChange={handleInputChange} className="h-8 text-xs bg-background/80" placeholder="https://..." />
                    </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {isEditing ? (
                      /* 이름 수정 */
                      <div className="space-y-2 flex-1 max-w-md">
                        <Label>닉네임</Label>
                        <Input name="nickname" value={draft?.nickname} onChange={handleInputChange} className="text-2xl font-black bg-background" placeholder="활동 이름을 적어주세요." />
                      </div>
                  ) : (
                      <div>
                        <h1 className="text-6xl font-black tracking-tighter text-foreground">{profile.nickname}</h1>
                        <p className="text-xl text-muted-foreground font-medium mt-1">@{profile.username} / 경력 {profile.totalCareerYears}년차</p>
                      </div>
                  )}
>>>>>>> origin/backup

                  <div className="flex gap-2 justify-center">
                    {isEditing ? (
                        <>
                          <Button onClick={saveProfile} size="lg" className="rounded-full gap-2 px-6"> <Save size={20}/> 저장 </Button>
                          <Button variant="ghost" onClick={() => setIsEditing(false)} className="rounded-full gap-2 px-6"> <X size={20}/> 취소 </Button>
                        </>
                    ) : (
<<<<<<< HEAD
                      <Button variant="outline" onClick={startEditing}>
                        프로필 수정
                      </Button>
=======
                        <Button variant="outline" size="lg" onClick={() => setIsEditing(true)} className="rounded-full gap-2 px-6"> <Settings size={20}/> 프로필 수정 </Button>
>>>>>>> origin/backup
                    )}
                  </div>
                </div>

                {/* 레벨 & 경력 수정 모드 */}
                {isEditing && (
                    <div className="grid grid-cols-2 gap-4 max-w-md p-4 bg-muted/40 rounded-2xl border">
                      <div className="space-y-2">
                        <Label>레벨</Label>
                        <Select value={draft?.level} onValueChange={(val) => setDraft(prev => prev ? {...prev, level: val} : null)}>
                          <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                          <SelectContent> {LEVEL_OPTIONS.map(lvl => <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>)} </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>경력(년)</Label>
                        <Input name="totalCareerYears" type="number" value={draft?.totalCareerYears} onChange={handleInputChange} className="bg-background" />
                      </div>
                    </div>
                )}
              </div>
            </div>
          </div>
        </section>

<<<<<<< HEAD
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
=======
        {/* 💡 메인 레이아웃 분할 */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* 왼쪽 컬럼: 소개 & 스킬 */}
            <div className="lg:col-span-2 space-y-12">

              {/* 소개(INTRO) */}
              <section>
                <h2 className="mb-6 text-2xl font-black flex items-center gap-2"><User size={24} className="text-primary"/> 나를 한 줄로 표현하자면?</h2>
                <Card className="rounded-3xl border-dashed border-2 bg-muted/20">
                  <CardContent className="p-8">
                    {isEditing ? (
                        <Textarea name="intro" rows={6} value={draft?.intro} onChange={handleInputChange} placeholder="전문 분야나 프로젝트 경험을 자유롭게 적어주세요. 자신감 있는 소개글은 퀘스트 수주 확률을 높입니다." className="bg-background leading-relaxed" />
                    ) : (
                        <p className="whitespace-pre-wrap text-xl font-medium text-muted-foreground leading-relaxed italic border-l-4 pl-8 border-primary/40">
                          "{profile.intro || "아직 작성된 소개글이 없습니다. 프로필을 수정해 자신을 알려보세요!"}"
                        </p>
                    )}
                  </CardContent>
                </Card>
              </section>

              {/* 기술 스택 */}
              <section>
                <h2 className="mb-6 text-2xl font-black flex items-center gap-2"><Briefcase size={24} className="text-primary"/> 주요 기술 스택</h2>
                {isEditing ? (
                    <Card className="rounded-3xl p-6 bg-card">
                      <Input name="techStackText" value={draft?.techStackText} onChange={handleInputChange} placeholder="Java, React, Next.js, Spring Boot" />
                      <p className="text-xs text-muted-foreground mt-2">쉼표(,)로 구분해서 입력하세요.</p>
                    </Card>
                ) : (
                    <div className="flex flex-wrap gap-2.5">
                      {profile.techStack && profile.techStack.length > 0 ? (
                          profile.techStack.map(skill => (
                              <Badge key={skill} variant="secondary" className="px-5 py-2 rounded-full text-sm font-semibold bg-white border dark:bg-zinc-800 text-foreground shadow-sm">#{skill}</Badge>
                          ))
                      ) : (
                          <p className="text-sm text-muted-foreground bg-muted p-4 rounded-xl">등록된 기술 스택이 없습니다.</p>
                      )}
                    </div>
                )}
              </section>
            </div>

            {/* 💡 오른쪽 컬럼: 통계 & 포트폴리오 */}
            <aside className="space-y-12">

              {/* 통계 카드 그리드 */}
              <section className="space-y-4">
                <Card className="rounded-3xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 p-6 flex items-center gap-6">
                  <DollarSign size={40} className="opacity-70 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium opacity-80">누적 수익</p>
                    <p className="text-4xl font-extrabold tracking-tight">₩{profile.totalReward.toLocaleString()}</p>
                  </div>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="rounded-2xl p-6 bg-muted/40">
                    <p className="text-xs text-muted-foreground mb-1">완료 퀘스트</p>
                    <p className="text-3xl font-bold flex items-end gap-1">{profile.completedQuestsCount}<span className="text-xs font-normal text-muted-foreground pb-1">건</span></p>
                  </Card>
                  <Card className="rounded-2xl p-6 bg-muted/40">
                    <p className="text-xs text-muted-foreground mb-1">보유 뱃지</p>
                    <p className="text-3xl font-bold flex items-end gap-1">{profile.badgeCount}<span className="text-xs font-normal text-muted-foreground pb-1">개</span></p>
                  </Card>
                </div>
              </section>

              {/* 포트폴리오 블로그 */}
              <Card className="rounded-3xl shadow-sm">
                <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase size={22}/> 포트폴리오 블로그</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {MOCK_BLOGS.map(blog => (
                      <a key={blog.id} href="#" className="block p-4 rounded-xl hover:bg-muted/50 transition-colors border">
                        <p className="font-semibold text-sm line-clamp-1 text-foreground">{blog.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{blog.date}</p>
                      </a>
                  ))}
                </CardContent>
              </Card>

              {/* 포트폴리오 링크 수정 (isEditing 모드) */}
              {isEditing && (
                  <Card className="rounded-3xl p-6 bg-card space-y-3">
                    <h3 className="font-semibold flex items-center gap-2"> <Link2 size={18}/> 포트폴리오 링크</h3>
                    <Input name="portfolioUrl" value={draft?.portfolioUrl} onChange={handleInputChange} placeholder="https://..." />
                  </Card>
              )}

            </aside>
>>>>>>> origin/backup
          </div>
        </main>
      </div>
  )
}