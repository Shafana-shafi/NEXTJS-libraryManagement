"use client";

import { useState } from "react";
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
};

type SortConfig = {
  key: keyof Book;
  direction: "asc" | "desc";
};

export default function BooksTable({
  initialBooks,
  onEditBook,
  onDeleteBook,
}: {
  initialBooks: Book[];
  onEditBook: (id: number, updatedBook: iBookBase) => Promise<void>;
  onDeleteBook: (bookId: number) => Promise<void>;
}) {
  const [books, setBooks] = useState(initialBooks);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "title",
    direction: "asc",
  });

  if (books.length === 0) {
    return null;
  }

  const handleSort = (key: keyof Book) => {
    let direction: "asc" | "desc" = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });

    const sortedBooks = [...books].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setBooks(sortedBooks);
  };

  const getSortIcon = (key: keyof Book) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
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
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeleteBook(book.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-sm text-gray-600 mb-1">Author: {book.author}</p>
      <p className="text-sm text-gray-600 mb-1">Publisher: {book.publisher}</p>
      <p className="text-sm text-gray-600 mb-1">ISBN: {book.isbnNo}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm font-medium text-rose-600">
          ₹{book.price.toFixed(2)}
        </span>
        <span className="text-sm text-gray-600">
          {book.availableCopies} copies available
        </span>
      </div>
    </div>
  );

  return (
    <ToastProvider>
      {/* Mobile view */}
      <div className="md:hidden bg-white">{books.map(renderMobileCard)}</div>

      {/* Desktop view */}
      <div className="hidden md:block rounded-md border bg-white border-rose-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {[
                "title",
                "author",
                "publisher",
                "isbnNo",
                "availableCopies",
                "price",
              ].map((key) => (
                <TableHead key={key} className="text-rose-800">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort(key as keyof Book)}
                    className="hover:bg-rose-200 text-rose-800"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {getSortIcon(key as keyof Book)}
                  </Button>
                </TableHead>
              ))}
              <TableHead className="text-rose-800">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
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
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ToastProvider>
  );
}
