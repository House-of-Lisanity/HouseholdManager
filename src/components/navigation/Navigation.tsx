"use client";

import { usePathname } from "next/navigation";
import NavLink from "./NavLink";

const NAV_ITEMS = [
  { href: "/calendar", label: "Calendar" },
  { href: "/meals", label: "Meals" },
  { href: "/workouts", label: "Workouts" },
  { href: "/workout-log", label: "Workout Log" },
  { href: "/profile", label: "Profile" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <span className="nav__brand">Weekly Planner</span>
      <ul className="nav__links">
        {NAV_ITEMS.map((item) => (
          <li key={item.href} className="nav__item">
            <NavLink
              href={item.href}
              label={item.label}
              isActive={pathname.startsWith(item.href)}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
