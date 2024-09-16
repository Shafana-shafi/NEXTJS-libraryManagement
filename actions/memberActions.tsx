"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { EditBookForm } from "@/components/ui/books/editBookForm";
import { iBookBase } from "@/models/book.model";
import { iMember } from "@/models/member.model";

export function MemberActions({
  member,
  // onEdit,
  onDelete,
  isPending,
}: {
  member: iMember;
  // onEdit: (id: number, updatedBook: iBookBase) => Promise<void>;
  onDelete: (bookId: number) => void;
  isPending: boolean;
}) {
  // const [isEditing, setIsEditing] = useState(false);

  // const handleEdit = () => {
  //   setIsEditing(true);
  // };

  // const handleSaveEdit = async (updatedBook: iBookBase) => {
  //   await onEdit(member.id, updatedBook);
  //   setIsEditing(false);
  // };
  const setBook = () => {
    // Do nothing or handle state changes if required
  };

  return (
    <div className="flex space-x-2">
      {/* <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogTrigger asChild>
          <Button size="sm" onClick={handleEdit} disabled={isPending}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          <EditBookForm
            book={member}
            onSave={handleSaveEdit}
            setBook={setBook}
          />
        </DialogContent>
      </Dialog> */}

      <Button
        size="sm"
        variant="destructive"
        onClick={() => onDelete(member.id)}
        disabled={isPending}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  );
}
