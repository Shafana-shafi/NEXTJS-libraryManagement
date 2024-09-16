"use client";

import { useState } from "react";
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
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface DeleteMemberButtonProps {
  memberId: number;
  onDelete: (memberId: number) => Promise<void>;
}

export function DeleteMemberButton({
  memberId,
  onDelete,
}: DeleteMemberButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsPending(true);
    try {
      await onDelete(memberId);
      toast({
        title: "Success",
        description: "Member deleted successfully",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete. This member has unreturned books.",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setIsOpen(true)}>
        Delete
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this member?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              member from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
