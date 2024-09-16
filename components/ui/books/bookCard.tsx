"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User, Building, DollarSign } from "lucide-react"; // Added DollarSign icon for price
import { createRequest } from "@/repositories/request.repository";
import { useSession } from "next-auth/react";
import { getUserByEmail } from "@/lib/actions";
import { useToast } from "@/components/ui/use-toast";

interface BookCardProps {
  id: number;
  title: string;
  publisher: string;
  author: string;
  genre: string;
  availableCopies: number;
  price: number;
}

export default function BookCard({
  id,
  title,
  publisher,
  author,
  genre,
  availableCopies,
  price,
}: BookCardProps) {
  const [isRequesting, setIsRequesting] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  const handleIssueBookRequest = async () => {
    if (!session) {
      toast({
        title: "Error",
        description: "Please log in to request a book.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }
    setIsRequesting(true);
    try {
      const email = session.user?.email as string;
      const user = await getUserByEmail(email);
      const request = {
        bookId: Number(id),
        memberId: Number(user?.id),
        issuedDate: null,
        requestDate: new Date(),
        status: "requested",
      };
      await createRequest(request);
      toast({
        title: "Book Requested",
        description: `Your request for "${title}" has been submitted.`,
        duration: 5000,
        className: "bg-green-500",
      });
    } catch (error) {
      console.error("Error requesting book:", error);
      toast({
        title: "Request Failed",
        description: "Unable to request the book. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <Card className="flex flex-col h-full transition-shadow duration-300 hover:shadow-lg">
      <CardContent className="flex-grow p-4">
        <h3 className="text-xl font-semibold line-clamp-2 mb-3">{title}</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary flex-shrink-0" />
            <p className="line-clamp-1 font-medium">{author}</p>
          </div>
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-primary flex-shrink-0" />
            <p className="line-clamp-1">{publisher}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <Badge variant="outline" className="text-xs">
            {genre}
          </Badge>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4 text-primary" />
            <Badge
              variant={availableCopies > 0 ? "default" : "destructive"}
              className="text-xs"
            >
              {availableCopies} {availableCopies === 1 ? "copy" : "copies"}
            </Badge>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <p className="text-lg font-bold text-gray-800">${price.toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/20 p-4">
        <Button
          className="w-full"
          onClick={handleIssueBookRequest}
          disabled={isRequesting || availableCopies === 0 || !session}
        >
          {availableCopies === 0
            ? "Unavailable"
            : isRequesting
            ? "Requesting..."
            : `Request Book for $${price.toFixed(2)}`}
        </Button>
      </CardFooter>
    </Card>
  );
}