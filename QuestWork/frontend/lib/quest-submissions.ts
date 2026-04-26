export type StoredSubmission = {
  id: string
  questId: string
  userId?: string
  questTitle: string
  reward: string
  title: string
  summary: string
  submissionType: 'github' | 'file'
  githubUrl?: string
  fileName?: string
  status?: string
  submittedAt: string
  freelancerName: string
}

const STORAGE_KEY = 'questwork-submissions'

export function formatSubmissionStatus(status?: string | null): string {
  if (!status || status === 'SUBMITTED') {
    return '제출 완료'
  }

  if (status === 'REVIEWING') {
    return '검토 중'
  }

  if (status === 'APPROVED' || status === 'WINNER') {
    return '선정 완료'
  }

  return status
}

export function getStoredSubmissions(userId?: string | null): StoredSubmission[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)
    const submissions = Array.isArray(parsed) ? parsed : []

    return submissions
      .filter((submission): submission is StoredSubmission => {
        return (
          submission &&
          typeof submission.id === 'string' &&
          typeof submission.questId === 'string' &&
          typeof submission.questTitle === 'string'
        )
      })
      .filter((submission) => !userId || submission.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
      )
  } catch {
    return []
  }
}

export function addStoredSubmission(submission: StoredSubmission) {
  if (typeof window === 'undefined') {
    return
  }

  const current = getStoredSubmissions()
  const next = [
    submission,
    ...current.filter(
      (item) =>
        !(
          item.questId === submission.questId &&
          (!submission.userId || !item.userId || item.userId === submission.userId)
        ),
    ),
  ]

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(next)
  )
}
