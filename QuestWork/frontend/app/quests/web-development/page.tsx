import { WebDevelopmentQuestsClient } from '@/components/quests/web-development-quests-client'
import { fetchQuestCardList } from '@/lib/quests'
import { WEB_DEVELOPMENT_QUESTS } from '@/lib/mock-quests-data'

export default async function WebDevelopmentQuestsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  const quests = await fetchQuestCardList({ category: 'Web Development' })
  const initialQuests =
    quests.length > 0 ? quests : WEB_DEVELOPMENT_QUESTS

  return (
    <WebDevelopmentQuestsClient
      initialQuery={params.q ?? ''}
      initialQuests={initialQuests}
    />
  )
}
