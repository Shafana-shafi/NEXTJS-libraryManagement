import { Suspense } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import {
  getUserByEmail,
  fetchPaginatedBooks,
  fetchFilteredBooks,
} from "@/lib/actions";
import { getDistinctGenres } from "@/repositories/book.repository";
import { update, deleteBook } from "@/repositories/book.repository";
import { revalidatePath } from "next/cache";
import Pagination from "@/components/ui/books/pagination";
import Search from "@/components/ui/search";
import BooksTable from "@/allTables/bookTable";
import { TableSkeleton } from "@/components/ui/skeletons";
import SideNav from "@/ui/components/sidenav";
import NavBar from "@/ui/components/navBar";
import AddButton from "@/components/ui/books/addButton";
import GenreDropdown from "@/allTables/FilterBooksComponent";
import { iBookBase } from "@/models/book.model";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    genre?: string;
  };
}) {
  const session = await getServerSession(authOptions);
  let userRole: string | null = null;

  if (session?.user?.email) {
    try {
      const user = await getUserByEmail(session.user.email);
      userRole = user.role;
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  }

  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const selectedGenre = searchParams?.genre || "all";
  const genres = await getDistinctGenres();
  const totalPages = await fetchPaginatedBooks(query, selectedGenre);
  const books = await fetchFilteredBooks(query, currentPage, selectedGenre);

  async function handleEditBook(id: number, updatedBook: iBookBase) {
    "use server";
    await update(id, updatedBook);
    revalidatePath("/books");
  }

  async function handleDeleteBook(bookId: number) {
    "use server";
    await deleteBook(bookId);
    revalidatePath("/books");
  }

  return (
    <div className="flex h-screen flex-col bg-white text-black">
      <NavBar />
      <div className="flex flex-grow">
        <SideNav />
        <div className="relative flex flex-col flex-grow bg-gray-50 p-4">
          <div className="flex items-center justify-center gap-4 mb-3 align-middle">
            <Search placeholder="Search Books..." />
            <GenreDropdown genres={genres} />
            {userRole === "admin" && <AddButton />}
          </div>
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
                <BooksTable
                  initialBooks={books}
                  onEditBook={handleEditBook}
                  onDeleteBook={handleDeleteBook}
                />
              </Suspense>
            )}
          </div>
          <div className="sticky bottom-0 left-0 right-0 p-3 bg-white flex justify-center">
            {totalPages > 0 && <Pagination totalPages={totalPages} />}
          </div>
        </div>
      </div>
    </div>
  );
}
