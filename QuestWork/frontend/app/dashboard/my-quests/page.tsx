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

export default function MyQuestsPage() {
  const [quests, setQuests] = useState<StoredAppliedQuest[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setQuests(getStoredAppliedQuests(userId));
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
            {quests.map((quest) => (
              <Card key={quest.questId} className="border border-border">
                <div className="p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-foreground">
                          {quest.title}
                        </h2>
                        <Badge
                          className={
                            quest.status === "완료"
                              ? "bg-green-100 text-green-700"
                              : "bg-primary-light text-primary"
                          }
                        >
                          {quest.status}
                        </Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-foreground-muted">
                        <span>보상 {quest.reward}</span>
                        <span>{quest.deadline}</span>
                      </div>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-raised">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: quest.status === "완료" ? "100%" : "50%",
                          }}
                        />
                      </div>
                    </div>

                    <Button variant="outline" asChild>
                      <Link href={`/quests/${quest.questId}`}>상세 보기</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </DashboardShell>
    </div>
  );
}
