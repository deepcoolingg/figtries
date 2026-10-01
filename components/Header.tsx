"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
// Tambahan useRouter dari next/navigation
import { usePathname, useRouter } from "next/navigation"; 
import { ArrowRight } from "lucide-react";

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isWhyChooseUsInView, setIsWhyChooseUsInView] = useState(false);
  const [isFooterInView, setIsFooterInView] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const section = document.getElementById("why-choose-us");
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsWhyChooseUsInView(entry.isIntersecting);
      },
      {
        threshold: 0.2,
        rootMargin: "-10% 0px -45% 0px",
      }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const footer = document.getElementById("contact");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterInView(entry.isIntersecting);
      },
      {
        threshold: 0.08,
      }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (pathname === "/") {
      const targetId = sessionStorage.getItem("pendingScroll");
      if (targetId) {
        sessionStorage.removeItem("pendingScroll");
        setTimeout(() => {
          const target = document.getElementById(targetId);
          if (target) {
            const headerOffset = 96;
            const elementPosition =
              target.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.scrollTo({ top: elementPosition, behavior: "smooth" });
          }
        }, 150);
      }
    }
  }, [pathname]);

  const navItems = [
    { name: "About Us", href: "/about", targetId: null },
    { name: "Services", href: "/", targetId: "services" },
    { name: "Projects", href: "/projects", targetId: null },
    { name: "Contact Us", href: "/", targetId: "contact" },
  ];

  const useLightNavButtons = isWhyChooseUsInView && !isOpen;

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    targetId?: string | null
  ) => {
    if (targetId) {
      e.preventDefault();
      setIsOpen(false);

      if (pathname === "/") {
        const target = document.getElementById(targetId);
        if (target) {
          const headerOffset = 96;
          const elementPosition =
            target.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top: elementPosition, behavior: "smooth" });
        }
      } else {
        sessionStorage.setItem("pendingScroll", targetId);
        router.push("/");
      }
      return;
    }

    setIsOpen(false);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[120] pointer-events-none">
        <div
          className="w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            paddingTop: scrolled
              ? "max(10px, env(safe-area-inset-top))"
              : "max(14px, env(safe-area-inset-top))",
          }}
        >
          <div className="pointer-events-auto flex items-center justify-between gap-3 px-2 sm:px-4 md:px-5 lg:px-7">
            <Link
              href="/"
              className="group flex min-w-0 items-center gap-3 sm:gap-4 overflow-visible"
            >
              <div
                className={`relative shrink-0 overflow-visible transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  scrolled
                    ? "h-11 w-11 sm:h-12 sm:w-12 md:h-14 md:w-14"
                    : "h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20"
                }`}
              >
                <Image
                  src="/figtries-logo.png"
                  alt="Figtries Logo"
                  fill
                  priority
                  sizes="(max-width: 640px) 56px, (max-width: 768px) 64px, 80px"
                  className="object-contain"
                />
              </div>

              <div
                className={`hidden sm:flex items-center transition-[clip-path,transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  scrolled && !isOpen
                    ? "-translate-x-2 opacity-0"
                    : "translate-x-0 opacity-100"
                }`}
                style={{
                  clipPath:
                    scrolled && !isOpen
                      ? "inset(-24px 100% -24px 0)"
                      : "inset(-24px -20px -24px 0)",
                }}
              >
                <span className="translate-y-[1px] md:translate-y-[2px] font-semibold inline-block whitespace-nowrap font-heading text-[24px] leading-none tracking-normal text-black sm:text-[28px] md:text-[34px]">
                  FIGTRIES
                </span>
              </div>
            </Link>

            <div className="flex shrink-0 items-center gap-2 sm:gap-2.5 md:gap-4">
              <Link
                href="https://wa.me/6285111213203"
                target="_blank"
                rel="noreferrer"
                className={`hidden md:inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3.5 font-heading font-medium tracking-[-0.02em] transition-all duration-300 sm:h-10 sm:px-4.5 md:h-12 md:px-6 ${
                  useLightNavButtons
                    ? "bg-white text-black hover:bg-white/85 hover:text-black"
                    : "bg-black text-white hover:bg-kota-cyan hover:text-black"
                } ${isOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
              >
                <span className="inline-flex items-center text-[9px] leading-none sm:text-[10px] md:text-sm">
                  Start a project
                </span>
                <ArrowRight
                  size={14}
                  strokeWidth={2.5}
                  className="shrink-0 self-center"
                />
              </Link>

              <button
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Toggle Navigation"
                aria-expanded={isOpen}
                className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors duration-300 sm:h-10 sm:w-10 md:h-12 md:w-12 ${
                  useLightNavButtons
                    ? "border-white bg-white text-black hover:bg-white/85 hover:text-black"
                    : "border-black bg-transparent text-black hover:bg-black hover:text-white"
                }`}
              >
                <span className="relative block h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className={`absolute inset-0 h-full w-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isOpen
                        ? "scale-75 rotate-45 opacity-0"
                        : "scale-100 rotate-0 opacity-100"
                    }`}
                  >
                    <path
                      d="M4 7H20"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M4 12H20"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M4 17H20"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className={`absolute inset-0 h-full w-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isOpen
                        ? "scale-100 rotate-0 opacity-100"
                        : "scale-75 -rotate-45 opacity-0"
                    }`}
                  >
                    <path
                      d="M6 6L18 18"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[110] bg-[#f4f4f4] transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full flex-col justify-center px-6 sm:px-10 md:px-24">
          <nav className="flex max-w-2xl flex-col gap-5 md:gap-10">
            {navItems.map((item, i) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e as any, item.href, item.targetId)}
                className="origin-left font-heading text-4xl tracking-normal text-black/90 transition-colors duration-150 hover:text-kota-periwinkle sm:text-5xl md:text-7xl"
                style={{
                  transitionDelay: isOpen ? `${100 + i * 50}ms` : "0ms",
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen
                    ? "translateY(0) scale(1)"
                    : "translateY(20px) scale(0.95)",
                  transitionProperty: "transform, opacity",
                  transitionDuration: "500ms",
                }}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <Link
        href="/"
        onClick={(e) => handleNavClick(e as any, "/", "contact")}
        className={`fixed right-5 bottom-[max(12px,calc(env(safe-area-inset-bottom)+8px))] z-[125] inline-flex h-12 items-center justify-center gap-2 rounded-full bg-black px-6 text-[0.98rem] font-heading font-medium tracking-[-0.02em] text-white shadow-[0_10px_26px_rgba(0,0,0,0.24)] transition-all duration-300 hover:bg-kota-cyan hover:text-black md:hidden ${
          isOpen || isFooterInView
            ? "pointer-events-none translate-y-3 opacity-0"
            : "pointer-events-auto translate-y-0 opacity-100"
        }`}
      >
        <span className="leading-none">Start a project</span>
        <ArrowRight size={16} strokeWidth={2.4} className="shrink-0" />
      </Link>
    </>
  );
};

export default Header;