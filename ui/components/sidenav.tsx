import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import NavLinks from "./nav-links";
import { LogOutButton } from "./LogOutButton";
import { GitPullRequestCreate, UsersIcon, Book } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

const SideNav = async () => {
  const session = await getServerSession(authOptions);
  const userRole = session?.user.role;
  const t = await getTranslations("Navigation");

  const adminLinks = [
    {
      name: t("books"),
      href: `/adminBooks`,
      icon: <Book className="w-5 h-5 text-rose-400" />,
    },
    {
      name: t("requests"),
      href: `/requests`,
      icon: <GitPullRequestCreate className="w-5 h-5 text-rose-400" />,
    },
    {
      name: t("members"),
      href: `/adminBooks/members`,
      icon: <UsersIcon className="w-5 h-5 text-rose-400" />,
    },
    {
      name: t("todaysDue"),
      href: `/adminBooks/todaysDue`,
      icon: <UsersIcon className="w-5 h-5 text-rose-400" />,
    },
    {
      name: t("profile"),
      href: `/profile`,
      icon: <UsersIcon className="w-5 h-5 text-rose-400" />,
    },
  ];

  const userLinks = [
    {
      name: t("books"),
      href: `/userBooks`,
      icon: <Book className="w-5 h-5 text-rose-400" />,
    },
    {
      name: t("myRequests"),
      href: `/requests`,
      icon: <GitPullRequestCreate className="w-5 h-5 text-rose-400" />,
    },
    {
      name: t("profile"),
      href: `/profile`,
      icon: <UsersIcon className="w-5 h-5 text-rose-400" />,
    },
  ];

  const links = userRole === "admin" ? adminLinks : userLinks;

  return (
    <div className="flex h-full flex-col bg-gray-50 w-64 py-4 px-3 border border-rose-200 rounded-lg">
      <div className="space-y-4">
        <NavLinks links={links} />
        <LogOutButton />
      </div>
      <div className="hidden h-auto w-full grow rounded-md bg-rose-50 md:block"></div>
    </div>
  );
};

export default SideNav;
