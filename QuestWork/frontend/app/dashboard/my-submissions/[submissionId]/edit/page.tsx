"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { GlobalNav } from "@/components/global-nav";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface SubmissionData {
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

const STATUS_LABEL: Record<string, string> = {
  SUBMITTED: "제출됨",
  UPDATED: "업데이트됨",
};

export default function EditSubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.submissionId as string;

  const [original, setOriginal] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [submissionType, setSubmissionType] = useState<"repo" | "file">("repo");
  const [formData, setFormData] = useState({
    submissionTitle: "",
    submissionContent: "",
    repoUrl: "",
    fileUrl: "",
  });

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }

    const fetchSubmission = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/quests/submissions/${submissionId}`,
        );
        if (!res.ok) throw new Error("제출물 정보를 불러올 수 없습니다.");
        const data: SubmissionData = await res.json();
        setOriginal(data);
        setFormData({
          submissionTitle: data.submissionTitle ?? "",
          submissionContent: data.submissionContent ?? "",
          repoUrl: data.repoUrl ?? "",
          fileUrl: data.fileUrl ?? "",
        });
        setSubmissionType(data.repoUrl ? "repo" : "file");
      } catch (e) {
        setLoadError(e instanceof Error ? e.message : "오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [submissionId, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }

    if (!formData.submissionTitle.trim()) {
      setSaveError("제출 제목을 입력해주세요.");
      return;
    }
    if (submissionType === "repo" && !formData.repoUrl.trim()) {
      setSaveError("GitHub 저장소 URL을 입력해주세요.");
      return;
    }
    if (submissionType === "file" && !formData.fileUrl.trim()) {
      setSaveError("파일 URL을 입력해주세요.");
      return;
    }

    setSaving(true);
    setSaveError(null);

    const requestBody = {
      SubmissionTitle: formData.submissionTitle,
      SubmissionContent: formData.submissionContent,
      repoUrl: submissionType === "repo" ? formData.repoUrl : null,
      fileUrl: submissionType === "file" ? formData.fileUrl : null,
    };

    try {
      const res = await fetch(
        `http://localhost:8000/api/quests/submissions/${submissionId}?userId=${userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        },
      );

      if (res.ok) {
        const updated: SubmissionData = await res.json();
        setOriginal(updated);
        setSaved(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setSaveError(data.message || "수정에 실패했습니다.");
      }
    } catch {
      setSaveError("서버 연결에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalNav />
        <DashboardShell>
          <div className="py-16 text-center text-foreground-muted">
            불러오는 중...
          </div>
        </DashboardShell>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalNav />
        <DashboardShell>
          <div className="py-16 text-center">
            <p className="text-red-600">{loadError}</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/dashboard/my-submissions">목록으로 돌아가기</Link>
            </Button>
          </div>
        </DashboardShell>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalNav />
        <DashboardShell>
          <div className="py-16 text-center">
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
            <h2 className="text-2xl font-bold text-foreground">수정 완료!</h2>
            <p className="mt-2 text-foreground-muted">
              제출물이 성공적으로 수정되었습니다.
            </p>
            {original && (
              <Card className="mx-auto mt-6 max-w-sm border border-border p-4 text-left text-sm">
                <p className="font-semibold text-foreground">
                  {original.submissionTitle}
                </p>
                <div className="mt-2 space-y-1 text-foreground-muted">
                  <p>버전: v{original.versionNo}</p>
                  <p>
                    상태: {STATUS_LABEL[original.status] ?? original.status}
                  </p>
                  <p>
                    수정일:{" "}
                    {new Date(original.updatedAt).toLocaleString("ko-KR")}
                  </p>
                </div>
              </Card>
            )}
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="outline" onClick={() => setSaved(false)}>
                계속 수정하기
              </Button>
              <Button asChild>
                <Link href="/dashboard/my-submissions">제출물 목록</Link>
              </Button>
            </div>
          </div>
        </DashboardShell>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <DashboardShell>
        <div className="mb-6">
          <nav className="mb-4 flex items-center gap-2 text-sm text-foreground-muted">
            <Link
              href="/dashboard/my-submissions"
              className="hover:text-foreground"
            >
              내 제출물
            </Link>
            <span>/</span>
            <span className="text-foreground">수정</span>
          </nav>

          <p className="text-sm font-semibold text-primary">Edit Submission</p>
          <h1 className="mt-1 text-3xl font-bold text-foreground">
            제출물 수정
          </h1>
          {original && (
            <div className="mt-2 flex items-center gap-2 text-sm text-foreground-muted">
              <span>제출 #{original.submissionId}</span>
              <span>·</span>
              <Badge className="text-xs">v{original.versionNo}</Badge>
              <span>·</span>
              <span>{STATUS_LABEL[original.status] ?? original.status}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* 기본 정보 */}
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
                  placeholder="제출 제목을 입력하세요"
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
                  placeholder="수정 내용, 변경 사항 등을 설명하세요."
                  value={formData.submissionContent}
                  onChange={handleChange}
                  rows={5}
                  className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </Card>

          {/* 제출 링크 */}
          <Card className="border border-border p-6">
            <h2 className="mb-4 text-base font-semibold text-foreground">
              제출 링크 수정
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

            {submissionType === "file" && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="fileUrl">
                  파일 링크 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fileUrl"
                  name="fileUrl"
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={formData.fileUrl}
                  onChange={handleChange}
                  className="border-border bg-background"
                />
              </div>
            )}
          </Card>

          {saveError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
              {saveError}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/my-submissions">취소</Link>
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "저장 중..." : "수정 저장하기"}
            </Button>
          </div>
        </form>
      </DashboardShell>
    </div>
  );
}
