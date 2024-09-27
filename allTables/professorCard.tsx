"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { updateProfessorCalendlyLinkAction } from "@/actions/updateCalendlyLinkAction";
import { fetchSchedulingUrl } from "@/actions/fetchSchedulinUrl";

interface Professor {
  id: number;
  name: string;
  department: string;
  bio: string | null;
  email: string | null;
  inviteStatus: string;
  calendlyLink: string | null;
}

interface ProfessorCardProps {
  professor: Professor;
  invitations: any[];
}

export default function ProfessorCard({
  professor,
  invitations,
}: ProfessorCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-500";
      case "pending":
        return "bg-rose-800";
      case "not invited":
        return "bg-gray-500";
      default:
        return "bg-blue-500";
    }
  };

  const handleScheduleMeeting = async () => {
    if (professor.inviteStatus === "accepted" && !professor.calendlyLink) {
      setIsUpdating(true);
      const invitation = invitations.find(
        (inv) => inv.email === professor.email
      );
      if (invitation) {
        try {
          const schedulingUrl = await fetchSchedulingUrl(invitation.user);
          const result = await updateProfessorCalendlyLinkAction(
            professor.id,
            schedulingUrl
          );
          if (result.success) {
            router.refresh(); // Refresh the page to show updated data
          } else {
            console.error("Failed to update Calendly link:", result.message);
          }
        } catch (error) {
          console.error("Error updating Calendly link:", error);
        } finally {
          setIsUpdating(false);
        }
      }
    }

    // If calendlyLink exists or after updating, navigate to the professor's page
    router.push(`/professors/${professor.id}`);
  };

  return (
    <Card className="flex flex-col h-full p-4 rounded-lg shadow-lg bg-white">
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-rose-800">{professor.name}</h3>
          <Badge
            className={`${getStatusColor(professor.inviteStatus)} text-white`}
          >
            {professor.inviteStatus}
          </Badge>
        </div>
        <p className="text-sm text-rose-600 mb-2">{professor.department}</p>
        <p className="text-sm mb-4 text-rose-700">{professor.bio}</p>
      </div>
      {professor.inviteStatus !== "pending" && (
        <Button
          className="w-full bg-rose-600 hover:bg-rose-700 text-white"
          onClick={handleScheduleMeeting}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Schedule Meeting"}
        </Button>
      )}
    </Card>
  );
}
