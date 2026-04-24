import { BadgeCheck, BriefcaseBusiness, Coins, Users } from "lucide-react";

const PLATFORM_STATS = [
  {
    value: "1200+",
    label: "등록 개발자",
    Icon: Users,
  },
  {
    value: "350+",
    label: "진행 중인 퀘스트",
    Icon: BriefcaseBusiness,
  },
  {
    value: "KRW 48M",
    label: "누적 보상 금액",
    Icon: Coins,
  },
  {
    value: "92%",
    label: "매칭 성공률",
    Icon: BadgeCheck,
  },
];

export function PlatformStatsSection() {
  return (
    <section className="bg-background px-4 pb-12 sm:px-6 sm:pb-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PLATFORM_STATS.map(({ value, label, Icon }) => (
            <div
              key={label}
              className="rounded-3xl border border-border/70 bg-white/80 p-5 shadow-[0_18px_45px_-36px_rgba(109,40,217,0.35)] backdrop-blur-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6D28D9]/8 text-[#6D28D9]">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-foreground">
                {value}
              </p>
              <p className="mt-1 text-sm font-medium text-foreground-muted">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
