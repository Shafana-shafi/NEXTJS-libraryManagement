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
import { BookOpenIcon, ChevronDown, ChevronUp } from "lucide-react";
import { BookActionButtons } from "@/actions/bookActions";
import { Button } from "@/components/ui/button";

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

  return (
    <ToastProvider>
      <div className="rounded-md border">
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
                <TableHead key={key}>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort(key as keyof Book)}
                    className="hover:bg-transparent"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {getSortIcon(key as keyof Book)}
                  </Button>
                </TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <BookOpenIcon className="mr-2 h-5 w-5 text-gray-400" />
                    {book.title}
                  </div>
                </TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.publisher}</TableCell>
                <TableCell>{book.isbnNo}</TableCell>
                <TableCell>{book.availableCopies}</TableCell>
                <TableCell className="flex justify-center align-middle">
                  {book.price}
                </TableCell>
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
