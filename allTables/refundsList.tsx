"use client";

import { useState } from "react";
import { processRefund } from "@/actions/refundActions";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface Payment {
  id: number;
  amount: number;
  professorName: string;
  paymentDate: Date;
  paymentid: string;
  refunded: boolean;
}

export default function RefundsList({ payments }: { payments: Payment[] }) {
  const [processingRefund, setProcessingRefund] = useState<string | null>(null);

  const handleRefund = async (paymentId: string, amount: number) => {
    setProcessingRefund(paymentId);
    try {
      const result = await processRefund(paymentId, amount);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to process refund",
        variant: "destructive",
      });
    } finally {
      setProcessingRefund(null);
    }
  };

  if (payments.length === 0) {
    return <div>No refundable payments found.</div>;
  }

  //   return (
  //     <ul className="space-y-4">
  //       {payments.map((payment) => (
  //         <li key={payment.id} className="border p-4 rounded-md">
  //           <div className="flex justify-between items-center">
  //             <div>
  //               <p className="font-semibold">{payment.professorName}</p>
  //               <p>Amount: ₹{payment.amount}</p>
  //               <p>Date: {new Date(payment.paymentDate).toLocaleDateString()}</p>
  //             </div>
  //             <Button
  //               onClick={() => handleRefund(payment.paymentId, payment.amount)}
  //               disabled={processingRefund === payment.id}
  //             >
  //               {processingRefund === payment.id
  //                 ? "Processing..."
  //                 : "Request Refund"}
  //             </Button>
  //           </div>
  //         </li>
  //       ))}
  //     </ul>
  //   );
  return (
    <ul className="space-y-4">
      {payments
        .filter((payment) => !payment.refunded) // Filter for payments not refunded
        .map((payment) => {
          console.log("Payment ID:", payment.paymentid); // Log paymentId for each payment

          return (
            <li key={payment.id} className="border p-4 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{payment.professorName}</p>
                  <p>Amount: ₹{payment.amount}</p>
                  <p>
                    Date: {new Date(payment.paymentDate).toLocaleDateString()}
                  </p>
                  <p>Refund: {payment.refunded}</p>
                </div>
                <Button
                  onClick={() => {
                    console.log("Clicked Payment ID:", payment.paymentid); // Log when button is clicked
                    handleRefund(payment.paymentid, payment.amount);
                  }}
                  disabled={processingRefund === payment.id.toString()}
                >
                  {processingRefund === payment.id.toString()
                    ? "Processing..."
                    : "Request Refund"}
                </Button>
              </div>
            </li>
          );
        })}
    </ul>
  );
}
