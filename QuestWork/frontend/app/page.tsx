import { GlobalNav } from "@/components/global-nav";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { Footer } from "@/components/landing/footer";
import { PlatformStatsSection } from "@/components/landing/platform-stats-section";
import { TrustedCompaniesSection } from "@/components/landing/trusted-companies-section";
import { QuestCard, type Quest } from "@/components/quest-card";

interface ApiQuest {
  id: number;
  title: string;
  formData: {
    description: string;
    techStack: string[];
    difficulty: string;
    submissionFormats: string[];
  };
  rewardAmount: number;
  deadline: string;
  status: string;
}

function formatReward(amount: number): string {
  return "원" + amount.toLocaleString("ko-KR");
}

function formatDeadline(deadline: string): string {
  const deadlineDate = new Date(deadline.replace(" ", "T"));
  const now = new Date();
  const diffMs = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "마감";
  return `${diffDays}일 남음`;
}

async function fetchFeaturedQuests(): Promise<Quest[]> {
  try {
    const res = await fetch("http://localhost:8000/api/quests", {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: ApiQuest[] = await res.json();
    return data.slice(0, 6).map((q) => ({
      id: String(q.id),
      title: q.title,
      description: q.formData?.description ?? "",
      techStack: q.formData?.techStack ?? [],
      reward: formatReward(q.rewardAmount),
      deadline: formatDeadline(q.deadline),
      participants: 0,
    }));
  } catch {
    return [];
  }
}

export default async function LandingPage() {
  const featuredQuests = await fetchFeaturedQuests();

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />
      <HeroSection />
      <TrustedCompaniesSection />
      <PlatformStatsSection />

      {/* Featured Quests Section */}
      <section className="border-t border-border bg-surface px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mb-16 flex flex-col items-center text-center">
            <h2 className="text-balance text-4xl font-bold text-foreground sm:text-5xl">
              인기 있는 퀘스트
            </h2>
            <p className="mt-4 text-lg text-foreground-muted">
              지금 시작할 수 있는 다양한 프로젝트들을 확인해보세요
            </p>
          </div>

          {/* Quest Grid */}
          {featuredQuests.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          ) : (
            <p className="text-center text-foreground-muted">
              퀘스트를 불러오는 중입니다...
            </p>
          )}
        </div>
      </section>

      <HowItWorksSection />
      <BenefitsSection />
      <Footer />
    </div>
  );
}