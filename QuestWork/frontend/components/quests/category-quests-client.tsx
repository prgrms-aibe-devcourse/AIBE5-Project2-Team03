'use client'

import { useEffect, useMemo, useState } from 'react'
import { GlobalNav } from '@/components/global-nav'
import {
  QuestFilters,
  type QuestFilters as QuestFiltersType,
} from '@/components/quest-filters'
import { QuestCard, type Quest } from '@/components/quest-card'
import { QuestSearch } from '@/components/quest-search'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Pagination } from '@/components/ui/pagination'
import type { QuestCategoryMeta } from '@/lib/mock-quests-data'

const QUESTS_PER_PAGE = 10

interface CategoryQuestsClientProps {
  category: QuestCategoryMeta
  quests: Quest[]
  initialQuery: string
  isPreview?: boolean
}

export function CategoryQuestsClient({
  category,
  quests,
  initialQuery,
  isPreview = false,
}: CategoryQuestsClientProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [filters, setFilters] = useState<QuestFiltersType>({
    categories: [],
    techStack: [],
    minReward: null,
    maxReward: null,
    difficulty: [],
  })

  useEffect(() => {
    setSearchQuery(initialQuery)
    setCurrentPage(1)
  }, [initialQuery])

  const filteredQuests = useMemo(() => {
    return quests.filter((quest) => {
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase()
        const matchesQuery = [quest.title, quest.description, ...quest.techStack]
          .join(' ')
          .toLowerCase()
          .includes(query)

        if (!matchesQuery) {
          return false
        }
      }

      if (filters.techStack.length > 0) {
        const hasMatchingTech = quest.techStack.some((tech) =>
          filters.techStack.includes(tech),
        )

        if (!hasMatchingTech) {
          return false
        }
      }

      return true
    })
  }, [filters, quests, searchQuery])

  const totalPages = Math.ceil(filteredQuests.length / QUESTS_PER_PAGE)
  const paginatedQuests = filteredQuests.slice(
    (currentPage - 1) * QUESTS_PER_PAGE,
    currentPage * QUESTS_PER_PAGE,
  )

  const handleFiltersChange = (newFilters: QuestFiltersType) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  return (
    <div className="bg-background">
      <GlobalNav />

      <main className="mx-auto max-w-[1380px] px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{category.label}</h1>
          <p className="text-sm text-foreground-muted">{category.description}</p>
          <p className="mt-1 text-foreground-muted">
            {searchQuery.trim()
              ? `"${searchQuery}" 검색 결과 ${filteredQuests.length}개`
              : `${filteredQuests.length}개의 퀘스트를 확인해보세요.`}
          </p>
        </div>

        <div className="flex gap-6">
          <QuestFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          <div className="w-full max-w-[1080px] flex-1">
            <QuestSearch value={searchQuery} onChange={handleSearchChange} />

            {isPreview ? (
              <Card className="mb-6 border border-border bg-surface p-5">
                <p className="text-sm text-foreground-muted">
                  이 카테고리는 현재 mock 데이터 기반 미리보기 페이지입니다.
                  레이아웃과 검색 흐름은 실제 퀘스트 페이지와 동일하게 맞춰두었습니다.
                </p>
              </Card>
            ) : null}

            {paginatedQuests.length > 0 ? (
              <>
                <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {paginatedQuests.map((quest) => (
                    <QuestCard key={quest.id} quest={quest} />
                  ))}
                </div>

                {totalPages > 1 ? (
                  <div className="flex items-center justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                ) : null}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-border bg-surface py-12">
                <p className="text-center text-foreground-muted">
                  검색 조건에 맞는 퀘스트가 없습니다.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    handleFiltersChange({
                      categories: [],
                      techStack: [],
                      minReward: null,
                      maxReward: null,
                      difficulty: [],
                    })
                  }}
                >
                  필터 초기화
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
