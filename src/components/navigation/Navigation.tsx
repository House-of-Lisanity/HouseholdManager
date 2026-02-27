"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import NavLink from "./NavLink";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  href: string;
  label: string;
}

function getMainLinks(): NavItem[] {
  return [
    { href: "/calendar", label: "Calendar" },
    { href: "/meals", label: "Meals" },
    { href: "/workouts", label: "Workouts" },
  ];
}

function getMoreItems(isAdmin: boolean): NavItem[] {
  const items: NavItem[] = [
    { href: "/todos", label: "To Do" },
    { href: "/meal-log", label: "Meal Log" },
    { href: "/workout-log", label: "Workout Log" },
    { href: "/profile", label: "Profile" },
  ];

  if (isAdmin) {
    items.push({ href: "/admin/users", label: "Users" });
  }

  items.push({ href: "/account", label: "Account" });

  return items;
}

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  const mainLinks = getMainLinks();
  const moreItems = getMoreItems(user.role === "admin");
  const isMoreChildActive = [...moreItems, { href: "/account" }].some((item) =>
    pathname.startsWith(item.href)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on navigation
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  function handleLogout() {
    setMoreOpen(false);
    logout();
  }

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <span className="nav__brand">Weekly Planner</span>

      <ul className="nav__links">
        {mainLinks.map((link) => (
          <li key={link.href} className="nav__item">
            <NavLink
              href={link.href}
              label={link.label}
              isActive={pathname.startsWith(link.href)}
            />
          </li>
        ))}
      </ul>

      <div className="nav__right">
        <button
          className="nav__generate-all"
          onClick={() => router.push("/results")}
          aria-label="Generate all plans"
          title="Generate all plans for this week"
        >
          Generate All
        </button>

        <div
          className="nav__item nav__item--dropdown"
          ref={moreRef}
        >
          <button
            className={`nav__link nav__dropdown-toggle${isMoreChildActive ? " nav__link--active" : ""}`}
            onClick={() => setMoreOpen(!moreOpen)}
            aria-expanded={moreOpen}
            aria-haspopup="true"
          >
            More
          </button>
          {moreOpen && (
            <ul className="nav__dropdown nav__dropdown--right" role="menu">
              {moreItems.map((item) => (
                <li key={item.href} role="menuitem">
                  <NavLink
                    href={item.href}
                    label={item.label}
                    isActive={pathname.startsWith(item.href)}
                  />
                </li>
              ))}
              <li role="menuitem" className="nav__dropdown-divider" />
              <li role="menuitem">
                <button
                  className="nav__link nav__dropdown-logout"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
