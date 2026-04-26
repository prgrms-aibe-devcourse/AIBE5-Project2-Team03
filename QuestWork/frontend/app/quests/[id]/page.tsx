"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { GlobalNav } from "@/components/global-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  addStoredAppliedQuest,
  createStoredAppliedQuest,
  getStoredAppliedQuests,
  removeStoredAppliedQuest,
} from "@/lib/applied-quests";
import { getStoredSubmissions } from "@/lib/quest-submissions";
import {
  Trophy,
  Calendar,
  Clock,
  Users,
  FileText,
  Building2,
  CheckCircle,
  AlertCircle,
  Star,
  Award,
  ChevronRight,
} from "lucide-react";

interface QuestApiResponse {
  id: number;
  managerId: number;
  title: string;
  formData: Record<string, unknown>;
  rewardAmount: number;
  deadline: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ManagerProfile {
  username: string;
  nickname: string;
  managerName: string;
  companyName: string;
  managerType: string;
  approved: boolean;
}

interface MySubmissionResponse {
  questId?: number | string;
}

const STATUS_LABELS: Record<string, string> = {
  OPEN: "모집 중",
  CLOSED: "마감",
  IN_PROCESS: "진행 중",
  FINISHED: "완료",
  PICKED: "선정 완료",
  CANCELED: "취소",
};

const STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-green-100 text-green-700 border-green-200",
  CLOSED: "bg-gray-100 text-gray-600 border-gray-200",
  IN_PROCESS: "bg-blue-100 text-blue-700 border-blue-200",
  FINISHED: "bg-purple-100 text-purple-700 border-purple-200",
  PICKED: "bg-amber-100 text-amber-700 border-amber-200",
  CANCELED: "bg-red-100 text-red-600 border-red-200",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  Beginner: "초급",
  Intermediate: "중급",
  Advanced: "고급",
};

