"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { GlobalNav } from "@/components/global-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  addStoredAppliedQuest,
  createStoredAppliedQuest,
} from "@/lib/applied-quests";

interface QuestData {
  id: number;
  title: string;
  rewardAmount: number;
  deadline: string;
  status: string;
  formData: {
    description?: string;
    techStack?: string[];
    difficulty?: string;
  };
}

const STATUS_LABEL: Record<string, string> = {
  OPEN: "모집 중",
  CLOSED: "모집 완료",
  IN_PROCESS: "진행 중",
  FINISHED: "종료",
  PICKED: "참여 신청 완료",
  CANCELED: "취소됨",
};

export default function QuestApplyPage() {
  const params = useParams();
  const router = useRouter();
  const questId = params.id as string;

  const [quest, setQuest] = useState<QuestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchQuest = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/quests/${questId}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("퀘스트 정보를 불러올 수 없습니다.");
        const data = await res.json();
        setQuest(data);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuest();

    return () => controller.abort();
  }, [questId]);

  const handleApply = async () => {
    if (applying || success) return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    setApplying(true);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:8000/api/quests/${questId}/applications?userId=${userId}`,
        { method: "POST" },
      );

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (quest) {
          addStoredAppliedQuest(
            createStoredAppliedQuest(quest, userId, data.applicationId),
          );
        }
        setSuccess(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "지원에 실패했습니다.");
      }
    } catch {
      setError("서버 연결에 실패했습니다.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalNav />
        <div className="mx-auto max-w-2xl px-4 py-16 text-center text-foreground-muted">
          퀘스트 정보를 불러오는 중...
        </div>
      </div>
    );
  }

  if (error && !quest) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalNav />
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <p className="text-red-600">{error}</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href={`/quests/${questId}`}>퀘스트로 돌아가기</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalNav />
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground">지원 완료!</h2>
          <p className="mt-2 text-foreground-muted">
            퀘스트에 성공적으로 지원했습니다. 매니저의 검토를 기다려주세요.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="outline" asChild>
              <Link href={`/quests/${questId}`}>퀘스트 보기</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/my-quests">내 퀘스트 목록</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const techStack: string[] = quest?.formData?.techStack ?? [];

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-foreground-muted">
          <Link href="/quests" className="hover:text-foreground">
            퀘스트
          </Link>
          <span>/</span>
          <Link href={`/quests/${questId}`} className="hover:text-foreground">
            {quest?.title}
          </Link>
          <span>/</span>
          <span className="text-foreground">참여 신청</span>
        </nav>

        <div className="mb-6">
          <p className="text-sm font-semibold text-primary">
            Quest Application
          </p>
          <h1 className="mt-1 text-3xl font-bold text-foreground">
            퀘스트 참여 신청
          </h1>
          <p className="mt-2 text-foreground-muted">
            아래 퀘스트에 참여를 신청합니다. 신청 후 매니저가 수락하면 참여가
            확정됩니다.
          </p>
        </div>

        {/* Quest Summary Card */}
        <Card className="mb-6 border border-border p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground">
                {quest?.title}
              </h2>
              {quest?.formData?.description && (
                <p className="mt-2 text-sm text-foreground-muted line-clamp-3">
                  {quest.formData.description}
                </p>
              )}
              {techStack.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <Badge className="shrink-0 bg-primary-light text-primary">
              {STATUS_LABEL[quest?.status ?? ""] ?? quest?.status}
            </Badge>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm">
            <div>
              <p className="text-foreground-muted">보상금</p>
              <p className="mt-1 font-semibold text-foreground">
                ₩{quest?.rewardAmount?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-foreground-muted">마감일</p>
              <p className="mt-1 font-semibold text-foreground">
                {quest?.deadline
                  ? new Date(quest.deadline).toLocaleDateString("ko-KR")
                  : "-"}
              </p>
            </div>
            {quest?.formData?.difficulty && (
              <div>
                <p className="text-foreground-muted">난이도</p>
                <p className="mt-1 font-semibold text-foreground">
                  {quest.formData.difficulty}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Notice */}
        <Card className="mb-6 border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
          <div className="flex gap-3">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <p className="font-semibold">신청 전 확인하세요</p>
              <ul className="mt-1 list-disc pl-4 space-y-1 text-amber-700 dark:text-amber-300">
                <li>한 퀘스트에 중복 신청할 수 없습니다.</li>
                <li>신청 후 매니저의 검토 결과를 기다려야 합니다.</li>
                <li>신청 취소는 대시보드에서 가능합니다.</li>
              </ul>
            </div>
          </div>
        </Card>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" asChild>
            <Link href={`/quests/${questId}`}>취소</Link>
          </Button>
          <Button onClick={handleApply} disabled={applying}>
            {applying ? "신청 중..." : "참여 신청하기"}
          </Button>
        </div>
      </div>
    </div>
  );
}
