import { BadgeDollarSign, BriefcaseBusiness, Headphones, Mail, ShieldCheck, Users } from "lucide-react";
import { GlobalNav } from "@/components/global-nav";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "projects",
    title: "대량 채용 / 외주 프로젝트 의뢰",
    description: "여러 개발 과제를 퀘스트로 분리해 동시에 운영하고, 제출 결과를 기준으로 협업 대상을 선별합니다.",
    icon: BriefcaseBusiness,
  },
  {
    id: "matching",
    title: "검증된 개발자 빠른 매칭",
    description: "기술 스택, 참여 이력, 제출물 품질을 바탕으로 프로젝트에 맞는 개발자를 빠르게 찾습니다.",
    icon: Users,
  },
  {
    id: "support",
    title: "전담 지원 서비스",
    description: "퀘스트 설계, 운영 안내, 검토 흐름까지 담당자가 기업 팀과 함께 정리합니다.",
    icon: Headphones,
  },
  {
    id: "pricing",
    title: "기업 맞춤 요금제",
    description: "단기 외주, 반복 과제, 채용형 프로젝트 등 운영 규모에 맞춰 플랜을 구성합니다.",
    icon: BadgeDollarSign,
  },
];

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <main>
        <section className="bg-gradient-to-br from-white via-[#F5EFFF] to-white px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">
                QuestWork Enterprise
              </p>
              <h1 className="mt-5 text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                개발 프로젝트 의뢰와 검증된 매칭을 한 번에 운영하세요.
              </h1>
              <p className="mt-6 text-lg leading-8 text-foreground-muted">
                QuestWork 기업 서비스는 과제 정의부터 개발자 참여, 결과물 검토까지 필요한 흐름을 프리미엄 SaaS 방식으로 정리합니다.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary-hover">
                  문의하기
                </Button>
                <Button variant="outline" className="rounded-full px-6">
                  서비스 살펴보기
                </Button>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-xl shadow-primary/10">
              <div className="grid gap-4">
                {["평균 매칭 리드타임 단축", "퀘스트별 제출물 비교", "프로젝트 운영 리포트 제공"].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl bg-surface p-4">
                    <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                    <span className="text-sm font-semibold text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article key={service.id} id={service.id} className="rounded-2xl border border-border bg-background p-7 shadow-sm shadow-black/5">
                  <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
                  <h2 className="mt-5 text-xl font-bold text-foreground">{service.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-foreground-muted">{service.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="contact" className="border-t border-border bg-surface px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-2xl bg-background p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Mail className="h-7 w-7 text-primary" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-foreground">기업 프로젝트를 상담해보세요</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-foreground-muted">
                현재는 목업 문의 CTA입니다. 실제 연결 전까지 기업 서비스 소개 페이지로 활용할 수 있습니다.
              </p>
            </div>
            <Button className="w-fit rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary-hover">
              문의하기
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
