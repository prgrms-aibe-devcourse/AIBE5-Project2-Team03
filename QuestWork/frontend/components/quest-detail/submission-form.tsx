'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SubmissionFormProps {
  questId: string
  onSubmit: (data: SubmissionData) => void
}

export interface SubmissionData {
  submissionType: 'github' | 'file'
  githubUrl?: string
  file?: File
}

export function SubmissionForm({ questId, onSubmit }: SubmissionFormProps) {
  const [submissionType, setSubmissionType] = useState<'github' | 'file'>(
    'github'
  )
  const [githubUrl, setGithubUrl] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const data: SubmissionData = {
      submissionType,
      ...(submissionType === 'github' && { githubUrl }),
      ...(submissionType === 'file' && { file }),
    }

    onSubmit(data)

    setTimeout(() => {
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-xl font-bold text-foreground">결과 제출</h2>
        <p className="text-sm text-foreground-muted">
          아래 방식 중 하나를 선택하여 결과물을 제출해주세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Submission Type Selection */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 rounded-lg border border-border p-4 cursor-pointer transition-colors hover:bg-surface"
            onClick={() => setSubmissionType('github')}>
            <input
              type="radio"
              name="submissionType"
              value="github"
              checked={submissionType === 'github'}
              onChange={() => setSubmissionType('github')}
              className="h-4 w-4"
            />
            <span className="font-medium text-foreground">GitHub 저장소</span>
          </label>

          <label className="flex items-center gap-3 rounded-lg border border-border p-4 cursor-pointer transition-colors hover:bg-surface"
            onClick={() => setSubmissionType('file')}>
            <input
              type="radio"
              name="submissionType"
              value="file"
              checked={submissionType === 'file'}
              onChange={() => setSubmissionType('file')}
              className="h-4 w-4"
            />
            <span className="font-medium text-foreground">파일 업로드</span>
          </label>
        </div>

        {/* GitHub URL Input */}
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
            <p className="text-xs text-foreground-muted">
              공개 저장소 링크를 입력해주세요.
            </p>
          </div>
        )}

        {/* File Upload */}
        {submissionType === 'file' && (
          <div className="space-y-2">
            <Label htmlFor="file" className="text-sm font-medium">
              파일 선택
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                required
                className="border-border bg-background"
              />
            </div>
            {fileName && (
              <p className="text-xs text-foreground-muted">
                선택된 파일: {fileName}
              </p>
            )}
            <p className="text-xs text-foreground-muted">
              최대 100MB 파일을 업로드할 수 있습니다.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          disabled={
            isSubmitting ||
            (submissionType === 'github' && !githubUrl) ||
            (submissionType === 'file' && !file)
          }
          className="w-full bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
        >
          {isSubmitting ? '제출 중...' : '결과 제출하기'}
        </Button>
      </form>

      {/* Supported Formats Info */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <h4 className="mb-2 font-semibold text-foreground">지원되는 제출 방식</h4>
        <ul className="space-y-1 text-sm text-foreground-muted">
          <li>• GitHub 공개 저장소 링크</li>
          <li>• ZIP, TAR.GZ 파일 (최대 100MB)</li>
          <li>• 프로젝트 구조 및 README 포함 필수</li>
        </ul>
      </div>
    </div>
  )
}
