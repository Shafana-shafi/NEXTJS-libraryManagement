"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditBookForm } from "@/components/ui/books/editBookForm";
import type { Book } from "@/allTables/bookTable";
import { iBookBase } from "@/models/book.model";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation"; // Use router to refresh or navigate if needed

export function BookActionButtons({
  book,
  onEdit,
  onDelete,
}: {
  book: Book;
  onEdit: (id: number, updatedBook: iBookBase) => Promise<void>;
  onDelete: (bookId: number) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const router = useRouter(); // To refresh the page after delete
  const { toast } = useToast();

  const handleSaveEdit = async (updatedBook: iBookBase) => {
    setIsPending(true);
    try {
      await onEdit(book.id, updatedBook);
      toast({
        title: "Success",
        description: "Book updated successfully",
        className: "bg-green-500 text-white",
        duration: 1000, // 2 seconds
      });
      console.log("after toast");
      setIsEditing(false);
      router.refresh(); // Optional: refresh the page or data after success
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update book.",
        variant: "destructive", // Red background for error
        duration: 1000, // 2 seconds
      });
      console.error("Error updating book:", error);
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    setIsPending(true);
    try {
      await onDelete(book.id);
      toast({
        title: "Success",
        description: "Book deleted successfully",
        className: "bg-green-500 text-white",
        duration: 1000, // 2 seconds
      });
      router.refresh(); // Optional: refresh the page after success
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to delete. This book might be currently loaned out.",
        variant: "destructive", // Red background for error
        duration: 1000, // 2 seconds
      });
      console.error("Error deleting book:", error);
    } finally {
      setIsPending(false);
      setIsConfirmingDelete(false); // Close the confirmation dialog
    }
  };

  return (
    <div className="flex space-x-2">
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogTrigger asChild>
          <Button size="sm" onClick={() => setIsEditing(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          <EditBookForm book={book} onSave={handleSaveEdit} />
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Delete */}
      <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this book? This action cannot be
            undone.
          </p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsConfirmingDelete(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        size="sm"
        variant="destructive"
        onClick={() => setIsConfirmingDelete(true)}
        disabled={isPending}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  );
}
