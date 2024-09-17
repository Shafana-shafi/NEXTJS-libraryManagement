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
import { useToast } from "@/components/ui/use-toast";

type iBook = z.infer<typeof bookSchema> & {
  id: number;
  availableCopies: number;
  price: number;
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
  const { toast } = useToast();
  const onSubmit = async (data: iBook) => {
    console.log(data, "book data");
    const result = await handleAddBook(data);
    if (result && !result.success) {
      if (result.errors) {
        setServerErrors(result.errors);
      } else {
        toast({
          title: "Error",
          description: "Something went wront while adding book",
          variant: "destructive",
          duration: 1000,
        });
      }
    }
    if (result?.success) {
      toast({
        title: "Success",
        description: "Book Added Successfully",
        className: "bg-green-500",
        duration: 1000,
      });
    }
  };

  const handleBlur = async (fieldName: keyof iBook) => {
    await trigger(fieldName);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-rose-50 border-rose-200">
      <CardHeader className="bg-rose-100">
        <CardTitle className="text-rose-800">Add New Book</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="title" className="text-rose-700">
                Title
              </Label>
              <Input
                id="title"
                {...register("title")}
                aria-invalid={!!errors.title}
                aria-describedby="title-error"
                onBlur={() => handleBlur("title")}
                onChange={(e) => setValue("title", e.target.value)}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
              />
              {errors.title && (
                <p id="title-error" className="text-rose-600 text-sm">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="author" className="text-rose-700">
                Author
              </Label>
              <Input
                id="author"
                {...register("author")}
                aria-invalid={!!errors.author}
                aria-describedby="author-error"
                onBlur={() => handleBlur("author")}
                onChange={(e) => setValue("author", e.target.value)}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
              />
              {errors.author && (
                <p id="author-error" className="text-rose-600 text-sm">
                  {errors.author.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="publisher" className="text-rose-700">
                Publisher
              </Label>
              <Input
                id="publisher"
                {...register("publisher")}
                aria-invalid={!!errors.publisher}
                aria-describedby="publisher-error"
                onBlur={() => handleBlur("publisher")}
                onChange={(e) => setValue("publisher", e.target.value)}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
              />
              {errors.publisher && (
                <p id="publisher-error" className="text-rose-600 text-sm">
                  {errors.publisher.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="genre" className="text-rose-700">
                Genre
              </Label>
              <Input
                id="genre"
                {...register("genre")}
                aria-invalid={!!errors.genre}
                aria-describedby="genre-error"
                onBlur={() => handleBlur("genre")}
                onChange={(e) => setValue("genre", e.target.value)}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
              />
              {errors.genre && (
                <p id="genre-error" className="text-rose-600 text-sm">
                  {errors.genre.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label htmlFor="isbnNo" className="text-rose-700">
                ISBN
              </Label>
              <Input
                id="isbnNo"
                {...register("isbnNo")}
                aria-invalid={!!errors.isbnNo}
                aria-describedby="isbnNo-error"
                onBlur={() => handleBlur("isbnNo")}
                onChange={(e) => setValue("isbnNo", e.target.value)}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
              />
              {errors.isbnNo && (
                <p id="isbnNo-error" className="text-rose-600 text-sm">
                  {errors.isbnNo.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="pages" className="text-rose-700">
                Pages
              </Label>
              <Input
                id="pages"
                type="number"
                {...register("pages")}
                aria-invalid={!!errors.pages}
                aria-describedby="pages-error"
                onBlur={() => handleBlur("pages")}
                onChange={(e) => setValue("pages", parseInt(e.target.value))}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
              />
              {errors.pages && (
                <p id="pages-error" className="text-rose-600 text-sm">
                  {errors.pages.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="totalCopies" className="text-rose-700">
                Total Copies
              </Label>
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
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
              />
              {errors.totalCopies && (
                <p id="totalCopies-error" className="text-rose-600 text-sm">
                  {errors.totalCopies.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="price" className="text-rose-700">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              {...register("price")}
              aria-invalid={!!errors.price}
              aria-describedby="price-error"
              onBlur={() => handleBlur("price")}
              onChange={(e) => setValue("price", parseInt(e.target.value))}
              className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
            />
            {errors.price && (
              <p id="price-error" className="text-rose-600 text-sm">
                {errors.price.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-rose-100 flex justify-center align-middle pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            Add Book
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
