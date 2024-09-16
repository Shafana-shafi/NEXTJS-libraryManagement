"use client";

import { useState, useTransition } from "react";
import { BookActionButtons } from "@/actions/bookActions";
import type { Book } from "../../allTables/bookTable";
import { iBookBase } from "@/models/book.model";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function BooksTableClient({
  initialBooks,
  onEdit,
  onDelete,
}: {
  initialBooks: Book[];
  onEdit: (id: number, updatedBook: iBookBase) => Promise<void>;
  onDelete: (bookId: number) => Promise<void>;
}) {
  const [books, setBooks] = useState(initialBooks);
  const [isPending, startTransition] = useTransition();
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const router = useRouter();

  const handleEdit = async (id: number, updatedBook: iBookBase) => {
    startTransition(async () => {
      try {
        await onEdit(id, updatedBook);
        toast({
          title: "Success",
          description: "Book updated successfully",
          className: "bg-green-600",
        });
        router.refresh();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update the book. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleDelete = async (bookId: number) => {
    startTransition(async () => {
      try {
        await onDelete(bookId);
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
        toast({
          title: "Success",
          description: "Book deleted successfully",
        });
        router.refresh();
      } catch (error) {
        toast({
          title: "Error",
          description: "Sorry, You Cannot delete an issued book",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Publisher</TableHead>
            <TableHead>ISBN</TableHead>
            <TableHead>Available Copies</TableHead>
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
              <TableCell>
                <BookActionButtons
                  book={book}
                  onEdit={handleEdit}
                  onDelete={async () => setBookToDelete(book)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog
        open={!!bookToDelete}
        onOpenChange={() => setBookToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this book?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              book {bookToDelete?.title} from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (bookToDelete) {
                  handleDelete(bookToDelete.id);
                  setBookToDelete(null);
                }
              }}
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
