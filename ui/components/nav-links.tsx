"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

interface NavLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface NavLinksProps {
  links: NavLink[];
}

export default function NavLinks({ links }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-2">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-sky-100 text-blue-600"
                : "bg-gray-50 text-gray-700 hover:bg-sky-50 hover:text-blue-600"
            }`}
          >
            <div className="flex items-center justify-center w-8 h-8">
              {link.icon}
            </div>
            <span className="ml-3 text-sm font-medium">{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
