'use client'

import { GlobalNav } from '@/components/global-nav'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function ProfileSettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <main className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="text-sm font-semibold text-primary">Settings</p>
            <h1 className="mt-1 text-3xl font-bold text-foreground">
              계정 설정
            </h1>
            <p className="mt-2 text-foreground-muted">
              로그인 정보, 이메일, 알림 수신 여부와 계정 상태를 관리하세요.
            </p>
          </div>

          <div className="space-y-6">
            <Card className="border border-border">
              <div className="border-b border-border p-6">
                <h2 className="text-xl font-semibold text-foreground">
                  이메일
                </h2>
                <p className="mt-1 text-sm text-foreground-muted">
                  계정과 알림에 사용할 이메일 주소입니다.
                </p>
              </div>
              <div className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label htmlFor="email">이메일 주소</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="kim.dev@example.com"
                    className="h-11 border-border bg-surface"
                  />
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary-hover">
                  이메일 저장
                </Button>
              </div>
            </Card>

            <Card className="border border-border">
              <div className="border-b border-border p-6">
                <h2 className="text-xl font-semibold text-foreground">
                  비밀번호 변경
                </h2>
                <p className="mt-1 text-sm text-foreground-muted">
                  안전한 계정 보호를 위해 주기적으로 비밀번호를 변경하세요.
                </p>
              </div>
              <div className="grid gap-4 p-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="current-password">현재 비밀번호</Label>
                  <Input
                    id="current-password"
                    type="password"
                    className="h-11 border-border bg-surface"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">새 비밀번호</Label>
                  <Input
                    id="new-password"
                    type="password"
                    className="h-11 border-border bg-surface"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    className="h-11 border-border bg-surface"
                  />
                </div>
                <div className="md:col-span-2">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary-hover">
                    비밀번호 변경
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="border border-border">
              <div className="border-b border-border p-6">
                <h2 className="text-xl font-semibold text-foreground">
                  알림 설정
                </h2>
                <p className="mt-1 text-sm text-foreground-muted">
                  퀘스트와 계정 관련 알림을 받을 방식을 선택하세요.
                </p>
              </div>
              <div className="divide-y divide-border p-6">
                <div className="flex items-center justify-between gap-4 pb-5">
                  <div>
                    <p className="font-medium text-foreground">퀘스트 알림</p>
                    <p className="mt-1 text-sm text-foreground-muted">
                      참여 중인 퀘스트의 마감, 댓글, 선정 결과를 받습니다.
                    </p>
                  </div>
                  <Switch defaultChecked aria-label="퀘스트 알림" />
                </div>
                <div className="flex items-center justify-between gap-4 py-5">
                  <div>
                    <p className="font-medium text-foreground">수익 알림</p>
                    <p className="mt-1 text-sm text-foreground-muted">
                      보상 지급과 정산 상태 변경 알림을 받습니다.
                    </p>
                  </div>
                  <Switch defaultChecked aria-label="수익 알림" />
                </div>
                <div className="flex items-center justify-between gap-4 pt-5">
                  <div>
                    <p className="font-medium text-foreground">마케팅 알림</p>
                    <p className="mt-1 text-sm text-foreground-muted">
                      새로운 기능과 추천 퀘스트 소식을 받습니다.
                    </p>
                  </div>
                  <Switch aria-label="마케팅 알림" />
                </div>
              </div>
            </Card>

            <Card className="border border-border">
              <div className="border-b border-border p-6">
                <h2 className="text-xl font-semibold text-foreground">
                  계정 설정
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
                      다른 사용자가 내 포트폴리오 프로필을 볼 수 있습니다.
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
  )
}
