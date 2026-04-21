import Link from 'next/link'
import { GlobalNav } from '@/components/global-nav'
import { QuestCard, type Quest } from '@/components/quest-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { QuestCategoryMeta } from '@/lib/mock-quests-data'

interface QuestCategoryPlaceholderPageProps {
  category: QuestCategoryMeta
  quests: Quest[]
  searchQuery?: string
}

export function QuestCategoryPlaceholderPage({
  category,
  quests,
  searchQuery = '',
}: QuestCategoryPlaceholderPageProps) {
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredQuests = quests.filter((quest) => {
    if (!normalizedQuery) {
      return true
    }

    return [quest.title, quest.description, ...quest.techStack]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery)
  })

  return (
    <div className="bg-background">
      <GlobalNav />

      <main className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{category.label}</h1>
          <p className="text-sm text-foreground-muted">{category.description}</p>
          <p className="text-foreground-muted">
            {searchQuery
              ? `"${searchQuery}" 검색 결과 ${filteredQuests.length}개`
              : `현재 ${filteredQuests.length}개의 mock 퀘스트가 준비되어 있습니다.`}
          </p>
        </div>

        <Card className="mb-6 border border-border bg-surface p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">Preview Category</p>
              <h2 className="mt-1 text-xl font-semibold text-foreground">
                카테고리 미리보기 페이지
              </h2>
              <p className="mt-2 text-sm text-foreground-muted">
                이 카테고리는 아직 실제 데이터 연동 전 단계입니다. 현재는 mock
                리스트와 검색 흐름만 먼저 연결되어 있습니다.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/quests/web-development${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`}>
                Web Development에서 실제 검색 보기
              </Link>
            </Button>
          </div>
        </Card>

        {filteredQuests.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        ) : (
          <Card className="border border-dashed border-border bg-surface p-10 text-center">
            <h3 className="text-lg font-semibold text-foreground">
              검색 결과가 없습니다
            </h3>
            <p className="mt-2 text-sm text-foreground-muted">
              다른 검색어로 다시 시도해보세요.
            </p>
          </Card>
        )}
      </main>
    </div>
  )
}
