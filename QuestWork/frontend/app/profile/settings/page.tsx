"use client";

import { useEffect, useState, type FormEvent } from "react";
import { GlobalNav } from "@/components/global-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function ProfileSettingsPage() {
  const [accountEmail, setAccountEmail] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [passwordDraft, setPasswordDraft] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    setAccountEmail(localStorage.getItem("email") || "");
    setUsername(localStorage.getItem("username") || "");
    setUserId(localStorage.getItem("userId") || "");
  }, []);

  const handlePasswordChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordMessage(null);

    if (!userId) {
      setPasswordMessage({
        type: "error",
        text: "로그인 사용자 ID를 찾을 수 없습니다. 다시 로그인한 뒤 시도해주세요.",
      });
      return;
    }

    if (
      !passwordDraft.currentPassword ||
      !passwordDraft.newPassword ||
      !passwordDraft.confirmPassword
    ) {
      setPasswordMessage({
        type: "error",
        text: "현재 비밀번호와 새 비밀번호를 모두 입력해주세요.",
      });
      return;
    }

    if (passwordDraft.newPassword !== passwordDraft.confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.",
      });
      return;
    }

    setIsPasswordLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/user/${encodeURIComponent(userId)}/password`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: passwordDraft.currentPassword,
            newPassword: passwordDraft.newPassword,
          }),
        },
      );

      if (!response.ok) {
        const errorMsg = await response.text();

        if (response.status === 400) {
          throw new Error(errorMsg || "현재 비밀번호가 일치하지 않습니다.");
        }

        if (response.status === 401 || response.status === 403) {
          throw new Error(
            "비밀번호 변경 권한을 확인하지 못했습니다. 다시 로그인한 뒤 시도해주세요.",
          );
        }

        if (response.status === 404) {
          throw new Error(
            "비밀번호를 변경할 사용자 정보를 찾지 못했습니다. 다시 로그인한 뒤 시도해주세요.",
          );
        }

        throw new Error(errorMsg || "비밀번호 수정 실패");
      }

      setPasswordDraft({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordMessage({
        type: "success",
        text: "비밀번호가 성공적으로 변경되었습니다.",
      });
    } catch (error) {
      setPasswordMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "비밀번호 변경 중 오류가 발생했습니다.",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <main className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="text-sm font-semibold text-primary">설정</p>
            <h1 className="mt-1 text-3xl font-bold text-foreground">
              계정 설정
            </h1>
            <p className="mt-2 text-foreground-muted">
              로그인 정보, 이메일, 알림 수신 여부와 계정 공개 범위를 관리할 수 있습니다.
            </p>
          </div>

          <div className="space-y-6">
            <Card className="border border-border">
              <div className="border-b border-border p-6">
                <h2 className="text-xl font-semibold text-foreground">
                  이메일
                </h2>
                <p className="mt-1 text-sm text-foreground-muted">
                  현재 로그인한 계정의 이메일 주소입니다.
                </p>
              </div>
              <div className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label id="account-email-label">계정 이메일</Label>
                  <div
                    role="text"
                    aria-labelledby="account-email-label"
                    className="flex min-h-11 items-center rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground"
                  >
                    {accountEmail || "이메일 정보가 없습니다."}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border border-border">
              <div className="border-b border-border p-6">
                <h2 className="text-xl font-semibold text-foreground">
                  비밀번호 변경
                </h2>
                <p className="mt-1 text-sm text-foreground-muted">
                  계정 보안을 위해 주기적으로 비밀번호를 변경해 주세요.
                </p>
              </div>
              <form
                onSubmit={handlePasswordChange}
                className="grid gap-4 p-6 md:grid-cols-2"
              >
                <div className="space-y-2">
                  <Label htmlFor="current-password">현재 비밀번호</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwordDraft.currentPassword}
                    onChange={(event) =>
                      setPasswordDraft((prev) => ({
                        ...prev,
                        currentPassword: event.target.value,
                      }))
                    }
                    autoComplete="current-password"
                    className="h-11 border-border bg-surface"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">새 비밀번호</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordDraft.newPassword}
                    onChange={(event) =>
                      setPasswordDraft((prev) => ({
                        ...prev,
                        newPassword: event.target.value,
                      }))
                    }
                    autoComplete="new-password"
                    className="h-11 border-border bg-surface"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordDraft.confirmPassword}
                    onChange={(event) =>
                      setPasswordDraft((prev) => ({
                        ...prev,
                        confirmPassword: event.target.value,
                      }))
                    }
                    autoComplete="new-password"
                    className="h-11 border-border bg-surface"
                  />
                </div>
                {passwordMessage ? (
                  <p
                    className={`text-sm md:col-span-2 ${
                      passwordMessage.type === "success"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {passwordMessage.text}
                  </p>
                ) : null}
                <div className="md:col-span-2">
                  <Button
                    type="submit"
                    disabled={isPasswordLoading}
                    className="bg-primary text-primary-foreground hover:bg-primary-hover"
                  >
                    {isPasswordLoading ? "변경 중..." : "비밀번호 변경"}
                  </Button>
                </div>
              </form>
            </Card>

            <Card className="border border-border">
              <div className="border-b border-border p-6">
                <h2 className="text-xl font-semibold text-foreground">
                  알림 설정
                </h2>
                <p className="mt-1 text-sm text-foreground-muted">
                  퀘스트와 계정 관련 알림 수신 여부를 선택해보세요.
                </p>
              </div>
              <div className="divide-y divide-border p-6">
                <div className="flex items-center justify-between gap-4 pb-5">
                  <div>
                    <p className="font-medium text-foreground">퀘스트 알림</p>
                    <p className="mt-1 text-sm text-foreground-muted">
                      참여 중인 퀘스트의 마감, 선정, 상태 변경 알림을 받습니다.
                    </p>
                  </div>
                  <Switch defaultChecked aria-label="퀘스트 알림" />
                </div>
                <div className="flex items-center justify-between gap-4 py-5">
                  <div>
                    <p className="font-medium text-foreground">수익 알림</p>
                    <p className="mt-1 text-sm text-foreground-muted">
                      보상 지급 및 정산 상태 변경 알림을 받습니다.
                    </p>
                  </div>
                  <Switch defaultChecked aria-label="수익 알림" />
                </div>
                <div className="flex items-center justify-between gap-4 pt-5">
                  <div>
                    <p className="font-medium text-foreground">마케팅 알림</p>
                    <p className="mt-1 text-sm text-foreground-muted">
                      새로운 기능과 추천 퀘스트 소식을 받아봅니다.
                    </p>
                  </div>
                  <Switch aria-label="마케팅 알림" />
                </div>
              </div>
            </Card>

            <Card className="border border-border">
              <div className="border-b border-border p-6">
                <h2 className="text-xl font-semibold text-foreground">
                  계정 상태
                </h2>
                <p className="mt-1 text-sm text-foreground-muted">
                  계정 공개 범위와 계정 상태를 관리합니다.
                </p>
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium text-foreground">프로필 공개</p>
                    <p className="mt-1 text-sm text-foreground-muted">
                      다른 사용자가 내 포트폴리오와 프로필을 볼 수 있습니다.
                    </p>
                  </div>
                  <Switch defaultChecked aria-label="프로필 공개" />
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="font-medium text-red-700">계정 비활성화</p>
                  <p className="mt-1 text-sm text-red-600">
                    계정을 비활성화하면 프로필이 공개 목록에서 숨겨집니다.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 border-red-200 text-red-700 hover:bg-red-100"
                  >
                    계정 비활성화
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
