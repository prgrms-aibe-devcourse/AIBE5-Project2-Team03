"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { GlobalNav } from "@/components/global-nav";
import { ManagerSidebar } from "@/components/manager/manager-sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

interface QuestFormData {
  description?: string;
  techStack?: string[];
  difficulty?: string;
  submissionFormats?: string[];
}

interface QuestDetail {
  id: number;
  title: string;
  status: string;
  rewardAmount: number;
  deadline: string;
  formData?: QuestFormData;
}

export default function EditQuestPage() {
  const params = useParams();
  const router = useRouter();
  const questId = params.id as string;

  const [isCheckingRole, setIsCheckingRole] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [managerId, setManagerId] = useState<number | null>(null);

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
    const uid = localStorage.getItem("userId");

    if (role !== "MANAGER" || !uid) {
      router.replace("/manager/upgrade");
      return;
    }

    setManagerId(Number(uid));
    setIsCheckingRole(false);
  }, [router]);

  // 기존 퀘스트 데이터 로드
  useEffect(() => {
    if (isCheckingRole) return;

    const fetchQuest = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/quests/${questId}`);
        if (!res.ok) throw new Error("퀘스트 정보를 불러올 수 없습니다.");
        const data: QuestDetail = await res.json();

        const deadlineDate = data.deadline
          ? data.deadline.split("T")[0]
          : "";

        setFormData({
          title: data.title ?? "",
          description: data.formData?.description ?? "",
          techStack: data.formData?.techStack ?? [],
          reward: String(data.rewardAmount ?? ""),
          deadline: deadlineDate,
          difficulty: data.formData?.difficulty ?? "",
          submissionFormats: data.formData?.submissionFormats ?? [],
        });
      } catch (e) {
        setErrorMessage(
          e instanceof Error ? e.message : "오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuest();
  }, [questId, isCheckingRole]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = formData.title.trim();
    const trimmedDescription = formData.description.trim();
    const rewardAmount = Number(formData.reward);

    setErrorMessage("");

    if (!trimmedTitle || !trimmedDescription || !formData.reward || !formData.deadline) {
      setErrorMessage("필수 항목을 모두 입력해주세요.");
      return;
    }

    if (!Number.isFinite(rewardAmount) || rewardAmount <= 0) {
      setErrorMessage("보상 금액은 ₩1 이상 입력해주세요.");
      return;
    }

    const requestBody = {
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
        `http://localhost:8000/api/quests/${questId}?managerId=${managerId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        alert("퀘스트가 수정되었습니다.");
        router.push(`/manager/quests/${questId}`);
        return;
      }

      const text = await response.text();
      if (response.status === 401 || response.status === 403) {
        setErrorMessage("권한이 없습니다.");
        return;
      }
      setErrorMessage(text || "퀘스트 수정에 실패했습니다.");
    } catch (error) {
      console.error("퀘스트 수정 중 오류:", error);
      setErrorMessage("서버와의 연결이 원활하지 않습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingRole || loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <div className="flex">
        <ManagerSidebar />

        <main className="flex-1">
          <div className="space-y-6 p-6 lg:p-8">
            <div>
              <Link
                href={`/manager/quests/${questId}`}
                className="text-sm text-foreground-muted hover:text-foreground"
              >
                ← 퀘스트 상세로 돌아가기
              </Link>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-foreground">퀘스트 수정</h1>
              <p className="mt-1 text-foreground-muted">
                퀘스트 정보를 수정하세요.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {errorMessage}
                </div>
              ) : null}

              <Card className="border border-border p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">기본 정보</h2>
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
                      placeholder="퀘스트 제목을 입력해주세요."
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
                <h2 className="mb-4 text-lg font-semibold text-foreground">기술 스택 요구사항</h2>
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
                <h2 className="mb-4 text-lg font-semibold text-foreground">보상 및 기한</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      보상 금액(₩)
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
                <h2 className="mb-4 text-lg font-semibold text-foreground">난이도</h2>
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
                <h2 className="mb-4 text-lg font-semibold text-foreground">제출 형식</h2>
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
                  {isSubmitting ? "수정 중..." : "퀘스트 수정하기"}
                </Button>
                <Link href={`/manager/quests/${questId}`}>
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
  );
}
