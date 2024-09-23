// File: app/[locale]/overdue-requests/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { fetchOverdueRequests } from "@/repositories/request.repository";
import OverdueRequestsTable from "@/allTables/overdueRequestsTable";
import NavBar from "@/ui/components/navBar";
import SideNav from "@/ui/components/sidenav";
import Search from "@/components/ui/search";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/skeletons";
import Pagination from "@/components/ui/books/pagination";
import { NextIntlClientProvider } from "next-intl";
import {
  getLocale,
  getMessages,
  getNow,
  getTimeZone,
  getTranslations,
} from "next-intl/server";

export default async function OverdueRequestsPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { query?: string; page?: string };
}) {
  const now = await getNow();
  const timeZone = await getTimeZone();
  const messages = await getMessages();
  const t = await getTranslations("OverdueRequestsPage");
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const query = searchParams.query || "";
  const currentPage = Number(searchParams.page) || 1;

  const { overdueRequests, totalPages } = await fetchOverdueRequests(
    query,
    currentPage
  );

  return (
    <NextIntlClientProvider
      locale={locale}
      now={now}
      timeZone={timeZone}
      messages={messages}
    >
      <div className="flex h-screen flex-col bg-rose-50">
        <NavBar />
        <div className="flex flex-grow">
          <SideNav />
          <div className="flex flex-col w-full p-8">
            <div className="mb-6 flex items-center justify-center space-x-6">
              <Search placeholder={t("searchOverdueRequests")} />
              <span className="text-rose-700 font-medium">
                {t("totalOverdue")}: {overdueRequests.length}
              </span>
            </div>

            <div className="flex-grow overflow-auto bg-white rounded-lg shadow-md border border-rose-200">
              {totalPages === 0 ? (
                <div className="text-center text-rose-500 py-10">
                  {t("noOverdueRequestsFound")}
                </div>
              ) : (
                <Suspense
                  key={query + currentPage}
                  fallback={<TableSkeleton />}
                >
                  <OverdueRequestsTable
                    requests={overdueRequests}
                    adminEmail={session?.user?.email || ""}
                  />
                </Suspense>
              )}
            </div>
            <div className="mt-6 flex justify-center">
              <Pagination totalPages={totalPages} />
            </div>
          </div>
        </div>
      </div>
    </NextIntlClientProvider>
  );
}
