"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GlobalNav } from "@/components/global-nav";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatSubmissionStatus,
  getStoredSubmissions,
  type StoredSubmission,
} from "@/lib/quest-submissions";

const STATUS_CLASS: Record<string, string> = {
  "선정 완료": "bg-green-100 text-green-700",
  "검토 중": "bg-blue-100 text-blue-700",
  "제출 완료": "bg-primary-light text-primary",
};

export default function MySubmissionsPage() {
  const [submissions, setSubmissions] = useState<StoredSubmission[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setSubmissions(getStoredSubmissions(userId));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <DashboardShell>
        <div className="mb-8">
          <p className="text-sm font-semibold text-primary">내 제출물</p>
          <h1 className="mt-1 text-3xl font-bold text-foreground">
            제출한 결과물을 확인해보세요
          </h1>
          <p className="mt-2 text-foreground-muted">
            제출 결과의 검토 상태와 보상 지급 현황을 한곳에서 확인할 수
            있습니다.
          </p>
        </div>

        {submissions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-sm text-foreground-muted">
              아직 제출한 퀘스트가 없습니다.
            </p>
            <Button
              asChild
              className="mt-4 bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              <Link href="/quests">퀘스트 둘러보기</Link>
            </Button>
          </div>
        ) : (
          <Card className="border border-border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="px-4 py-4 text-left font-semibold text-foreground">
                      퀘스트
                    </th>
                    <th className="px-4 py-4 text-left font-semibold text-foreground">
                      제출 제목
                    </th>
                    <th className="px-4 py-4 text-left font-semibold text-foreground">
                      제출일
                    </th>
                    <th className="px-4 py-4 text-left font-semibold text-foreground">
                      상태
                    </th>
                    <th className="px-4 py-4 text-right font-semibold text-foreground">
                      링크 / 상세
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => {
                    const status = formatSubmissionStatus(submission.status);

                    return (
                      <tr
                        key={submission.id}
                        className="border-b border-border transition-colors last:border-b-0 hover:bg-surface"
                      >
                        <td className="px-4 py-4">
                          <p className="font-medium text-foreground">
                            {submission.questTitle}
                          </p>
                          <p className="mt-0.5 text-xs text-foreground-muted">
                            Quest #{submission.questId}
                          </p>
                        </td>
                        <td className="max-w-[200px] truncate px-4 py-4 text-foreground-muted">
                          {submission.title}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-foreground-muted">
                          {new Date(submission.submittedAt).toLocaleDateString(
                            "ko-KR",
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <Badge
                            className={
                              STATUS_CLASS[status] ??
                              "bg-slate-100 text-slate-700"
                            }
                          >
                            {status}
                          </Badge>
                        </td>
                        <td className="space-x-2 px-4 py-4 text-right">
                          {submission.githubUrl && (
                            <a
                              href={submission.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mr-2 text-xs text-primary underline"
                            >
                              GitHub
                            </a>
                          )}
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/quests/${submission.questId}`}>
                              보기
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </DashboardShell>
    </div>
  );
}
