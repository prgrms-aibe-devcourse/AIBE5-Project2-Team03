export type StoredSubmission = {
  id: string
  questId: string
  questTitle: string
  reward: string
  title: string
  summary: string
  submissionType: 'github' | 'file'
  githubUrl?: string
  fileName?: string
  submittedAt: string
  freelancerName: string
}

const STORAGE_KEY = 'questwork-submissions'

export function getStoredSubmissions(): StoredSubmission[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function addStoredSubmission(submission: StoredSubmission) {
  if (typeof window === 'undefined') {
    return
  }

  const current = getStoredSubmissions()
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([submission, ...current])
  )
}
