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
import type { Book } from "./bookTable";
import { iBookBase } from "@/models/book.model";

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

  const handleSaveEdit = async (updatedBook: iBookBase) => {
    await onEdit(book.id, updatedBook);
    setIsEditing(false);
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

      <Button size="sm" variant="destructive" onClick={() => onDelete(book.id)}>
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  );
}
