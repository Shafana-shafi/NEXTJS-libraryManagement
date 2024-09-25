"use client";

import { InlineWidget } from "react-calendly";
import { Card } from "@/components/ui/card";

interface Professor {
  id: number;
  name: string;
  department: string;
  bio: string | null;
  calendlyLink: string | null;
  userName: string | null;
  userEmail: string | null;
}

interface ProfessorScheduleClientProps {
  professor: Professor;
}

export default function ProfessorScheduleClient({
  professor,
}: ProfessorScheduleClientProps) {
  // Construct Calendly URL with prefill parameters
  const calendlyUrl = professor.calendlyLink
    ? `${professor.calendlyLink}`
    : null;

  const prefill = {
    name: professor.userName || "",
    email: professor.userEmail || "",
  };

  return (
    <div className="h-screen flex justify-center align-middle bg-rose-50 text-rose-900">
      <div className="flex flex-grow overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <Card className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-rose-800">
              {professor.name}
            </h1>
            <p className="text-lg text-rose-600 mb-2">{professor.department}</p>
            <p className="text-md mb-6 text-rose-700">{professor.bio}</p>

            {calendlyUrl ? (
              <InlineWidget
                url={calendlyUrl}
                prefill={prefill}
                styles={{
                  width: "500px",
                  height: "630px",
                }}
              />
            ) : (
              <p>No valid Calendly link available.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
