import AddBookForm from "@/components/ui/books/addBookForm";
import { createBook } from "@/repositories/book.repository";
import NavBar from "@/ui/components/navBar";
import SideNav from "@/ui/components/sidenav";
import { Upload } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function AddBookPage() {
  const t = await getTranslations("AddBookForm");

  const translations = {
    addNewBook: t("addNewBook"),
    title: t("title"),
    author: t("author"),
    publisher: t("publisher"),
    genre: t("genre"),
    coverImage: t("coverImage"),
    isbn: t("isbn"),
    pages: t("pages"),
    totalCopies: t("totalCopies"),
    price: t("price"),
    addBook: t("addBook"),
    adding: t("adding"),
    error: t("error"),
    success: t("success"),
    addBookError: t("addBookError"),
    bookAddedSuccess: t("bookAddedSuccess"),
    imageUploadError: t("imageUploadError"),
    uploading: t("uploading"),
  };

  return (
    <div className="flex h-screen flex-col">
      <NavBar />
      <div className="flex flex-grow">
        <SideNav />
        <div className="flex flex-col w-full p-4 justify-center align-middle">
          <AddBookForm translations={translations} />
        </div>
      </div>
    </div>
  );
}