export default function QuestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const questId = params.id as string;
  const [quest, setQuest] = useState<QuestApiResponse | null>(null);
  const [manager, setManager] = useState<ManagerProfile | null>(null);
  const [similarQuests, setSimilarQuests] = useState<QuestApiResponse[]>([]);
  const [stats, setStats] = useState({
    applicantCount: 0,
    submissionCount: 0,
    reviewingCount: 0,
    selectedCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [hasSubmission, setHasSubmission] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [submissionCount, setSubmissionCount] = useState(0);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);

    const userId = localStorage.getItem("userId");
    setCurrentUserId(userId);
    if (!userId || role === "MANAGER") return;

    const storedApplication = getStoredAppliedQuests(userId).find(
      (item) => item.questId === questId,
    );
    if (storedApplication) {
      setApplied(true);
      setApplicationId(storedApplication.applicationId ?? null);
    }

    const checkApplication = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/quests/${questId}/applications/me?userId=${userId}`,
        );
        if (res.ok) {
          const data = await res.json();
          setApplicationId(data.applicationId);
          setApplied(true);
          if (quest) {
            addStoredAppliedQuest(
              createStoredAppliedQuest(quest, userId, data.applicationId),
            );
          }
        }
      } catch {
        // ignore
      }
    };
    checkApplication();
  }, [questId, quest]);

  useEffect(() => {
    if (!currentUserId || userRole === "MANAGER") {
      setHasSubmission(false);
      return;
    }

    const hasLocalSubmission = getStoredSubmissions(currentUserId).some(
      (submission) => submission.questId === questId,
    );
    setHasSubmission(hasLocalSubmission);

    const checkMySubmissions = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/quests/my-submissions?userId=${currentUserId}`,
        );
        if (!res.ok) return;

        const data: MySubmissionResponse[] = await res.json();
        if (!Array.isArray(data)) return;

        setHasSubmission(
          data.some((submission) => String(submission.questId) === questId),
        );
      } catch {
        // localStorage fallback is enough for the current frontend flow.
      }
    };

    checkMySubmissions();
  }, [questId, currentUserId, userRole]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/quests/${questId}`);
        if (!res.ok) {
          setQuest(null);
          return;
        }
        const data: QuestApiResponse = await res.json();
        setQuest(data);

        // 매니저 정보
        try {
          const mRes = await fetch(
            `http://localhost:8000/api/manager/${data.managerId}`,
          );
          if (mRes.ok) setManager(await mRes.json());
        } catch {
          /* ignore */
        }

        // 같은 의뢰인의 다른 퀘스트
        try {
          const sRes = await fetch(
            `http://localhost:8000/api/quests/manager/${data.managerId}`,
          );
          if (sRes.ok) {
            const all: QuestApiResponse[] = await sRes.json();
            setSimilarQuests(
              all
                .filter((q) => q.id !== data.id && q.status === "OPEN")
                .slice(0, 3),
            );
          }
        } catch {
          /* ignore */
        }
      } catch {
        setQuest(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [questId]);

  // 활동 통계 폴링 (10초마다 갱신)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/quests/${questId}/stats`,
        );
        if (res.ok) setStats(await res.json());
      } catch {
        /* ignore */
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [questId]);

  const formatDeadline = (deadline: string) => {
    const diff = Math.ceil(
      (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    return diff > 0 ? `${diff}일 남음` : "마감";
  };

  const formatReward = (amount: number) => `₩${amount.toLocaleString("ko-KR")}`;

  const formatPostedDate = (createdAt: string) => {
    const diff = Math.floor(
      (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diff === 0) return "오늘 등록";
    if (diff === 1) return "어제 등록";
    return `${diff}일 전 등록`;
  };

  const handleApply = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }
    setApplying(true);
    setApplyError(null);
    try {
      const res = await fetch(
        `http://localhost:8000/api/quests/${questId}/applications?userId=${userId}`,
        { method: "POST" },
      );
      if (res.ok) {
        const data = await res.json();
        setApplicationId(data.applicationId);
        setApplied(true);
        if (quest) {
          addStoredAppliedQuest(
            createStoredAppliedQuest(quest, userId, data.applicationId),
          );
        }
        // 통계 즉시 갱신
        const sRes = await fetch(
          `http://localhost:8000/api/quests/${questId}/stats`,
        ).catch(() => null);
        if (sRes?.ok) setStats(await sRes.json());
      } else {
        const errorText = await res.text();
        let message = errorText;
        try {
          const parsed = JSON.parse(errorText);
          message = parsed.message || message;
        } catch {
          // plain text response
        }

        if (message.includes("이미 지원")) {
          setApplied(true);
          if (quest) {
            addStoredAppliedQuest(createStoredAppliedQuest(quest, userId));
          }
          setApplyError(null);
          return;
        }

        setApplyError(message || "지원에 실패했습니다.");
      }
    } catch {
      setApplyError("서버 연결에 실패했습니다.");
    } finally {
      setApplying(false);
    }
  };

  const handleCancel = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId || !applicationId) return;
    setCancelling(true);
    setApplyError(null);
    try {
      const res = await fetch(
        `http://localhost:8000/api/quests/applications/${applicationId}/cancel?userId=${userId}`,
        { method: "PATCH" },
      );
      if (res.ok) {
        setApplied(false);
        setApplicationId(null);
        removeStoredAppliedQuest(questId, userId);
        // 통계 즉시 갱신
        const sRes = await fetch(
          `http://localhost:8000/api/quests/${questId}/stats`,
        ).catch(() => null);
        if (sRes?.ok) setStats(await sRes.json());
      } else {
        const data = await res.json().catch(() => ({}));
        setApplyError(data.message || "취소에 실패했습니다.");
      }
    } catch {
      setApplyError("서버 연결에 실패했습니다.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalNav />
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-foreground-muted">
              퀘스트 불러오는 중...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalNav />
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-foreground-muted" />
          <h1 className="text-2xl font-bold text-foreground">
            퀘스트를 찾을 수 없습니다
          </h1>
          <p className="mt-2 text-foreground-muted">
            {questId}번 퀘스트가 존재하지 않습니다.
          </p>
          <Link href="/quests">
            <Button className="mt-6">퀘스트 목록으로</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formData = quest.formData as Record<string, unknown>;
  const description = (formData?.description as string) ?? "";
  const techStack: string[] = Array.isArray(formData?.techStack)
    ? (formData.techStack as string[])
    : [];
  const difficulty = (formData?.difficulty as string) ?? "";
  const submissionFormats: string[] = Array.isArray(formData?.submissionFormats)
    ? (formData.submissionFormats as string[])
    : [];

  const deadlineText = formatDeadline(quest.deadline);
  const postedText = formatPostedDate(quest.createdAt);
  const statusLabel = STATUS_LABELS[quest.status] ?? quest.status;
  const statusColor =
    STATUS_COLORS[quest.status] ?? "bg-gray-100 text-gray-600";
  const difficultyLabel = DIFFICULTY_LABELS[difficulty] ?? difficulty;
  const hasSubmittedResult = hasSubmission;

  const managerDisplayName =
    manager?.companyName || manager?.nickname || `매니저 #${quest.managerId}`;
  const managerType =
    manager?.managerType === "COMPANY"
      ? "기업"
      : manager?.managerType === "INDIVIDUAL"
        ? "개인"
        : "-";

  const infoItems = [
    {
      icon: Trophy,
      label: "보상",
      value: formatReward(quest.rewardAmount),
      highlight: true,
    },
    { icon: Calendar, label: "마감", value: deadlineText, highlight: false },
    {
      icon: Star,
      label: "난이도",
      value: difficultyLabel || "미설정",
      highlight: false,
    },
    {
      icon: FileText,
      label: "제출 형식",
      value:
        submissionFormats.length > 0
          ? submissionFormats
              .map((f) =>
                f === "github" ? "GitHub" : f === "file" ? "파일" : f,
              )
              .join(", ")
          : "미설정",
      highlight: false,
    },
    {
      icon: Clock,
      label: "등록일",
      value: new Date(quest.createdAt).toLocaleDateString("ko-KR"),
      highlight: false,
    },
    {
      icon: Building2,
      label: "의뢰 유형",
      value: managerType,
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      {/* Page Header */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-1 text-xs text-foreground-muted">
            <Link
              href="/quests"
              className="hover:text-primary transition-colors"
            >
              퀘스트
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span>상세 보기</span>
          </nav>

          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              {quest.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-foreground-muted">
              <span>{postedText}</span>
              <span>·</span>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor}`}
              >
                {statusLabel}
              </span>
              {techStack.length > 0 && (
                <>
                  <span>·</span>
                  <span>
                    {techStack[0]}
                    {techStack.length > 1
                      ? ` 외 ${techStack.length - 1}개`
                      : ""}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Summary */}
            {description && (
              <section className="rounded-xl border border-border bg-surface p-6">
                <h2 className="mb-3 text-base font-bold text-foreground">
                  요약
                </h2>
                <p className="whitespace-pre-line leading-relaxed text-foreground-muted">
                  {description}
                </p>
              </section>
            )}

            {/* Info Grid */}
            <section className="rounded-xl border border-border bg-surface p-6">
              <h2 className="mb-5 text-base font-bold text-foreground">
                퀘스트 정보
              </h2>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                {infoItems.map(({ icon: Icon, label, value, highlight }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0 rounded-lg bg-primary/10 p-2">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-foreground-muted">{label}</p>
                      <p
                        className={`mt-0.5 text-sm font-semibold ${highlight ? "text-primary" : "text-foreground"}`}
                      >
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            {techStack.length > 0 && (
              <section className="rounded-xl border border-border bg-surface p-6">
                <h2 className="mb-4 text-base font-bold text-foreground">
                  스킬 & 기술 스택
                </h2>
                <p className="mb-2 text-xs font-medium text-foreground-muted">
                  필수 스킬
                </p>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="border-primary/30 bg-primary/5 text-primary"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {/* Activity */}
            <section className="rounded-xl border border-border bg-surface p-6">
              <h2 className="mb-4 text-base font-bold text-foreground">
                이 퀘스트의 활동
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  {
                    icon: Users,
                    label: "지원자",
                    value: `${stats.applicantCount}명`,
                  },
                  {
                    icon: FileText,
                    label: "제출물",
                    value: `${stats.submissionCount}건`,
                  },
                  {
                    icon: CheckCircle,
                    label: "검토 중",
                    value: `${stats.reviewingCount}건`,
                  },
                  {
                    icon: Award,
                    label: "최종 선정",
                    value:
                      stats.selectedCount > 0
                        ? `${stats.selectedCount}명`
                        : "-",
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex flex-col gap-1 rounded-lg bg-background p-4"
                  >
                    <Icon className="h-4 w-4 text-foreground-muted" />
                    <span className="text-xl font-bold text-foreground">
                      {value}
                    </span>
                    <span className="text-xs text-foreground-muted">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* About Manager */}
            <section className="rounded-xl border border-border bg-surface p-6">
              <h2 className="mb-4 text-base font-bold text-foreground">
                의뢰인 정보
              </h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {managerDisplayName}
                  </p>
                  <p className="text-xs text-foreground-muted">
                    {managerType} 회원{manager?.approved ? " · ✓ 인증됨" : ""}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                {[
                  { label: "가입 유형", value: managerType },
                  {
                    label: "계정 상태",
                    value: manager?.approved ? "✓ 인증됨" : "미인증",
                  },
                  { label: "담당자", value: manager?.managerName || "-" },
                  { label: "닉네임", value: manager?.nickname || "-" },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg bg-background p-3">
                    <p className="text-foreground-muted">{label}</p>
                    <p className="mt-0.5 font-semibold text-foreground">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div>
            <div className="sticky top-24 space-y-4">
              {/* Reward + Actions */}
              <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                <div className="mb-5 text-center">
                  <p className="text-3xl font-bold text-primary">
                    {formatReward(quest.rewardAmount)}
                  </p>
                  <p className="mt-1 text-xs text-foreground-muted">
                    퀘스트 보상금
                  </p>
                </div>
                <div className="mb-5 grid grid-cols-2 divide-x divide-border border-t border-border pt-4 text-center">
                  <div className="pr-4">
                    <p className="text-sm font-semibold text-foreground">
                      {deadlineText}
                    </p>
                    <p className="text-xs text-foreground-muted">마감</p>
                  </div>
                  <div className="pl-4">
                    <p
                      className={`text-sm font-semibold ${quest.status === "OPEN" ? "text-green-600" : "text-foreground"}`}
                    >
                      {statusLabel}
                    </p>
                    <p className="text-xs text-foreground-muted">상태</p>
                  </div>
                </div>

                {userRole !== "MANAGER" && (
                  <div className="space-y-2">
                    {applied ? (
                      <>
                        <Button
                          className="w-full bg-green-600 text-white hover:bg-green-700 cursor-default"
                          disabled
                        >
                          ✓ 참여 중
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-red-300 text-red-600 hover:bg-red-50"
                          onClick={handleCancel}
                          disabled={cancelling}
                        >
                          {cancelling ? "취소 중..." : "참여 취소하기"}
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
                        onClick={handleApply}
                        disabled={applying || quest.status !== "OPEN"}
                      >
                        {applying
                          ? "신청 중..."
                          : quest.status !== "OPEN"
                            ? "모집 마감"
                            : "퀘스트 참여하기"}
                      </Button>
                    )}
                    {applyError && (
                      <p className="text-center text-xs text-red-500">
                        {applyError}
                      </p>
                    )}
                    {hasSubmittedResult ? (
                      <Button
                        variant="outline"
                        className="w-full cursor-default border-primary/25 bg-primary-light/70 text-primary hover:bg-primary-light/70 hover:text-primary"
                        disabled
                      >
                        제출 완료 · 검토중
                      </Button>
                    ) : (
                      <Link
                        href={`/quests/${questId}/submit`}
                        className="block"
                      >
                        <Button variant="outline" className="w-full">
                          결과 제출하기
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Submission Formats */}
              {submissionFormats.length > 0 && (
                <div className="rounded-xl border border-border bg-surface p-5">
                  <h3 className="mb-3 text-sm font-semibold text-foreground">
                    제출 형식
                  </h3>
                  <ul className="space-y-2">
                    {submissionFormats.map((fmt) => (
                      <li
                        key={fmt}
                        className="flex items-center gap-2 text-sm text-foreground-muted"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                        {fmt === "github"
                          ? "GitHub Repository"
                          : fmt === "file"
                            ? "파일 업로드"
                            : fmt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Difficulty badge */}
              {difficultyLabel && (
                <div className="rounded-xl border border-border bg-surface p-5">
                  <h3 className="mb-3 text-sm font-semibold text-foreground">
                    난이도
                  </h3>
                  <Badge
                    className={
                      difficulty === "Beginner"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : difficulty === "Intermediate"
                          ? "bg-amber-100 text-amber-700 border-amber-200"
                          : "bg-red-100 text-red-700 border-red-200"
                    }
                    variant="outline"
                  >
                    {difficultyLabel}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Quests */}
        {similarQuests.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 text-xl font-bold text-foreground">
              같은 의뢰인의 다른 퀘스트
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {similarQuests.map((q) => {
                const fd = q.formData as Record<string, unknown>;
                const stack: string[] = Array.isArray(fd?.techStack)
                  ? (fd.techStack as string[])
                  : [];
                return (
                  <Link key={q.id} href={`/quests/${q.id}`}>
                    <div className="group rounded-xl border border-border bg-surface p-5 transition-all hover:border-primary/50 hover:shadow-md">
                      <h3 className="line-clamp-2 font-semibold text-foreground group-hover:text-primary">
                        {q.title}
                      </h3>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-bold text-primary">
                          {formatReward(q.rewardAmount)}
                        </span>
                        <span className="text-xs text-foreground-muted">
                          {formatDeadline(q.deadline)}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {stack.slice(0, 3).map((t) => (
                          <Badge key={t} variant="outline" className="text-xs">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
