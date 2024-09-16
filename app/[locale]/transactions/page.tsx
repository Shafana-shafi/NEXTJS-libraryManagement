import { Suspense } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { getUserByEmail } from "@/repositories/user.repository";
import NavBar from "@/ui/components/navBar";
import SideNav from "@/ui/components/sidenav";
import Search from "@/components/ui/search";
import TransactionsTable from "@/components/tables/transactionsTable";
import { TableSkeleton } from "@/components/ui/skeletons";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const session = await getServerSession(authOptions);
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const userRole = session?.user.role;
  const memberId = Number(session?.user.id);

  return (
    <div className="flex h-screen flex-col bg-white text-black">
      <NavBar />
      <div className="flex flex-grow">
        <SideNav />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <div className="mb-6 flex justify-center align-middle">
              <Search placeholder="Search Transactions..." />
            </div>
            <div className="rounded-lg bg-white shadow">
              <Suspense fallback={<TableSkeleton />}>
                <TransactionsTable query={query} currentPage={currentPage} />
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
