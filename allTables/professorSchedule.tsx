"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import Script from "next/script";

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
    ? `${professor.calendlyLink}?name=${encodeURIComponent(
        professor.userName || ""
      )}&email=${encodeURIComponent(professor.userEmail || "")}`
    : null;

  const calendlyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initCalendly = () => {
      if (calendlyUrl && window.Calendly && calendlyRef.current) {
        // Ensure Calendly is loaded before initializing the widget
        window.Calendly.initInlineWidget({
          url: calendlyUrl,
          parentElement: calendlyRef.current,
          prefill: {
            name: professor.userName || "",
            email: professor.userEmail || "",
          },
        });
      }
    };

    if (typeof window.Calendly !== "undefined") {
      initCalendly();
    } else {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.onload = initCalendly;
      document.body.appendChild(script);
    }
  }, [calendlyUrl, professor.userName, professor.userEmail]);

  return (
    <div className="flex h-screen flex justify-center align-middle bg-rose-50 text-rose-900">
      <div className="flex flex-grow overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <Card className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-rose-800">
              {professor.name}
            </h1>
            <p className="text-lg text-rose-600 mb-2">{professor.department}</p>
            <p className="text-md mb-6 text-rose-700">{professor.bio}</p>
            {calendlyUrl && (
              <div
                ref={calendlyRef}
                className="calendly-inline-widget"
                style={{ minWidth: "320px", height: "630px" }}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
