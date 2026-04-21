import {
  CATEGORY_PLACEHOLDER_QUESTS,
  getQuestCategoryBySlug,
} from '@/lib/mock-quests-data'
import { CategoryQuestsClient } from '@/components/quests/category-quests-client'

export default async function SoftwareDevelopmentPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  const category = getQuestCategoryBySlug('software-development')

  if (!category) {
    return null
  }

  return (
    <CategoryQuestsClient
      category={category}
      quests={CATEGORY_PLACEHOLDER_QUESTS['software-development']}
      initialQuery={params.q ?? ''}
      isPreview
    />
  )
}
