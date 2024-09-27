"use client";

import { useState } from "react";
import { Button } from "@/ui/components/button";
import { useToast } from "@/components/ui/use-toast";
import { cancelMeeting, rescheduleMeeting } from "@/actions/meetingAction";
import { InlineWidget } from "react-calendly";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MeetingButtonsProps {
  email: string;
  joinUrl: string;
  rescheduleUrl: string;
  eventUuid: string;
}

export default function MeetingButtons({
  email,
  joinUrl,
  rescheduleUrl,
  eventUuid,
}: MeetingButtonsProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [showRescheduleWidget, setShowRescheduleWidget] = useState(false);
  const [rrul, setRrul] = useState<string | null>(null); // Manage reschedule URL in state
  const { toast } = useToast();

  const handleJoinMeeting = () => {
    window.open(joinUrl, "_blank");
  };

  const handleRescheduleMeeting = async () => {
    setIsRescheduling(true);
    try {
      const result = await rescheduleMeeting(eventUuid, email);
      if (result.success && result.rescheduleUrl) {
        setShowRescheduleWidget(true);
        setRrul(result.rescheduleUrl); // Update state with the new reschedule URL
      } else {
        throw new Error(result.error || "Failed to get reschedule information");
      }
    } catch (error) {
      console.error("Error rescheduling meeting:", error);
      toast({
        title: "Error",
        description: "Failed to reschedule the meeting. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsRescheduling(false);
    }
  };

  const handleCancelMeeting = async () => {
    setIsCancelling(true);
    try {
      const result = await cancelMeeting(eventUuid);
      if (result.success) {
        toast({
          title: "Meeting Cancelled",
          description: "Your meeting has been successfully cancelled.",
          className: "bg-green-500",
          duration: 3000,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error cancelling meeting:", error);
      toast({
        title: "Error",
        description: "Failed to cancel the meeting. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsCancelling(false);
    }
  };

  // Function to validate URL
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={handleJoinMeeting}
        className="bg-rose-800 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded"
      >
        Join Meeting
      </Button>

      <Dialog
        open={showRescheduleWidget}
        onOpenChange={setShowRescheduleWidget}
      >
        <DialogTrigger asChild>
          <Button
            onClick={handleRescheduleMeeting}
            disabled={isRescheduling}
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 px-4 rounded"
          >
            {isRescheduling ? "Rescheduling..." : "Reschedule"}
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Reschedule Meeting</DialogTitle>
            <DialogDescription>
              Please select a new time for your meeting.
            </DialogDescription>
          </DialogHeader>

          {/* Add check for valid reschedule URL */}
          {rrul ? (
            <InlineWidget
              url={rrul}
              styles={{
                height: "630px",
                width: "100%",
              }}
            />
          ) : (
            <p>Invalid or missing reschedule URL. Please try again later.</p>
          )}
        </DialogContent>
      </Dialog>

      <Button
        onClick={handleCancelMeeting}
        disabled={isCancelling}
        className="bg-rose-200 hover:bg-rose-300 text-rose-800 font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {isCancelling ? "Cancelling..." : "Cancel Meeting"}
      </Button>
    </div>
  );
}
