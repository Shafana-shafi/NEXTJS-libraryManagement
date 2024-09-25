"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, DollarSign, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

// Helper function to format the price based on locale and currency
function formatPriceToLocale(price: number, locale: string) {
  // Determine currency based on locale, fallback to INR if unknown
  const currency = locale === "en-US" ? "USD" : "INR";

  // Format price using Intl.NumberFormat
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(price);
}
console.log(formatPriceToLocale(150, "en-US"), "formatted");
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Detect the user's locale
  const locale = Intl.DateTimeFormat().resolvedOptions().locale || "en-IN";
  console.log(locale, "locale");
  const handleIssueBookRequest = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the dialog when clicking the button
    setIsRequesting(true);
    try {
      const result = await onCreateRequest(id);
      if (result.success) {
        toast({
          title: "Book Requested",
          description: `Your request for ${title} has been submitted.`,
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
    <>
      <Card
        className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="relative aspect-[3/4] w-full">
          <Image
            src={imageUrl || defaultImageUrl}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/90 to-transparent">
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-gray-300 mb-2">{author}</p>
          <div className="flex items-center justify-between text-white mb-2">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span className="text-base font-semibold">
                {availableCopies} {availableCopies === 1 ? "copy" : "copies"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold">
                {formatPriceToLocale(price, locale)}
              </span>
            </div>
          </div>
          <Button
            className="w-full bg-white text-black hover:bg-gray-200 transition-colors duration-300 text-xs py-1"
            onClick={handleIssueBookRequest}
            disabled={isRequesting || availableCopies === 0}
          >
            {availableCopies === 0
              ? "Unavailable"
              : isRequesting
              ? "Requesting..."
              : "Request Book"}
          </Button>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
            <DialogClose className="absolute right-4 top-4">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={imageUrl || defaultImageUrl}
                alt={title}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="space-y-4">
              <p className="text-lg font-semibold">{author}</p>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{genre}</Badge>
                <Badge variant="outline">{publisher}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold">
                    {formatPriceToLocale(price, locale)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span>
                    {availableCopies}{" "}
                    {availableCopies === 1 ? "copy" : "copies"} available
                  </span>
                </div>
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleIssueBookRequest}
                disabled={isRequesting || availableCopies === 0}
              >
                {availableCopies === 0
                  ? "Unavailable"
                  : isRequesting
                  ? "Requesting..."
                  : "Request Book"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
