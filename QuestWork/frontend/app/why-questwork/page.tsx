import {
  Building2,
  CheckCircle2,
  ClipboardList,
  Rocket,
  ShieldCheck,
  Trophy,
  UserCheck,
} from "lucide-react";
import { GlobalNav } from "@/components/global-nav";

const workflow = [
  "기업이 해결할 문제를 퀘스트로 등록합니다.",
  "개발자가 기술 스택과 경험에 맞춰 참여합니다.",
  "결과물을 제출하고 매니저가 검토합니다.",
  "선정된 결과는 포트폴리오와 보상으로 이어집니다.",
];

const reasons = [
  {
    title: "성과 중심 검증",
    description:
      "프로필 문구보다 실제 제출물과 문제 해결 과정을 기준으로 판단합니다. 프로필 문구보다 실제 제출 결과물과 문제 해결 과정을 기준으로 평가합니다. ",
    icon: ShieldCheck,
  },
  {
    title: "프로젝트 단위 운영",
    description:
      "작은 기능부터 외주 프로젝트까지 명확한 범위와 마감으로 운영합니다.",
    icon: ClipboardList,
  },
  {
    title: "빠른 매칭",
    description:
      "기술 스택과 프로젝트 조건에 맞는 개발자가 즉시 참여합니다. 채용 공고를 오래 기다릴 필요 없이 짧은 시간 안에 협업 후보를 확보할 수 있습니다.",
    icon: Rocket,
  },
];

export default function WhyQuestWorkPage() {
  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <main>
        <section
          id="overview"
          className="border-b border-border bg-gradient-to-br from-white via-[#F7F2FF] to-white px-5 py-20 sm:px-8 lg:px-12"
        >
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">
              Why QuestWork
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              개발자 협업을 채용 공고가 아닌 퀘스트로 운영합니다.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-foreground-muted">
              QuestWork는 기업의 문제를 명확한 퀘스트로 만들고, 개발자는 실제
              결과물로 역량을 보여주는 협업형 개발 플랫폼입니다.
            </p>
          </div>
        </section>

        <section id="workflow" className="px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold text-primary">
                Quest Workflow
              </p>
              <h2 className="mt-2 text-3xl font-bold text-foreground">
                퀘스트 진행 방식
              </h2>
            </div>
            <div className="grid gap-3">
              {workflow.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-2xl bg-surface p-5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-sm font-medium leading-6 text-foreground">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
            {reasons.map((reason) => {
              const Icon = reason.icon;

              return (
                <div
                  key={reason.title}
                  className="rounded-2xl bg-background p-6 shadow-sm shadow-black/5"
                >
                  <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
                  <h3 className="mt-5 text-lg font-bold text-foreground">
                    {reason.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-foreground-muted">
                    {reason.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
            <div
              id="companies"
              className="rounded-2xl border border-border p-7"
            >
              <Building2 className="h-8 w-8 text-primary" aria-hidden="true" />
              <h2 className="mt-5 text-2xl font-bold text-foreground">
                기업이 사용하는 이유
              </h2>
              <p className="mt-3 text-sm leading-6 text-foreground-muted">
                요구사항을 퀘스트 형태로 구조화해 여러 개발자의 제출물을 비교할
                수 있습니다. 단순 이력서 검토가 아닌 실제 결과물을 기준으로 협업
                대상을 선택할 수 있어 채용 시간과 검증 비용을 줄일 수
                있습니다.{" "}
              </p>
            </div>
            <div
              id="freelancers"
              className="rounded-2xl border border-border p-7"
            >
              <UserCheck className="h-8 w-8 text-primary" aria-hidden="true" />
              <h2 className="mt-5 text-2xl font-bold text-foreground">
                프리랜서가 선택하는 이유
              </h2>
              <p className="mt-3 text-sm leading-6 text-foreground-muted">
                실제 문제를 해결한 기록이 곧 포트폴리오가 됩니다. 불필요한 면접
                과정 없이 실력으로 평가받을 수 있으며, 명확한 보상과 일정이 있는
                프로젝트에 집중할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        <section
          id="stories"
          className="border-t border-border px-5 py-16 sm:px-8 lg:px-12"
        >
          <div className="mx-auto max-w-6xl rounded-2xl bg-[#F4EEFF] p-8">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-primary" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-foreground">성공 사례</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                "API 전환 PoC 2주 단축",
                "관리자 대시보드 성능 개선",
                "모바일 MVP 기능 검증",
                "외주보다 빠른 협업",
                "실제 서비스에 바로 적용",
                "포트폴리오로 인정받는 결과물",
              ].map((story) => (
                <div key={story} className="rounded-2xl bg-white p-5">
                  <CheckCircle2
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    {story}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
