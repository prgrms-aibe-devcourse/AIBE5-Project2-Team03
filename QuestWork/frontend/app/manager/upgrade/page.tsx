"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  ShieldCheck,
  Users,
} from "lucide-react";
import { GlobalNav } from "@/components/global-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const BENEFITS = [
  {
    icon: BriefcaseBusiness,
    title: "퀘스트 무제한 등록",
    description:
      "원하는 만큼 다양한 퀘스트를 등록하고 프로젝트 기회를 넓혀보세요.",
  },
  {
    icon: Users,
    title: "검증된 개발자 매칭",
    description:
      "실력 있는 개발자들과 빠르게 연결되어 프로젝트를 더 안정적으로 시작할 수 있어요.",
  },
  {
    icon: ShieldCheck,
    title: "프로젝트 관리 도구",
    description:
      "제출 검토, 보상 관리, 진행 상황 확인까지 한 화면에서 관리할 수 있어요.",
  },
];

const PROFILE_CLUSTER = [
  {
    name: "Kim Dev",
    title: "Team Lead",
    status: "Active",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=kim-dev",
    className:
      "left-28 top-8 z-20 h-[18.5rem] w-60 border-white/80 bg-white/95 shadow-[0_28px_60px_-30px_rgba(109,40,217,0.42)]",
    avatarClassName: "h-40 w-40",
    imageClassName: "scale-[1.16]",
    bodyClassName: "pt-5",
    badgeClassName: "right-4 top-4",
  },
  {
    name: "Jin Park",
    title: "Frontend Developer",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=park-ui",
    className:
      "left-2 top-48 z-10 h-44 w-44 border-white/70 bg-white/88 shadow-[0_22px_44px_-26px_rgba(15,23,42,0.34)]",
    avatarClassName: "h-20 w-20",
    imageClassName: "",
    bodyClassName: "",
  },
  {
    name: "Mina Lee",
    title: "Backend Developer",
    status: "Available",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=lee-backend",
    className:
      "right-4 top-36 z-20 h-48 w-44 border-white/80 bg-white/92 shadow-[0_24px_50px_-28px_rgba(15,23,42,0.36)]",
    avatarClassName: "h-24 w-24",
    imageClassName: "",
    bodyClassName: "",
    badgeClassName:
      "right-4 top-4 px-2 py-0.5 text-[8px] tracking-[0.1em] shadow-sm",
  },
  {
    name: "Alex Choi",
    title: "Product Designer",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=questwork-user",
    className:
      "right-24 top-2 z-0 h-36 w-36 border-white/60 bg-white/55 opacity-55",
    avatarClassName: "h-16 w-16",
    imageClassName: "",
    bodyClassName: "",
  },
  {
    name: "Felix",
    title: "QA Specialist",
    image:
      "https://api.dicebear.com/8.x/notionists/svg?seed=Felix&backgroundColor=ffdfbf&backgroundRotation=0,360&beardProbability=0&glassesProbability=100&glasses=variant02&smileProbability=100",
    className:
      "right-0 top-60 z-0 h-36 w-36 border-white/60 bg-white/60 opacity-60",
    avatarClassName: "h-16 w-16",
    imageClassName: "",
    bodyClassName: "",
  },
  {
    name: "Sora Han",
    title: "Mobile Developer",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar",
    className:
      "left-0 top-10 z-0 h-32 w-32 border-white/50 bg-white/50 opacity-45",
    avatarClassName: "h-14 w-14",
    imageClassName: "",
    bodyClassName: "",
  },
];

