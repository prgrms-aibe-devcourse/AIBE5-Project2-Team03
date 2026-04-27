'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { GlobalNav } from '@/components/global-nav'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { ManagerSidebar } from '@/components/manager/manager-sidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface QuestDetail {
  id: number
  title: string
  status: string
  rewardAmount: number
  deadline: string
  createdAt: string
  formData?: Record<string, unknown>
}

interface Applicant {
  applicationId: number
  memberId: number
  nickname: string
  portfolioUrl: string | null
  intro: string | null
  status: string
  appliedAt: string
}

interface Submission {
  submissionId: number
  questId: number
  memberId: number
  userId: number
  nickname: string
  submissionTitle: string
  submissionContent: string
  fileUrl: string | null
  repoUrl: string | null
  versionNo: number
  status: string
  submittedAt: string
}

const STATUS_LABEL: Record<string, string> = {
  OPEN: '모집 중',
  CLOSED: '모집 완료',
  IN_PROCESS: '진행 중',
  FINISHED: '종료',
  PICKED: '선정 완료',
  CANCELED: '취소됨',
}
const STATUS_COLOR: Record<string, string> = {
  OPEN: 'bg-green-100 text-green-700',
  IN_PROCESS: 'bg-primary-light text-primary',
  PICKED: 'bg-primary-light text-primary',
  FINISHED: 'bg-slate-100 text-slate-700',
  CLOSED: 'bg-slate-100 text-slate-700',
  CANCELED: 'bg-red-100 text-red-700',
}

const SUB_STATUS_LABEL: Record<string, string> = {
  SUBMITTED: '제출됨',
  WINNER: '선정됨',
  REJECTED: '반려됨',
}
const SUB_STATUS_COLOR: Record<string, string> = {
  SUBMITTED: 'bg-blue-100 text-blue-700',
  WINNER: 'bg-green-100 text-green-700',
  REJECTED: 'bg-slate-100 text-slate-700',
}

