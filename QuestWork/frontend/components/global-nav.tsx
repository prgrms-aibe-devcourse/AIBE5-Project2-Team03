"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const QUEST_CATEGORIES = [
  {
    title: "웹 개발",
    description:
      "프론트엔드, 백엔드, 풀스택 프로젝트 퀘스트를 확인해보세요.",
    route: "/quests/web-development",
  },
  {
    title: "모바일 개발",
    description: "iOS, Android, React Native 기반 퀘스트를 둘러보세요.",
    route: "/quests/mobile-development",
  },
  {
    title: "소프트웨어 개발",
    description:
      "데스크톱 앱, 시스템 툴, 자동화 프로젝트 관련 퀘스트입니다.",
    route: "/quests/software-development",
  },
  {
    title: "워드프레스 개발",
    description: "커스텀 테마, 플러그인 개발, 유지보수 퀘스트를 모았습니다.",
    route: "/quests/wordpress-development",
  },
];

export function GlobalNav({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const [isQuestsOpen, setIsQuestsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [role, setRole] = useState<"USER" | "MEMBER" | "MANAGER" | "ADMIN">(
    "USER",
  );

  const questsCloseRef = useRef<NodeJS.Timeout | null>(null);
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
    setUsername(localStorage.getItem("username"));
    setNickname(localStorage.getItem("nickname"));
    setProfileImage(
      localStorage.getItem("profileImage") || localStorage.getItem("avatar"),
    );

    const storedRole = localStorage.getItem("role") as
      | "USER"
      | "MEMBER"
      | "MANAGER"
      | "ADMIN"
      | null;

    setRole(storedRole || "USER");
  }, []);

  const isAuthenticated = isLoggedIn || Boolean(nickname);
  const userProfileImage =
    profileImage ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      nickname || "questwork-user",
    )}`;
  const profileHref = `/profile/${encodeURIComponent(username || "")}`;
  const avatarFallback = nickname?.trim().slice(0, 1).toUpperCase() || "Q";
  const dashboardHref = !isAuthenticated
    ? "/login"
    : role === "MANAGER"
      ? "/manager"
      : "/dashboard";

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("nickname");
    localStorage.removeItem("profileImage");
    localStorage.removeItem("avatar");
    localStorage.removeItem("role");
    setUsername(null);
    setNickname(null);
    setProfileImage(null);
    setRole("USER");
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
      <nav className="mx-auto grid w-full max-w-[88rem] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-4 px-5 py-3 sm:gap-x-6 sm:px-8 lg:gap-x-10 lg:px-12 xl:gap-x-14 xl:px-16">
        <div className="flex min-w-0 items-center justify-self-start md:pr-8 lg:pr-12">
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

        <div className="hidden items-center justify-self-center md:flex">
          <div className="flex items-center gap-1 rounded-full border border-border/70 bg-white/70 px-3 py-1.5 shadow-sm shadow-black/5 backdrop-blur-sm">
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
                <div className="absolute left-1/2 top-full z-30 w-80 -translate-x-1/2 pt-4">
                  <div className="rounded-2xl border border-border bg-background p-3 shadow-xl shadow-primary/8">
                    {QUEST_CATEGORIES.map((category) => (
                      <Link
                        key={category.route}
                        href={category.route}
                        onClick={() => setIsQuestsOpen(false)}
                        className="block rounded-xl px-4 py-3 transition-colors hover:bg-surface"
                      >
                        <div className="text-sm font-semibold text-foreground">
                          {category.title}
                        </div>
                        <div className="mt-1 text-xs leading-5 text-foreground-muted">
                          {category.description}
                        </div>
                      </Link>
                    ))}
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

            <Link
              href="/blog"
              className="rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Blog
            </Link>
          </div>
        </div>

        <div className="flex min-w-0 items-center justify-self-end md:pl-8 lg:pl-12">
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
                    className="rounded-2xl border border-border bg-background p-4 text-center shadow-xl shadow-primary/10"
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
    </header>
  );
}
