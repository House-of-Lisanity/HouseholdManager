"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import NavLink from "./NavLink";

interface NavItem {
  href: string;
  label: string;
}

interface NavDropdown {
  label: string;
  items: NavItem[];
}

type NavEntry = NavItem | NavDropdown;

function isDropdown(entry: NavEntry): entry is NavDropdown {
  return "items" in entry;
}

const NAV_ENTRIES: NavEntry[] = [
  { href: "/calendar", label: "Calendar" },
  { href: "/meals", label: "Meals" },
  { href: "/workouts", label: "Workouts" },
  {
    label: "Logs",
    items: [
      { href: "/meal-log", label: "Meal Log" },
      { href: "/workout-log", label: "Workout Log" },
    ],
  },
  { href: "/profile", label: "Profile" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on navigation
  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <span className="nav__brand">Weekly Planner</span>
      <ul className="nav__links">
        {NAV_ENTRIES.map((entry) => {
          if (isDropdown(entry)) {
            const isChildActive = entry.items.some((item) =>
              pathname.startsWith(item.href)
            );
            const isOpen = openDropdown === entry.label;

            return (
              <li
                key={entry.label}
                className="nav__item nav__item--dropdown"
                ref={dropdownRef}
              >
                <button
                  className={`nav__link nav__dropdown-toggle${isChildActive ? " nav__link--active" : ""}`}
                  onClick={() =>
                    setOpenDropdown(isOpen ? null : entry.label)
                  }
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                >
                  {entry.label}
                </button>
                {isOpen && (
                  <ul className="nav__dropdown" role="menu">
                    {entry.items.map((item) => (
                      <li key={item.href} role="menuitem">
                        <NavLink
                          href={item.href}
                          label={item.label}
                          isActive={pathname.startsWith(item.href)}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          }

          return (
            <li key={entry.href} className="nav__item">
              <NavLink
                href={entry.href}
                label={entry.label}
                isActive={pathname.startsWith(entry.href)}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
