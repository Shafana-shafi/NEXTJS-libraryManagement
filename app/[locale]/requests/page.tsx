// File: app/requests/page.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { getUserByEmail } from "@/repositories/user.repository";
import {
  fetchFilteredUserRequests,
  fetchAllRequests,
  updateRequestStatus,
  updateRequestStatusOnReturn,
  fetchPaginatedRequest,
} from "@/repositories/request.repository";
import {
  updateAvailableBookCopiesOnIssue,
  updateAvailableBookCopiesOnReturn,
} from "@/repositories/book.repository";
import RequestsTable, { Request } from "@/allTables/requestTable";
import { revalidatePath } from "next/cache";
import NavBar from "@/ui/components/navBar";
import SideNav from "@/ui/components/sidenav";
import Search from "@/components/ui/search";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/ui/skeletons";
import Pagination from "@/components/ui/books/pagination";
import { RequestFilterComponent } from "@/allTables/requestFilterComponent";

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: { query?: string; page?: string; filters?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold">
          Please sign in to access this page.
        </p>
      </div>
    );
  }

  const user = await getUserByEmail(session.user.email);
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold">User not found.</p>
      </div>
    );
  }

  const isAdmin = user.role === "admin";
  const query = searchParams.query || "";
  const currentPage = Number(searchParams.page) || 1;
  const filters = searchParams.filters ? JSON.parse(searchParams.filters) : {};

  console.log(filters);
  const totalPages = await fetchPaginatedRequest(query);

  const requests = isAdmin
    ? await fetchAllRequests(query, currentPage, filters)
    : await fetchFilteredUserRequests(user.id, query, currentPage, filters);

  const today = new Date();

  async function handleAccept(
    memberId: number,
    bookId: number,
    requestId: number
  ) {
    "use server";

    if (!isAdmin) {
      throw new Error("Unauthorized");
    }
    await updateRequestStatus(
      memberId,
      bookId,
      "success",
      today,
      null,
      requestId
    );
    await updateAvailableBookCopiesOnIssue(bookId);
    revalidatePath("/requests");
  }

  async function handleDecline(
    memberId: number,
    bookId: number,
    requestId: number
  ) {
    "use server";
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }
    await updateRequestStatus(
      memberId,
      bookId,
      "declined",
      null,
      null,
      requestId
    );
    revalidatePath("/requests");
  }

  async function handleReturn(
    memberId: number,
    bookId: number,
    requestId: number
  ) {
    "use server";
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }
    await updateRequestStatusOnReturn(
      memberId,
      bookId,
      "returned",
      today,
      requestId
    );
    await updateAvailableBookCopiesOnReturn(bookId);
    revalidatePath("/requests");
  }

  return (
    <div className="flex h-screen flex-col bg-rose-50">
      <NavBar />
      <div className="flex flex-grow">
        <SideNav />
        <div className="flex flex-col w-full p-4">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Search placeholder="Search Requests..." />
            <RequestFilterComponent />
          </div>
          <div className="flex-grow px-4 overflow-auto bg-white rounded-lg shadow">
            {totalPages === 0 ? (
              <div className="text-center text-gray-500 py-10">
                No Requests found
              </div>
            ) : (
              <div className="flex-grow overflow-auto">
                <Suspense
                  key={query + currentPage + JSON.stringify(filters)}
                  fallback={<TableSkeleton />}
                >
                  <RequestsTable
                    requests={requests}
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                    onReturn={handleReturn}
                  />
                </Suspense>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-center">
            <Pagination totalPages={totalPages} />
          </div>
        </div>
      </div>
    </div>
  );
}
