"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import {
  QUEST_CATEGORIES,
  type QuestCategorySlug,
} from "@/lib/mock-quests-data";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&h=900&fit=crop",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&h=900&fit=crop",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&h=900&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-4ea95f317b13?w=1600&h=900&fit=crop",
];

type Audience = "freelancer" | "manager";

export function HeroSection() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [audience, setAudience] = useState<Audience>("freelancer");
  const [role, setRole] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<QuestCategorySlug>("web-development");
  const [searchQuery, setSearchQuery] = useState("");
  const autoSlideRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isHovered) {
      if (autoSlideRef.current) clearTimeout(autoSlideRef.current);
      return;
    }

    autoSlideRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => {
      if (autoSlideRef.current) clearTimeout(autoSlideRef.current);
    };
  }, [isHovered, currentSlide]);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length,
    );
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const category =
      QUEST_CATEGORIES.find((item) => item.slug === selectedCategory) ??
      QUEST_CATEGORIES[0];
    const trimmedQuery = searchQuery.trim();
    const destination = trimmedQuery
      ? `${category.route}?q=${encodeURIComponent(trimmedQuery)}`
      : category.route;

    router.push(destination);
  };

  return (
    <section className="flex justify-center bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div
        className="relative aspect-[1280/628] min-h-[616px] w-full max-w-[1408px] overflow-hidden rounded-3xl shadow-2xl shadow-black/20 lg:min-h-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0">
          {HERO_IMAGES.map((image, idx) => (
            <div
              key={`${image}-${idx}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))}

          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/25" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
        </div>

        <div className="relative z-10 flex h-full items-center px-6 py-12 sm:px-10 md:pl-20 md:pr-14 lg:px-16 lg:pl-24">
          <div className="flex w-full max-w-3xl flex-col gap-7">
            <div className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur-md">
              개발자와 퀘스트를 가장 빠르게 연결해보세요
            </div>

            <div className="space-y-5">
              <h1 className="text-balance text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                검증된 개발자를
                <br />
                명확한 퀘스트로 찾아보세요
              </h1>
              <p className="max-w-2xl text-pretty text-base leading-7 text-white/80 sm:text-lg">
                QuestWork는 개발자 중심의 프리랜서 플랫폼입니다. 프리랜서는
                실력에 맞는 퀘스트를 찾고, 기업과 매니저는 필요한 기술을 가진
                전문가를 더 빠르게 연결할 수 있습니다.
              </p>
            </div>

            <div className="space-y-4">
              <div
                className="flex w-fit rounded-full border border-white/20 bg-black/35 p-1 shadow-inner shadow-black/30 backdrop-blur-md"
                role="tablist"
                aria-label="사용자 유형 선택"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={audience === "freelancer"}
                  onClick={() => setAudience("freelancer")}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:ring-offset-2 focus:ring-offset-black/40 sm:px-7 ${
                    audience === "freelancer"
                      ? "bg-white text-[#6D28D9] shadow-lg shadow-black/25"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  프리랜서
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={audience === "manager"}
                  onClick={() => setAudience("manager")}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:ring-offset-2 focus:ring-offset-black/40 sm:px-7 ${
                    audience === "manager"
                      ? "bg-white text-[#6D28D9] shadow-lg shadow-black/25"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  기업 및 매니저
                </button>
              </div>

              {audience === "freelancer" ? (
                <form
                  onSubmit={handleSearch}
                  className="flex w-full max-w-2xl flex-col gap-3 rounded-[2rem] border border-white/20 bg-white/95 p-2 shadow-2xl shadow-black/25 sm:flex-row"
                >
                  <label className="sr-only" htmlFor="quest-search">
                    퀘스트 검색
                  </label>
                  <input
                    id="quest-search"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="어떤 퀘스트를 찾고 있나요?"
                    className="min-h-12 flex-1 rounded-full bg-transparent px-5 text-sm font-medium text-gray-950 outline-none placeholder:text-gray-500 sm:text-base"
                  />
                  <button
                    type="submit"
                    className="min-h-12 rounded-full bg-[#6D28D9] px-7 text-sm font-bold text-white shadow-lg shadow-[#6D28D9]/30 transition hover:bg-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:ring-offset-2 focus:ring-offset-white"
                  >
                    퀘스트 검색
                  </button>
                </form>
              ) : (
                <Link
                  href={
                    role === "MANAGER"
                      ? "/manager/create-quest"
                      : "/manager/upgrade"
                  }
                  className="inline-flex min-h-14 w-fit items-center justify-center rounded-full bg-[#6D28D9] px-8 text-base font-bold text-white shadow-xl shadow-[#6D28D9]/35 transition hover:bg-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:ring-offset-2 focus:ring-offset-black/40"
                >
                  퀘스트 등록하기
                </Link>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5 pt-1">
              {QUEST_CATEGORIES.map((category) => {
                const isActive = selectedCategory === category.slug;

                return (
                  <button
                    key={category.slug}
                    type="button"
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold backdrop-blur-md transition ${
                      isActive
                        ? "border-[#A78BFA] bg-[#6D28D9]/45 text-white shadow-lg shadow-[#6D28D9]/20"
                        : "border-white/20 bg-white/10 text-white/90 hover:border-[#A78BFA]/80 hover:bg-[#6D28D9]/30 hover:text-white"
                    }`}
                    aria-pressed={isActive}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-5 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/25 p-3 text-white backdrop-blur-md transition-all hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA] md:inline-flex lg:left-6"
          aria-label="Previous slide"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/25 p-3 text-white backdrop-blur-md transition-all hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA] md:inline-flex"
          aria-label="Next slide"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
