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

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    genre?: string; // Accept genre from URL params
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const selectedGenre = searchParams?.genre || "all";
  const genres = await getDistinctGenres();
  const totalPages = await fetchPaginatedBooks(query, selectedGenre);
  return (
    <div className="flex h-screen flex-col">
      <NavBar />
      <div className="flex flex-grow">
        <SideNav />

        <div className="relative flex-grow overflow-hidden flex flex-col">
          {/* Center the search bar */}
          <div className="flex justify-center z-10 bg-background pt-3 mb-3 gap-3">
            <Search placeholder="Search Books..." />
            <GenreDropdown genres={genres} />
          </div>

          {/* Main content with books table */}
          <div className="flex-grow px-4 overflow-auto">
            {totalPages === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                No books found for the search query.
              </div>
            ) : (
              <Suspense
                key={query + currentPage + selectedGenre}
                fallback={<TableSkeleton />}
              >
                <Books
                  query={query}
                  currentPage={currentPage}
                  genre={selectedGenre}
                />
              </Suspense>
            )}
          </div>

          {/* Sticky pagination at the bottom */}
          <div className="sticky bottom-0 left-0 right-0 p-4 bg-white flex justify-center">
            {totalPages > 0 && <Pagination totalPages={totalPages} />}
          </div>
        </div>
      </div>
    </div>
  );
}
