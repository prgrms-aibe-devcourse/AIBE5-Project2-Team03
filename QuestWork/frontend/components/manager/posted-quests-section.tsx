'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation' // 💡 이동을 위해 추가
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// 💡 백엔드 QuestResponseDto 구조에 맞게 인터페이스 수정
interface Quest {
  id: number // Long -> number
  title: string
  status: 'OPEN' | 'CLOSED' | 'COMPLETED' // 대문자 처리
  rewardAmount: number // reward -> rewardAmount
  createdAt: string
  // submissionsCount는 백엔드에서 추가로 보내주거나 0으로 초기화
  submissionsCount?: number
}

interface PostedQuestsSectionProps {
  quests: Quest[]
}

// 💡 백엔드 QuestStatus (대문자)에 맞게 컬러 매핑
const statusBadgeColor = {
  OPEN: 'bg-green-500 text-white',
  CLOSED: 'bg-gray-500 text-white',
  COMPLETED: 'bg-blue-500 text-white',
}

const statusLabel = {
  OPEN: '진행 중',
  CLOSED: '마감됨',
  COMPLETED: '완료',
}

export function PostedQuestsSection({ quests }: PostedQuestsSectionProps) {
  const router = useRouter(); // 💡 router 선언

  return (
      <Card className="border border-border">
        <div className="border-b border-border p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">등록된 퀘스트</h2>
            {/* 💡 새 퀘스트 버튼 클릭 시 이동 로직 추가 */}
            <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => router.push('/manager/create-quest')}
            >
              + 새 퀘스트
            </Button>
          </div>
        </div>

        <div className="divide-y divide-border">
          {quests.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">등록된 퀘스트가 없습니다.</p>
              </div>
          ) : (
              quests.map((quest) => (
                  <Link
                      key={quest.id}
                      href={`/manager/quests/${quest.id}`}
                      className="block transition-colors hover:bg-muted/50"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground hover:text-primary truncate">
                            {quest.title}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            생성일: {new Date(quest.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {/* 💡 상태값 대문자 호환 */}
                        <Badge className={statusBadgeColor[quest.status]}>
                          {statusLabel[quest.status]}
                        </Badge>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div>
                            <p className="text-xs text-muted-foreground">보상</p>
                            <p className="font-semibold text-primary">
                              {quest.rewardAmount?.toLocaleString()}원
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">제출</p>
                            <p className="font-semibold text-foreground">
                              {quest.submissionsCount || 0}건
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" className="text-xs">
                          상세 보기
                        </Button>
                      </div>
                    </div>
                  </Link>
              ))
          )}
        </div>
      </Card>
  )
}