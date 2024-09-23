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
import { useRouter } from "next/navigation";

interface BookActionButtonsProps {
  book: Book;
  onEdit: (id: number, updatedBook: iBookBase) => Promise<void>;
  onDelete: (bookId: number) => Promise<void>;
  translations: {
    edit: string;
    delete: string;
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

export function BookActionButtons({
  book,
  onEdit,
  onDelete,
  translations,
}: BookActionButtonsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSaveEdit = async (updatedBook: iBookBase) => {
    setIsPending(true);
    try {
      await onEdit(book.id, updatedBook);
      toast({
        title: translations.success,
        description: translations.bookUpdated,
        className: "bg-green-500 text-white",
        duration: 1000,
      });
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast({
        title: translations.error,
        description: translations.updateFailed,
        variant: "destructive",
        duration: 1000,
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
        title: translations.success,
        description: translations.bookDeleted,
        className: "bg-green-600 text-white",
        duration: 1000,
      });
      router.refresh();
    } catch (error) {
      toast({
        title: translations.error,
        description: translations.deleteFailed,
        variant: "destructive",
        duration: 1000,
      });
      console.error("Error deleting book:", error);
    } finally {
      setIsPending(false);
      setIsConfirmingDelete(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogTrigger asChild>
          <Button size="sm" onClick={() => setIsEditing(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            {translations.edit}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{translations.editBook}</DialogTitle>
          </DialogHeader>
          <EditBookForm book={book} onSave={handleSaveEdit} />
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{translations.confirmDeletion}</DialogTitle>
          </DialogHeader>
          <p>{translations.deleteConfirmation}</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsConfirmingDelete(false)}
              disabled={isPending}
            >
              {translations.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {translations.confirm}
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
        {translations.delete}
      </Button>
    </div>
  );
}
