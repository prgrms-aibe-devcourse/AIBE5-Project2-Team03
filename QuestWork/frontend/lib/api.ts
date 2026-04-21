export const API_BASE_URL = 'http://localhost:8000'

// ── 백엔드 응답 타입 ──────────────────────────────────────────────

export type QuestStatus =
  | 'OPEN'
  | 'CLOSED'
  | 'IN_PROCESS'
  | 'FINISHED'
  | 'PICKED'
  | 'CANCELED'

export interface QuestFormData {
  description?: string
  techStack?: string[]
  difficulty?: string
  submissionFormats?: string[]
  [key: string]: unknown
}

export interface QuestResponse {
  id: number
  managerId: number
  title: string
  formData: QuestFormData
  rewardAmount: number
  deadline: string // "yyyy-MM-dd HH:mm:ss"
  status: QuestStatus
  createdAt: string
  updatedAt: string
}

export interface UserResponse {
  id: number
  email: string
  nickname: string
  username: string
}

// ── 변환 헬퍼 ────────────────────────────────────────────────────

/** ₩1,000,000 형태로 변환 */
export function formatReward(amount: number): string {
  return `₩${Math.floor(amount).toLocaleString('ko-KR')}`
}

/** "yyyy-MM-dd HH:mm:ss" → "X일 남음" */
export function formatDeadline(deadline: string): string {
  const deadlineDate = new Date(deadline.replace(' ', 'T'))
  const now = new Date()
  const diffMs = deadlineDate.getTime() - now.getTime()
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  if (days <= 0) return '마감됨'
  return `${days}일 남음`
}

/** QuestStatus → 한글 라벨 */
export function formatStatus(status: QuestStatus): string {
  const map: Record<QuestStatus, string> = {
    OPEN: '모집 중',
    CLOSED: '모집 완료',
    IN_PROCESS: '진행 중',
    FINISHED: '종료',
    PICKED: '참여 신청 완료',
    CANCELED: '취소됨',
  }
  return map[status] ?? status
}

/** 날짜 문자열 → "yyyy-MM-ddTHH:mm:ss" (백엔드 LocalDateTime 포맷) */
export function toLocalDateTime(dateStr: string): string {
  // input: "2026-05-01" or "2026-05-01T23:59"
  if (dateStr.length === 10) return `${dateStr}T23:59:00`
  if (dateStr.includes('T') && dateStr.length === 16) return `${dateStr}:00`
  return dateStr
}

// ── API 호출 함수 ─────────────────────────────────────────────────

export async function fetchAllQuests(): Promise<QuestResponse[]> {
  const res = await fetch(`${API_BASE_URL}/api/quests`)
  if (!res.ok) throw new Error('퀘스트 목록을 불러오지 못했습니다.')
  return res.json()
}

export async function fetchQuest(questId: string | number): Promise<QuestResponse> {
  const res = await fetch(`${API_BASE_URL}/api/quests/${questId}`)
  if (!res.ok) throw new Error('퀘스트를 불러오지 못했습니다.')
  return res.json()
}

export async function fetchQuestsByManager(managerId: number): Promise<QuestResponse[]> {
  const res = await fetch(`${API_BASE_URL}/api/quests/manager/${managerId}`)
  if (!res.ok) throw new Error('매니저 퀘스트를 불러오지 못했습니다.')
  return res.json()
}

export interface QuestCreatePayload {
  managerId: number
  title: string
  formData: QuestFormData
  rewardAmount: number
  deadline: string // LocalDateTime 형식
}

export async function createQuest(payload: QuestCreatePayload): Promise<QuestResponse> {
  const res = await fetch(`${API_BASE_URL}/api/quests?managerId=${payload.managerId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      managerId: payload.managerId,
      title: payload.title,
      formData: payload.formData,
      rewardAmount: payload.rewardAmount,
      deadline: payload.deadline,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || '퀘스트 생성 실패')
  }
  return res.json()
}

// ── 로컬스토리지 유저 정보 ─────────────────────────────────────────

export function getStoredUser(): UserResponse | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('user')
  if (!raw) return null
  try {
    return JSON.parse(raw) as UserResponse
  } catch {
    return null
  }
}

export function setStoredUser(user: UserResponse): void {
  localStorage.setItem('user', JSON.stringify(user))
}

export function clearStoredUser(): void {
  localStorage.removeItem('user')
  localStorage.removeItem('nickname') // 기존 키도 제거
}
