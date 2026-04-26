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
const USER_STORAGE_KEY_PREFIX = 'questwork-applied-quests:'

function getUserStorageKey(userId: string) {
  return `${USER_STORAGE_KEY_PREFIX}${userId}`
}

function parseStoredQuests(raw: string | null): StoredAppliedQuest[] {
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)
    const quests = Array.isArray(parsed) ? parsed : []

    return quests.filter((quest): quest is StoredAppliedQuest => {
      return (
        quest &&
        typeof quest.questId === 'string' &&
        typeof quest.userId === 'string' &&
        typeof quest.title === 'string'
      )
    })
  } catch {
    return []
  }
}

function sortAppliedQuests(quests: StoredAppliedQuest[]) {
  return quests.sort(
    (a, b) =>
      new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
  )
}

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

  if (userId) {
    const userQuests = parseStoredQuests(
      window.localStorage.getItem(getUserStorageKey(userId)),
    )
    const legacyQuests = parseStoredQuests(window.localStorage.getItem(STORAGE_KEY))
      .filter((quest) => quest.userId === userId)

    const merged = new Map<string, StoredAppliedQuest>()
    const questsForUser = [...legacyQuests, ...userQuests]
    questsForUser.forEach((quest) => {
      merged.set(quest.questId, quest)
    })

    const next = sortAppliedQuests(Array.from(merged.values()))
    if (next.length > 0) {
      window.localStorage.setItem(getUserStorageKey(userId), JSON.stringify(next))
    }

    return next
  }

  const allQuests = new Map<string, StoredAppliedQuest>()
  parseStoredQuests(window.localStorage.getItem(STORAGE_KEY)).forEach((quest) => {
    allQuests.set(`${quest.userId}:${quest.questId}`, quest)
  })

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index)
    if (!key?.startsWith(USER_STORAGE_KEY_PREFIX)) continue

    parseStoredQuests(window.localStorage.getItem(key)).forEach((quest) => {
      allQuests.set(`${quest.userId}:${quest.questId}`, quest)
    })
  }

  return sortAppliedQuests(Array.from(allQuests.values()))
}

export function addStoredAppliedQuest(quest: StoredAppliedQuest) {
  if (typeof window === 'undefined') {
    return
  }

  const current = getStoredAppliedQuests(quest.userId)
  const next = [
    quest,
    ...current.filter(
      (item) =>
        !(item.questId === quest.questId && item.userId === quest.userId),
    ),
  ]

  window.localStorage.setItem(
    getUserStorageKey(quest.userId),
    JSON.stringify(next),
  )
}

export function removeStoredAppliedQuest(questId: string, userId: string) {
  if (typeof window === 'undefined') {
    return
  }

  const next = getStoredAppliedQuests(userId).filter(
    (quest) => !(quest.questId === questId && quest.userId === userId),
  )
  window.localStorage.setItem(getUserStorageKey(userId), JSON.stringify(next))
}

export function completeStoredAppliedQuest(
  questId: string,
  userId: string,
  fallback?: Partial<StoredAppliedQuest>,
) {
  if (typeof window === 'undefined') {
    return
  }

  const current = getStoredAppliedQuests(userId)
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

  window.localStorage.setItem(getUserStorageKey(userId), JSON.stringify(next))
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
