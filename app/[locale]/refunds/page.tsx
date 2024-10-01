import { Suspense } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { fetchRefundablePayments } from "@/actions/refundActions";
import RefundsList from "@/allTables/refundsList";
import { Card } from "@/components/ui/card";
import NavBar from "@/ui/components/navBar"; // Importing NavBar
import SideNav from "@/ui/components/sidenav"; // Importing SideNav
import { redirect } from "next/navigation";

export default async function RefundsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
    return null; // Ensures no further rendering after redirect
  }

  const userId = session.user.id;
  const id = Number(userId);

  const result = await fetchRefundablePayments(id);

  if (!result || !result.success) {
    return (
      <div className="text-red-500">
        {result?.payments?.message || "Failed to fetch refundable payments."}
      </div>
    );
  }

  const payments = result.payments?.data || []; // Ensure payments is always an array

  return (
    <div className="flex flex-col h-screen bg-rose-50">
      {/* Top Navigation */}
      <NavBar />

      {/* Side Navigation + Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Side Navigation */}
        <SideNav />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Refunds</h1>
            <Card className="p-4">
              <Suspense fallback={<div>Loading refundable payments...</div>}>
                <RefundsList payments={payments} />
              </Suspense>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
