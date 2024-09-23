// File: app/[locale]/components/requestActionButtons.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";

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
  ) => Promise<void>;
  returnDate: string | null;
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
  const { toast } = useToast();
  const t = useTranslations("RequestActionButtons");

  const handleAccept = async () => {
    setIsPending(true);
    try {
      await onAccept(memberId, bookId, requestId);
      toast({
        title: t("requestAccepted"),
        description: t("requestAcceptedDescription", { bookId }),
        className: "bg-green-500",
        duration: 1000,
      });
    } catch (error) {
      console.error("Error accepting request:", error);
      toast({
        title: t("acceptFailed"),
        description: t("acceptFailedDescription"),
        variant: "destructive",
        duration: 1000,
      });
    }
    setIsPending(false);
  };

  const handleDecline = async () => {
    setIsPending(true);
    try {
      await onDecline(memberId, bookId, requestId);
      toast({
        title: t("requestDeclined"),
        description: t("requestDeclinedDescription", { bookId }),
        className: "bg-green-500",
        duration: 1000,
      });
    } catch (error) {
      console.error("Error declining request:", error);
      toast({
        title: t("declineFailed"),
        description: t("declineFailedDescription"),
        variant: "destructive",
        duration: 1000,
      });
    }
    setIsPending(false);
  };

  const handleReturn = async () => {
    setIsPending(true);
    try {
      await onReturn(memberId, bookId, requestId);
      toast({
        title: t("bookReturned"),
        description: t("bookReturnedDescription", { bookId }),
        className: "bg-blue-500",
        duration: 1000,
      });
    } catch (error) {
      console.error("Error processing return:", error);
      toast({
        title: t("returnFailed"),
        description: t("returnFailedDescription"),
        variant: "destructive",
        duration: 1000,
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
        {t("accept")}
      </Button>
      <Button
        onClick={handleDecline}
        disabled={!isRequested || isPending}
        variant="destructive"
        size="sm"
      >
        {t("decline")}
      </Button>
      <Button
        onClick={handleReturn}
        className="bg-blue-600 text-white"
        disabled={status !== "success" || isPending}
        variant="secondary"
        size="sm"
      >
        {t("return")}
      </Button>
    </div>
  );
}
