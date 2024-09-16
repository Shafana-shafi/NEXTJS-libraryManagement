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
    name: "Profile",
    href: "/profile",
    icon: <User className="w-5 h-5" />,
  },
  {
    name: "Books",
    href: "/adminBooks",
    icon: <Book className="w-5 h-5" />,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: <ArrowLeftRight className="w-5 h-5" />,
  },
  {
    name: "Requests",
    href: "/requests",
    icon: <GitPullRequestCreate className="w-5 h-5" />,
  },
  {
    name: "Members",
    href: "/adminBooks/members",
    icon: <UsersIcon className="w-5 h-5" />,
  },
  {
    name: "Add New Admin",
    href: "/adminBooks/addMember",
    icon: <UserPlusIcon className="w-5 h-5" />,
  },
];

const userLinks = [
  {
    name: "Profile",
    href: "/profile",
    icon: <User className="w-5 h-5" />,
  },
  { name: "Books", href: "/userBooks", icon: <Book className="w-5 h-5" /> },
  {
    name: "My Transactions",
    href: "/transactions",
    icon: <ArrowLeftRight className="w-5 h-5" />,
  },
  {
    name: "My Requests",
    href: "/requests",
    icon: <GitPullRequestCreate className="w-5 h-5" />,
  },
];

export default async function SideNav() {
  const session = await getServerSession(authOptions);
  console.log(session);
  let userRole = session?.user.role;

  const links = userRole === "admin" ? adminLinks : userLinks;

  return (
    <div className="flex h-full flex-col bg-gray-100 w-64 py-4 px-3">
      <div className="flex grow flex-col justify-between space-y-4 w-full">
        <div className="space-y-2">
          <NavLinks links={links} />
        </div>
        <div className="hidden h-auto w-full grow rounded-md bg-gray-200 md:block"></div>
        <LogOutButton />
      </div>
    </div>
  );
}
