// "use client";

// import { InlineWidget, useCalendlyEventListener } from "react-calendly";
// import { Card } from "@/components/ui/card";

// interface Professor {
//   id: number;
//   name: string;
//   department: string;
//   bio: string | null;
//   calendlyLink: string | null;
//   userName: string | null;
//   userEmail: string | null;
// }

// interface ProfessorScheduleClientProps {
//   professor: Professor;
// }

// export default function ProfessorScheduleClient({
//   professor,
// }: ProfessorScheduleClientProps) {
//   // Construct Calendly URL with prefill parameters

//   const calendlyUrl = professor.calendlyLink
//     ? `${professor.calendlyLink}`
//     : null;

//   const prefill = {
//     name: professor.userName || "",
//     email: professor.userEmail || "",
//   };

//   return (
//     <div className="h-screen flex justify-center align-middle bg-rose-50 text-rose-900 overflow-hidden">
//       {/* This makes sure that the entire screen is used and scrolling is hidden */}
//       <div className="flex flex-grow overflow-hidden">
//         {/* Remove overflow here */}
//         <div className="flex-1 p-6">
//           <Card className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg w-full h-full">
//             <h1 className="text-2xl font-bold mb-4 text-rose-800">
//               {professor.name}
//             </h1>
//             <p className="text-lg text-rose-600 mb-2">{professor.department}</p>
//             <p className="text-md mb-6 text-rose-700">{professor.bio}</p>

//             {calendlyUrl ? (
//               <InlineWidget
//                 url={calendlyUrl}
//                 prefill={prefill}
//                 styles={{
//                   width: "600px",
//                   height: "630px",
//                 }}
//               />
//             ) : (
//               <p>No valid Calendly link available.</p>
//             )}
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import { Card } from "@/components/ui/card";
import { createScheduledMeeting } from "@/actions/scheduledMeetingAction";
import { toast } from "@/components/ui/use-toast";

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

async function fetchEventDetails(eventUri: string) {
  const eventUuid = eventUri.split("/").pop();
  try {
    const response = await fetch(`/api/calendly/event/${eventUuid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch event details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching event details:", error);
    throw error;
  }
}

export default function ProfessorScheduleClient({
  professor,
}: ProfessorScheduleClientProps) {
  const [isScheduling, setIsScheduling] = useState(false);

  const handleEventScheduled = async (e: any) => {
    setIsScheduling(true);
    console.log("Calendly event scheduled:", e.data);

    try {
      const eventDetails = e.data.payload;
      console.log(eventDetails, "event details");

      // Fetch detailed event information
      const detailedEventInfo = await fetchEventDetails(eventDetails.event.uri);
      console.log("Detailed event info:", detailedEventInfo);

      const result = await createScheduledMeeting(
        {
          startTime: detailedEventInfo.resource.start_time,
          endTime: detailedEventInfo.resource.end_time,
          inviteeName: eventDetails.invitee.name,
          inviteeEmail: eventDetails.invitee.email,
          eventType: detailedEventInfo.resource.event_type,
          eventTypeUuid: detailedEventInfo.resource.event_type_uuid,
          eventUuid: detailedEventInfo.resource.uuid,
        },
        professor.id
      );

      if (result.success) {
        toast({
          title: "Success",
          description: "Meeting scheduled successfully!",
          className: "bg-green-500",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      toast({
        title: "Error",
        description: "Failed to schedule meeting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScheduling(false);
    }
  };

  useCalendlyEventListener({
    onEventScheduled: handleEventScheduled,
  });

  const calendlyUrl = professor.calendlyLink
    ? `${professor.calendlyLink}`
    : null;

  const prefill = {
    name: professor.userName || "",
    email: professor.userEmail || "",
  };

  return (
    <div className="h-screen flex justify-center align-middle bg-rose-50 text-rose-900 overflow-hidden">
      <div className="flex flex-grow overflow-hidden">
        <div className="flex-1 p-6">
          <Card className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg w-full h-full">
            <h1 className="text-2xl font-bold mb-4 text-rose-800">
              {professor.name}
            </h1>
            <p className="text-lg text-rose-600 mb-2">{professor.department}</p>
            <p className="text-md mb-6 text-rose-700">{professor.bio}</p>

            {calendlyUrl ? (
              <>
                <InlineWidget
                  url={calendlyUrl}
                  prefill={prefill}
                  styles={{
                    width: "630px",
                    height: "500px",
                  }}
                />
                {isScheduling && (
                  <div className="absolute inset-0 bg-rose-50 bg-opacity-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-rose-500"></div>
                  </div>
                )}
              </>
            ) : (
              <p>No valid Calendly link available.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
