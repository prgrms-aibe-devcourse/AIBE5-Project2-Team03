'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1522202176988-4ea95f317b13?w=1600&h=900&fit=crop',
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-slide logic
  useEffect(() => {
    if (isHovered) {
      if (autoSlideRef.current) clearTimeout(autoSlideRef.current)
      return
    }

    autoSlideRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 5000)

    return () => {
      if (autoSlideRef.current) clearTimeout(autoSlideRef.current)
    }
  }, [isHovered, currentSlide])

  const goToSlide = (index: number) => setCurrentSlide(index)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length)

  return (
    /* Outer wrapper: full-width, centers the hero block */
    <section className="flex justify-center bg-background py-10 px-4 sm:px-6 lg:px-8">
      {/* Hero block: 70vw wide, 70vh tall, rounded, self-contained */}
      <div
        className="relative w-[70vw] min-w-[320px] h-[70vh] min-h-[480px] overflow-hidden rounded-2xl shadow-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background image slider — fills the hero block */}
        <div className="absolute inset-0">
          {HERO_IMAGES.map((image, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/25" />
        </div>

        {/* Text content — layered on top of the image */}
        <div className="relative z-10 flex h-full items-center px-8 sm:px-12 lg:px-16">
          <div className="flex max-w-lg flex-col gap-7">
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
              <span className="text-xs font-semibold text-white">
                지금 퀘스트에 참여하세요
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              <span>실력으로 증명하는</span>
              <br />
              <span className="text-secondary">프리랜서 플랫폼</span>
            </h1>

            {/* Subheading */}
            <p className="text-base text-white/80 sm:text-lg">
              기업은 문제를 퀘스트로 올리고
              <br />
              프리랜서는 결과물로 경쟁합니다.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/60">프리랜서</p>
                <Link href="/quests/web-development">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-hover">
                    퀘스트 탐색하기
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/60">기업 · 매니저</p>
                <Link href="/manager/create-quest">
                  <Button className="w-full border border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
                    퀘스트 등록하기
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white transition-all hover:bg-white/40 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Previous slide"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white transition-all hover:bg-white/40 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Next slide"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
