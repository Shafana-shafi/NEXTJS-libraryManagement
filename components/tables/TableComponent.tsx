"use client";

import { useState, useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
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

interface TableComponentProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    header: string;
    render?: (item: T) => React.ReactNode;
  }[];
  actions?: {
    label: string;
    onClick: (item: T) => void;
    renderButton?: (item: T, isPending: boolean) => React.ReactNode;
  }[];
  onDelete?: (item: T) => Promise<void>;
  deleteConfirmMessage?: string;
  rowKey: (item: T) => string | number;
}

export function TableComponent<T>({
  data,
  columns,
  actions,
  onDelete,
  deleteConfirmMessage = "This action cannot be undone.",
  rowKey,
}: TableComponentProps<T>) {
  const [isPending, startTransition] = useTransition();
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  const handleDelete = async (item: T) => {
    if (onDelete) {
      startTransition(async () => {
        try {
          await onDelete(item);
          toast({
            title: "Success",
            description: "Item deleted successfully",
          });
          setItemToDelete(null);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete the item.",
            variant: "destructive",
          });
        }
      });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key as string}>{column.header}</TableHead>
            ))}
            {actions && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={rowKey(item)}>
              {columns.map((column) => (
                <TableCell key={column.key as string}>
                  {column.render
                    ? column.render(item)
                    : (item[column.key] as React.ReactNode)}
                </TableCell>
              ))}
              {actions && (
                <TableCell>
                  <div className="flex space-x-2">
                    {actions.map((action, index) => (
                      <div key={index}>
                        {action.renderButton ? (
                          action.renderButton(item, isPending)
                        ) : (
                          <button
                            className="btn btn-primary"
                            onClick={() => action.onClick(item)}
                          >
                            {action.label}
                          </button>
                        )}
                      </div>
                    ))}
                    {onDelete && (
                      <button
                        className="btn btn-danger"
                        onClick={() => setItemToDelete(item)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog
        open={!!itemToDelete}
        onOpenChange={() => setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirmMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (itemToDelete) {
                  handleDelete(itemToDelete);
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
