import Pagination from "@/components/ui/books/pagination";
import Search from "@/components/ui/search";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/skeletons";
import SideNav from "@/ui/components/sidenav";
import NavBar from "@/ui/components/navBar";
import { fetchPaginatedMembers } from "@/repositories/user.repository";
import MembersTable from "@/allTables/membersTable";
import AddMemeberButton from "@/components/members/addMemeberButton";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchPaginatedMembers(query);

  return (
    <div className="flex h-screen flex-col bg-white text-black">
      <NavBar />

      <div className="flex flex-grow">
        <SideNav />

        <div className="relative flex flex-col flex-grow bg-gray-50 p-4">
          <div className="flex items-center justify-center gap-4 pt-7 mb-5">
            <Search placeholder="Search Members..." />
            <AddMemeberButton />
          </div>

          <div className="flex-grow px-4 overflow-auto">
            {totalPages === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                No Members found for the search query.
              </div>
            ) : (
              <Suspense key={query + currentPage} fallback={<TableSkeleton />}>
                <MembersTable query={query} currentPage={currentPage} />
              </Suspense>
            )}
          </div>

          <div className="sticky bottom-0 left-0 right-0 p-4 bg-white flex justify-center">
            {totalPages > 0 && <Pagination totalPages={totalPages} />}
          </div>
        </div>
      </div>
    </div>
  );
}
