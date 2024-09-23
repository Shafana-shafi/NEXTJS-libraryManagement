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
import Image from "next/image";

type iBook = z.infer<typeof bookSchema> & {
  id: number;
  availableCopies: number;
  price: number;
};

interface AddBookFormProps {
  translations: {
    addNewBook: string;
    title: string;
    author: string;
    publisher: string;
    genre: string;
    coverImage: string;
    isbn: string;
    pages: string;
    totalCopies: string;
    price: string;
    addBook: string;
    adding: string;
    error: string;
    success: string;
    addBookError: string;
    bookAddedSuccess: string;
    imageUploadError: string;
    uploading: string;
  };
}

export default function AddBookForm({ translations }: AddBookFormProps) {
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");

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

  const uploadImageToCloudinary = async (image: File) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "ml_default");
    try {
      setUploadStatus(translations.uploading);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dpwjausog/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Image upload failed.");
      }
      const data = await response.json();
      setUploadStatus("");
      setPreviewUrl(data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadStatus("");
      throw error;
    }
  };

  const onSubmit = async (data: iBook) => {
    setLoading(true);
    try {
      let coverImageUrl = "";
      if (coverImage) {
        coverImageUrl = await uploadImageToCloudinary(coverImage);
      }

      const result = await handleAddBook({
        ...data,
        imgUrl: coverImageUrl,
      });

      if (result && !result.success) {
        if (result.errors) {
          setServerErrors(result.errors);
        } else {
          toast({
            title: translations.error,
            description: translations.addBookError,
            variant: "destructive",
            duration: 1000,
          });
        }
      }

      if (result?.success) {
        toast({
          title: translations.success,
          description: translations.bookAddedSuccess,
          className: "bg-green-500",
          duration: 1000,
        });
      }
    } catch (error) {
      toast({
        title: translations.error,
        description: translations.imageUploadError,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = async (fieldName: keyof iBook) => {
    await trigger(fieldName);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setCoverImage(file);
      try {
        await uploadImageToCloudinary(file);
      } catch (error) {
        toast({
          title: translations.error,
          description: translations.imageUploadError,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-rose-50 border-rose-200">
      <CardHeader className="bg-rose-100">
        <CardTitle className="text-rose-800">
          {translations.addNewBook}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="title" className="text-rose-700">
                {translations.title}
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
                {translations.author}
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
                {translations.publisher}
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
                {translations.genre}
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

          <div className="space-y-1">
            <Label htmlFor="coverImage" className="text-rose-700">
              {translations.coverImage}
            </Label>
            <Input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
            />
            {uploadStatus && (
              <p className="text-blue-600 text-sm">{uploadStatus}</p>
            )}
            {previewUrl && (
              <div className="mt-2">
                <Image
                  src={previewUrl}
                  alt="Cover preview"
                  width={100}
                  height={150}
                  className="object-cover rounded"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label htmlFor="isbnNo" className="text-rose-700">
                {translations.isbn}
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
                {translations.pages}
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
                {translations.totalCopies}
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
              {translations.price}
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
            disabled={loading || isSubmitting}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            {loading ? translations.adding : translations.addBook}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
