"use client";

import { useState, useEffect } from "react";

export function CreateMeetingButton() {
  const [showWidget, setShowWidget] = useState(false);

  useEffect(() => {
    if (showWidget) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [showWidget]);

  const handleCreateMeeting = () => {
    setShowWidget(true);
  };

  return (
    <div>
      {!showWidget ? (
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleCreateMeeting}
        >
          Create New Meeting
        </button>
      ) : (
        <div className="mt-4">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mb-4"
            onClick={() => setShowWidget(false)}
          >
            Close Calendly
          </button>
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/shifashafana14"
            style={{ minWidth: "320px", height: "700px" }}
          />
        </div>
      )}
    </div>
  );
}
