export interface StoredAppliedQuest {
  questId: string
  userId: string
  title: string
  reward: string
  deadline: string
  rawDeadline?: string
  status: string
  appliedAt: string
  applicationId?: number | null
}

interface QuestLike {
  id: number | string
  title: string
  rewardAmount?: number
  deadline?: string
  status?: string
}

const STORAGE_KEY = 'questwork-applied-quests'

export function formatAppliedQuestReward(amount?: number): string {
  if (typeof amount !== 'number') {
    return '-'
  }

  return `₩${amount.toLocaleString('ko-KR')}`
}

export function formatAppliedQuestDeadline(deadline?: string): string {
  if (!deadline) {
    return '-'
  }

  const deadlineDate = new Date(deadline.replace(' ', 'T'))
  if (Number.isNaN(deadlineDate.getTime())) {
    return deadline
  }

  const diffMs = deadlineDate.getTime() - Date.now()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) {
    return '마감'
  }

  return `${diffDays}일 남음`
}

export function getStoredAppliedQuests(userId?: string | null): StoredAppliedQuest[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)
    const quests = Array.isArray(parsed) ? parsed : []

    return quests
      .filter((quest): quest is StoredAppliedQuest => {
        return (
          quest &&
          typeof quest.questId === 'string' &&
          typeof quest.userId === 'string' &&
          typeof quest.title === 'string'
        )
      })
      .filter((quest) => !userId || quest.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
      )
  } catch {
    return []
  }
}

export function addStoredAppliedQuest(quest: StoredAppliedQuest) {
  if (typeof window === 'undefined') {
    return
  }

  const current = getStoredAppliedQuests()
  const next = [
    quest,
    ...current.filter(
      (item) =>
        !(item.questId === quest.questId && item.userId === quest.userId),
    ),
  ]

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function removeStoredAppliedQuest(questId: string, userId: string) {
  if (typeof window === 'undefined') {
    return
  }

  const next = getStoredAppliedQuests().filter(
    (quest) => !(quest.questId === questId && quest.userId === userId),
  )
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function completeStoredAppliedQuest(
  questId: string,
  userId: string,
  fallback?: Partial<StoredAppliedQuest>,
) {
  if (typeof window === 'undefined') {
    return
  }

  const current = getStoredAppliedQuests()
  const existing = current.find(
    (quest) => quest.questId === questId && quest.userId === userId,
  )

  const completed: StoredAppliedQuest = {
    questId,
    userId,
    title: existing?.title ?? fallback?.title ?? `퀘스트 #${questId}`,
    reward: existing?.reward ?? fallback?.reward ?? '-',
    deadline: existing?.deadline ?? fallback?.deadline ?? '-',
    rawDeadline: existing?.rawDeadline ?? fallback?.rawDeadline,
    status: '완료',
    appliedAt: existing?.appliedAt ?? fallback?.appliedAt ?? new Date().toISOString(),
    applicationId: existing?.applicationId ?? fallback?.applicationId ?? null,
  }

  const next = [
    completed,
    ...current.filter(
      (quest) => !(quest.questId === questId && quest.userId === userId),
    ),
  ]

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function createStoredAppliedQuest(
  quest: QuestLike,
  userId: string,
  applicationId?: number | null,
): StoredAppliedQuest {
  return {
    questId: String(quest.id),
    userId,
    title: quest.title,
    reward: formatAppliedQuestReward(quest.rewardAmount),
    deadline: formatAppliedQuestDeadline(quest.deadline),
    rawDeadline: quest.deadline,
    status: quest.status === 'FINISHED' ? '완료' : '진행 중',
    appliedAt: new Date().toISOString(),
    applicationId,
  }
}
