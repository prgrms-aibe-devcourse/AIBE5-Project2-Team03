"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold">
                Q
              </div>
              <span className="font-bold text-foreground">QuestWork</span>
            </div>
            <p className="text-sm text-foreground-muted">
              실력으로 증명하는 프리랜서 플랫폼
            </p>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-foreground">Company</h4>
            <ul className="flex flex-col gap-2 text-sm text-foreground-muted">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <ul className="flex flex-col gap-2 text-sm text-foreground-muted">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-foreground">Connect</h4>
            <ul className="flex flex-col gap-2 text-sm text-foreground-muted">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  GitHub
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Discord
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-border pt-8 flex flex-col items-center justify-between gap-4 text-sm text-foreground-muted md:flex-row">
          <p>&copy; 2026 QuestWork. All rights reserved.</p>
          <p>Made with passion for developers and companies</p>
        </div>
      </div>
    </footer>
  );
}
