"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { GlobalNav } from "@/components/global-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TECH_STACK_OPTIONS = [
  "React",
  "Next.js",
  "Java",
  "Spring",
  "Node.js",
  "Python",
];

const DIFFICULTY_OPTIONS = ["Beginner", "Intermediate", "Advanced"];

const SUBMISSION_FORMAT_OPTIONS = [
  { id: "github", label: "GitHub Repository" },
  { id: "file", label: "File Upload" },
];

function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

async function parseResponseBody(response: Response) {
  const rawText = await response.text();

  if (!rawText) {
    return null;
  }

  try {
    return JSON.parse(rawText) as { id?: number; message?: string };
  } catch {
    return { message: rawText };
  }
}

export default function CreateQuestPage() {
  const router = useRouter();
  const [isCheckingRole, setIsCheckingRole] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [createdQuestId, setCreatedQuestId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: [] as string[],
    reward: "",
    deadline: "",
    difficulty: "",
    submissionFormats: [] as string[],
  });

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "MANAGER") {
      router.replace("/manager/upgrade");
      return;
    }

    setIsCheckingRole(false);
  }, [router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setErrorMessage("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechStackChange = (tech: string) => {
    setErrorMessage("");
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter((t) => t !== tech)
        : [...prev.techStack, tech],
    }));
  };

  const handleDifficultyChange = (difficulty: string) => {
    setErrorMessage("");
    setFormData((prev) => ({ ...prev, difficulty }));
  };

  const handleSubmissionFormatChange = (format: string) => {
    setErrorMessage("");
    setFormData((prev) => ({
      ...prev,
      submissionFormats: prev.submissionFormats.includes(format)
        ? prev.submissionFormats.filter((f) => f !== format)
        : [...prev.submissionFormats, format],
    }));
  };

  const handleSuccessConfirm = () => {
    setIsSuccessOpen(false);

    if (createdQuestId) {
      router.push(`/quests/${createdQuestId}`);
      return;
    }

    router.push("/manager/posted-quests");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const managerId = Number(localStorage.getItem("userId"));
    const role = localStorage.getItem("role");
    const trimmedTitle = formData.title.trim();
    const trimmedDescription = formData.description.trim();
    const rewardAmount = Number(formData.reward);

    setErrorMessage("");

    if (!managerId || role !== "MANAGER") {
      setErrorMessage("매니저 계정으로 로그인한 뒤 이용해주세요.");
      return;
    }

    if (
      !trimmedTitle ||
      !trimmedDescription ||
      !formData.reward ||
      !formData.deadline
    ) {
      setErrorMessage("필수 항목을 모두 입력해주세요.");
      return;
    }

    if (!Number.isFinite(rewardAmount) || rewardAmount <= 0) {
      setErrorMessage("보상 금액은 0원 이상 입력해주세요.");
      return;
    }

    if (formData.deadline <= getTodayDateString()) {
      setErrorMessage("제출 마감일은 오늘 이후 날짜로 설정해주세요.");
      return;
    }

    const requestBody = {
      managerId,
      title: trimmedTitle,
      rewardAmount,
      deadline: `${formData.deadline}T00:00:00`,
      formData: {
        description: trimmedDescription,
        techStack: formData.techStack,
        difficulty: formData.difficulty,
        submissionFormats: formData.submissionFormats,
      },
    };

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `http://localhost:8000/api/quests?managerId=${managerId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        },
      );

      const responseBody = await parseResponseBody(response);

      if (response.ok) {
        setCreatedQuestId(responseBody?.id ?? null);
        setIsSuccessOpen(true);
        return;
      }

      if (response.status === 401 || response.status === 403) {
        setErrorMessage("매니저 계정으로 로그인한 뒤 이용해주세요.");
        return;
      }

      if (responseBody?.message) {
        setErrorMessage(responseBody.message);
        return;
      }

      if (response.status === 400) {
        setErrorMessage("필수 항목을 모두 입력해주세요.");
        return;
      }

      setErrorMessage("퀘스트 등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } catch (error) {
      console.error("퀘스트 생성 중 오류:", error);
      setErrorMessage("서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingRole) {
    return null;
  }

  const rewardPreview = Number(formData.reward);
  const formattedReward =
    formData.reward && Number.isFinite(rewardPreview)
      ? `₩${rewardPreview.toLocaleString("ko-KR")}`
      : "보상금 입력 전";
  const selectedTechStack =
    formData.techStack.length > 0 ? formData.techStack : ["선택 전"];
  const selectedDifficulty = formData.difficulty || "난이도 선택 전";
  const deadlinePreview = formData.deadline || "마감일 선택 전";

  return (
    <>
      <div className="min-h-screen bg-[#F8F7FC]">
        <GlobalNav />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[96rem] space-y-6">
            <Button
              type="button"
              variant="ghost"
              className="gap-2 rounded-full px-3 text-foreground-muted hover:bg-white hover:text-primary"
              asChild
            >
              <Link href="/manager">
                <ArrowLeft className="h-4 w-4" />
                대시보드로 돌아가기
              </Link>
            </Button>

            <div className="overflow-hidden rounded-[32px] border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-white px-6 py-7 shadow-[0_28px_70px_-48px_rgba(109,40,217,0.55)] sm:px-8">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                  Quest Builder
                </p>
                <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-foreground sm:text-4xl">
                  퀘스트 등록
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground-muted sm:text-base">
                  개발자가 바로 이해하고 지원할 수 있도록 목표, 보상, 제출
                  방식을 명확하게 정리해보세요.
                </p>
            </div>

            <form
              id="create-quest-form"
              onSubmit={handleSubmit}
              className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(380px,1fr)]"
            >
                {errorMessage ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 xl:col-span-2">
                    {errorMessage}
                  </div>
                ) : null}

                <div className="space-y-6">
                  <Card className="rounded-[28px] border border-purple-100 bg-white p-7 shadow-[0_22px_60px_-44px_rgba(30,41,59,0.45)] sm:p-8">
                    <div className="mb-6">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                        Step 01
                      </p>
                      <h2 className="mt-2 text-xl font-bold text-foreground">
                        기본 정보
                      </h2>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-foreground">
                          퀘스트 제목
                        </label>
                        <Input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="예: React Admin Dashboard 성능 최적화"
                          className="mt-2 h-12 rounded-2xl border-purple-100 bg-purple-50/30 px-4 text-base placeholder:text-slate-400 focus:border-primary focus:ring-primary/15"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground">
                          퀘스트 설명
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="목표, 현재 상황, 기대 결과물, 참고 링크를 구체적으로 적어주세요."
                          rows={10}
                          className="mt-2 min-h-[240px] w-full resize-y rounded-2xl border border-purple-100 bg-purple-50/30 px-4 py-4 text-base leading-7 text-foreground placeholder:text-slate-400 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                          required
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="rounded-[28px] border border-purple-100 bg-white p-7 shadow-[0_22px_60px_-44px_rgba(30,41,59,0.45)] sm:p-8">
                    <div className="mb-6">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                        Step 02
                      </p>
                      <h2 className="mt-2 text-xl font-bold text-foreground">
                        요구 기술
                      </h2>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {TECH_STACK_OPTIONS.map((tech) => (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => handleTechStackChange(tech)}
                          className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                            formData.techStack.includes(tech)
                              ? "bg-primary text-primary-foreground shadow-[0_12px_28px_-16px_rgba(109,40,217,0.9)]"
                              : "border border-purple-100 bg-white text-foreground hover:border-primary/40 hover:bg-purple-50 hover:text-primary"
                          }`}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  </Card>

                  <Card className="rounded-[28px] border border-purple-100 bg-white p-7 shadow-[0_22px_60px_-44px_rgba(30,41,59,0.45)] sm:p-8">
                    <div className="mb-6">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                        Step 03
                      </p>
                      <h2 className="mt-2 text-xl font-bold text-foreground">
                        보상과 마감
                      </h2>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-semibold text-foreground">
                          보상 금액
                        </label>
                        <Input
                          type="number"
                          name="reward"
                          value={formData.reward}
                          onChange={handleInputChange}
                          placeholder="1000000"
                          className="mt-2 h-12 rounded-2xl border-purple-100 bg-purple-50/30 px-4 text-base placeholder:text-slate-400 focus:border-primary focus:ring-primary/15"
                          min={1}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground">
                          제출 마감일
                        </label>
                        <Input
                          type="date"
                          name="deadline"
                          value={formData.deadline}
                          onChange={handleInputChange}
                          className="mt-2 h-12 rounded-2xl border-purple-100 bg-purple-50/30 px-4 text-base focus:border-primary focus:ring-primary/15"
                          required
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="rounded-[28px] border border-purple-100 bg-white p-7 shadow-[0_22px_60px_-44px_rgba(30,41,59,0.45)] sm:p-8">
                    <div className="mb-6">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                        Step 04
                      </p>
                      <h2 className="mt-2 text-xl font-bold text-foreground">
                        난이도와 제출 방식
                      </h2>
                    </div>

                    <div className="space-y-7">
                      <div>
                        <p className="mb-3 text-sm font-semibold text-foreground">
                          난이도
                        </p>
                        <div className="grid gap-3 sm:grid-cols-3">
                          {DIFFICULTY_OPTIONS.map((difficulty) => (
                            <button
                              key={difficulty}
                              type="button"
                              onClick={() => handleDifficultyChange(difficulty)}
                              className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
                                formData.difficulty === difficulty
                                  ? "border-primary bg-primary text-primary-foreground shadow-[0_14px_32px_-18px_rgba(109,40,217,0.9)]"
                                  : "border-purple-100 bg-white text-foreground hover:border-primary/40 hover:bg-purple-50 hover:text-primary"
                              }`}
                            >
                              {difficulty}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="mb-3 text-sm font-semibold text-foreground">
                          제출 형식
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {SUBMISSION_FORMAT_OPTIONS.map((format) => (
                            <label
                              key={format.id}
                              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-4 transition-all ${
                                formData.submissionFormats.includes(format.id)
                                  ? "border-primary bg-purple-50 text-primary"
                                  : "border-purple-100 bg-white text-foreground hover:border-primary/40 hover:bg-purple-50"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.submissionFormats.includes(
                                  format.id,
                                )}
                                onChange={() =>
                                  handleSubmissionFormatChange(format.id)
                                }
                                className="h-4 w-4 cursor-pointer rounded border-purple-200 text-primary focus:ring-primary"
                              />
                              <span className="text-sm font-semibold">
                                {format.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                <aside className="xl:sticky xl:top-24 xl:self-start">
                  <Card className="overflow-hidden rounded-[32px] border border-purple-100 bg-white shadow-[0_28px_80px_-52px_rgba(109,40,217,0.65)]">
                    <div className="space-y-5 p-6">
                      <div className="rounded-3xl bg-gradient-to-br from-primary to-[#8B5CF6] p-5 text-white">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                          Publishing Guide
                        </p>
                        <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-white">
                          좋은 퀘스트는 더 빠르게 지원을 받습니다
                        </h2>
                      </div>

                      <div className="rounded-2xl border border-purple-100 bg-purple-50/70 p-4">
                        <h3 className="text-sm font-bold text-foreground">
                          등록 팁
                        </h3>
                        <ul className="mt-3 space-y-2 text-sm leading-6 text-foreground-muted">
                          <li>목표 결과물과 성공 기준을 먼저 적어주세요.</li>
                          <li>
                            필수 기술과 선택 기술을 구분하면 지원 품질이
                            좋아집니다.
                          </li>
                          <li>참고 링크나 현재 문제 상황을 함께 남겨주세요.</li>
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-sm font-bold text-foreground">
                          입력 요약
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-2xl bg-purple-50 p-4">
                            <p className="text-xs font-semibold text-foreground-muted">
                              보상금
                            </p>
                            <p className="mt-2 whitespace-nowrap text-lg font-black text-primary">
                              {formattedReward}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold text-foreground-muted">
                              마감일
                            </p>
                            <p className="mt-2 text-sm font-bold text-foreground">
                              {deadlinePreview}
                            </p>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-purple-100 p-4">
                          <p className="text-xs font-semibold text-foreground-muted">
                            기술스택
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {selectedTechStack.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-primary"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold text-foreground-muted">
                            난이도
                          </p>
                          <p className="mt-2 text-sm font-bold text-foreground">
                            {selectedDifficulty}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                        <h3 className="text-sm font-bold text-amber-900">
                          등록 전 확인
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-amber-800">
                          등록 후에는 지원자가 설명을 기준으로 판단합니다. 보상,
                          마감일, 제출 형식이 실제 운영 조건과 맞는지 한 번 더
                          확인해주세요.
                        </p>
                      </div>

                      <div className="space-y-3 pt-2">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="h-12 w-full rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-[0_18px_36px_-18px_rgba(109,40,217,0.85)] hover:bg-primary-hover"
                        >
                          {isSubmitting ? "등록 중..." : "퀘스트 등록하기"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-11 w-full rounded-2xl border-purple-100 text-primary hover:bg-purple-50"
                        >
                          임시 저장
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-11 w-full rounded-2xl border-purple-100"
                          asChild
                        >
                          <Link href="/manager">취소</Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </aside>
            </form>
          </div>
        </main>
      </div>

      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="max-w-md rounded-[28px] border border-[#A78BFA]/25 bg-white p-0 shadow-[0_30px_80px_-36px_rgba(109,40,217,0.35)]">
          <div className="px-8 pb-8 pt-9">
            <DialogHeader className="items-center text-center">
              <div className="mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#6D28D9]/8 ring-8 ring-[#A78BFA]/10">
                <CheckCircle2
                  className="h-10 w-10 text-[#6D28D9]"
                  strokeWidth={2.2}
                />
              </div>
              <DialogTitle className="text-center text-[28px] font-bold tracking-[-0.03em] text-foreground">
                퀘스트가 등록되었습니다
              </DialogTitle>
              <DialogDescription className="max-w-[260px] pt-2 text-center text-sm leading-6 text-foreground-muted">
                등록한 퀘스트 페이지로 이동합니다.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-8 sm:justify-center">
              <Button
                type="button"
                onClick={handleSuccessConfirm}
                className="min-w-28 rounded-xl bg-[#6D28D9] px-6 text-white shadow-[0_14px_30px_-14px_rgba(109,40,217,0.65)] hover:bg-[#5B21B6]"
              >
                확인
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
