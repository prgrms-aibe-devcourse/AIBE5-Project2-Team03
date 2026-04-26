"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type MutableRefObject } from "react";
import {
  BadgeDollarSign,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  Headphones,
  Menu,
  MonitorSmartphone,
  Sparkles,
  Trophy,
  UserCheck,
  Users,
  Workflow,
  Code2,
  X,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const QUEST_CATEGORIES = [
  {
    title: "웹 개발",
    description: "프론트엔드, 백엔드, 풀스택 프로젝트 퀘스트를 확인해보세요.",
    route: "/quests/web-development",
    icon: Code2,
  },
  {
    title: "모바일 개발",
    description: "iOS, Android, React Native 기반 퀘스트를 둘러보세요.",
    route: "/quests/mobile-development",
    icon: MonitorSmartphone,
  },
  {
    title: "소프트웨어 개발",
    description: "데스크톱 앱, 시스템 툴, 자동화 프로젝트 관련 퀘스트입니다.",
    route: "/quests/software-development",
    icon: Workflow,
  },
  {
    title: "워드프레스 개발",
    description: "커스텀 테마, 플러그인 개발, 유지보수 퀘스트를 모았습니다.",
    route: "/quests/wordpress-development",
    icon: BriefcaseBusiness,
  },
];

const WHY_QUESTWORK_ITEMS: Array<{
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}> = [
  {
    title: "QuestWork 소개",
    description: "퀘스트 기반 협업 플랫폼의 핵심 구조를 살펴보세요.",
    href: "/why-questwork#overview",
    icon: BookOpen,
  },
  {
    title: "퀘스트 진행 방식",
    description: "등록, 참여, 제출, 검토까지 이어지는 표준 워크플로우입니다.",
    href: "/why-questwork#workflow",
    icon: Workflow,
  },
  {
    title: "기업이 사용하는 이유",
    description: "검증된 개발자를 빠르게 찾고 프로젝트 리스크를 줄입니다.",
    href: "/why-questwork#companies",
    icon: Building2,
  },
  {
    title: "프리랜서가 선택하는 이유",
    description: "성과 중심 포트폴리오와 명확한 보상 기회를 만듭니다.",
    href: "/why-questwork#freelancers",
    icon: UserCheck,
  },
  {
    title: "성공 사례",
    description: "실제 퀘스트가 팀의 속도와 결과를 바꾼 사례를 확인하세요.",
    href: "/why-questwork#stories",
    icon: Trophy,
  },
];

const ENTERPRISE_ITEMS: Array<{
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}> = [
  {
    title: "대량 채용 / 외주 프로젝트 의뢰",
    description: "여러 포지션과 프로젝트를 퀘스트 단위로 동시에 운영합니다.",
    href: "/enterprise#projects",
    icon: BriefcaseBusiness,
  },
  {
    title: "검증된 개발자 빠른 매칭",
    description: "기술 스택과 제출 이력 중심으로 적합한 개발자를 찾습니다.",
    href: "/enterprise#matching",
    icon: Users,
  },
  {
    title: "전담 지원 서비스",
    description: "요구사항 정리부터 운영 리포트까지 함께 관리합니다.",
    href: "/enterprise#support",
    icon: Headphones,
  },
  {
    title: "기업 맞춤 요금제",
    description: "프로젝트 규모와 운영 방식에 맞춘 플랜을 제안합니다.",
    href: "/enterprise#pricing",
    icon: BadgeDollarSign,
  },
];

export function GlobalNav({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const [isQuestsOpen, setIsQuestsOpen] = useState(false);
  const [isWhyOpen, setIsWhyOpen] = useState(false);
  const [isEnterpriseOpen, setIsEnterpriseOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [role, setRole] = useState<"USER" | "MEMBER" | "MANAGER" | "ADMIN">(
    "USER",
  );

  const questsCloseRef = useRef<NodeJS.Timeout | null>(null);
  const whyCloseRef = useRef<NodeJS.Timeout | null>(null);
  const enterpriseCloseRef = useRef<NodeJS.Timeout | null>(null);
  const userMenuCloseRef = useRef<NodeJS.Timeout | null>(null);

  const makeEnter =
    (
      setter: (v: boolean) => void,
      timerRef: MutableRefObject<NodeJS.Timeout | null>,
    ) =>
    () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setter(true);
    };

  const makeLeave =
    (
      setter: (v: boolean) => void,
      timerRef: MutableRefObject<NodeJS.Timeout | null>,
    ) =>
    () => {
      timerRef.current = setTimeout(() => setter(false), 150);
    };

  useEffect(() => {
    // 💡 데이터를 불러오는 로직을 함수로 분리
    const loadUserData = () => {
      const storedId = localStorage.getItem("userId");
      const storedNickname = localStorage.getItem("nickname");
      const storedUsername = localStorage.getItem("username");
      const storedProfileImage =
        localStorage.getItem("profileImage") || localStorage.getItem("avatar");
      const storedRole = localStorage.getItem("role") as any;

      setUserId(storedId);
      setNickname(storedNickname);
      setUsername(storedUsername);
      setProfileImage(storedProfileImage);
      setRole(storedRole || "USER");
    };

    // 1. 컴포넌트 마운트 시 실행
    loadUserData();

    // 2. 💡 소셜 로그인 후 저장될 때의 변화를 감지하기 위해 storage 이벤트 리스너 추가
    window.addEventListener("storage", loadUserData);
    return () => window.removeEventListener("storage", loadUserData);
  }, []);

  const isAuthenticated = isLoggedIn || Boolean(nickname);

  // 💡 프로필 경로 우선순위 조정: 소셜 로그인 유저는 userId(PK)가 필수입니다.
  // userId가 없으면 username을, 둘 다 없으면 기본 profile 경로로 보냅니다.
  const profileHref = userId
    ? `/profile/${userId}`
    : username
      ? `/profile/${username}`
      : "/profile";

  const userProfileImage =
    profileImage ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      nickname || "questwork-user",
    )}`;

  const avatarFallback = nickname?.trim().slice(0, 1).toUpperCase() || "Q";

  const dashboardHref = !isAuthenticated
    ? "/login"
    : role === "MANAGER"
      ? "/manager"
      : "/dashboard";

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    // 💡 로그아웃 시 모든 정보 삭제
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("nickname");
    localStorage.removeItem("email");
    localStorage.removeItem("profileImage");
    localStorage.removeItem("avatar");
    localStorage.removeItem("role");

    setUserId(null);
    setUsername(null);
    setNickname(null);
    setProfileImage(null);
    setRole("USER");
    setIsUserMenuOpen(false);

    // 로그아웃 후 홈으로 이동하거나 새로고침
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
      <nav className="mx-auto grid w-full max-w-[92rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 px-5 py-3 sm:px-8 md:grid-cols-[minmax(0,auto)_1fr_minmax(0,auto)] lg:gap-x-8 lg:px-12 xl:px-16">
        <div className="flex min-w-0 items-center justify-self-start md:pr-2">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-2xl px-1 py-1 transition-opacity hover:opacity-90"
            aria-label="QuestWork home"
          >
            <Image
              src="/logos/questworkLogo.png"
              alt="QuestWork"
              width={44}
              height={44}
              priority
              className="h-11 w-11 rounded-xl object-cover shadow-[0_10px_24px_-16px_rgba(109,40,217,0.75)]"
            />
            <div className="flex flex-col justify-center">
              <span className="text-lg font-bold leading-none tracking-[-0.03em] text-foreground sm:text-xl">
                QuestWork
              </span>
              <span className="mt-1 hidden text-[11px] font-medium uppercase tracking-[0.24em] text-foreground-muted sm:block">
                Developer Marketplace
              </span>
            </div>
          </Link>
        </div>

        <div className="hidden min-w-0 items-center justify-self-center lg:flex">
          <div className="flex items-center gap-1 rounded-full border border-border/70 bg-white/70 px-2 py-1.5 shadow-sm shadow-black/5 backdrop-blur-sm xl:px-3">
            <div
              className="relative"
              onMouseEnter={makeEnter(setIsQuestsOpen, questsCloseRef)}
              onMouseLeave={makeLeave(setIsQuestsOpen, questsCloseRef)}
            >
              <button
                type="button"
                onClick={() => setIsQuestsOpen((open) => !open)}
                className="rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                퀘스트
              </button>

              {isQuestsOpen && (
                <div className="absolute left-1/2 top-full z-30 w-[28rem] -translate-x-1/2 pt-4">
                  <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-xl shadow-primary/10">
                    <div className="border-b border-border bg-gradient-to-r from-primary-light/55 to-white px-5 py-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                        Quest Categories
                      </p>
                      <p className="mt-1 text-sm text-foreground-muted">
                        지금 참여할 수 있는 개발 퀘스트를 분야별로 탐색하세요
                      </p>
                    </div>
                    <div className="grid gap-1 p-3">
                      {QUEST_CATEGORIES.map((category) => {
                        const Icon = category.icon;

                        return (
                          <Link
                            key={category.route}
                            href={category.route}
                            onClick={() => setIsQuestsOpen(false)}
                            className="flex gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-surface"
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                              <Icon className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <span>
                              <span className="block text-sm font-semibold text-foreground">
                                {category.title}
                              </span>
                              <span className="mt-1 block text-xs leading-5 text-foreground-muted">
                                {category.description}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href={dashboardHref}
              className="rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              대시보드
            </Link>

            <div
              className="relative"
              onMouseEnter={makeEnter(setIsWhyOpen, whyCloseRef)}
              onMouseLeave={makeLeave(setIsWhyOpen, whyCloseRef)}
            >
              <button
                type="button"
                onClick={() => setIsWhyOpen((open) => !open)}
                className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                Why QuestWork
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </button>

              {isWhyOpen && (
                <div className="absolute left-1/2 top-full z-30 w-[30rem] -translate-x-1/2 pt-4">
                  <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-xl shadow-primary/10">
                    <div className="border-b border-border bg-gradient-to-r from-primary-light/55 to-white px-5 py-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                        Why QuestWork
                      </p>
                      <p className="mt-1 text-sm text-foreground-muted">
                        기업과 개발자가 같은 기준으로 협업하는 이유
                      </p>
                    </div>
                    <div className="grid gap-1 p-3">
                      {WHY_QUESTWORK_ITEMS.map((item) => {
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsWhyOpen(false)}
                            className="flex gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-surface"
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                              <Icon className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <span>
                              <span className="block text-sm font-semibold text-foreground">
                                {item.title}
                              </span>
                              <span className="mt-1 block text-xs leading-5 text-foreground-muted">
                                {item.description}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={makeEnter(setIsEnterpriseOpen, enterpriseCloseRef)}
              onMouseLeave={makeLeave(setIsEnterpriseOpen, enterpriseCloseRef)}
            >
              <button
                type="button"
                onClick={() => setIsEnterpriseOpen((open) => !open)}
                className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                기업 서비스
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </button>

              {isEnterpriseOpen && (
                <div className="absolute left-1/2 top-full z-30 w-[31rem] -translate-x-1/2 pt-4">
                  <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-xl shadow-primary/10">
                    <div className="grid gap-4 bg-gradient-to-r from-[#F1E8FF] to-white p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                            Enterprise
                          </p>
                          <h3 className="mt-1 text-lg font-bold text-foreground">
                            개발 프로젝트를 더 빠르고 예측 가능하게
                          </h3>
                        </div>
                        <Sparkles className="h-5 w-5 shrink-0 text-primary" />
                      </div>
                      <Button
                        asChild
                        className="w-fit rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary-hover"
                      >
                        <Link
                          href="/enterprise#contact"
                          onClick={() => setIsEnterpriseOpen(false)}
                        >
                          문의하기
                        </Link>
                      </Button>
                    </div>
                    <div className="grid gap-1 p-3">
                      {ENTERPRISE_ITEMS.map((item) => {
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsEnterpriseOpen(false)}
                            className="flex gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-surface"
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                              <Icon className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <span>
                              <span className="block text-sm font-semibold text-foreground">
                                {item.title}
                              </span>
                              <span className="mt-1 block text-xs leading-5 text-foreground-muted">
                                {item.description}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/blog"
              className="rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Blog
            </Link>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-2 justify-self-end md:pl-2">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/75 text-foreground transition-colors hover:border-primary/40 hover:bg-primary-light/35 hover:text-primary lg:hidden"
            aria-label="메뉴 열기"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          {isAuthenticated && nickname ? (
            <div
              className="relative"
              onMouseEnter={makeEnter(setIsUserMenuOpen, userMenuCloseRef)}
              onMouseLeave={makeLeave(setIsUserMenuOpen, userMenuCloseRef)}
            >
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((open) => !open)}
                className={`flex items-center gap-2 rounded-full border bg-background px-2 py-1.5 shadow-sm transition-all duration-200 ${
                  role === "MANAGER"
                    ? "border-blue-500/70 hover:border-blue-600 hover:bg-blue-50"
                    : "border-border hover:border-primary/50 hover:bg-primary-light/60"
                }`}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="menu"
              >
                <Avatar
                  className={`size-8 bg-primary-light ${
                    role === "MANAGER"
                      ? "border-2 border-blue-500/70"
                      : "border border-primary/20"
                  }`}
                >
                  <AvatarImage src={userProfileImage} alt={nickname} />
                  <AvatarFallback className="bg-primary-light text-xs font-semibold text-primary">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden max-w-28 truncate pr-1 sm:inline">
                  <span className="text-sm font-medium text-foreground">
                    {nickname}
                  </span>
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-full z-30 w-72 pt-3">
                  <div
                    className="rounded-2xl border-4 border-primary/35 bg-background p-4 text-center shadow-xl shadow-primary/10"
                    role="menu"
                  >
                    <Avatar className="mx-auto size-20 border-2 border-primary/15 bg-primary-light shadow-md shadow-primary/10">
                      <AvatarImage src={userProfileImage} alt={nickname} />
                      <AvatarFallback className="bg-primary-light text-2xl font-bold text-primary">
                        {avatarFallback}
                      </AvatarFallback>
                    </Avatar>

                    <p className="mt-3 text-base font-semibold text-foreground">
                      {nickname}님 반갑습니다
                    </p>

                    <div className="mt-4 space-y-2">
                      {role !== "MANAGER" ? (
                        <Button
                          asChild
                          className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
                        >
                          <Link
                            href={profileHref}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            프로필 보기
                          </Link>
                        </Button>
                      ) : null}
                      <Button
                        variant="outline"
                        className="w-full border-border hover:border-primary hover:text-primary"
                        asChild
                      >
                        <Link
                          href="/profile/settings"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          프로필 설정
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-border hover:border-primary hover:text-primary"
                        onClick={handleLogout}
                      >
                        로그아웃
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              className="h-10 rounded-full border-border bg-white/70 px-5 text-sm text-foreground shadow-none transition-all duration-200 hover:border-primary/40 hover:bg-primary-light/35 hover:text-primary"
              asChild
            >
              <Link href="/login">로그인</Link>
            </Button>
          )}
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="border-t border-border bg-background px-5 py-4 shadow-lg shadow-black/5 lg:hidden">
          <div className="mx-auto grid max-w-[92rem] gap-5">
            <div className="grid gap-2">
              <Link
                href="/quests"
                onClick={closeMobileMenu}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface"
              >
                퀘스트
              </Link>
              <Link
                href={dashboardHref}
                onClick={closeMobileMenu}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface"
              >
                대시보드
              </Link>
            </div>

            <div>
              <p className="px-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Quest Categories
              </p>
              <div className="mt-2 grid gap-1">
                {QUEST_CATEGORIES.map((category) => {
                  const Icon = category.icon;

                  return (
                    <Link
                      key={category.route}
                      href={category.route}
                      onClick={closeMobileMenu}
                      className="flex gap-3 rounded-xl px-3 py-3 hover:bg-surface"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-foreground">
                          {category.title}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-foreground-muted">
                          {category.description}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="px-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Why QuestWork
              </p>
              <div className="mt-2 grid gap-1">
                {WHY_QUESTWORK_ITEMS.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="flex gap-3 rounded-xl px-3 py-3 hover:bg-surface"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-foreground">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-foreground-muted">
                          {item.description}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-[#F1E8FF] to-white p-3">
              <div className="flex items-center justify-between gap-3 px-2 py-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                    기업 서비스
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    프로젝트 의뢰와 개발자 매칭을 한곳에서
                  </p>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary-hover"
                >
                  <Link href="/enterprise#contact" onClick={closeMobileMenu}>
                    문의
                  </Link>
                </Button>
              </div>
              <div className="mt-2 grid gap-1">
                {ENTERPRISE_ITEMS.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="flex gap-3 rounded-xl px-3 py-3 hover:bg-white/70"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-foreground">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-foreground-muted">
                          {item.description}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <Link
              href="/blog"
              onClick={closeMobileMenu}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface"
            >
              Blog
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
