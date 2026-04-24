"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { GlobalNav } from "@/components/global-nav";
import { ManagerSidebar } from "@/components/manager/manager-sidebar";
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
      setErrorMessage("매니저 계정으로 로그인 후 이용해주세요.");
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
      setErrorMessage("보상 금액은 1원 이상 입력해주세요.");
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
        setErrorMessage("매니저 계정으로 로그인 후 이용해주세요.");
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
      setErrorMessage(
        "서버와의 연결이 원활하지 않습니다. 잠시 후 다시 시도해주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingRole) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <GlobalNav />

        <div className="flex">
          <ManagerSidebar />

          <main className="flex-1">
            <div className="space-y-6 p-6 lg:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    퀘스트 등록
                  </h1>
                  <p className="mt-1 text-foreground-muted">
                    새로운 퀘스트를 생성하여 프리랜서들의 지원을 받아보세요.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {errorMessage}
                  </div>
                ) : null}

                <Card className="border border-border p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">
                    기본 정보
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground">
                        퀘스트 제목
                      </label>
                      <Input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., React Admin Dashboard Performance Optimization"
                        className="mt-1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground">
                        퀘스트 설명
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="퀘스트의 상세한 설명을 입력해주세요."
                        rows={6}
                        className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-foreground-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                        required
                      />
                    </div>
                  </div>
                </Card>

                <Card className="border border-border p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">
                    기술 스택 요구사항
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {TECH_STACK_OPTIONS.map((tech) => (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => handleTechStackChange(tech)}
                        className={`rounded-md px-3 py-2 text-sm font-medium transition-all ${
                          formData.techStack.includes(tech)
                            ? "bg-primary text-primary-foreground"
                            : "border border-border bg-surface text-foreground hover:border-primary hover:text-primary"
                        }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="border border-border p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">
                    보상 및 기한
                  </h2>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-foreground">
                        보상 금액(원)
                      </label>
                      <Input
                        type="number"
                        name="reward"
                        value={formData.reward}
                        onChange={handleInputChange}
                        placeholder="e.g., 1000000"
                        className="mt-1"
                        min={1}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground">
                        제출 마감일
                      </label>
                      <Input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleInputChange}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                </Card>

                <Card className="border border-border p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">
                    난이도
                  </h2>

                  <div className="flex gap-3">
                    {DIFFICULTY_OPTIONS.map((difficulty) => (
                      <button
                        key={difficulty}
                        type="button"
                        onClick={() => handleDifficultyChange(difficulty)}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                          formData.difficulty === difficulty
                            ? "bg-primary text-primary-foreground"
                            : "border border-border bg-surface text-foreground hover:border-primary hover:text-primary"
                        }`}
                      >
                        {difficulty}
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="border border-border p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">
                    제출 형식
                  </h2>

                  <div className="space-y-2">
                    {SUBMISSION_FORMAT_OPTIONS.map((format) => (
                      <label
                        key={format.id}
                        className="flex items-center gap-2 rounded-md p-2 hover:bg-surface"
                      >
                        <input
                          type="checkbox"
                          checked={formData.submissionFormats.includes(format.id)}
                          onChange={() => handleSubmissionFormatChange(format.id)}
                          className="h-4 w-4 cursor-pointer rounded border-border text-primary"
                        />
                        <span className="cursor-pointer text-sm font-medium text-foreground">
                          {format.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </Card>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary text-primary-foreground hover:bg-primary-hover"
                  >
                    {isSubmitting ? "등록 중..." : "퀘스트 등록하기"}
                  </Button>
                  <Link href="/manager">
                    <Button type="button" variant="outline">
                      취소
                    </Button>
                  </Link>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>

      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="max-w-md rounded-[28px] border border-[#A78BFA]/25 bg-white p-0 shadow-[0_30px_80px_-36px_rgba(109,40,217,0.35)]">
          <div className="px-8 pb-8 pt-9">
            <DialogHeader className="items-center text-center">
              <div className="mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#6D28D9]/8 ring-8 ring-[#A78BFA]/10">
                <CheckCircle2 className="h-10 w-10 text-[#6D28D9]" strokeWidth={2.2} />
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
