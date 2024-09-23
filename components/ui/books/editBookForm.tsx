"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { iBook } from "@/models/book.model";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

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
  imgUrl: null,
};

export function EditBookForm({
  book,
  onSave,
}: {
  book: iBook;
  onSave: (updatedBook: iBook) => Promise<void>;
}) {
  const router = useRouter();
  const { toast } = useToast();

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
    imgUrl: book.imgUrl,
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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

  const uploadImageToCloudinary = async (image: File) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "ml_default"); // Update with your preset if different
    try {
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
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let coverImageUrl = formState.imgUrl;
      if (coverImage) {
        coverImageUrl = await uploadImageToCloudinary(coverImage);
      }

      const updatedBook = {
        ...book,
        ...formState,
        imgUrl: coverImageUrl,
      };

      await onSave(updatedBook);
      toast({
        title: "Success",
        description: "Book updated successfully!",
        className: "bg-green-500",
        duration: 3000,
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update book. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
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
          <div className="space-y-1">
            <Label htmlFor="coverImage" className="text-rose-700">
              Cover Image
            </Label>
            <Input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCoverImage(e.target.files ? e.target.files[0] : null)
              }
              className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
            />
            {formState.imgUrl && (
              <div className="mt-2">
                <Image
                  src={formState.imgUrl}
                  alt="Current cover"
                  width={100}
                  height={150}
                  className="rounded-md"
                />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-rose-100">
          <Button
            type="submit"
            disabled={loading}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
