"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { update } from "@/repositories/book.repository";
import { iBook } from "@/models/book.model";
import { useState } from "react";

interface FormState extends Omit<iBook, "id"> {
  message?: string;
}

const initialState: FormState = {
  title: "",
  publisher: "",
  author: "",
  genre: "",
  isbnNo: "",
  pages: 0,
  totalCopies: 0,
  availableCopies: 0,
};

function formAction(bookid: number) {
  return async (
    prevState: FormState,
    formData: FormData
  ): Promise<FormState> => {
    try {
      const bookData = Object.fromEntries(formData.entries());
      const updatedBook = {
        id: bookid,
        title: bookData.title as string,
        publisher: bookData.publisher as string,
        author: bookData.author as string,
        genre: bookData.genre as string,
        isbnNo: bookData.isbnNo as string,
        pages: parseInt(bookData.pages as string, 10),
        totalCopies: parseInt(bookData.totalCopies as string, 10),
        availableCopies: parseInt(bookData.availableCopies as string, 10),
      };

      const response = await update(bookid, updatedBook);
      if (response) {
        return { ...updatedBook, message: "Book updated successfully!" };
      }
      return {
        ...prevState,
        message: "Failed to update book. Please try again.",
      };
    } catch (error) {
      return {
        ...prevState,
        message: "An error occurred. Please try again.",
      };
    }
  };
}

export function EditBookForm({
  book,
  onSave,
}: {
  book: iBook;
  onSave: (updatedBook: iBook) => Promise<void>;
}) {
  const router = useRouter();

  // Use local state for form fields
  const [formState, setFormState] = useState<FormState>({
    title: book.title,
    author: book.author,
    publisher: book.publisher,
    genre: book.genre,
    isbnNo: book.isbnNo,
    pages: book.pages,
    totalCopies: book.totalCopies,
    availableCopies: book.availableCopies,
  });

  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]:
        name === "pages" || name === "totalCopies" || name === "availableCopies"
          ? parseInt(value, 10)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedBook = {
        ...book,
        ...formState,
      };
      await onSave(updatedBook);
      setMessage("Book updated successfully!");
    } catch (error) {
      setMessage("Failed to update book. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formState.title}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          name="author"
          value={formState.author}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="publisher">Publisher</Label>
        <Input
          id="publisher"
          name="publisher"
          value={formState.publisher}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="genre">Genre</Label>
        <Input
          id="genre"
          name="genre"
          value={formState.genre}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="isbnNo">ISBN</Label>
        <Input
          id="isbnNo"
          name="isbnNo"
          value={formState.isbnNo}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="pages">Pages</Label>
        <Input
          id="pages"
          name="pages"
          type="number"
          value={formState.pages}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="totalCopies">Total Copies</Label>
        <Input
          id="totalCopies"
          name="totalCopies"
          type="number"
          value={formState.totalCopies}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="availableCopies">Available Copies</Label>
        <Input
          id="availableCopies"
          name="availableCopies"
          type="number"
          value={formState.availableCopies}
          onChange={handleChange}
        />
      </div>
      <Button type="submit">Save Changes</Button>
      {message && <p className="text-sm text-red-500">{message}</p>}
    </form>
  );
}
