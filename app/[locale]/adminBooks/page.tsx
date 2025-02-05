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
import {
  getLocale,
  getNow,
  getTimeZone,
  getMessages,
  getTranslations,
} from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    genre?: string;
    sort?: string;
    order?: "asc" | "desc";
  };
}) {
  const session = await getServerSession(authOptions);
  let userRole: string | null = null;

  if (session?.user?.email) {
    try {
      const user = await getUserByEmail(session.user.email);
      if (user) {
        userRole = user.role;
      } else {
        userRole = "user";
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  }

  const locale = await getLocale();
  const now = await getNow();
  const timeZone = await getTimeZone();
  const messages = await getMessages();
  const t = await getTranslations("BooksTable");
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const selectedGenre = searchParams?.genre || "all";
  const sortField = searchParams?.sort;
  const sortOrder = searchParams?.order || "asc";

  const genres = await getDistinctGenres();
  const totalPages = await fetchPaginatedBooks(
    query,
    selectedGenre,
    sortField,
    sortOrder
  );
  const books = await fetchFilteredBooks(
    query,
    currentPage,
    selectedGenre,
    sortField,
    sortOrder
  );

  const translations = {
    title: t("title"),
    author: t("author"),
    publisher: t("publisher"),
    isbn: t("isbn"),
    availableCopies: t("availableCopies"),
    price: t("price"),
    actions: t("actions"),
    edit: t("edit"),
    delete: t("delete"),
    copiesAvailable: t("copiesAvailable"),
    editBook: t("editBook"),
    confirmDeletion: t("confirmDeletion"),
    deleteConfirmation: "deleteConfirmation",
    cancel: t("cancel"),
    confirm: t("confirm"),
    success: t("success"),
    error: t("error"),
    bookUpdated: t("bookUpdated"),
    bookDeleted: t("bookDeleted"),
    updateFailed: t("updateFailed"),
    deleteFailed: t("deleteFailed"),
  };

  async function handleEditBook(id: number, updatedBook: iBookBase) {
    "use server";
    await update(id, updatedBook);
    revalidatePath("/adminBooks");
  }

  async function handleDeleteBook(bookId: number) {
    "use server";
    await deleteBook(bookId);
    revalidatePath("/adminBooks");
  }

  return (
    <NextIntlClientProvider
      locale={locale}
      now={now}
      timeZone={timeZone}
      messages={messages}
    >
      <div className="flex h-screen flex-col bg-rose-50 text-rose-900">
        {/* Sticky NavBar */}
        <div className="sticky top-0 z-50">
          <NavBar />
        </div>

        <div className="flex flex-grow overflow-hidden">
          {/* Sticky SideNav */}
          <div className="sticky top-0 h-screen">
            <SideNav />
          </div>

          <div className="relative flex flex-col flex-grow bg-rose-50 p-4">
            <div className="flex items-center justify-center gap-4 mb-3 align-middle">
              <Search placeholder={t("searchBooks")} />
              <GenreDropdown genres={genres} />
              {userRole === "admin" && <AddButton buttonFor="book" />}
            </div>

            <div className="flex-grow px-4 overflow-auto">
              {totalPages === 0 ? (
                <div className="text-center text-rose-500 mt-10">
                  {t("noBooksFound")}
                </div>
              ) : (
                <Suspense
                  key={
                    query + currentPage + selectedGenre + sortField + sortOrder
                  }
                  fallback={<TableSkeleton />}
                >
                  <BooksTable
                    initialBooks={books}
                    onEditBook={handleEditBook}
                    onDeleteBook={handleDeleteBook}
                    translations={translations}
                  />
                </Suspense>
              )}
            </div>

            {/* Sticky Pagination at the bottom */}
            <div className="sticky bottom-0 left-0 right-0 p-1 bg-rose-100 flex justify-center">
              {totalPages > 0 && <Pagination totalPages={totalPages} />}
            </div>
          </div>
        </div>
      </div>
    </NextIntlClientProvider>
  );
}
