import Link from "next/link";

export function PromoBanner() {
  return (
    <section className="bg-background px-4 pt-6 sm:px-6 lg:px-8">
      <Link
        href="/quests/web-development"
        className="group mx-auto flex w-full max-w-[1408px] flex-col gap-4 rounded-2xl bg-gradient-to-r from-[#E2D4FF] via-[#EEE3FF] to-[#FBF7FF] px-6 py-5 shadow-[0_14px_36px_-32px_rgba(109,40,217,0.55)] transition-all duration-300 hover:from-[#DAC8FF] hover:via-[#E9DCFF] hover:to-[#F7F0FF] sm:flex-row sm:items-center sm:justify-between sm:px-8"
      >
        <p className="text-sm font-semibold leading-6 text-slate-800 sm:text-base">
          오늘도 새로운 퀘스트가 등록되었습니다. 지금 기회를 잡아보세요.
        </p>
        <span className="inline-flex w-fit items-center rounded-full bg-white/75 px-4 py-2 text-sm font-bold text-[#6D28D9] shadow-[0_8px_20px_-18px_rgba(109,40,217,0.8)] transition-colors duration-300 group-hover:bg-white group-hover:text-[#5B21B6]">
          둘러보기 →
        </span>
      </Link>
    </section>
  );
}
