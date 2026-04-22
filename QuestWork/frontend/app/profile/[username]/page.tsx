"use client";

import { useState, useEffect, type ChangeEvent, use, useRef } from "react";
import { GlobalNav } from "@/components/global-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Lucide 아이콘 (필요시 pnpm install lucide-react 필요, 없다면 텍스트로 대체 가능)
import {
  User,
  Briefcase,
  DollarSign,
  Award,
  Settings,
  Save,
  X,
  Link2,
  Lock,
  Calendar as CalendarIcon,
} from "lucide-react";

// 인터페이스 정의 (기존과 동일)
interface FreelancerProfile {
  username: string;
  nickname: string;
  profileImageUrl: string | null;
  intro: string | null;
  portfolioUrl: string | null;
  level: string;
  totalCareerYears: number;
  totalReward: number;
  completedQuestsCount: number;
  techStack: string[];
  badgeCount: number;
}

interface ProfileDraft {
  nickname: string;
  profileImageUrl: string;
  intro: string;
  portfolioUrl: string;
  level: string;
  totalCareerYears: number;
  techStack: string[];
}

// 블로그 모의 데이터 (필요시 백엔드 연동)
const MOCK_BLOGS = [
  {
    id: 1,
    title: "React Admin Dashboard 성능 최적화 경험기",
    date: "2024-04-10",
  },
  {
    id: 2,
    title: "Next.js App Router에서 데이터 흐름 정리하기",
    date: "2024-04-05",
  },
  { id: 3, title: "TypeScript 타입 설계 노트", date: "2024-03-28" },
];

// 기술 스택 옵션 (나중에 DB에서 가져올 예정)
const TECH_STACK_OPTIONS = [
  "Java",
  "React",
  "Next.js",
  "Spring Boot",
  "TypeScript",
  "Python",
  "Node.js",
  "Vue.js",
  "Angular",
  "Django",
  "Flask",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "JavaScript",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "GraphQL",
  "REST API",
  "Git",
  "Linux",
  "Firebase",
  "Supabase",
];

// 찜한/진행 중 퀘스트 모의 데이터
const MOCK_QUESTS = [
  {
    id: 1,
    title: "React 기반 관리자 대시보드 개발",
    status: "진행중",
    deadline: "2024-05-15",
  },
  {
    id: 2,
    title: "Next.js 이커머스 플랫폼 구축",
    status: "찜",
    deadline: "2024-05-20",
  },
  {
    id: 3,
    title: "Spring Boot API 서버 개발",
    status: "진행중",
    deadline: "2024-05-10",
  },
];

