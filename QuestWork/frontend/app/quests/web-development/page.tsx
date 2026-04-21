import { WebDevelopmentQuestsClient } from '@/components/quests/web-development-quests-client'

export default async function WebDevelopmentQuestsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams

  return <WebDevelopmentQuestsClient initialQuery={params.q ?? ''} />
}
