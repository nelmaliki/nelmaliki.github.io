"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

//add a new entry here for it to appear in the navbar
interface NavBarEntry {
  displayName: string;
  route: string;
}
const navBarEntries: NavBarEntry[] = [
  {
    displayName: "Home",
    route: "/",
  },
  {
    displayName: "Projects",
    route: "/projects",
  },
  {
    displayName: "Text IDE",
    route: "/projects/project1",
  },
  {
    displayName: "Learning ML",
    route: "/learning-ml",
  },
];

export function NavBar(): React.ReactElement {
  return (
    <header>
      <nav className="bg-Onyx text-amber-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold">
                Nour.Codes
              </Link>
            </div>
            <div className="flex space-x-4">
              {navBarEntries.map((e) => (
                <NavBarLink key={e.route} navBarEntry={e} />
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

function NavBarLink(props: { navBarEntry: NavBarEntry }): React.ReactElement {
  const { navBarEntry } = props;
  const pathName = usePathname();
  if (isSelected(pathName, navBarEntry)) {
    return (
      <div className="bg-NaplesYellow px-2 rounded-3xl">
        <Link href={navBarEntry.route} className="text-black">
          {navBarEntry.displayName}
        </Link>
      </div>
    );
  } else {
    return (
      <Link href={navBarEntry.route} className="hover:text-NaplesYellow">
        {navBarEntry.displayName}
      </Link>
    );
  }
}

function isSelected(currentRoute: string, navBarEntry: NavBarEntry): boolean {
  // Remove trailing whitespace and slashes from routes
  const sanitizedCurrentRoute = currentRoute.replace(/\/+$/, "").trim();
  const sanitizedRoute = navBarEntry.route.replace(/\/+$/, "").trim();
  return sanitizedCurrentRoute === sanitizedRoute;
}
