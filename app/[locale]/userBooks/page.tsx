import Pagination from "@/components/ui/books/pagination";
import Search from "@/components/ui/search";
import Books from "@/components/ui/books/table";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/skeletons";
import { fetchPaginatedBooks } from "@/lib/actions";
import SideNav from "@/ui/components/sidenav";
import NavBar from "@/ui/components/navBar";
import { getDistinctGenres } from "@/repositories/book.repository";
import GenreDropdown from "@/allTables/FilterBooksComponent";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getNow, getTimeZone } from "next-intl/server";

export default async function Page({
  searchParams,
  params: { locale },
}: {
  params: { locale: string };
  searchParams?: {
    query?: string;
    page?: string;
    genre?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const selectedGenre = searchParams?.genre || "all";
  const totalPages = await fetchPaginatedBooks(query, selectedGenre);
  const genres = await getDistinctGenres();
  const session = await getServerSession(authOptions);
  const memberId = session?.user.id;
  const now = await getNow();
  const timeZone = await getTimeZone();
  const messages = await getMessages();
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

          <div className="relative flex-grow overflow-hidden flex flex-col">
            {/* Center the search bar */}
            <div className="flex justify-center z-10 bg-rose-100 pt-6 pb-4 mb-3 gap-3 shadow-md">
              <Search placeholder="Search Books..." />
              <GenreDropdown genres={genres} />
            </div>

            {/* Main content with books table */}
            <div className="flex-grow px-4 overflow-auto">
              {totalPages === 0 ? (
                <div className="text-center text-rose-600 mt-10 text-lg">
                  No books found for the search query.
                </div>
              ) : (
                <Suspense
                  key={query + currentPage + selectedGenre}
                  fallback={<TableSkeleton />}
                >
                  <div className="bg-white rounded-lg shadow-md mb-4">
                    <Books
                      query={query}
                      currentPage={currentPage}
                      genre={selectedGenre}
                      memberId={Number(memberId)}
                    />
                  </div>
                </Suspense>
              )}
            </div>

            {/* Sticky pagination at the bottom */}
            <div className="sticky bottom-0 left-0 right-0 p-4 bg-rose-100 flex justify-center shadow-md">
              {totalPages > 0 && <Pagination totalPages={totalPages} />}
            </div>
          </div>
        </div>
      </div>
    </NextIntlClientProvider>
  );
}
