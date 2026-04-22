import Image from "next/image";

const COMPANY_LOGOS = [
  { name: "3M", src: "/logos/3m.svg", width: 74, height: 30 },
  { name: "Airbnb", src: "/logos/airbnb.svg", width: 112, height: 34 },
  { name: "Cloudflare", src: "/logos/cloudflare.svg", width: 138, height: 32 },
  { name: "Databricks", src: "/logos/databricks.svg", width: 152, height: 30 },
  { name: "Google", src: "/logos/google.svg", width: 108, height: 36 },
  { name: "Grammarly", src: "/logos/grammarly.svg", width: 146, height: 34 },
  { name: "Hyundai", src: "/logos/hyundai.svg", width: 126, height: 30 },
  { name: "Instagram", src: "/logos/instagram.svg", width: 132, height: 34 },
  { name: "Kakao", src: "/logos/kakao.svg", width: 104, height: 30 },
  { name: "NBC", src: "/logos/nbc.svg", width: 88, height: 36 },
  { name: "Samsung", src: "/logos/samsung.svg", width: 136, height: 28 },
  { name: "TikTok", src: "/logos/tiktok.svg", width: 108, height: 34 },
];

const MARQUEE_GROUPS = [COMPANY_LOGOS, COMPANY_LOGOS];

export function TrustedCompaniesSection() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-[linear-gradient(180deg,rgba(109,40,217,0.04),rgba(255,255,255,0)_36%),linear-gradient(90deg,rgba(167,139,250,0.08),rgba(255,255,255,0)_18%,rgba(255,255,255,0)_82%,rgba(167,139,250,0.08))] px-4 py-16 sm:px-6 sm:py-[4.5rem] lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#A78BFA]/40 to-transparent" />

      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6D28D9]">
            TRUSTED BY COMPANIES
          </p>
          <h2 className="mt-4 text-balance text-3xl font-bold text-foreground sm:text-4xl">
            Trusted by teams building real products
          </h2>
          <p className="mt-3 text-sm leading-6 text-foreground-muted sm:text-base">
            QuestWork helps companies discover proven developers and launch
            project-based collaboration with more confidence.
          </p>
        </div>

        <div className="relative mt-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background via-background/92 to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background via-background/92 to-transparent sm:w-24" />

          <div className="rounded-[2rem] border border-white/60 bg-white/72 px-3 py-5 shadow-[0_24px_80px_-48px_rgba(109,40,217,0.35)] backdrop-blur-sm sm:px-4">
            <div className="trusted-marquee overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="trusted-marquee__track flex min-w-max shrink-0 items-center">
                {MARQUEE_GROUPS.map((group, groupIndex) => (
                  <div
                    key={groupIndex}
                    className="flex min-w-max shrink-0 items-center"
                    aria-hidden={groupIndex === 1}
                  >
                    {group.map((logo) => (
                      <div
                        key={`${groupIndex}-${logo.name}`}
                        className="group/logo flex h-16 w-[136px] items-center justify-center px-3 transition-colors duration-300 hover:bg-[#6D28D9]/4 sm:h-[4.5rem] sm:w-[156px] sm:px-4"
                      >
                        <Image
                          src={logo.src}
                          alt={`${logo.name} logo`}
                          width={logo.width}
                          height={logo.height}
                          className="h-auto max-h-8 w-auto max-w-full opacity-60 grayscale transition-all duration-300 group-hover/logo:opacity-95 group-hover/logo:grayscale-0 sm:max-h-9"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
