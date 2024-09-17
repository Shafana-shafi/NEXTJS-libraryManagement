import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import NavLinks from "./nav-links";
import { LogOutButton } from "./LogOutButton";
import {
  ArrowLeftRight,
  GitPullRequestCreate,
  UsersIcon,
  UserPlusIcon,
  HomeIcon,
  Book,
  User,
} from "lucide-react";

const adminLinks = [
  {
    name: "Books",
    href: "/adminBooks",
    icon: <Book className="w-5 h-5 text-rose-400" />,
  },
  {
    name: "Requests",
    href: "/requests",
    icon: <GitPullRequestCreate className="w-5 h-5 text-rose-400" />,
  },
  {
    name: "Members",
    href: "/adminBooks/members",
    icon: <UsersIcon className="w-5 h-5 text-rose-400" />,
  },
  {
    name: "Add New Members",
    href: "/adminBooks/addMember",
    icon: <UserPlusIcon className="w-5 h-5 text-rose-400" />,
  },
];

const userLinks = [
  {
    name: "Books",
    href: "/userBooks",
    icon: <Book className="w-5 h-5 text-rose-400" />,
  },
  {
    name: "My Requests",
    href: "/requests",
    icon: <GitPullRequestCreate className="w-5 h-5 text-rose-400" />,
  },
];

export default async function SideNav() {
  const session = await getServerSession(authOptions);
  let userRole = session?.user.role;

  const links = userRole === "admin" ? adminLinks : userLinks;

  return (
    <div className="flex h-full flex-col bg-gray-50 w-64 py-4 px-3 border border-rose-200 rounded-lg">
      <div className="space-y-4">
        <NavLinks links={links} />
        <LogOutButton /> {/* Moved LogOutButton right after the NavLinks */}
      </div>
      <div className="hidden h-auto w-full grow rounded-md bg-rose-50 md:block"></div>
    </div>
  );
}
