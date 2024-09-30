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

// Helper function to format the date according to the user's locale
function formatDateToLocale(dateString: string | null, locale: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const validLocale =
    typeof Intl.DateTimeFormat.supportedLocalesOf === "function" &&
    Intl.DateTimeFormat.supportedLocalesOf(locale).length > 0
      ? locale
      : "en-US";

  return new Intl.DateTimeFormat(validLocale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default async function RequestsTable({
  requests,
  onAccept,
  onDecline,
  onReturn,
}: RequestsTableProps) {
  // Fetching session information
  const session = await getServerSession(authOptions);
  const userRole = session?.user.role;
  const isAdmin = userRole === "admin";

  // Fetching translations
  const t = await getTranslations("RequestsTable");

  // Get the user's current locale
  const locale = Intl.DateTimeFormat().resolvedOptions().locale || "en-GB";
  console.log(locale);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
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
                    {t("memberName")}: {request.memberFirstName}
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
                {t("requestDate")}:{" "}
                {formatDateToLocale(request.requestDate, locale)}
              </p>
              <p className="text-sm text-rose-800">
                {t("issuedDate")}:{" "}
                {formatDateToLocale(request.issuedDate, locale)}
              </p>
              <p className="text-sm text-rose-800">
                {t("returnDate")}:{" "}
                {formatDateToLocale(request.returnDate, locale)}
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
                      {request.memberFirstName}
                    </TableCell>
                  )}
                  <TableCell className="font-medium text-rose-800">
                    {request.bookTitle}
                  </TableCell>
                  <TableCell className="font-medium text-rose-800">
                    {formatDateToLocale(request.requestDate, locale)}
                  </TableCell>
                  <TableCell className="font-medium text-rose-800">
                    {formatDateToLocale(request.issuedDate, locale)}
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
                    {formatDateToLocale(request.returnDate, locale)}
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
                        onReturn={onReturn}
                        returnDate={
                          request.returnDate
                            ? request.returnDate.toString()
                            : null
                        }
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
  );
}
