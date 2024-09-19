"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User, Building, DollarSign } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface BookCardProps {
  id: number;
  title: string;
  publisher: string;
  author: string;
  genre: string;
  availableCopies: number;
  price: number;
  imageUrl: string | null;
  onCreateRequest: (
    bookId: number
  ) => Promise<{ success: boolean; message: string }>;
}

export default function BookCard({
  id,
  title,
  publisher,
  author,
  genre,
  availableCopies,
  price,
  imageUrl,
  onCreateRequest,
}: BookCardProps) {
  const [isRequesting, setIsRequesting] = useState(false);
  const { toast } = useToast();

  const handleIssueBookRequest = async () => {
    setIsRequesting(true);
    try {
      const result = await onCreateRequest(id);
      if (result.success) {
        toast({
          title: "Book Requested",
          description: `Your request for "${title}" has been submitted.`,
          duration: 3000,
          className: "bg-green-500 text-white",
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error requesting book:", error);
      toast({
        title: "Request Failed",
        description: "Unable to request the book. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const defaultImageUrl =
    "https://res.cloudinary.com/dpwjausog/image/upload/v1726718398/india_bbynhl.jpg";

  return (
    <Card className="flex flex-col h-full transition-shadow duration-300 hover:shadow-md overflow-hidden border-rose-100">
      <div className="relative w-full h-48">
        <Image
          src={imageUrl || defaultImageUrl}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-t-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardContent className="flex-grow p-6">
        <div className="flex flex-col mb-4">
          <h3 className="text-xl font-semibold text-rose-800 mb-2">{title}</h3>
          <Badge
            variant="outline"
            className="text-sm px-2 py-1 w-fit text-rose-600 border-rose-200"
          >
            {genre}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-rose-400 flex-shrink-0" />
            <p className="font-medium">{author}</p>
          </div>
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-rose-400 flex-shrink-0" />
            <p>{publisher}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 bg-rose-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-rose-600" />
            <p className="text-lg font-semibold text-rose-800">
              {price.toFixed(2)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-rose-400" />
            <Badge
              variant={availableCopies > 0 ? "secondary" : "destructive"}
              className="text-sm px-2 py-1 bg-rose-100 text-rose-700"
            >
              {availableCopies} {availableCopies === 1 ? "copy" : "copies"}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-rose-50 p-4">
        <Button
          className="w-full text-base py-2 bg-rose-600 hover:bg-rose-700 text-white"
          onClick={handleIssueBookRequest}
          disabled={isRequesting || availableCopies === 0}
        >
          {availableCopies === 0
            ? "Unavailable"
            : isRequesting
            ? "Requesting..."
            : "Request Book"}
        </Button>
      </CardFooter>
    </Card>
  );
}
