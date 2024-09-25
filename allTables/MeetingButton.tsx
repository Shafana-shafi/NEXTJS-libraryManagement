"use client";

import { Button } from "@/ui/components/button";

interface JoinMeetingButtonProps {
  joinUrl: string;
}

export default function JoinMeetingButton({ joinUrl }: JoinMeetingButtonProps) {
  const handleJoinMeeting = () => {
    window.open(joinUrl, "_blank");
  };

  return (
    <Button
      onClick={handleJoinMeeting}
      className="bg-rose-800 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded"
    >
      Join Meeting
    </Button>
  );
}