export default function ProfilePage({
  params: paramsPromise,
}: {
  params: Promise<{ username: string }>;
}) {
  const params = use(paramsPromise);
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [draft, setDraft] = useState<ProfileDraft | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [questFilter, setQuestFilter] = useState<"전체" | "진행중" | "찜">(
    "전체",
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newQuestTitle, setNewQuestTitle] = useState("");
  const [newQuestStatus, setNewQuestStatus] = useState<"진행중" | "찜">(
    "진행중",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const decodedUsername = decodeURIComponent(params.username);
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/user/${decodedUsername}`,
        );
        if (!response.ok) throw new Error("프로필 로드 실패");
        const data: FreelancerProfile = await response.json();
        setProfile(data);
        setDraft({
<<<<<<< HEAD
          nickname: data.nickname || "",
          profileImageUrl: data.profileImageUrl || "",
          intro: data.intro || "",
          portfolioUrl: data.portfolioUrl || "",
          level: data.level || "BRONZE",
=======
          nickname: data.nickname || '', // username을 nickname으로 변경!
          profileImageUrl: data.profileImageUrl || '',
          intro: data.intro || '',
          portfolioUrl: data.portfolioUrl || '',
          level: data.level || 'BRONZE',
>>>>>>> origin/seokmin
          totalCareerYears: data.totalCareerYears || 0,
          techStack: data.techStack || [],
        });
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [params.username]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setDraft((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setDraft((prev) =>
          prev ? { ...prev, profileImageUrl: result } : null,
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const addQuest = () => {
    if (selectedDate && newQuestTitle.trim()) {
      const newQuest = {
        id: MOCK_QUESTS.length + 1,
        title: newQuestTitle,
        status: newQuestStatus,
        deadline: selectedDate.toISOString().split("T")[0],
      };
      // 실제로는 API 호출, 여기서는 Mock 업데이트
      MOCK_QUESTS.push(newQuest);
      setNewQuestTitle("");
      setNewQuestStatus("진행중");
      setSelectedDate(undefined);
      setIsDialogOpen(false);
    }
  };

  const getNextDeadline = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureQuests = MOCK_QUESTS.filter(
      (quest) => new Date(quest.deadline) >= today,
    ).sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    );

    if (futureQuests.length === 0) return null;

    const nextQuest = futureQuests[0];
    const deadlineDate = new Date(nextQuest.deadline);
    const daysDiff = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

    return {
      title: nextQuest.title,
      days: daysDiff === 0 ? "D-Day" : `D-${daysDiff}`,
    };
  };

  const saveProfile = async () => {
    if (!draft || !profile) return;

    try {
      // 1. 백엔드 API 호출 (주소: /api/user/[username], 메서드: PUT)
      const response = await fetch(
        `http://localhost:8000/api/user/${profile.username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          // 백엔드 MemberUpdateDto 필드명에 맞춰서 전송
          body: JSON.stringify({
            nickname: draft.nickname,
            intro: draft.intro,
            level: draft.level, // "BRONZE", "SILVER" 등 대문자 문자열
            portfolioUrl: draft.portfolioUrl,
            totalCareerYears: Number(draft.totalCareerYears), // 반드시 숫자로 변환
          }),
        },
      );

      // 2. 응답 결과 확인
      if (!response.ok) {
        // 403이나 500 에러가 나면 여기서 걸러집니다.
        const errorData = await response.text();
        console.error("서버 응답 에러:", errorData);
        throw new Error("서버 저장 실패");
      }

      // 3. 서버 저장 성공 시 프론트엔드 상태(UI) 업데이트
      setProfile({
        ...profile,
        nickname: draft.nickname,
        profileImageUrl: draft.profileImageUrl,
        intro: draft.intro,
        portfolioUrl: draft.portfolioUrl,
        level: draft.level,
        totalCareerYears: Number(draft.totalCareerYears),
        techStack: draft.techStack,
      });

      setIsEditing(false);
      alert("프로필이 성공적으로 저장되었습니다!");
    } catch (error) {
      // 네트워크 장애나 위에서 던진 Error 처리
      console.error("저장 중 에러 발생:", error);
      alert("저장에 실패했습니다. 서버 로그나 주소를 확인해주세요.");
    }
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center font-bold text-xl">
        유저 데이터를 가져오는 중입니다...
      </div>
    );
  if (!profile)
    return (
      <div className="flex h-screen items-center justify-center font-bold text-red-500">
        유저 정보를 찾을 수 없습니다.
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <GlobalNav />

      {/* 💡 상단 프로필 헤더 비주얼 강화 */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background pt-16 pb-8 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* 이미지 수정 부분 */}
            <div className="relative group">
              <img
                src={
                  isEditing
                    ? draft?.profileImageUrl ||
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
                    : profile.profileImageUrl ||
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
                }
                alt="Profile Avatar"
                className="h-40 w-40 rounded-3xl border-4 border-background object-cover shadow-3xl transition-transform duration-300 group-hover:rotate-3 cursor-pointer"
                onClick={() => isEditing && fileInputRef.current?.click()}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                hidden
              />
              <Badge className="absolute -bottom-3 -right-3 px-4 py-1.5 shadow-xl text-lg font-black tracking-wider rotate-6 bg-yellow-400 text-yellow-950 hover:bg-yellow-400/90">
                {profile.level}
              </Badge>
              {isEditing && (
                <div className="absolute inset-x-2 bottom-2">
                  <Input
                    name="profileImageUrl"
                    value={draft?.profileImageUrl}
                    onChange={handleInputChange}
                    className="h-8 text-xs bg-background/80"
                    placeholder="https://..."
                  />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {isEditing ? (
                  /* 이름 수정 */
                  <div className="space-y-2 flex-1 max-w-md">
                    <Label>닉네임</Label>
                    <Input
                      name="nickname"
                      value={draft?.nickname}
                      onChange={handleInputChange}
                      className="text-2xl font-black bg-background"
                      placeholder="활동 이름을 적어주세요."
                    />
                    <Label>소개글</Label>
                    <Textarea
                      name="intro"
                      rows={3}
                      value={draft?.intro}
                      onChange={handleInputChange}
                      placeholder="전문 분야나 프로젝트 경험을 자유롭게 적어주세요."
                      className="bg-background leading-relaxed"
                    />
                  </div>
                ) : (
                  <div>
                    <h1 className="text-7xl font-black tracking-tighter text-foreground">
                      {profile.nickname}
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium mt-1">
                      @{profile.username} / 경력 {profile.totalCareerYears}년차
                    </p>
                    {profile.intro && (
                      <p className="text-lg text-muted-foreground mt-4 italic leading-relaxed">
                        "{profile.intro}"
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-2 justify-center">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={saveProfile}
                        size="lg"
                        className="rounded-full gap-2 px-6"
                      >
                        {" "}
                        <Save size={20} /> 저장{" "}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setIsEditing(false)}
                        className="rounded-full gap-2 px-6"
                      >
                        {" "}
                        <X size={20} /> 취소{" "}
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setIsEditing(true)}
                      className="rounded-full gap-2 px-6"
                    >
                      {" "}
                      <Settings size={20} /> 프로필 수정{" "}
                    </Button>
                  )}
                </div>
              </div>

              {/* 레벨 & 경력 수정 모드 */}
              {isEditing && (
                <div className="grid grid-cols-2 gap-4 max-w-md p-4 bg-muted/40 rounded-2xl border">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Lock size={16} className="text-muted-foreground" />
                      레벨
                    </Label>
                    <div className="bg-background border rounded-md px-3 py-2 text-sm opacity-50 cursor-not-allowed">
                      {draft?.level}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Lock size={16} className="text-muted-foreground" />
                      경력(년)
                    </Label>
                    <div className="bg-background border rounded-md px-3 py-2 text-sm opacity-50 cursor-not-allowed">
                      {draft?.totalCareerYears}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 💡 메인 레이아웃 분할 */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* 왼쪽 컬럼: 소개 & 스킬 */}
          <div className="lg:col-span-2 space-y-12">
            {/* 기술 스택 */}
            <section>
              <h2 className="mb-6 text-2xl font-black flex items-center gap-2">
                <Briefcase size={24} className="text-primary" /> 주요 기술 스택
              </h2>
              {isEditing ? (
                <Card className="rounded-3xl p-6 bg-card">
                  <Label className="mb-4 block">기술 스택 선택</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                    {TECH_STACK_OPTIONS.map((tech) => (
                      <div
                        key={tech}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={draft?.techStack.includes(tech) || false}
                          onChange={(e) => {
                            setDraft((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    techStack: e.target.checked
                                      ? [...prev.techStack, tech]
                                      : prev.techStack.filter(
                                          (t) => t !== tech,
                                        ),
                                  }
                                : null,
                            );
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{tech}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {profile.techStack && profile.techStack.length > 0 ? (
                    profile.techStack.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="px-5 py-2 rounded-full text-sm font-semibold bg-white border dark:bg-zinc-800 text-foreground shadow-sm"
                      >
                        #{skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground bg-muted p-4 rounded-xl">
                      등록된 기술 스택이 없습니다.
                    </p>
                  )}
                </div>
              )}
            </section>

            {/* 찜한/진행 중 퀘스트 */}
            <section>
              <h2 className="mb-6 text-2xl font-black flex items-center gap-2">
                <Award size={24} className="text-primary" /> 내 퀘스트 현황
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="lg:col-span-1">
                  <Card className="rounded-2xl p-6">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <CalendarIcon size={24} />
                        데드라인 캘린더
                      </CardTitle>
                      {getNextDeadline() && (
                        <p className="text-sm text-muted-foreground">
                          다음 데드라인: {getNextDeadline()?.title} (
                          {getNextDeadline()?.days})
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setIsDialogOpen(true);
                        }}
                        modifiers={{
                          deadline: MOCK_QUESTS.map(
                            (q) => new Date(q.deadline),
                          ),
                        }}
                        modifiersClassNames={{
                          deadline: "bg-primary/20 text-primary font-semibold",
                        }}
                        className="rounded-md border-0 w-full"
                      />
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:col-span-1">
                  <div className="mb-4 flex gap-2">
                    {(["전체", "진행중", "찜"] as const).map((filter) => (
                      <Button
                        key={filter}
                        variant={questFilter === filter ? "default" : "outline"}
                        size="sm"
                        onClick={() => setQuestFilter(filter)}
                        className="rounded-full"
                      >
                        {filter}
                      </Button>
                    ))}
                  </div>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {MOCK_QUESTS.filter(
                      (quest) =>
                        questFilter === "전체" || quest.status === questFilter,
                    ).map((quest) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const deadlineDate = new Date(quest.deadline);
                      const daysDiff = Math.ceil(
                        (deadlineDate - today) / (1000 * 60 * 60 * 24),
                      );
                      const dDisplay =
                        daysDiff === 0
                          ? "D-Day"
                          : daysDiff > 0
                            ? `D-${daysDiff}`
                            : `D+${Math.abs(daysDiff)}`;

                      return (
                        <Card
                          key={quest.id}
                          className="rounded-2xl p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-foreground">
                                {quest.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <CalendarIcon size={14} />
                                {quest.deadline} ({dDisplay})
                              </p>
                            </div>
                            <Badge
                              variant={
                                quest.status === "진행중"
                                  ? "default"
                                  : "secondary"
                              }
                              className="ml-4"
                            >
                              {quest.status}
                            </Badge>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>새로운 퀘스트 추가</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="quest-title">퀘스트 제목</Label>
                      <Input
                        id="quest-title"
                        value={newQuestTitle}
                        onChange={(e) => setNewQuestTitle(e.target.value)}
                        placeholder="퀘스트 제목을 입력하세요"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quest-status">상태</Label>
                      <Select
                        value={newQuestStatus}
                        onValueChange={(value: "진행중" | "찜") =>
                          setNewQuestStatus(value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="진행중">진행중</SelectItem>
                          <SelectItem value="찜">찜</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>데드라인</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedDate
                          ? selectedDate.toLocaleDateString()
                          : "날짜를 선택하세요"}
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      취소
                    </Button>
                    <Button onClick={addQuest} disabled={!newQuestTitle.trim()}>
                      추가
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </section>
          </div>

          {/* 💡 오른쪽 컬럼: 통계 & 포트폴리오 */}
          <aside className="space-y-12">
            {/* 통계 카드 그리드 */}
            <section className="space-y-4">
              <Card className="rounded-3xl bg-primary text-primary-foreground shadow-2xl shadow-primary/30 p-6 flex items-center gap-6">
                <DollarSign size={40} className="opacity-70 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium opacity-80">누적 수익</p>
                  <p className="text-4xl font-extrabold tracking-tight">
                    ₩{profile.totalReward.toLocaleString()}
                  </p>
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card className="rounded-2xl p-6 bg-muted/40">
                  <p className="text-xs text-muted-foreground mb-1">
                    완료 퀘스트
                  </p>
                  <p className="text-3xl font-bold flex items-end gap-1">
                    {profile.completedQuestsCount}
                    <span className="text-xs font-normal text-muted-foreground pb-1">
                      건
                    </span>
                  </p>
                </Card>
                <Card className="rounded-2xl p-6 bg-muted/40">
                  <p className="text-xs text-muted-foreground mb-1">
                    보유 뱃지
                  </p>
                  <p className="text-3xl font-bold flex items-end gap-1">
                    {profile.badgeCount}
                    <span className="text-xs font-normal text-muted-foreground pb-1">
                      개
                    </span>
                  </p>
                </Card>
              </div>
            </section>

            {/* 포트폴리오 블로그 */}
            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase size={22} /> 포트폴리오 블로그
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {MOCK_BLOGS.map((blog) => (
                  <a
                    key={blog.id}
                    href="#"
                    className="block p-4 rounded-xl hover:bg-muted/50 transition-colors border"
                  >
                    <p className="font-semibold text-sm line-clamp-1 text-foreground">
                      {blog.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {blog.date}
                    </p>
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* 포트폴리오 링크 수정 (isEditing 모드) */}
            {isEditing && (
              <Card className="rounded-3xl p-6 bg-card space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  {" "}
                  <Link2 size={18} /> 포트폴리오 링크
                </h3>
                <Input
                  name="portfolioUrl"
                  value={draft?.portfolioUrl}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </Card>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
