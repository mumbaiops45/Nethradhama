"use client";

import { useState, useEffect } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about-us" },
  { name: "Research", href: "/research" },
  { name: "Activity Gallery", href: "/activity-gallery" },
  { name: "Faculty", href: "/faculty" },
  { name: "Curricular", href: "/curricular" },
  { name: "Contact", href: "/contact" },
];

const ACCENT = "#0D8DD7";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Lens({ className = "", style }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <circle
        cx="24"
        cy="24"
        r="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.35"
      />
      <circle
        cx="24"
        cy="24"
        r="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.6"
      />
      <circle cx="24" cy="24" r="6" fill="currentColor" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  const [logoOk, setLogoOk] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isActive = (href) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname?.startsWith(href + "/");

  return (
    <Disclosure
      as="nav"
      className={classNames(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-white/95 shadow-lg backdrop-blur-md border-b border-gray-200"
          : "bg-transparent"
      )}
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-20 items-center justify-between">
              
              
              <a href="/" className="flex items-center gap-3">
                {logoOk ? (
                  <img
                    src="/logo.png"
                    alt="Nethradhama School of Optometry"
                    onError={() => setLogoOk(false)}
                    className="h-12 w-auto object-contain"
                  />
                ) : (
                  <>
                    <Lens
                      className="h-9 w-9"
                      style={{
                        color: scrolled ? ACCENT : "#ffffff",
                      }}
                    />
                    <div>
                      <span
                        className={classNames(
                          "block text-base font-semibold",
                          scrolled ? "text-gray-900" : "text-white"
                        )}
                      >
                        Nethradhama
                      </span>
                      <span
                        className="block text-[10px] uppercase tracking-[0.18em]"
                        style={{
                          color: scrolled ? ACCENT : "#ffffff",
                        }}
                      >
                        School of Optometry
                      </span>
                    </div>
                  </>
                )}
              </a>

              
              <div className="hidden md:flex items-center gap-1">
                {navigation.map((item) => {
                  const active = isActive(item.href);

                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        "group relative px-4 py-2 text-sm font-medium transition-all duration-300",
                        active
                          ? "text-[#0D8DD7]"
                          : scrolled
                          ? "text-gray-700 hover:text-[#0D8DD7]"
                          : "text-white hover:text-white"
                      )}
                    >
                      {item.name}

                      <span
                        className={classNames(
                          "absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-[#0D8DD7] transition-transform duration-300",
                          active
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100"
                        )}
                      />
                    </a>
                  );
                })}
              </div>

             
              <div className="hidden md:block">
                <a
                  href="/contact"
                  className={classNames(
                    "rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300",
                    scrolled
                      ? "bg-[#0D8DD7] text-white shadow-lg hover:-translate-y-0.5"
                      : "bg-white text-[#0D8DD7] hover:bg-gray-100"
                  )}
                >
                  Admission Application
                </a>
              </div>

             
              <div className="md:hidden">
                <DisclosureButton
                  className={classNames(
                    "rounded-md p-2 transition-colors",
                    scrolled
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-white hover:bg-white/10"
                  )}
                >
                  {open ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </DisclosureButton>
              </div>
            </div>
          </div>

         
          <DisclosurePanel className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="space-y-1 px-4 py-4">
              {navigation.map((item) => {
                const active = isActive(item.href);

                return (
                  <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      "block rounded-lg px-4 py-3 text-base font-medium",
                      active
                        ? "bg-[#0D8DD7]/10 text-[#0D8DD7]"
                        : "text-gray-700 hover:bg-[#0D8DD7]/5"
                    )}
                  >
                    {item.name}
                  </DisclosureButton>
                );
              })}

              <a
                href="/contact"
                className="mt-3 block rounded-full bg-[#0D8DD7] px-4 py-3 text-center font-semibold text-white"
              >
                Admission Application
              </a>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}