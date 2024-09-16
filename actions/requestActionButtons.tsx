"use client";

import { Button } from "@/components/ui/button";

export function RequestActionButtons({
  requestId,
  memberId,
  bookId,
  onAccept,
  onDecline,
  isPending,
}: {
  requestId: number;
  memberId: number;
  bookId: number;
  onAccept: (memberId: number, bookId: number) => Promise<void>;
  onDecline: (memberId: number, bookId: number) => Promise<void>;
  isPending: boolean;
}) {
  return (
    <div className="flex space-x-2">
      <Button
        size="sm"
        onClick={() => onAccept(memberId, bookId)}
        disabled={isPending}
      >
        {isPending ? "Processing..." : "Accept"}
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => onDecline(memberId, bookId)}
        disabled={isPending}
      >
        {isPending ? "Processing..." : "Decline"}
      </Button>
    </div>
  );
}
