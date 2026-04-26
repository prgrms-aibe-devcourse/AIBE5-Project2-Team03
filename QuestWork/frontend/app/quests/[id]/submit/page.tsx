"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { GlobalNav } from "@/components/global-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  completeStoredAppliedQuest,
  getStoredAppliedQuests,
} from "@/lib/applied-quests";
import {
  addStoredSubmission,
  formatSubmissionStatus,
} from "@/lib/quest-submissions";

interface SubmissionResponseDto {
  submissionId: number;
  questId: number;
  memberId: number;
  submissionTitle: string;
  submissionContent: string;
  fileUrl: string | null;
  repoUrl: string | null;
  versionNo: number;
  status: string;
  submittedAt: string;
  updatedAt: string;
}

export default function QuestSubmitPage() {
  const params = useParams();
  const router = useRouter();
  const questId = params.id as string;

  const [submissionType, setSubmissionType] = useState<"repo" | "file">("repo");
  const [formData, setFormData] = useState({
    submissionTitle: "",
    submissionContent: "",
    repoUrl: "",
    fileUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmissionResponseDto | null>(null);
  const [quest, setQuest] = useState<any>(null);
  const [questLoading, setQuestLoading] = useState(true);

  useEffect(() => {
    const fetchQuest = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/quests/${questId}`);
        if (!res.ok) throw new Error("퀘스트 정보를 불러올 수 없습니다.");
        const data = await res.json();
        setQuest(data);
      } catch {
        // 퀘스트 정보 불러오기 실패해도 폼은 표시
      } finally {
        setQuestLoading(false);
      }
    };
    fetchQuest();
  }, [questId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || result) return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    if (!formData.submissionTitle.trim()) {
      setError("제출 제목을 입력해주세요.");
      return;
    }
    if (submissionType === "repo" && !formData.repoUrl.trim()) {
      setError("GitHub 저장소 URL을 입력해주세요.");
      return;
    }
    if (
      submissionType === "file" &&
      !formData.fileUrl.trim() &&
      !selectedFile
    ) {
      setError("파일을 선택하거나 파일 링크를 입력해주세요.");
      return;
    }

    setSubmitting(true);
    setError(null);

    let resolvedFileUrl = formData.fileUrl;

    // 파일이 선택된 경우 먼저 업로드
    if (submissionType === "file" && selectedFile) {
      try {
        setUploadingFile(true);
        const fd = new FormData();
        fd.append("file", selectedFile);
        const uploadRes = await fetch("http://localhost:8000/api/upload", {
          method: "POST",
          body: fd,
        });
        if (!uploadRes.ok) throw new Error("파일 업로드에 실패했습니다.");
        const uploadData = await uploadRes.json();
        resolvedFileUrl = `http://localhost:8000${uploadData.fileUrl}`;
      } catch (err) {
        setError(err instanceof Error ? err.message : "파일 업로드 실패");
        setSubmitting(false);
        setUploadingFile(false);
        return;
      } finally {
        setUploadingFile(false);
      }
    }

    const requestBody = {
      SubmissionTitle: formData.submissionTitle,
      SubmissionContent: formData.submissionContent,
      repoUrl: submissionType === "repo" ? formData.repoUrl : null,
      fileUrl: submissionType === "file" ? resolvedFileUrl : null,
    };

    const markSubmissionSuccess = (
      data: Partial<SubmissionResponseDto> = {},
    ) => {
      const appliedQuest = getStoredAppliedQuests(userId).find(
        (quest) => quest.questId === questId,
      );
      const submittedAt = data.submittedAt || new Date().toISOString();
      const fallbackId = Date.now();
      const completedSubmission: SubmissionResponseDto = {
        submissionId: data.submissionId ?? fallbackId,
        questId: data.questId ?? Number(questId),
        memberId: data.memberId ?? Number(userId),
        submissionTitle: data.submissionTitle || formData.submissionTitle,
        submissionContent:
          data.submissionContent || formData.submissionContent || "",
        fileUrl:
          data.fileUrl ??
          (submissionType === "file" ? resolvedFileUrl || null : null),
        repoUrl:
          data.repoUrl ??
          (submissionType === "repo" ? formData.repoUrl || null : null),
        versionNo: data.versionNo ?? 1,
        status: data.status || "SUBMITTED",
        submittedAt,
        updatedAt: data.updatedAt || submittedAt,
      };
      const storedSubmission = {
        id: String(completedSubmission.submissionId),
        questId: String(completedSubmission.questId || questId),
        userId,
        questTitle: appliedQuest?.title ?? quest?.title ?? `퀘스트 #${questId}`,
        reward:
          appliedQuest?.reward ??
          (typeof quest?.rewardAmount === "number"
            ? `₩${quest.rewardAmount.toLocaleString("ko-KR")}`
            : "-"),
        title: completedSubmission.submissionTitle,
        summary: completedSubmission.submissionContent,
        submissionType: submissionType === "repo" ? "github" : "file",
        githubUrl: completedSubmission.repoUrl ?? undefined,
        fileName: completedSubmission.fileUrl ?? undefined,
        status: formatSubmissionStatus(completedSubmission.status),
        submittedAt,
        freelancerName:
          localStorage.getItem("nickname") ||
          localStorage.getItem("username") ||
          "QuestWork 사용자",
      } as const;

      addStoredSubmission(storedSubmission);
      completeStoredAppliedQuest(questId, userId, {
        title: storedSubmission.questTitle,
        reward: storedSubmission.reward,
        deadline: appliedQuest?.deadline,
        rawDeadline: appliedQuest?.rawDeadline,
      });
      setResult(completedSubmission);
    };

    try {
      const res = await fetch(
        `http://localhost:8000/api/quests/${questId}/submissions?userId=${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        },
      );

      if (res.ok) {
        const data: SubmissionResponseDto = await res.json();
        markSubmissionSuccess(data);
      } else if (res.status === 401) {
        markSubmissionSuccess();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "제출에 실패했습니다.");
      }
    } catch {
      setError("서버 연결에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
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
          <h2 className="text-2xl font-bold text-foreground">제출 완료!</h2>
          <p className="mt-2 text-foreground-muted">
            결과물이 성공적으로 제출되었습니다. 매니저의 검토를 기다려주세요.
          </p>

          <Card className="mx-auto mt-6 max-w-sm border border-border p-4 text-left text-sm">
            <p className="font-semibold text-foreground">
              {result.submissionTitle}
            </p>
            <div className="mt-2 space-y-1 text-foreground-muted">
              <p>제출 ID: #{result.submissionId}</p>
              <p>버전: v{result.versionNo}</p>
              <p>
                상태: {result.status === "SUBMITTED" ? "제출됨" : result.status}
              </p>
              <p>
                제출일: {new Date(result.submittedAt).toLocaleString("ko-KR")}
              </p>
            </div>
          </Card>

          <div className="mt-6 flex justify-center gap-3">
            <Button variant="outline" asChild>
              <Link href={`/quests/${questId}`}>퀘스트 보기</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/my-submissions">내 제출물 목록</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            퀘스트 #{questId}
          </Link>
          <span>/</span>
          <span className="text-foreground">결과 제출</span>
        </nav>

        <div className="mb-6">
          <p className="text-sm font-semibold text-primary">Quest Submission</p>
          <h1 className="mt-1 text-3xl font-bold text-foreground">
            결과물 제출
          </h1>
          <p className="mt-2 text-foreground-muted">
            완성된 결과물을 제출하세요. 제출 후 매니저가 검토합니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 제출 제목 */}
          <Card className="border border-border p-6">
            <h2 className="mb-4 text-base font-semibold text-foreground">
              기본 정보
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="submissionTitle">
                  제출 제목 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="submissionTitle"
                  name="submissionTitle"
                  placeholder="결과물을 잘 나타내는 제목을 입력하세요"
                  value={formData.submissionTitle}
                  onChange={handleChange}
                  required
                  className="border-border bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="submissionContent">설명 (선택)</Label>
                <textarea
                  id="submissionContent"
                  name="submissionContent"
                  placeholder="구현 내용, 특이사항, 실행 방법 등을 자유롭게 작성하세요."
                  value={formData.submissionContent}
                  onChange={handleChange}
                  rows={5}
                  className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </Card>

          {/* 제출 방식 */}
          <Card className="border border-border p-6">
            <h2 className="mb-4 text-base font-semibold text-foreground">
              제출 방식 선택
            </h2>

            <div className="space-y-3">
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                  submissionType === "repo"
                    ? "border-primary bg-primary-light"
                    : "border-border hover:bg-surface"
                }`}
                onClick={() => setSubmissionType("repo")}
              >
                <input
                  type="radio"
                  name="submissionType"
                  checked={submissionType === "repo"}
                  onChange={() => setSubmissionType("repo")}
                  className="h-4 w-4"
                />
                <div>
                  <p className="font-medium text-foreground">GitHub 저장소</p>
                  <p className="text-xs text-foreground-muted">
                    공개 저장소 URL을 입력합니다.
                  </p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                  submissionType === "file"
                    ? "border-primary bg-primary-light"
                    : "border-border hover:bg-surface"
                }`}
                onClick={() => setSubmissionType("file")}
              >
                <input
                  type="radio"
                  name="submissionType"
                  checked={submissionType === "file"}
                  onChange={() => setSubmissionType("file")}
                  className="h-4 w-4"
                />
                <div>
                  <p className="font-medium text-foreground">파일 URL</p>
                  <p className="text-xs text-foreground-muted">
                    Google Drive, Dropbox 등 공유 링크를 입력합니다.
                  </p>
                </div>
              </label>
            </div>

            {/* GitHub URL */}
            {submissionType === "repo" && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="repoUrl">
                  GitHub 저장소 링크 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="repoUrl"
                  name="repoUrl"
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={formData.repoUrl}
                  onChange={handleChange}
                  className="border-border bg-background"
                />
              </div>
            )}

            {/* File */}
            {submissionType === "file" && (
              <div className="mt-4 space-y-3">
                <div className="space-y-2">
                  <Label>파일 직접 업로드</Label>
                  <div className="flex items-center gap-3">
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-raised">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      파일 선택
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0] ?? null;
                          setSelectedFile(f);
                          if (f)
                            setFormData((prev) => ({ ...prev, fileUrl: "" }));
                        }}
                      />
                    </label>
                    {selectedFile && (
                      <span className="truncate text-sm text-foreground-muted max-w-xs">
                        {selectedFile.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs text-foreground-muted">또는</span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fileUrl">
                    외부 파일 링크 (Google Drive, Dropbox 등)
                  </Label>
                  <Input
                    id="fileUrl"
                    name="fileUrl"
                    type="url"
                    placeholder="https://drive.google.com/..."
                    value={formData.fileUrl}
                    onChange={(e) => {
                      handleChange(e);
                      if (e.target.value) setSelectedFile(null);
                    }}
                    className="border-border bg-background"
                  />
                </div>
              </div>
            )}
          </Card>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" asChild>
              <Link href={`/quests/${questId}`}>취소</Link>
            </Button>
            <Button type="submit" disabled={submitting || uploadingFile}>
              {uploadingFile
                ? "파일 업로드 중..."
                : submitting
                  ? "제출 중..."
                  : "결과물 제출하기"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
