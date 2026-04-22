import { GlobalNav } from "@/components/global-nav";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { Footer } from "@/components/landing/footer";
import { PlatformStatsSection } from "@/components/landing/platform-stats-section";
import { TrustedCompaniesSection } from "@/components/landing/trusted-companies-section";
import { QuestCard, type Quest } from "@/components/quest-card";

const FEATURED_QUESTS: Quest[] = [
  {
    id: "1",
    title: "React Admin Dashboard Performance Optimization",
    description:
      "Improve rendering performance and reduce bundle size in a React admin dashboard.",
    techStack: ["React", "Next.js", "TypeScript"],
    reward: "₩1,000,000",
    deadline: "5일 남음",
    participants: 15,
  },
  {
    id: "2",
    title: "Mobile App for Task Management",
    description:
      "Develop a cross-platform task management application with offline capabilities and cloud synchronization.",
    techStack: ["React Native", "Firebase"],
    reward: "₩800,000",
    deadline: "7일 남음",
    participants: 12,
  },
  {
    id: "3",
    title: "REST API for Microservices Architecture",
    description:
      "Design and implement a robust REST API with authentication, rate limiting, and comprehensive documentation.",
    techStack: ["Node.js", "Express", "MongoDB"],
    reward: "₩1,500,000",
    deadline: "3일 남음",
    participants: 22,
  },
  {
    id: "11",
    title: "Next.js E-commerce Platform",
    description:
      "Build a full-stack e-commerce platform with payment integration, product management, and order tracking.",
    techStack: ["Next.js", "React", "Stripe"],
    reward: "₩2,500,000",
    deadline: "14일 남음",
    participants: 28,
  },
  {
    id: "4",
    title: "Kubernetes Deployment & CI/CD Pipeline",
    description:
      "Set up a complete Kubernetes cluster with automated CI/CD pipelines for a multi-container application.",
    techStack: ["Kubernetes", "Docker", "Jenkins"],
    reward: "₩2,000,000",
    deadline: "10일 남음",
    participants: 8,
  },
  {
    id: "12",
    title: "Node.js Chat Application",
    description:
      "Develop a real-time chat application with WebSocket support, user authentication, and message persistence.",
    techStack: ["Node.js", "Socket.io", "MongoDB"],
    reward: "₩1,100,000",
    deadline: "8일 남음",
    participants: 14,
  },
];

export default function LandingPage() {
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURED_QUESTS.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        </div>
      </section>

      <HowItWorksSection />
      <BenefitsSection />
      <Footer />
    </div>
  );
}
