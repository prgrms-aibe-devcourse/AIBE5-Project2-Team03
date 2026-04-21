'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface SubmissionFormProps {
  questId: string
  questTitle?: string
  submissionGuide?: string
  onSubmit: (data: SubmissionData) => void
}

export interface SubmissionData {
  questId: string
  submissionType: 'github' | 'file'
  title: string
  summary: string
  githubUrl?: string
  file?: File | null
  checklistConfirmed: boolean
}

const DEFAULT_REQUIREMENTS = [
  'README 또는 실행 방법 포함',
  '핵심 구현 내용 요약 작성',
  '필요 시 스크린샷/리포트 첨부',
]

export function SubmissionForm({
  questId,
  questTitle,
  submissionGuide,
  onSubmit,
}: SubmissionFormProps) {
  const [submissionType, setSubmissionType] = useState<'github' | 'file'>(
    'github'
  )
  const [title, setTitle] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [checklistConfirmed, setChecklistConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const requirementLines = submissionGuide
    ? submissionGuide
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
    : DEFAULT_REQUIREMENTS

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name)
    }
  }

  const isValid =
    title.trim().length > 0 &&
    summary.trim().length > 0 &&
    checklistConfirmed &&
    ((submissionType === 'github' && githubUrl.trim().length > 0) ||
      (submissionType === 'file' && file !== null))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValid) {
      return
    }

    setIsSubmitting(true)

    onSubmit({
      questId,
      submissionType,
      title: title.trim(),
      summary: summary.trim(),
      checklistConfirmed,
      ...(submissionType === 'github'
        ? { githubUrl: githubUrl.trim() }
        : { file }),
    })

    setTimeout(() => {
      setIsSubmitting(false)
    }, 800)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-foreground">결과 제출</h2>
          <Badge className="bg-primary-light text-primary">#{questId}</Badge>
        </div>
        <p className="text-sm text-foreground-muted">
          {questTitle ?? '선택한 퀘스트'}에 대한 작업 결과를 정리해서 제출해주세요.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-surface p-4">
        <h4 className="mb-2 font-semibold text-foreground">제출 체크리스트</h4>
        <ul className="space-y-1 text-sm text-foreground-muted">
          {requirementLines.map((line, index) => (
            <li key={`${line}-${index}`}>• {line}</li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-3">
          <Label className="text-sm font-medium">제출 방식</Label>

          <div className="grid gap-3">
            <label
              className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                submissionType === 'github'
                  ? 'border-primary bg-primary-light/40'
                  : 'border-border hover:bg-surface'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="submissionType"
                  value="github"
                  checked={submissionType === 'github'}
                  onChange={() => setSubmissionType('github')}
                  className="mt-1 h-4 w-4"
                />
                <div>
                  <p className="font-medium text-foreground">GitHub 저장소</p>
                  <p className="text-xs text-foreground-muted">
                    커밋 이력과 README를 함께 확인할 수 있어요.
                  </p>
                </div>
              </div>
            </label>

            <label
              className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                submissionType === 'file'
                  ? 'border-primary bg-primary-light/40'
                  : 'border-border hover:bg-surface'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="submissionType"
                  value="file"
                  checked={submissionType === 'file'}
                  onChange={() => setSubmissionType('file')}
                  className="mt-1 h-4 w-4"
                />
                <div>
                  <p className="font-medium text-foreground">파일 업로드</p>
                  <p className="text-xs text-foreground-muted">
                    압축 파일, 보고서, 스크린샷 등으로 제출할 수 있어요.
                  </p>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="submission-title" className="text-sm font-medium">
            제출 제목
          </Label>
          <Input
            id="submission-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 대시보드 성능 최적화 결과물"
            className="border-border bg-background"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary" className="text-sm font-medium">
            작업 요약
          </Label>
          <Textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="무엇을 구현했고, 어떤 점을 개선했는지 간단히 적어주세요."
            rows={5}
            className="border-border bg-background"
            required
          />
          <p className="text-xs text-foreground-muted">
            구현 내용, 실행 방법, 검증 포인트를 함께 적으면 리뷰가 빨라집니다.
          </p>
        </div>

        {submissionType === 'github' && (
          <div className="space-y-2">
            <Label htmlFor="github" className="text-sm font-medium">
              GitHub 저장소 링크
            </Label>
            <Input
              id="github"
              type="url"
              placeholder="https://github.com/username/repo"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              required
              className="border-border bg-background"
            />
          </div>
        )}

        {submissionType === 'file' && (
          <div className="space-y-2">
            <Label htmlFor="file" className="text-sm font-medium">
              제출 파일
            </Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              required
              className="border-border bg-background"
            />
            {fileName && (
              <p className="text-xs text-foreground-muted">
                선택된 파일: {fileName}
              </p>
            )}
            <p className="text-xs text-foreground-muted">
              ZIP, PDF, 이미지, 문서 등 필요한 산출물을 첨부할 수 있습니다.
            </p>
          </div>
        )}

        <div className="flex items-start gap-3 rounded-lg border border-border p-4">
          <Checkbox
            id="checklist"
            checked={checklistConfirmed}
            onCheckedChange={(checked) => setChecklistConfirmed(checked === true)}
          />
          <div className="space-y-1">
            <Label htmlFor="checklist" className="cursor-pointer text-sm font-medium">
              제출 형식과 필수 항목을 모두 확인했습니다.
            </Label>
            <p className="text-xs text-foreground-muted">
              README, 실행 방법, 요구 산출물이 포함되었는지 마지막으로 점검해주세요.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || !isValid}
          className="w-full bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
        >
          {isSubmitting ? '제출 중...' : '결과 제출하기'}
        </Button>
      </form>
    </div>
  )
}
