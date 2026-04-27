"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GlobalNav } from "@/components/global-nav";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getStoredAppliedQuests,
  type StoredAppliedQuest,
} from "@/lib/applied-quests";
import {
  formatSubmissionStatus,
  getStoredSubmissions,
  type StoredSubmission,
} from "@/lib/quest-submissions";

type QuestStepState = "complete" | "current" | "waiting";

const getQuestStatus = (
  quest: StoredAppliedQuest,
  submission?: StoredSubmission,
) => {
  const submissionStatus = formatSubmissionStatus(submission?.status);
  const isFinalComplete =
    quest.status === "완료" &&
    (!submission || submissionStatus === "선정 완료");

  if (isFinalComplete) {
    return {
      label: "완료",
      className: "bg-green-50 text-green-700 ring-1 ring-green-100",
    };
  }

  if (submission) {
    return {
      label: "제출 완료",
      className: "bg-primary-light text-primary ring-1 ring-primary/10",
    };
  }

  return {
    label: quest.status === "제출 완료" ? "제출 완료" : "진행 중",
    className: "bg-primary-light/70 text-primary ring-1 ring-primary/10",
  };
};

const getQuestSteps = (
  quest: StoredAppliedQuest,
  submission?: StoredSubmission,
): { label: string; state: QuestStepState }[] => {
  const submitted = Boolean(submission) || quest.status === "제출 완료";
  const finalComplete =
    quest.status === "완료" &&
    (!submission || formatSubmissionStatus(submission.status) === "선정 완료");

  return [
    {
      label: "참여 완료",
      state: "complete" as QuestStepState,
    },
    {
      label: "제출 완료",
      state: submitted || finalComplete ? "complete" : "waiting",
    },
    {
      label: finalComplete ? "최종 완료" : "결과 대기",
      state: finalComplete ? "complete" : submitted ? "current" : "waiting",
    },
  ];
};

const getStepCircleClass = (state: QuestStepState) => {
  if (state === "complete") {
    return "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/15";
  }

  if (state === "current") {
    return "border-primary/50 bg-primary-light text-primary shadow-md shadow-primary/15 ring-2 ring-primary/10";
  }

  return "border-border bg-surface text-foreground-muted";
};

const getStepTextClass = (state: QuestStepState) => {
  if (state === "complete" || state === "current") {
    return "font-semibold text-foreground";
  }

  return "font-medium text-foreground-muted";
};

export default function MyQuestsPage() {
  const [quests, setQuests] = useState<StoredAppliedQuest[]>([]);
  const [submissions, setSubmissions] = useState<StoredSubmission[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setQuests(getStoredAppliedQuests(userId));
    setSubmissions(getStoredSubmissions(userId));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <DashboardShell>
        <div className="mb-8">
          <p className="text-sm font-semibold text-primary">내 퀘스트</p>
          <h1 className="mt-1 text-3xl font-bold text-foreground">
            참여 중인 퀘스트를 관리해보세요
          </h1>
          <p className="mt-2 text-foreground-muted">
            지원하거나 진행 중인 퀘스트의 상태를 한눈에 확인할 수 있습니다.
          </p>
        </div>

        {quests.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-sm text-foreground-muted">
              아직 참여중인 퀘스트가 없습니다.
            </p>
            <Button
              asChild
              className="mt-4 bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              <Link href="/quests">퀘스트 둘러보기</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {quests.map((quest) => {
              const submission = submissions.find(
                (item) => item.questId === quest.questId,
              );
              const status = getQuestStatus(quest, submission);
              const steps = getQuestSteps(quest, submission);

              return (
                <Card
                  key={quest.questId}
                  className="border border-border transition-all hover:border-primary/25 hover:shadow-sm"
                >
                  <div className="px-4 py-3.5 sm:px-5 sm:py-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div>
                          <h2 className="text-lg font-semibold text-foreground">
                            {quest.title}
                          </h2>
                        </div>

                        <p className="mt-1.5 text-sm font-medium text-foreground-muted">
                          보상{" "}
                          <span className="text-foreground">{quest.reward}</span>
                          <span className="mx-2 text-border">·</span>
                          <span>마감까지 {quest.deadline}</span>
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                          {steps.map((step, index) => (
                            <div
                              key={step.label}
                              className="flex items-center gap-2 text-sm"
                            >
                              <span
                                className={`flex h-7 w-7 items-center justify-center rounded-full border text-sm font-bold ${getStepCircleClass(
                                  step.state,
                                )}`}
                              >
                                {step.state === "complete" ? "✓" : index + 1}
                              </span>
                              <span
                                className={getStepTextClass(step.state)}
                              >
                                {step.label}
                              </span>
                              {index < steps.length - 1 ? (
                                <span
                                  className={`mx-1 ${
                                    step.state === "complete"
                                      ? "text-primary/60"
                                      : "text-foreground-muted"
                                  }`}
                                >
                                  →
                                </span>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-start gap-2.5 lg:shrink-0 lg:justify-end">
                        <Badge
                          className={`px-2.5 py-0.5 text-xs font-semibold ${status.className}`}
                        >
                          {status.label}
                        </Badge>
                        <Button variant="outline" asChild>
                          <Link href={`/quests/${quest.questId}`}>
                            상세 보기
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </DashboardShell>
    </div>
  );
}