export default function ManagerQuestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const questId = params.id as string

  const [userId, setUserId] = useState<number | null>(null)
  const [quest, setQuest] = useState<QuestDetail | null>(null)
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectingId, setSelectingId] = useState<number | null>(null)
  const [winnerError, setWinnerError] = useState<string | null>(null)

  // 우승자 선정 확인 모달
  const [confirmSubmissionId, setConfirmSubmissionId] = useState<number | null>(null)
  // 제출품 상세 보기 모달
  const [viewingSubmission, setViewingSubmission] = useState<Submission | null>(null)
  // 지급 승인
  const [payoutSubmission, setPayoutSubmission] = useState<Submission | null>(null)
  const [payoutLoading, setPayoutLoading] = useState(false)
  const [payoutError, setPayoutError] = useState<string | null>(null)
  const [payoutDone, setPayoutDone] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem('role')
    const uid = localStorage.getItem('userId')
    if (!uid || role !== 'MANAGER') {
      router.push('/login')
      return
    }
    setUserId(Number(uid))
  }, [router])

  useEffect(() => {
    if (!userId) return

    const fetchAll = async () => {
      setLoading(true)
      setError(null)
      try {
        const [questRes, applicantsRes, submissionsRes] = await Promise.all([
          fetch(`http://localhost:8000/api/quests/${questId}`),
          fetch(`http://localhost:8000/api/manager/quests/${questId}/applicants?userId=${userId}`),
          fetch(`http://localhost:8000/api/manager/quests/${questId}/submissions?userId=${userId}`),
        ])

        if (!questRes.ok) throw new Error('퀘스트 정보를 불러올 수 없습니다.')

        const [questData, applicantsData, submissionsData] = await Promise.all([
          questRes.json(),
          applicantsRes.ok ? applicantsRes.json() : [],
          submissionsRes.ok ? submissionsRes.json() : [],
        ])

        setQuest(questData)
        setApplicants(applicantsData)
        setSubmissions(submissionsData)
        // 이미 지급 완료된 경우(FINISHED) payoutDone 반영
        if (questData.status === 'FINISHED') {
          setPayoutDone(true)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : '오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [userId, questId])

  const handlePayout = async (submission: Submission) => {
    if (!quest) return
    setPayoutLoading(true)
    setPayoutError(null)
    try {
      const res = await fetch('http://localhost:8000/api/settlement/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          freelancerId: submission.userId,
          questId: quest.id,
          originalAmount: quest.rewardAmount,
        }),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || '지급 처리에 실패했습니다.')
      }
      setPayoutDone(true)
      setPayoutSubmission(null)
      // 퀘스트 상태를 FINISHED로 로컬 업데이트
      setQuest(prev => prev ? { ...prev, status: 'FINISHED' } : prev)
    } catch (e) {
      setPayoutError(e instanceof Error ? e.message : '오류가 발생했습니다.')
    } finally {
      setPayoutLoading(false)
    }
  }

  const handleSelectWinner = async (submissionId: number) => {
    setConfirmSubmissionId(null)
    if (!userId) return
    setSelectingId(submissionId)
    setWinnerError(null)
    try {
      const res = await fetch(
        `http://localhost:8000/api/manager/quests/${questId}/winner?userId=${userId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ submissionId }),
        },
      )
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || '우승자 선정에 실패했습니다.')
      }
      // 로컬 상태 업데이트
      setSubmissions((prev) =>
        prev.map((s) => ({
          ...s,
          status: s.submissionId === submissionId ? 'WINNER' : 'REJECTED',
        })),
      )
    } catch (e) {
      setWinnerError(e instanceof Error ? e.message : '오류가 발생했습니다.')
    } finally {
      setSelectingId(null)
    }
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('ko-KR')

  const formatDeadline = (dateStr: string) => {
    const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (diff < 0) return '마감됨'
    if (diff === 0) return '오늘 마감'
    return `${diff}일 남음`
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <GlobalNav />
        <DashboardShell sidebar={<ManagerSidebar />}>
          <div className="space-y-8">
            {/* 뒤로가기 */}
            <div>
              <Link
                href="/manager/posted-quests"
                className="text-sm text-foreground-muted hover:text-foreground"
              >
                ← 등록한 퀘스트 목록으로
              </Link>
            </div>

            {loading && (
              <p className="text-sm text-foreground-muted">불러오는 중...</p>
            )}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* 퀘스트 기본 정보 */}
            {quest && (
              <Card className="border border-border shadow-none">
                <div className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase text-foreground-muted">
                        Quest #{quest.id}
                      </p>
                      <h1 className="mt-1 text-2xl font-bold text-foreground">
                        {quest.title}
                      </h1>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          STATUS_COLOR[quest.status] ?? 'bg-slate-100 text-slate-700'
                        }
                      >
                        {STATUS_LABEL[quest.status] ?? quest.status}
                      </Badge>
                      <Link href={`/manager/quests/${quest.id}/edit`}>
                        <Button variant="outline" size="sm">수정하기</Button>
                      </Link>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <p className="text-xs text-foreground-muted">보상 금액</p>
                      <p className="mt-1 text-lg font-bold text-primary">
                        ₩{quest.rewardAmount?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground-muted">마감일</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {formatDeadline(quest.deadline)}
                      </p>
                      <p className="text-xs text-foreground-muted">
                        {formatDate(quest.deadline)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground-muted">지원자 수</p>
                      <p className="mt-1 text-lg font-bold text-foreground">
                        {applicants.length}명
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground-muted">제출 수</p>
                      <p className="mt-1 text-lg font-bold text-foreground">
                        {submissions.length}건
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* 지원자 목록 */}
            {!loading && (
              <Card className="border border-border shadow-none">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    지원자 명단
                  </h2>
                  <p className="mt-1 text-sm text-foreground-muted">
                    이 퀘스트에 지원한 개발자 목록입니다.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>닉네임</TableHead>
                        <TableHead>소개</TableHead>
                        <TableHead>포트폴리오</TableHead>
                        <TableHead>지원 상태</TableHead>
                        <TableHead>지원일</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applicants.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="py-8 text-center text-foreground-muted"
                          >
                            아직 지원자가 없습니다.
                          </TableCell>
                        </TableRow>
                      ) : (
                        applicants.map((a) => (
                          <TableRow key={a.applicationId}>
                            <TableCell className="font-medium text-foreground">
                              {a.nickname}
                            </TableCell>
                            <TableCell className="max-w-50 truncate text-sm text-foreground-muted">
                              {a.intro || '-'}
                            </TableCell>
                            <TableCell>
                              {a.portfolioUrl ? (
                                <a
                                  href={a.portfolioUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary underline"
                                >
                                  보기
                                </a>
                              ) : (
                                <span className="text-sm text-foreground-muted">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-blue-100 text-blue-700">
                                {a.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-foreground-muted">
                              {formatDate(a.appliedAt)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )}

            {/* 제출물 목록 */}
            {!loading && (
              <Card className="border border-border shadow-none">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    제출물 목록
                  </h2>
                  <p className="mt-1 text-sm text-foreground-muted">
                    제출된 결과물을 확인하고 우승자를 선정하세요.
                  </p>
                </div>

                {winnerError && (
                  <div className="mx-6 mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {winnerError}
                  </div>
                )}

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>개발자</TableHead>
                        <TableHead>제목</TableHead>
                        <TableHead>링크</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>제출일</TableHead>
                        <TableHead className="text-right">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="py-8 text-center text-foreground-muted"
                          >
                            아직 제출물이 없습니다.
                          </TableCell>
                        </TableRow>
                      ) : (
                        submissions.map((s) => (
                          <TableRow key={s.submissionId}>
                            <TableCell className="font-medium text-foreground">
                              {s.nickname}
                            </TableCell>
                            <TableCell className="max-w-40 truncate text-sm text-foreground">
                              {s.submissionTitle}
                            </TableCell>
                            <TableCell>
                              {s.repoUrl ? (
                                <a
                                  href={s.repoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary underline"
                                >
                                  GitHub
                                </a>
                              ) : s.fileUrl ? (
                                <a
                                  href={s.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary underline"
                                >
                                  파일
                                </a>
                              ) : (
                                <span className="text-sm text-foreground-muted">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  SUB_STATUS_COLOR[s.status] ??
                                  'bg-slate-100 text-slate-700'
                                }
                              >
                                {SUB_STATUS_LABEL[s.status] ?? s.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-foreground-muted">
                              {formatDate(s.submittedAt)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setViewingSubmission(s)}
                                >
                                  내용 보기
                                </Button>
                                {s.status === 'WINNER' ? (
                                  <Button
                                    size="sm"
                                    disabled={quest?.status === 'FINISHED' || payoutDone}
                                    className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-40"
                                    onClick={() => setPayoutSubmission(s)}
                                  >
                                    {(quest?.status === 'FINISHED' || payoutDone) ? '지급 완료' : '지급 승인'}
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    disabled={
                                      s.status !== 'SUBMITTED' ||
                                      selectingId !== null ||
                                      submissions.some((sub) => sub.status === 'WINNER')
                                    }
                                    className="bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-40"
                                    onClick={() => setConfirmSubmissionId(s.submissionId)}
                                  >
                                    {selectingId === s.submissionId ? '처리 중...' : '선정하기'}
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )}
          </div>
        </DashboardShell>
      </div>

      {/* 우승자 선정 확인 모달 */}
      <Dialog
        open={confirmSubmissionId !== null}
        onOpenChange={(open) => { if (!open) setConfirmSubmissionId(null) }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>우승자 선정 확인</DialogTitle>
            <DialogDescription>
              이 제출물을 우승자로 선정하시겠습니까?
              선정 후에는 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmSubmissionId(null)}>
              취소
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary-hover"
              onClick={() => {
                if (confirmSubmissionId !== null) handleSelectWinner(confirmSubmissionId)
              }}
            >
              선정하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 지급 승인 확인 모달 */}
      <Dialog
        open={payoutSubmission !== null}
        onOpenChange={(open) => { if (!open) { setPayoutSubmission(null); setPayoutError(null) } }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>보상 지급 승인</DialogTitle>
            <DialogDescription>
              {payoutSubmission?.nickname}님에게 ₩{quest?.rewardAmount?.toLocaleString()}의 90%
              (수수료 10% 제외)를 지급합니다. 진행하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          {payoutError && (
            <p className="text-sm text-red-600">{payoutError}</p>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setPayoutSubmission(null); setPayoutError(null) }}>
              취소
            </Button>
            <Button
              disabled={payoutLoading}
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={() => payoutSubmission && handlePayout(payoutSubmission)}
            >
              {payoutLoading ? '처리 중...' : '지급 승인'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 제출품 내용 보기 모달 */}
      <Dialog
        open={viewingSubmission !== null}
        onOpenChange={(open) => { if (!open) setViewingSubmission(null) }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewingSubmission?.submissionTitle}</DialogTitle>
            <DialogDescription>제출자: {viewingSubmission?.nickname}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm text-foreground">
            <p className="whitespace-pre-wrap rounded-lg bg-surface p-4">
              {viewingSubmission?.submissionContent}
            </p>
            {viewingSubmission?.repoUrl && (
              <p>
                <span className="font-medium">GitHub: </span>
                <a
                  href={viewingSubmission.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  {viewingSubmission.repoUrl}
                </a>
              </p>
            )}
            {viewingSubmission?.fileUrl && (
              <p>
                <span className="font-medium">파일: </span>
                <a
                  href={viewingSubmission.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  파일 보기
                </a>
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingSubmission(null)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
