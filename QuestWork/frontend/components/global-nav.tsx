"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const QUEST_CATEGORIES = [
  {
    title: "Web Development",
    description: "Frontend, backend, and full-stack product build quests.",
    route: "/quests/web-development",
  },
  {
    title: "Mobile Development",
    description: "iOS, Android, and React Native app delivery work.",
    route: "/quests/mobile-development",
  },
  {
    title: "Software Development",
    description: "Product engineering, platform work, and custom systems.",
    route: "/quests/software-development",
  },
  {
    title: "WordPress Development",
    description: "Theme customization, plugin work, and site maintenance.",
    route: "/quests/wordpress-development",
  },
];

const MY_PAGE_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Submissions", href: "/dashboard/my-submissions" },
  { label: "Rewards", href: "/dashboard" },
  { label: "Profile Settings", href: "/profile/settings" },
];

export function GlobalNav({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const [isQuestsOpen, setIsQuestsOpen] = useState(false);
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [role, setRole] = useState<"USER" | "MANAGER">("USER");
  const [username, setUsername] = useState<string | null>(null);  

  const questsCloseRef = useRef<NodeJS.Timeout | null>(null);
  const myPageCloseRef = useRef<NodeJS.Timeout | null>(null);
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
    setUsername(localStorage.getItem("username")); // 💡 추가
    setNickname(localStorage.getItem("nickname"));
    setProfileImage(
        localStorage.getItem("profileImage") || localStorage.getItem("avatar"),
    );
    const storedRole = localStorage.getItem("role") as
      | "USER"
      | "MANAGER"
      | null;
    setRole(storedRole || "USER");
  }, []);

  const isAuthenticated = isLoggedIn || Boolean(nickname);
  const userProfileImage =
      profileImage ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
          nickname || "questwork-user",
      )}`;

  // 💡 주소창에 들어가는 값은 nickname이 아닌 username(아이디)으로 설정!
  const profileHref = `/profile/${encodeURIComponent(username || "")}`;
  const avatarFallback = nickname?.trim().slice(0, 1).toUpperCase() || "Q";

  const handleLogout = () => {
    localStorage.removeItem("username"); // 💡 추가
    localStorage.removeItem("nickname");
    localStorage.removeItem("profileImage");
    localStorage.removeItem("avatar");
    localStorage.removeItem("role");
    setNickname(null);
    setProfileImage(null);
    setRole("USER");
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center">
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

        <div className="hidden flex-1 items-center justify-center px-6 md:flex lg:px-10">
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
                Quests
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
            <Link
              href="/dashboard"
              className="rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Dashboard
            </Link>

            <Link
              href="/blog"
              className="rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Blog
            </Link>

            {isAuthenticated && role === "MANAGER" ? (
              <Link
                href="/manager"
                className="rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                Manager Dashboard
              </Link>
            ) : isAuthenticated ? (
              <div
                className="relative"
                onMouseEnter={makeEnter(setIsMyPageOpen, myPageCloseRef)}
                onMouseLeave={makeLeave(setIsMyPageOpen, myPageCloseRef)}
              >
                <button
                  type="button"
                  onClick={() => setIsMyPageOpen((open) => !open)}
                  className="rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  My Page
                </button>

                {isMyPageOpen && (
                  <div className="absolute left-1/2 top-full z-30 w-56 -translate-x-1/2 pt-4">
                    <div className="rounded-2xl border border-border bg-background py-2 shadow-xl shadow-primary/8">
                      {MY_PAGE_LINKS.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setIsMyPageOpen(false)}
                          className="block px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-surface hover:text-primary"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end pl-4">
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
            ) : null}
          </div>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-full z-30 w-72 pt-3">
                  <div
                    className="rounded-2xl border border-border bg-background p-4 text-center shadow-xl shadow-primary/10"
                    role="menu"
                  >
                    <Avatar className="mx-auto size-20 border-2 border-primary/15 bg-primary-light shadow-md shadow-primary/10">
                      <AvatarImage src={userProfileImage} alt={nickname} />
                      <AvatarFallback className="bg-primary-light text-xs font-semibold text-primary">
                        {avatarFallback}
                      </AvatarFallback>
                    </Avatar>

                    <p className="mt-3 text-base font-semibold text-foreground">
                      Welcome back, {nickname}
                    </p>

                    <div className="mt-4 space-y-2">
                      <Button
                        asChild
                        className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
                      >
                        {role === "MANAGER" ? (
                          <Link
                            href="/manager"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Open Manager Dashboard
                          </Link>
                        ) : (
                          <Link
                            href={profileHref}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            View Profile
                          </Link>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-border hover:border-primary hover:text-primary"
                        onClick={handleLogout}
                      >
                        Log Out
                      </Button>
                    </div>
                  </button>

                  {isUserMenuOpen && (
                      <div className="absolute right-0 top-full w-72 pt-3">
                        <div
                            className="rounded-lg border border-border bg-background p-4 text-center shadow-xl shadow-primary/10"
                            role="menu"
                        >
                          <Avatar className="mx-auto size-20 border-2 border-primary bg-primary-light shadow-md shadow-primary/10">
                            <AvatarImage src={userProfileImage} alt={nickname} />
                            <AvatarFallback className="bg-primary-light text-2xl font-bold text-primary">
                              {avatarFallback}
                            </AvatarFallback>
                          </Avatar>

                          <p className="mt-3 text-base font-semibold text-foreground">
                            안녕하세요, {nickname}님
                          </p>

                          <div className="mt-4 space-y-2">
                            <Button
                                asChild
                                className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
                            >
                              {role === 'MANAGER' ? (
                                  <Link
                                      href="/manager"
                                      onClick={() => setIsUserMenuOpen(false)}
                                  >
                                    매니저 대시보드
                                  </Link>
                              ) : (
                                  <Link
                                      href={profileHref}
                                      onClick={() => setIsUserMenuOpen(false)}
                                  >
                                    프로필 보기
                                  </Link>
                              )}
                            </Button>
                            {role === 'MANAGER' && (
                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full border-blue-200 text-blue-600 hover:border-blue-400 hover:bg-blue-50"
                                >
                                  <Link
                                      href="/manager"
                                      onClick={() => setIsUserMenuOpen(false)}
                                  >
                                    프로필 설정
                                  </Link>
                                </Button>
                            )}
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
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              className="h-10 rounded-full border-border bg-white/70 px-5 text-sm text-foreground shadow-none transition-all duration-200 hover:border-primary/40 hover:bg-primary-light/35 hover:text-primary"
              asChild
            >
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}