export default function ManagerUpgradePage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const ctaHref = useMemo(() => "/signup?role=MANAGER", []);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    if (storedRole === "MANAGER") {
      router.replace("/manager/create-quest");
    }
  }, [router]);

  if (role === "MANAGER") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <main className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top_left,_rgba(167,139,250,0.18),_transparent_42%),radial-gradient(circle_at_80%_20%,_rgba(109,40,217,0.14),_transparent_30%)]" />
        <div className="absolute right-[-8rem] top-16 h-72 w-72 rounded-full bg-[#A78BFA]/14 blur-3xl" />
        <div className="absolute left-[-6rem] top-32 h-64 w-64 rounded-full bg-[#6D28D9]/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1380px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-white/80 shadow-[0_28px_70px_-40px_rgba(109,40,217,0.35)] backdrop-blur-sm">
            <div className="grid gap-12 px-6 py-10 sm:px-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:px-14 lg:py-16">
              <div className="flex flex-col justify-center">
                <div className="inline-flex w-fit items-center rounded-full bg-[#6D28D9]/8 px-4 py-2 text-sm font-semibold text-[#6D28D9]">
                  매니저 / 기업 계정
                </div>

                <div className="mt-7 space-y-6">
                  <h1 className="text-balance text-[2.7rem] font-bold leading-[1.08] tracking-[-0.04em] text-foreground sm:text-[3.35rem]">
                    퀘스트 등록은
                    <br />
                    <span className="block text-[3.15rem] leading-none text-[#6D28D9] sm:text-[4.35rem]">
                      매니저 / 기업 계정
                    </span>
                    전용입니다
                  </h1>

                  <p className="max-w-xl text-lg leading-8 text-foreground-muted">
                    퀘스트를 등록하고 더 많은 개발자와 함께 프로젝트를 진행해보세요.
                  </p>
                </div>

                <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <Button
                    asChild
                    className="h-14 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary-hover"
                  >
                    <Link href={ctaHref}>
                      매니저 / 기업 계정 신청하기
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <Link
                    href="#benefits"
                    className="inline-flex items-center text-base font-semibold text-foreground transition-colors hover:text-primary"
                  >
                    자세히 알아보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[360px] lg:min-h-[440px]">
                <div className="absolute inset-x-0 top-12 h-56 rounded-[999px] bg-gradient-to-r from-[#E9D5FF]/70 via-[#F5F3FF] to-[#DDD6FE]/70 blur-2xl" />
                <div className="absolute right-10 top-8 h-44 w-44 rounded-full bg-[#A78BFA]/18 blur-3xl" />

                <div className="absolute inset-0">
                  {PROFILE_CLUSTER.map((profile) => (
                    <div
                      key={profile.name}
                      className={`absolute rounded-[2rem] border p-4 backdrop-blur-sm ${profile.className}`}
                    >
                      {profile.status ? (
                        <span
                          className={`absolute z-20 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary ${profile.badgeClassName ?? ""}`}
                        >
                          {profile.status === "Active" ? "활동 중" : "응답 가능"}
                        </span>
                      ) : null}

                      <div className={`flex h-full flex-col ${profile.bodyClassName}`}>
                        <div className="flex justify-center">
                          <Avatar className={`${profile.avatarClassName} ring-4 ring-white/80`}>
                            <AvatarImage
                              src={profile.image}
                              alt={profile.name}
                              className={profile.imageClassName}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {profile.name.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <div className="mt-auto pt-5 text-center">
                          <p className="text-sm font-semibold text-foreground">
                            {profile.name}
                          </p>
                          <p className="mt-1 text-xs text-foreground-muted">
                            {profile.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="absolute left-28 top-28 flex h-16 w-16 items-center justify-center rounded-3xl border border-border/60 bg-white/90 text-primary shadow-[0_18px_36px_-22px_rgba(109,40,217,0.35)] backdrop-blur-sm">
                  <ArrowRight className="h-6 w-6 -rotate-45" />
                </div>
                <div className="absolute right-16 top-10 flex h-16 w-16 items-center justify-center rounded-3xl border border-border/60 bg-white/90 text-primary shadow-[0_18px_36px_-22px_rgba(109,40,217,0.35)] backdrop-blur-sm">
                  <ShieldCheck className="h-6 w-6" />
                </div>
              </div>
            </div>
          </section>

          <section id="benefits" className="pt-14 lg:pt-20">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/70">
                혜택 안내
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-4xl">
                매니저/기업 계정이 되면 이런 혜택이 있어요
              </h2>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {BENEFITS.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <Card
                    key={benefit.title}
                    className="rounded-[1.75rem] border border-border/80 bg-white/85 p-6 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.22)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_22px_52px_-30px_rgba(109,40,217,0.32)]"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-foreground-muted">
                      {benefit.description}
                    </p>
                  </Card>
                );
              })}
            </div>

            <div className="mt-10 text-center text-sm text-foreground-muted">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                로그인하기
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
