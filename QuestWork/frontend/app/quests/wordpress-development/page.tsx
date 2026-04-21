import {
  CATEGORY_PLACEHOLDER_QUESTS,
  getQuestCategoryBySlug,
} from '@/lib/mock-quests-data'
import { CategoryQuestsClient } from '@/components/quests/category-quests-client'

export default async function WordPressDevelopmentPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  const category = getQuestCategoryBySlug('wordpress-development')

  if (!category) {
    return null
  }

  return (
    <CategoryQuestsClient
      category={category}
      quests={CATEGORY_PLACEHOLDER_QUESTS['wordpress-development']}
      initialQuery={params.q ?? ''}
      isPreview
    />
  )
}
