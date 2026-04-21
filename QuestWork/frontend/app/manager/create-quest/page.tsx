'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GlobalNav } from '@/components/global-nav'
import { ManagerSidebar } from '@/components/manager/manager-sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const TECH_STACK_OPTIONS = [
  'React',
  'Next.js',
  'Java',
  'Spring',
  'Node.js',
  'Python',
]

const DIFFICULTY_OPTIONS = ['Beginner', 'Intermediate', 'Advanced']

const SUBMISSION_FORMAT_OPTIONS = [
  { id: 'github', label: 'GitHub Repository' },
  { id: 'file', label: 'File Upload' },
]

export default function CreateQuestPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: [] as string[],
    reward: '',
    deadline: '',
    difficulty: '',
    submissionFormats: [] as string[],
  })

  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTechStackChange = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter((t) => t !== tech)
        : [...prev.techStack, tech],
    }))
  }

  const handleDifficultyChange = (difficulty: string) => {
    setFormData((prev) => ({ ...prev, difficulty }))
  }

  const handleSubmissionFormatChange = (format: string) => {
    setFormData((prev) => ({
      ...prev,
      submissionFormats: prev.submissionFormats.includes(format)
        ? prev.submissionFormats.filter((f) => f !== format)
        : [...prev.submissionFormats, format],
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('[v0] Quest creation form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <div className="flex">
        {/* Sidebar */}
        <ManagerSidebar />

        {/* Main Content */}
        <main className="flex-1">
          <div className="space-y-6 p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  새 퀘스트 등록
                </h1>
                <p className="mt-1 text-foreground-muted">
                  새로운 퀘스트를 생성하여 프리랜서들의 솔루션을 받아보세요.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Card */}
              <Card className="border border-border p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  기본 정보
                </h2>

                <div className="space-y-4">
                  {/* Quest Title */}
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      퀘스트 제목
                    </label>
                    <Input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., React Admin Dashboard Performance Optimization"
                      className="mt-1"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      퀘스트 설명
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="퀘스트의 상세한 설명을 입력하세요..."
                      rows={6}
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-foreground-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                      required
                    />
                  </div>
                </div>
              </Card>

              {/* Tech Stack Card */}
              <Card className="border border-border p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  기술 스택 요구사항
                </h2>

                <div className="flex flex-wrap gap-2">
                  {TECH_STACK_OPTIONS.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => handleTechStackChange(tech)}
                      className={`rounded-md px-3 py-2 text-sm font-medium transition-all ${
                        formData.techStack.includes(tech)
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-border bg-surface text-foreground hover:border-primary hover:text-primary'
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Reward & Deadline Card */}
              <Card className="border border-border p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  보상 및 기한
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Reward */}
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      보상액 (원)
                    </label>
                    <Input
                      type="number"
                      name="reward"
                      value={formData.reward}
                      onChange={handleInputChange}
                      placeholder="e.g., 1000000"
                      className="mt-1"
                      required
                    />
                  </div>

                  {/* Deadline */}
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      마감일
                    </label>
                    <Input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
              </Card>

              {/* Difficulty Card */}
              <Card className="border border-border p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  난이도
                </h2>

                <div className="flex gap-3">
                  {DIFFICULTY_OPTIONS.map((difficulty) => (
                    <button
                      key={difficulty}
                      type="button"
                      onClick={() => handleDifficultyChange(difficulty)}
                      className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                        formData.difficulty === difficulty
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-border bg-surface text-foreground hover:border-primary hover:text-primary'
                      }`}
                    >
                      {difficulty}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Submission Format Card */}
              <Card className="border border-border p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  제출 형식
                </h2>

                <div className="space-y-2">
                  {SUBMISSION_FORMAT_OPTIONS.map((format) => (
                    <label
                      key={format.id}
                      className="flex items-center gap-2 rounded-md p-2 hover:bg-surface"
                    >
                      <input
                        type="checkbox"
                        checked={formData.submissionFormats.includes(format.id)}
                        onChange={() =>
                          handleSubmissionFormatChange(format.id)
                        }
                        className="h-4 w-4 cursor-pointer rounded border-border text-primary"
                      />
                      <span className="cursor-pointer text-sm font-medium text-foreground">
                        {format.label}
                      </span>
                    </label>
                  ))}
                </div>
              </Card>

              {/* Success Message */}
              {submitted && (
                <div className="rounded-md border border-green-200 bg-green-50 p-4">
                  <p className="text-sm font-medium text-green-800">
                    ✓ 퀘스트가 등록되었습니다!
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary-hover"
                >
                  퀘스트 등록하기
                </Button>
                <Link href="/manager">
                  <Button type="button" variant="outline">
                    취소
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
