"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { updateProfessorCalendlyLinkAction } from "@/actions/updateCalendlyLinkAction";
import { fetchSchedulingUrl } from "@/actions/fetchSchedulinUrl";
import { storeTransactionDetails } from "@/actions/transactionDetails";
import { checkProfessorPaymentStatus } from "@/actions/checkPaymentStatusAction";

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

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function ProfessorCard({
  professor,
  invitations,
}: ProfessorCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const router = useRouter();

  console.log("ProfessorCard rendered", { professor, invitations });

  useEffect(() => {
    console.log("useEffect triggered");

    const loadRazorpay = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        console.log("Razorpay script loaded");
        setRazorpayLoaded(true);
      };
      document.body.appendChild(script);
    };

    const checkPaymentStatus = async () => {
      try {
        console.log("Checking payment status for professor", professor.id);
        const result = await checkProfessorPaymentStatus(professor.id);
        console.log("Payment status result:", result);
        if (result.success) {
          setHasPaid(result.status || false);
        } else {
          console.error("Error checking payment status:", result.error);
        }
      } catch (error) {
        console.error("Error in checkPaymentStatus:", error);
      }
    };

    loadRazorpay();
    checkPaymentStatus();

    // Cleanup function
    return () => {
      console.log("ProfessorCard unmounting");
    };
  }, [professor.id]);

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

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      console.error("Razorpay script not loaded");
      return;
    }

    try {
      setIsUpdating(true);
      const response = await fetch("/api/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 50000,
          currency: "INR",
          receipt: `receipt_${professor.id}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const order = await response.json();
      console.log("Razorpay order:", order);
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Shifa'S Library",
        description: "Test Transaction",
        order_id: order.id,
        handler: async function (response: any) {
          setIsProcessing(true);
          try {
            const result = await storeTransactionDetails({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              professorId: professor.id,
              amount: order.amount,
              currency: order.currency,
            });
            if (result.success) {
              console.log("Transaction details stored:", result.message);
              setHasPaid(true);
              await handleScheduleMeeting();
            } else {
              console.error(
                "Error storing transaction details:",
                result.message
              );
              setIsProcessing(false);
              alert(
                "Error storing transaction details. Please contact support."
              );
            }
          } catch (error) {
            console.error("Error in payment handler:", error);
            setIsProcessing(false);
            alert("An error occurred. Please try again or contact support.");
          }
        },
        prefill: {
          name: professor.name,
          email: professor.email,
        },
        theme: {
          color: "#F43F5E",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      alert("Error creating order. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleScheduleMeeting = async () => {
    if (professor.inviteStatus === "accepted" && !professor.calendlyLink) {
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
            console.log("Calendly link updated successfully");
            router.refresh(); // Refresh the page to show updated data
            router.push(`/professors/${professor.id}`); // Redirect to professor's page
          } else {
            console.error("Failed to update Calendly link:", result.message);
            setIsProcessing(false);
            alert("Failed to update Calendly link. Please try again.");
          }
        } catch (error) {
          console.error("Error updating Calendly link:", error);
          setIsProcessing(false);
          alert("Error updating Calendly link. Please try again.");
        }
      }
    } else if (professor.calendlyLink) {
      // If Calendly link already exists, just redirect
      router.push(`/professors/${professor.id}`);
    }
  };

  console.log("Rendering ProfessorCard", {
    hasPaid,
    razorpayLoaded,
    isProcessing,
  });

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
        <button
          className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded disabled:opacity-50"
          onClick={hasPaid ? handleScheduleMeeting : handlePayment}
          disabled={isUpdating || (!razorpayLoaded && !hasPaid) || isProcessing}
        >
          {isProcessing
            ? "Processing payment and scheduling..."
            : isUpdating
            ? "Processing..."
            : hasPaid || professor.calendlyLink
            ? "Schedule Meeting"
            : "Pay and Schedule"}
        </button>
      )}
    </Card>
  );
}
