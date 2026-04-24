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
import { User, Briefcase, DollarSign, Award, Settings, Save, X, Link2, Lock, Calendar as CalendarIcon, Bell, Wallet, Coins } from 'lucide-react'

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
  userId?: number;
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
  const [profile, setProfile] = useState<FreelancerProfile | null>(null)
  const [draft, setDraft] = useState<ProfileDraft | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [questFilter, setQuestFilter] = useState<'전체' | '진행중' | '찜'>('전체')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newQuestTitle, setNewQuestTitle] = useState('')
  const [newQuestStatus, setNewQuestStatus] = useState<'진행중' | '찜'>('진행중')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [walletBalance, setWalletBalance] = useState<number | null>(null)
  const [walletLoading, setWalletLoading] = useState(true)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [withdrawBank, setWithdrawBank] = useState('국민')
  const [withdrawHolder, setWithdrawHolder] = useState('')
  const [withdrawAccount, setWithdrawAccount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawError, setWithdrawError] = useState('')
  const [withdrawSubmitting, setWithdrawSubmitting] = useState(false)


  // 1. fetchWallet을 useEffect보다 먼저 정의하세요.
  const fetchWallet = async (userId: number) => {
    setWalletLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/settlement/wallet/${userId}`);
      if (!response.ok) throw new Error("지갑 정보 로드 실패");
      const data = await response.json();
      setWalletBalance(data.balance); // 여기서 잔액이 업데이트됩니다.
    } catch (error) {
      console.error("Wallet fetch error:", error);
      setWalletBalance(0);
    } finally {
      setWalletLoading(false);
    }
  };

  // 2. ⭐ fetchProfile을 useEffect 밖으로 꺼내서 정의합니다.
  const fetchProfile = async () => {
    const decodedUsername = decodeURIComponent(params.username);
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/user/${decodedUsername}`);
      if (!response.ok) throw new Error("프로필 로드 실패");

      const data = await response.json();
      setProfile(data);
      setDraft({
        nickname: data.nickname || '',
        profileImageUrl: data.profileImageUrl || '',
        intro: data.intro || '',
        portfolioUrl: data.portfolioUrl || '',
        level: data.level || 'BRONZE',
        totalCareerYears: data.totalCareerYears || 0,
        techStack: data.techStack || []
      });

      if (data.userId) {
        fetchWallet(data.userId);
      }
    } catch (error) {
      console.error("❌ 프로필 로드 에러:", error);
    } finally {
      setIsLoading(false);
    }
  };

// 3. 페이지 로드 시에는 fetchProfile만 호출
  useEffect(() => {
    if (params.username) {
      fetchProfile();
    }
  }, [params.username]);

// 4. 출금 핸들러 수정
  const handleWithdrawSubmit = async () => {
    setWithdrawError('');
    const amountNumber = Number(withdrawAmount.replace(/,/g, ''));

    if (!profile?.userId) return;
    // ... (유효성 검사 로직 생략) ...

    setWithdrawSubmitting(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/settlement/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.userId,
          amount: amountNumber,
          bankName: withdrawBank,
          accountNumber: withdrawAccount,
          accountHolder: withdrawHolder
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '출금 요청을 처리하지 못했습니다.');
      }

      alert('출금 신청이 완료되었습니다.');

      // 모달 및 입력값 초기화
      setIsWithdrawOpen(false);
      setWithdrawBank('국민');
      setWithdrawHolder('');
      setWithdrawAccount('');
      setWithdrawAmount('');

      // ⭐ 핵심: 여기서 두 함수를 호출하여 화면을 갱신합니다.
      // fetchProfile이 밖으로 나왔기 때문에 이제 정상 호출됩니다!
      await fetchWallet(profile.userId);
      await fetchProfile();

    } catch (error: any) {
      console.error('Withdraw error:', error);
      setWithdrawError(error.message || '출금 신청 중 오류가 발생했습니다.');
    } finally {
      setWithdrawSubmitting(false);
    }
  };
  // 5. 파일 변경 핸들러 (이게 없어서 에러가 났던 겁니다!)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string
        // 이미지 미리보기를 위해 draft 상태 업데이트
        setDraft((prev: any) => prev ? { ...prev, profileImageUrl: result } : null)
      }
      reader.readAsDataURL(file)
    }
  };

