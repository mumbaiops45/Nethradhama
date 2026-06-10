

"use client";
import { useState } from "react";
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
  { name: "Academics", href: "/academics" },
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


function Lens({ className = "" }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.35" />
      <circle cx="24" cy="24" r="14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      <circle cx="24" cy="24" r="6" fill="currentColor" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [logoOk, setLogoOk] = useState(true);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname === href || pathname?.startsWith(href + "/");

  return (
    <Disclosure
      as="nav"
      className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 shadow-sm backdrop-blur-lg"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-20 items-center justify-between gap-4">
             
              <a href="/" className="flex shrink-0 items-center gap-2.5">
                {logoOk ? (
                  <img
                    src="/logo.png"
                    alt="Nethradhama School of Optometry"
                    onError={() => setLogoOk(false)}
                    className="h-12 w-auto object-contain"
                  />
                ) : (
                  <>
                    <Lens className="h-9 w-9" style={{ color: ACCENT }} />
                    <span className="leading-tight">
                      <span className="block font-serif text-base font-semibold text-gray-900">Nethradhama</span>
                      <span className="block text-[10px] uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
                        School of Optometry
                      </span>
                    </span>
                  </>
                )}
              </a>

             
              <div className="hidden flex-1 items-center justify-center md:flex">
                <div className="flex items-center gap-0.5">
                  {navigation.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={classNames(
                          "group relative whitespace-nowrap px-3.5 py-2 text-sm font-medium transition-colors duration-300",
                          active ? "text-[#0D8DD7]" : "text-gray-700 hover:text-[#0D8DD7]"
                        )}
                      >
                        {item.name}
                        <span
                          className={classNames(
                            "absolute inset-x-3.5 -bottom-0.5 h-0.5 origin-center rounded-full bg-[#0D8DD7] transition-transform duration-300",
                            active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                          )}
                        />
                      </a>
                    );
                  })}
                </div>
              </div>

            
              <div className="hidden shrink-0 md:flex">
                <a
                  href="/admission"
                  className="rounded-full bg-[#0D8DD7] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Admission Application
                </a>
              </div>

              
              <div className="flex md:hidden">
                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100">
                  <span className="sr-only">Toggle menu</span>
                  {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </DisclosureButton>
              </div>
            </div>
          </div>

        
          <DisclosurePanel className="border-t border-gray-200 bg-white xl:hidden">
            <div className="space-y-1 px-4 py-4">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={classNames(
                      "block rounded-lg px-4 py-3 text-base font-medium transition-colors",
                      active
                        ? "bg-[#0D8DD7]/10 text-[#0D8DD7]"
                        : "text-gray-700 hover:bg-[#0D8DD7]/5 hover:text-[#0D8DD7]"
                    )}
                  >
                    {item.name}
                  </DisclosureButton>
                );
              })}
              <a
                href="/admission"
                className="mt-3 block rounded-full bg-[#0D8DD7] px-4 py-3 text-center font-semibold text-white shadow-sm transition-colors hover:bg-[#0b7cbe]"
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