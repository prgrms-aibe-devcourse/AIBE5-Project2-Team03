import {
  CATEGORY_PLACEHOLDER_QUESTS,
  getQuestCategoryBySlug,
} from '@/lib/mock-quests-data'
import { CategoryQuestsClient } from '@/components/quests/category-quests-client'

export default async function MobileDevelopmentPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  const category = getQuestCategoryBySlug('mobile-development')

  if (!category) {
    return null
  }

  return (
    <CategoryQuestsClient
      category={category}
      quests={CATEGORY_PLACEHOLDER_QUESTS['mobile-development']}
      initialQuery={params.q ?? ''}
      isPreview
    />
  )
}