// 6. 입력값 변경 핸들러 (혹시 이것도 에러 나면 추가하세요)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDraft((prev: any) => prev ? { ...prev, [name]: value } : null)
  }

  const addQuest = () => {
    if (selectedDate && newQuestTitle.trim()) {
      const newQuest = {
        id: MOCK_QUESTS.length + 1,
        title: newQuestTitle,
        status: newQuestStatus,
        deadline: selectedDate.toISOString().split("T")[0],
      };
      // 실제로는 API 호출, 여기서는 Mock 업데이트
      MOCK_QUESTS.push(newQuest)
      setNewQuestTitle('')
      setNewQuestStatus('진행중')
      setSelectedDate(undefined)
      setIsDialogOpen(false)
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
    const daysDiff = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

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
            techStack: draft.techStack, // 💡 기술 스택 데이터 추가
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
  // 비밀번호 변경 모달 상태
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordDraft, setPasswordDraft] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const handlePasswordChange = async () => {
    // 1. 유효성 검사
    if (passwordDraft.newPassword !== passwordDraft.confirmPassword) {
      alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsPasswordLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/user/${profile?.username}/password`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: passwordDraft.currentPassword,
            newPassword: passwordDraft.newPassword,
          }),
        },
      );

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || "비밀번호 수정 실패");
      }

      alert("비밀번호가 성공적으로 변경되었습니다.");
      setIsPasswordModalOpen(false);
      setPasswordDraft({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsPasswordLoading(false);
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
    <div className="min-h-screen bg-white text-[#1e293b]">
      <GlobalNav />

      {/* 💡 상단 프로필 헤더 비주얼 강화 */}
      <section className="relative overflow-hidden bg-white pt-32 pb-8">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative">
          <div className="flex flex-row items-center gap-8">
            {/* 이미지 수정 부분 */}
            <div className="relative group">
              <img
                src={
                  isEditing
                    ? draft?.profileImageUrl ||
                      "https://api.dicebear.com/8.x/notionists/svg?seed=Felix&backgroundColor=ffdfbf&backgroundRotation=0,360&beardProbability=0&glassesProbability=100&glasses=variant02&smileProbability=100"
                    : profile.profileImageUrl ||
                      "https://api.dicebear.com/8.x/notionists/svg?seed=Felix&backgroundColor=ffdfbf&backgroundRotation=0,360&beardProbability=0&glassesProbability=100&glasses=variant02&smileProbability=100"
                }
                alt="Profile Avatar"
                className="h-64 w-64 rounded-3xl border-2 border-white object-cover shadow-xl transition-transform duration-300 group-hover:rotate-3 cursor-pointer"
                onClick={() => isEditing && fileInputRef.current?.click()}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                hidden
              />
              {isEditing && (
                <div className="absolute inset-x-2 bottom-2">
                  <Input
                    name="profileImageUrl"
                    value={draft?.profileImageUrl}
                    onChange={handleInputChange}
                    className="h-8 text-xs bg-white/80"
                    placeholder="https://..."
                  />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-6">
              <div className="flex flex-col gap-4">
                {isEditing ? (
                  /* 닉네임 & 소개글 수정 모드 */
                  <div className="space-y-2 flex-1 max-w-md">
                    <Label>닉네임</Label>
                    <Input
                      name="nickname"
                      value={draft?.nickname}
                      onChange={handleInputChange}
                      className="text-4xl font-black bg-white rounded-2xl"
                      placeholder="활동 이름을 적어주세요."
                    />
                    <Label>소개글</Label>
                    <Textarea
                      name="intro"
                      rows={4}
                      value={draft?.intro}
                      onChange={handleInputChange}
                      placeholder="전문 분야나 프로젝트 경험을 자유롭게 적어주세요."
                      className="bg-white leading-relaxed rounded-2xl"
                    />
                  </div>
                ) : (
                  /* 일반 표시 모드 */
                  <div className="space-y-2">
                    <h1 className="text-7xl font-extrabold tracking-tighter text-[#1e293b] flex items-center gap-4">
                      {profile.nickname}{" "}
                      <Badge className="px-4 py-2 rounded-full text-sm font-semibold bg-[#FEF3C7] text-[#92400E] border-0">
                        {profile.level}
                      </Badge>
                    </h1>
                    <p className="text-lg text-[#1e293b] font-medium">
                      @{profile.username} / 경력 {profile.totalCareerYears}년차
                    </p>
                    {profile.intro && (
                      <p className="text-base text-[#1e293b] mt-4 leading-relaxed font-normal italic">
                        "{profile.intro}"
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-4 justify-end">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={saveProfile}
                        size="default"
                        className="rounded-2xl gap-2 px-6 bg-purple-600 hover:bg-purple-700 text-white border-0 shadow-lg"
                      >
                        {" "}
                        <Save size={20} /> 저장{" "}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setIsEditing(false)}
                        className="rounded-2xl gap-2 px-6 border-gray-300 text-gray-700 hover:bg-gray-100"
                      >
                        {" "}
                        <X size={20} /> 취소{" "}
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* 🔒 비밀번호 변경 모달 추가 */}
                      <Dialog
                        open={isPasswordModalOpen}
                        onOpenChange={setIsPasswordModalOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="default"
                            className="rounded-2xl px-6 text-purple-600 hover:bg-purple-50 hover:text-purple-700 shadow-sm"
                          >
                            비밀번호 변경
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-106.25 rounded-2xl">
                          <div className="grid gap-6 py-6">
                            <div className="space-y-2">
                              <Label>현재 비밀번호</Label>
                              <Input
                                type="password"
                                value={passwordDraft.currentPassword}
                                onChange={(e) =>
                                  setPasswordDraft({
                                    ...passwordDraft,
                                    currentPassword: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <Separator />
                            <div className="space-y-2">
                              <Label>새 비밀번호</Label>
                              <Input
                                type="password"
                                value={passwordDraft.newPassword}
                                onChange={(e) =>
                                  setPasswordDraft({
                                    ...passwordDraft,
                                    newPassword: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>새 비밀번호 확인</Label>
                              <Input
                                type="password"
                                value={passwordDraft.confirmPassword}
                                onChange={(e) =>
                                  setPasswordDraft({
                                    ...passwordDraft,
                                    confirmPassword: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setIsDialogOpen(false)}
                              className="rounded-xl"
                            >
                              취소
                            </Button>
                            <Button
                              onClick={handlePasswordChange}
                              disabled={isPasswordLoading}
                              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                            >
                              {isPasswordLoading
                                ? "변경 중..."
                                : "비밀번호 수정 완료"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="default"
                        onClick={() => setIsEditing(true)}
                        className="rounded-2xl px-6 text-purple-600 hover:bg-purple-50 hover:text-purple-700 shadow-sm"
                      >
                        {" "}
                        프로필 수정{" "}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* 레벨, 경력 & 알림 설정 섹션 (수정 모드일 때만 표시) */}
              {isEditing && (
                <div className="flex flex-col gap-4 max-w-4xl">
                  {/* 기존 레벨 & 경력 */}
                  <div className="grid grid-cols-2 gap-4 flex-1 p-4 bg-gray-50 rounded-2xl border-0 shadow-sm">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        {" "}
                        <Lock size={16} className="text-slate-500" /> 레벨{" "}
                      </Label>
                      <div className="bg-white border rounded-md px-3 py-2 text-sm opacity-50 cursor-not-allowed">
                        {" "}
                        {draft?.level}{" "}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        {" "}
                        <Lock size={16} className="text-slate-500" />{" "}
                        경력(년){" "}
                      </Label>
                      <div className="bg-white border rounded-md px-3 py-2 text-sm opacity-50 cursor-not-allowed">
                        {" "}
                        {draft?.totalCareerYears}{" "}
                      </div>
                    </div>
                  </div>

                  {/* 🔔 알림 설정 토글 추가 */}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 💡 메인 레이아웃 분할 */}
      <main className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* 왼쪽 컬럼: 소개 & 스킬 */}
          <div className="lg:col-span-2 space-y-16">
            {/* 기술 스택 */}
            <section>
              <h2 className="mb-4 text-3xl font-black text-[#1e293b] flex items-center gap-3">
                <Briefcase size={28} className="text-purple-600" /> 주요 기술
                스택
              </h2>
              {isEditing ? (
                <Card className="rounded-3xl p-8 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-0">
                  <Label className="mb-4 block">기술 스택 선택</Label>
                  <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                    {TECH_STACK_OPTIONS.map((tech) => (
                      <div
                        key={tech}
                        className="flex items-center gap-3 cursor-pointer"
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
                <div className="flex flex-wrap gap-2">
                  {profile.techStack && profile.techStack.length > 0 ? (
                    profile.techStack.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 border-0"
                      >
                        #{skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 bg-gray-50 p-4 rounded-2xl">
                      등록된 기술 스택이 없습니다.
                    </p>
                  )}
                </div>
              )}

                <Card className="rounded-3xl bg-linear-to-r from-green-50 to-emerald-50 text-[#1e293b] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-8 border-0">
                  {/* 위: 아이콘 + 텍스트 + 금액 */}
                  <div className="flex items-center gap-6 mb-6">
                    <Wallet size={48} className="opacity-80 shrink-0 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium opacity-90">내 지갑</p>
                      <p className="text-4xl lg:text-5xl font-extrabold tracking-tight text-green-700">
                        {walletLoading ? '---' : `₩${walletBalance?.toLocaleString() || '0'}`}
                      </p>
                      <p className="text-sm text-slate-600 mt-2">안전하게 출금할 수 있습니다.</p>
                    </div>
                  </div>

                  {/* 아래: 출금 신청 버튼 */}
                  <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full rounded-full px-8 py-3 bg-green-600 text-white hover:bg-green-700 shadow-md">
                        출금 신청
                      </Button>
                    </DialogTrigger>
                      <DialogContent className="sm:max-w-130 rounded-3xl">
                        <DialogHeader>
                          <DialogTitle>출금 신청</DialogTitle>
                          <p className="text-sm text-slate-500 mt-2">은행 정보와 출금 금액을 입력하여 안전하게 요청하세요.</p>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label>은행</Label>
                            <Select value={withdrawBank} onValueChange={setWithdrawBank}>
                              <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="은행 선택" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="국민">국민</SelectItem>
                                <SelectItem value="신한">신한</SelectItem>
                                <SelectItem value="우리">우리</SelectItem>
                                <SelectItem value="농협">농협</SelectItem>
                                <SelectItem value="하나">하나</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label>예금주</Label>
                            <Input
                              value={withdrawHolder}
                              onChange={(e) => setWithdrawHolder(e.target.value)}
                              placeholder="예금주 이름 입력"
                              className="rounded-xl"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>계좌번호</Label>
                            <Input
                              value={withdrawAccount}
                              onChange={(e) => setWithdrawAccount(e.target.value)}
                              placeholder="123-456-789012"
                              className="rounded-xl"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>출금 금액</Label>
                            <Input
                              type="number"
                              value={withdrawAmount}
                              onChange={(e) => setWithdrawAmount(e.target.value)}
                              placeholder={walletLoading ? '잔액 로딩 중...' : `최대 ₩${walletBalance?.toLocaleString() || '0'}`}
                              className="rounded-xl"
                            />
                            <p className="text-sm text-slate-500">현재 잔액: {walletLoading ? '---' : `₩${walletBalance?.toLocaleString() || '0'}`}</p>
                          </div>
                          {withdrawError && <p className="text-sm text-red-600">{withdrawError}</p>}
                        </div>
                        <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                          <Button variant="outline" onClick={() => setIsWithdrawOpen(false)} className="rounded-xl">
                            닫기
                          </Button>
                          <Button onClick={handleWithdrawSubmit} disabled={withdrawSubmitting} className="rounded-xl bg-green-600 text-white hover:bg-green-700">
                            {withdrawSubmitting ? '신청 중...' : '출금 신청'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="rounded-3xl p-8 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-0">
                    <p className="text-xs text-slate-500 mb-1">완료 퀘스트</p>
                    <p className="text-3xl font-bold flex items-end gap-1">{profile.completedQuestsCount}<span className="text-xs font-normal text-slate-500 pb-1">건</span></p>
                  </Card>
                  <Card className="rounded-3xl p-8 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-0">
                    <p className="text-xs text-slate-500 mb-1">보유 뱃지</p>
                    <p className="text-3xl font-bold flex items-end gap-1">{profile.badgeCount}<span className="text-xs font-normal text-slate-500 pb-1">개</span></p>
                  </Card>
                </div>
                <div className="lg:col-span-1">
                  <div className="mb-4 flex gap-3">
                    {(["전체", "진행중", "찜"] as const).map((filter) => (
                      <Button
                        key={filter}
                        variant="outline"
                        size="sm"
                        onClick={() => setQuestFilter(filter)}
                        className="rounded-full px-4 py-2 border-purple-300 text-purple-600 hover:bg-purple-50 transition-all duration-200"
                      >
                        {filter}
                      </Button>
                    ))}
                  </div>
                  <div className="space-y-6 max-h-96 overflow-y-auto">
                    {MOCK_QUESTS.filter(
                      (quest) =>
                        questFilter === "전체" || quest.status === questFilter,
                    ).map((quest) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const deadlineDate = new Date(quest.deadline);
                      const daysDiff = Math.ceil(
                        (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
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
                          className="rounded-3xl p-8 hover:shadow-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-shadow duration-200 border-0"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-[#1e293b]">
                                {quest.title}
                              </p>
                              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
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
                              className="ml-4 px-3 py-1 rounded-full bg-purple-100 text-purple-800 border-0"
                            >
                              {quest.status}
                            </Badge>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="rounded-3xl">
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
                        className="rounded-xl"
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
                        <SelectTrigger className="rounded-xl">
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
                      <p className="text-sm text-slate-500 mt-1">
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
                      className="rounded-xl"
                    >
                      취소
                    </Button>
                    <Button
                      onClick={addQuest}
                      disabled={!newQuestTitle.trim()}
                      className="rounded-xl"
                    >
                      추가
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </section>
          </div>

          {/* 💡 오른쪽 컬럼: 통계 & 포트폴리오 */}
          <aside className="space-y-16">
            {/* 통계 카드 그리드 */}
            <section className="space-y-4">
              <Card className="rounded-3xl bg-white text-[#1e293b] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-8 flex items-center gap-4 border-0">
                <DollarSign
                  size={48}
                  className="opacity-80 shrink-0 text-purple-600"
                />
                <div>
                  <p className="text-sm font-medium opacity-90">누적 수익</p>
                  <p className="text-5xl font-extrabold tracking-tight">
                    ₩{profile?.totalReward.toLocaleString()}
                  </p>
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card className="rounded-3xl p-8 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-0">
                  <p className="text-xs text-slate-500 mb-1">완료 퀘스트</p>
                  <p className="text-3xl font-bold flex items-end gap-1">
                    {profile?.completedQuestsCount}
                    <span className="text-xs font-normal text-slate-500 pb-1">
                      건
                    </span>
                  </p>
                </Card>
                <Card className="rounded-3xl p-8 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-0">
                  <p className="text-xs text-slate-500 mb-1">보유 뱃지</p>
                  <p className="text-3xl font-bold flex items-end gap-1">
                    {profile?.badgeCount}
                    <span className="text-xs font-normal text-slate-500 pb-1">
                      개
                    </span>
                  </p>
                </Card>
              </div>
            </section>

            {/* 포트폴리오 블로그 */}
            <Card className="rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-[#1e293b]">
                  <Briefcase size={24} className="text-purple-600" /> 포트폴리오
                  블로그
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                {MOCK_BLOGS.map((blog) => (
                  <a
                    key={blog.id}
                    href="#"
                    className="block p-6 rounded-2xl hover:bg-gray-50 transition-colors border border-gray-200"
                  >
                    <p className="font-semibold text-sm line-clamp-1 text-[#1e293b]">
                      {blog.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">{blog.date}</p>
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* 포트폴리오 링크 수정 (isEditing 모드) */}
            {isEditing && (
              <Card className="rounded-3xl p-8 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 border-0">
                <h3 className="font-semibold flex items-center gap-3 text-lg">
                  {" "}
                  <Link2 size={20} className="text-purple-600" /> 포트폴리오
                  링크
                </h3>
                <Input
                  name="portfolioUrl"
                  value={draft?.portfolioUrl}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="rounded-xl"
                />
              </Card>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
