"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { iBookBase } from "@/models/book.model";
import { ToastProvider } from "@/components/ui/toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BookOpenIcon,
  ChevronDown,
  ChevronUp,
  MoreVertical,
} from "lucide-react";
import { BookActionButtons } from "@/actions/bookActions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Book = iBookBase & {
  id: number;
  availableCopies: number;
  price: number;
  imgUrl: string | null;
};

interface BooksTableProps {
  initialBooks: Book[];
  onEditBook: (id: number, updatedBook: iBookBase) => Promise<void>;
  onDeleteBook: (bookId: number) => Promise<void>;
  translations: {
    title: string;
    author: string;
    publisher: string;
    isbn: string;
    availableCopies: string;
    price: string;
    actions: string;
    edit: string;
    delete: string;
    copiesAvailable: string;
    editBook: string;
    confirmDeletion: string;
    deleteConfirmation: string;
    cancel: string;
    confirm: string;
    success: string;
    error: string;
    bookUpdated: string;
    bookDeleted: string;
    updateFailed: string;
    deleteFailed: string;
  };
}

export default function BooksTable({
  initialBooks,
  onEditBook,
  onDeleteBook,
  translations,
}: BooksTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (initialBooks.length === 0) {
    return null;
  }

  const handleSort = (key: keyof Book) => {
    const params = new URLSearchParams(searchParams);
    const currentSort = params.get("sort");
    const currentOrder = params.get("order");

    let newOrder = "asc";
    if (currentSort === key && currentOrder === "asc") {
      newOrder = "desc";
    }

    params.set("sort", key);
    params.set("order", newOrder);

    router.push(`?${params.toString()}`);
  };

  const getSortIcon = (key: keyof Book) => {
    const currentSort = searchParams.get("sort");
    const currentOrder = searchParams.get("order");

    if (currentSort === key) {
      return currentOrder === "asc" ? (
        <ChevronUp className="ml-2 h-4 w-4" />
      ) : (
        <ChevronDown className="ml-2 h-4 w-4" />
      );
    }
    return null;
  };

  const renderMobileCard = (book: Book) => (
    <div key={book.id} className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{book.title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEditBook(book.id, book)}>
              {translations.edit}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeleteBook(book.id)}>
              {translations.delete}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-sm text-gray-600 mb-1">
        {translations.author}: {book.author}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        {translations.publisher}: {book.publisher}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        {translations.isbn}: {book.isbnNo}
      </p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm font-medium text-rose-600">
          ₹{book.price.toFixed(2)}
        </span>
        <span className="text-sm text-gray-600">
          {book.availableCopies} {translations.copiesAvailable}
        </span>
      </div>
    </div>
  );

  const tableHeaders: (keyof Book)[] = [
    "title",
    "author",
    "publisher",
    "isbnNo",
    "availableCopies",
    "price",
  ];

  return (
    <>
      {/* Mobile view */}
      <div className="md:hidden bg-white">
        {initialBooks.map(renderMobileCard)}
      </div>

      {/* Desktop view */}
      <div className="hidden md:block rounded-md border bg-white border-rose-200 overflow-hidden mb-4">
        <Table>
          <TableHeader>
            <TableRow>
              {tableHeaders.map((key) => (
                <TableHead key={key} className="text-rose-800">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort(key)}
                    className="hover:bg-rose-200 text-rose-800"
                  >
                    {translations[key as keyof typeof translations]}
                    {getSortIcon(key)}
                  </Button>
                </TableHead>
              ))}
              <TableHead className="text-rose-800">
                {translations.actions}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialBooks.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <BookOpenIcon className="mr-2 h-5 w-5 text-rose-400" />
                    {book.title}
                  </div>
                </TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.publisher}</TableCell>
                <TableCell>{book.isbnNo}</TableCell>
                <TableCell className="flex justify-center align-middle">
                  {book.availableCopies}
                </TableCell>
                <TableCell>₹{book.price.toFixed(2)}</TableCell>
                <TableCell>
                  <BookActionButtons
                    book={book}
                    onDelete={onDeleteBook}
                    onEdit={onEditBook}
                    translations={translations}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
