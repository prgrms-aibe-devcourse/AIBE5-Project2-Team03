import type { Quest } from "@/components/quest-card";

export interface ApiQuestFormData {
  description?: string;
  techStack?: string[];
  difficulty?: string;
  submissionFormats?: string[];
}

export interface ApiQuest {
  id: number;
  title: string;
  formData: ApiQuestFormData | null;
  rewardAmount: number;
  deadline: string;
  status: string;
}

interface QuestCardMapOptions {
  category?: string;
}

function normalizeFormData(formData: ApiQuest["formData"]): ApiQuestFormData {
  if (!formData) {
    return {};
  }

  return {
    description: typeof formData.description === "string" ? formData.description : "",
    techStack: Array.isArray(formData.techStack)
      ? formData.techStack.filter((tech): tech is string => typeof tech === "string")
      : [],
    difficulty: typeof formData.difficulty === "string" ? formData.difficulty : "",
    submissionFormats: Array.isArray(formData.submissionFormats)
      ? formData.submissionFormats.filter(
          (format): format is string => typeof format === "string",
        )
      : [],
  };
}

export function formatQuestReward(amount: number): string {
  return `원${amount.toLocaleString("ko-KR")}`;
}

export function formatQuestDeadline(deadline: string): string {
  const deadlineDate = new Date(deadline.replace(" ", "T"));
  const now = new Date();
  const diffMs = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return "마감";
  }

  return `${diffDays}일 남음`;
}

export function mapApiQuestToCardQuest(
  apiQuest: ApiQuest,
  options: QuestCardMapOptions = {},
): Quest {
  const formData = normalizeFormData(apiQuest.formData);

  return {
    id: String(apiQuest.id),
    title: apiQuest.title,
    description: formData.description ?? "",
    techStack: formData.techStack ?? [],
    reward: formatQuestReward(apiQuest.rewardAmount),
    deadline: formatQuestDeadline(apiQuest.deadline),
    participants: 0,
    category: options.category,
  };
}

export async function fetchQuestList(): Promise<ApiQuest[]> {
  try {
    const response = await fetch("http://localhost:8000/api/quests", {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return [];
    }

    return (await response.json()) as ApiQuest[];
  } catch {
    return [];
  }
}

export async function fetchQuestCardList(
  options: QuestCardMapOptions = {},
): Promise<Quest[]> {
  const quests = await fetchQuestList();
  return quests.map((quest) => mapApiQuestToCardQuest(quest, options));
}
