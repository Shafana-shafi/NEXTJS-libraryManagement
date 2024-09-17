"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { update } from "@/repositories/book.repository";
import { iBook } from "@/models/book.model";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

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
  price: 0,
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
        price: parseInt(bookData.price as string, 10),
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

  const [formState, setFormState] = useState<FormState>({
    title: book.title,
    author: book.author,
    publisher: book.publisher,
    genre: book.genre,
    isbnNo: book.isbnNo,
    pages: book.pages,
    totalCopies: book.totalCopies,
    availableCopies: book.availableCopies,
    price: book.price,
  });

  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]:
        name === "pages" ||
        name === "totalCopies" ||
        name === "availableCopies" ||
        name === "price"
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
    <Card className="w-full max-w-2xl mx-auto bg-rose-50 border-rose-200">
      <CardHeader className="bg-rose-100">
        <CardTitle className="text-rose-800">Edit Book</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="title" className="text-rose-700">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formState.title}
                onChange={handleChange}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="author" className="text-rose-700">
                Author
              </Label>
              <Input
                id="author"
                name="author"
                value={formState.author}
                onChange={handleChange}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="publisher" className="text-rose-700">
                Publisher
              </Label>
              <Input
                id="publisher"
                name="publisher"
                value={formState.publisher}
                onChange={handleChange}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="genre" className="text-rose-700">
                Genre
              </Label>
              <Input
                id="genre"
                name="genre"
                value={formState.genre}
                onChange={handleChange}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="isbnNo" className="text-rose-700">
                ISBN
              </Label>
              <Input
                id="isbnNo"
                name="isbnNo"
                value={formState.isbnNo}
                onChange={handleChange}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="pages" className="text-rose-700">
                Pages
              </Label>
              <Input
                id="pages"
                name="pages"
                type="number"
                value={formState.pages}
                onChange={handleChange}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label htmlFor="totalCopies" className="text-rose-700">
                Total Copies
              </Label>
              <Input
                id="totalCopies"
                name="totalCopies"
                type="number"
                value={formState.totalCopies}
                onChange={handleChange}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="availableCopies" className="text-rose-700">
                Available Copies
              </Label>
              <Input
                id="availableCopies"
                name="availableCopies"
                type="number"
                value={formState.availableCopies}
                onChange={handleChange}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="price" className="text-rose-700">
                Price
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formState.price}
                onChange={handleChange}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-rose-100">
          <Button
            type="submit"
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            Save Changes
          </Button>
          {message && <p className="text-sm text-rose-600 ml-4">{message}</p>}
        </CardFooter>
      </form>
    </Card>
  );
}
