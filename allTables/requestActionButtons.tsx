"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"; // Import useToast

interface RequestActionButtonsProps {
  requestId: number;
  memberId: number;
  bookId: number;
  status: string;
  onAccept: (
    memberId: number,
    bookId: number,
    requestId: number
  ) => Promise<void>;
  onDecline: (
    memberId: number,
    bookId: number,
    requestId: number
  ) => Promise<void>;
  onReturn: (
    memberId: number,
    bookId: number,
    requestId: number
  ) => Promise<void>; // Add handler for return action
  returnDate: Date | null;
}

export function RequestActionButtons({
  requestId,
  memberId,
  bookId,
  status,
  onAccept,
  onDecline,
  onReturn,
  returnDate,
}: RequestActionButtonsProps) {
  const isRequested = status === "requested";
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast(); // Use the toast hook

  const handleAccept = async () => {
    setIsPending(true);
    try {
      await onAccept(memberId, bookId, requestId);
      toast({
        title: "Request Accepted",
        description: `The request for book ${bookId} has been accepted.`,
        duration: 2000,
        className: "bg-green-500",
      });
    } catch (error) {
      console.error("Error accepting request:", error);
      toast({
        title: "Accept Failed",
        description: "Unable to accept the request. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    }
    setIsPending(false);
  };

  const handleDecline = async () => {
    setIsPending(true);
    try {
      await onDecline(memberId, bookId, requestId);
      toast({
        title: "Request Declined",
        description: `The request for book ${bookId} has been declined.`,
        duration: 2000,
        className: "bg-red-500",
      });
    } catch (error) {
      console.error("Error declining request:", error);
      toast({
        title: "Decline Failed",
        description: "Unable to decline the request. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    }
    setIsPending(false);
  };

  const handleReturn = async () => {
    setIsPending(true);
    try {
      await onReturn(memberId, bookId, requestId);
      toast({
        title: "Book Returned",
        description: `The book ${bookId} has been successfully returned.`,
        duration: 2000,
        className: "bg-blue-500",
      });
    } catch (error) {
      console.error("Error processing return:", error);
      toast({
        title: "Return Failed",
        description: "Unable to process the return. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    }
    setIsPending(false);
  };

  return (
    <div className="flex space-x-2">
      <Button
        onClick={handleAccept}
        disabled={!isRequested || isPending}
        size="sm"
        className="bg-green-600"
      >
        Accept
      </Button>
      <Button
        onClick={handleDecline}
        disabled={!isRequested || isPending}
        variant="destructive"
        size="sm"
      >
        Decline
      </Button>
      <Button
        onClick={handleReturn}
        className="bg-blue-600 text-white"
        disabled={status !== "success" || isPending}
        variant="secondary"
        size="sm"
      >
        Return
      </Button>
    </div>
  );
}
