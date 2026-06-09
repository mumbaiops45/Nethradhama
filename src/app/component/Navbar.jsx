"use client"
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  return (
    <Disclosure
      as="nav"
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <a href="/">
              <img
                src="/logo.png"
                alt="College Logo"
                className="h-12 w-auto object-contain"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:text-blue-600"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="/admission"
              className="
                rounded-full
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                shadow-lg
                transition-all
                duration-300
                hover:scale-105
                hover:shadow-xl
              "
            >
              Admission Application
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100">
              <Bars3Icon className="block h-6 w-6 group-data-open:hidden" />
              <XMarkIcon className="hidden h-6 w-6 group-data-open:block" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <DisclosurePanel className="lg:hidden bg-white border-t border-gray-200">
        <div className="space-y-2 px-4 py-4">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              className="
                block
                rounded-lg
                px-4
                py-3
                text-base
                font-medium
                text-gray-700
                hover:bg-blue-50
                hover:text-blue-600
                transition
              "
            >
              {item.name}
            </DisclosureButton>
          ))}

          <a
            href="/admission"
            className="
              mt-4
              block
              text-center
              rounded-lg
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              px-4
              py-3
              font-semibold
              text-white
            "
          >
            Admission Application
          </a>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}