"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { bookSchema } from "@/validations/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { handleAddBook } from "../../../actions/addBookActions";
import { useState } from "react";
import { toast } from "react-toastify";

type iBook = z.infer<typeof bookSchema> & {
  id: number;
  availableCopies: number;
};

export default function AddBookForm() {
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    setValue,
  } = useForm<iBook>({
    resolver: zodResolver(bookSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: iBook) => {
    console.log(data, "book data");
    const result = await handleAddBook(data);
    if (result && !result.success) {
      if (result.errors) {
        setServerErrors(result.errors);
      } else {
        toast.error(result.error || "An error occurred");
      }
    }
    if (result?.success) {
      toast.success("Book added successfully");
    }
  };

  const handleBlur = async (fieldName: keyof iBook) => {
    await trigger(fieldName);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add New Book</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title")}
              aria-invalid={!!errors.title}
              aria-describedby="title-error"
              onBlur={() => handleBlur("title")}
              onChange={(e) => setValue("title", e.target.value)}
            />
            {errors.title && (
              <p id="title-error" className="text-red-600 text-sm">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="publisher">Publisher</Label>
            <Input
              id="publisher"
              {...register("publisher")}
              aria-invalid={!!errors.publisher}
              aria-describedby="publisher-error"
              onBlur={() => handleBlur("publisher")}
              onChange={(e) => setValue("publisher", e.target.value)}
            />
            {errors.publisher && (
              <p id="publisher-error" className="text-red-600 text-sm">
                {errors.publisher.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              {...register("author")}
              aria-invalid={!!errors.author}
              aria-describedby="author-error"
              onBlur={() => handleBlur("author")}
              onChange={(e) => setValue("author", e.target.value)}
            />
            {errors.author && (
              <p id="author-error" className="text-red-600 text-sm">
                {errors.author.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="genre">Genre</Label>
            <Input
              id="genre"
              {...register("genre")}
              aria-invalid={!!errors.genre}
              aria-describedby="genre-error"
              onBlur={() => handleBlur("genre")}
              onChange={(e) => setValue("genre", e.target.value)}
            />
            {errors.genre && (
              <p id="genre-error" className="text-red-600 text-sm">
                {errors.genre.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="isbnNo">ISBN</Label>
            <Input
              id="isbnNo"
              {...register("isbnNo")}
              aria-invalid={!!errors.isbnNo}
              aria-describedby="isbnNo-error"
              onBlur={() => handleBlur("isbnNo")}
              onChange={(e) => setValue("isbnNo", e.target.value)}
            />
            {errors.isbnNo && (
              <p id="isbnNo-error" className="text-red-600 text-sm">
                {errors.isbnNo.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="pages">Pages</Label>
            <Input
              id="pages"
              type="number"
              {...register("pages")}
              aria-invalid={!!errors.pages}
              aria-describedby="pages-error"
              onBlur={() => handleBlur("pages")}
              onChange={(e) => setValue("pages", parseInt(e.target.value))}
            />
            {errors.pages && (
              <p id="pages-error" className="text-red-600 text-sm">
                {errors.pages.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="totalCopies">Total Copies</Label>
            <Input
              id="totalCopies"
              type="number"
              {...register("totalCopies")}
              aria-invalid={!!errors.totalCopies}
              aria-describedby="totalCopies-error"
              onBlur={() => handleBlur("totalCopies")}
              onChange={(e) =>
                setValue("totalCopies", parseInt(e.target.value))
              }
            />
            {errors.totalCopies && (
              <p id="totalCopies-error" className="text-red-600 text-sm">
                {errors.totalCopies.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" disabled={isSubmitting}>
            Add Book
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
