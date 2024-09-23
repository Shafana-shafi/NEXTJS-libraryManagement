// File: app/[locale]/components/requestsTable.tsx

"use server";
import { Badge } from "@/components/ui/badge";
import { getServerSession } from "next-auth/next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RequestActionButtons } from "./requestActionButtons";
import { authOptions } from "@/lib/authOptions";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

type Request = {
  id: number;
  memberId: number;
  bookId: number;
  requestDate: string;
  status: string;
  issuedDate: string | null;
  returnDate: string | null;
  memberFirstName: string;
  memberLastName: string;
  bookTitle: string;
};

interface RequestsTableProps {
  requests: Request[];
  onAccept: (
    memberId: number,
    bookId: number,
    requestId: number
  ) => Promise<void>;
  onDecline: (
    memberId: number,
    bookId: number,
    requestId: number
  ) => Promise<void>;
  onReturn: (
    memberId: number,
    bookId: number,
    requestId: number
  ) => Promise<void>;
}

export default async function RequestsTable({
  requests,
  onAccept,
  onDecline,
  onReturn,
}: RequestsTableProps) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user.role;
  const isAdmin = userRole === "admin";
  const t = await getTranslations("RequestsTable");

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        {/* <div className="rounded-lg bg-white shadow-md p-6 border border-rose-200"> */}
        {/* Mobile view for requests */}
        <div className="md:hidden space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-rose-50 p-4 rounded-lg border border-rose-100 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-rose-200 pb-2 mb-2">
                {isAdmin && (
                  <p className="font-medium text-rose-800">
                    {t("memberName")}: {request.memberFirstName}{" "}
                    {request.memberLastName}
                  </p>
                )}
                <p className="font-medium text-rose-700">
                  {t("bookName")}: {request.bookTitle}
                </p>
                <Badge
                  variant="outline"
                  className="text-rose-800 border-rose-400"
                >
                  {t(request.status)}
                </Badge>
              </div>
              <p className="text-sm text-rose-800">
                {t("requestDate")}: {request.requestDate}
              </p>
              <p className="text-sm text-rose-800">
                {t("issuedDate")}: {request.issuedDate}
              </p>
              <p className="text-sm text-rose-800">
                {t("returnDate")}: {request.returnDate}
              </p>
              {isAdmin && (
                <div className="mt-2">
                  <RequestActionButtons
                    requestId={request.id}
                    memberId={request.memberId}
                    bookId={request.bookId}
                    status={request.status}
                    onAccept={onAccept}
                    onDecline={onDecline}
                    onReturn={onReturn}
                    returnDate={
                      request.returnDate ? request.returnDate.toString() : null
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Desktop view for requests */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="bg-rose-100">
                {isAdmin && (
                  <TableHead className="text-rose-900 font-bold py-3">
                    {t("memberName")}
                  </TableHead>
                )}
                <TableHead className="text-rose-900 font-bold py-3">
                  {t("bookName")}
                </TableHead>
                <TableHead className="text-rose-900 font-bold py-3">
                  {t("requestDate")}
                </TableHead>
                <TableHead className="text-rose-900 font-bold py-3">
                  {t("issuedDate")}
                </TableHead>
                <TableHead className="text-rose-900 font-bold py-3">
                  {t("status")}
                </TableHead>
                <TableHead className="text-rose-900 font-bold py-3">
                  {t("returnDate")}
                </TableHead>
                {isAdmin && (
                  <TableHead className="text-rose-900 font-bold py-3">
                    {t("actions")}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id} className="hover:bg-rose-50">
                  {isAdmin && (
                    <TableCell className="font-medium text-rose-800">
                      {request.memberFirstName} {request.memberLastName}
                    </TableCell>
                  )}
                  <TableCell className="font-medium text-rose-800">
                    {request.bookTitle}
                  </TableCell>
                  <TableCell className="font-medium text-rose-800">
                    {request.requestDate}
                  </TableCell>
                  <TableCell className="font-medium text-rose-800">
                    {request.issuedDate}
                  </TableCell>
                  <TableCell className="font-medium text-rose-800">
                    <Badge
                      variant="outline"
                      className="text-rose-800 border-rose-800"
                    >
                      {t(request.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-rose-800">
                    {request.returnDate}
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <RequestActionButtons
                        requestId={request.id}
                        memberId={request.memberId}
                        bookId={request.bookId}
                        status={request.status}
                        onAccept={onAccept}
                        onDecline={onDecline}
                        returnDate={
                          request.returnDate
                            ? request.returnDate.toString()
                            : null
                        }
                        onReturn={onReturn}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* No requests message */}
        {requests.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            {t("noRequestsFound")}
          </p>
        )}
      </div>
    </div>
    // </div>
  );
}
