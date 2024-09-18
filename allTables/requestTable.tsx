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
import { strict } from "assert";

type Request = {
  id: number;
  memberId: number;
  bookId: number;
  requestDate: Date; // Changed from string to Date
  status: string;
  issuedDate: Date | null; // Changed from string | null to Date | null
  returnDate: Date | null; // Changed from string | null to Date | null
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

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-white shadow-md p-6 border border-rose-200">
          {" "}
          {/* Soft rose border */}
          {/* Mobile view for requests */}
          <div className="md:hidden space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-rose-50 p-4 rounded-lg border border-rose-100 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-rose-200 pb-2 mb-2">
                  {" "}
                  {/* Subtle rose for dividers */}
                  {isAdmin && (
                    <p className="font-medium text-rose-800">
                      {" "}
                      {/* Rose for admin labels */}
                      Member Name:{request.memberFirstName}
                      {request.memberLastName}
                    </p>
                  )}
                  <p className="font-medium text-gray-700">
                    Book Name: {request.bookTitle}
                  </p>
                  <Badge
                    variant="outline"
                    className="text-rose-800 border-rose-400"
                  >
                    {" "}
                    {/* Rose for status */}
                    {request.status}
                  </Badge>
                </div>
                <p className="text-sm text-rose-800">
                  Request Date:{" "}
                  {new Date(request.requestDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-rose-800">
                  Issued Date:{" "}
                  {request.issuedDate
                    ? new Date(request.issuedDate).toLocaleDateString()
                    : "-"}
                </p>
                <p className="text-sm text-rose-800">
                  Return Date:{" "}
                  {request.returnDate
                    ? new Date(request.returnDate).toLocaleDateString()
                    : "-"}
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
                        request.returnDate
                          ? request.returnDate.toString()
                          : null
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
                <TableRow>
                  {isAdmin && (
                    <TableHead className="text-rose-800">Member Name</TableHead>
                  )}{" "}
                  {/* Rose for table headers */}
                  <TableHead className="text-rose-800">Book Name</TableHead>
                  <TableHead className="text-rose-800">Request Date</TableHead>
                  <TableHead className="text-rose-800">Issued Date</TableHead>
                  <TableHead className="text-rose-800">Status</TableHead>
                  <TableHead className="text-rose-800">Return Date</TableHead>
                  {isAdmin && (
                    <TableHead className="text-rose-800">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id} className="hover:bg-rose-50">
                    {" "}
                    {/* Soft hover effect */}
                    {isAdmin && (
                      <TableCell className="font-medium text-rose-800">
                        {request.memberFirstName}
                        {request.memberLastName}
                      </TableCell>
                    )}
                    <TableCell className="font-medium text-rose-800">
                      {request.bookTitle}
                    </TableCell>
                    <TableCell className="font-medium text-rose-800">
                      {new Date(request.requestDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium text-rose-800">
                      {request.issuedDate
                        ? new Date(request.issuedDate).toLocaleDateString()
                        : "NULL"}
                    </TableCell>
                    <TableCell className="font-medium text-rose-800">
                      <Badge
                        variant="outline"
                        className="text-rose-400 border-rose-800"
                      >
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-rose-800">
                      {request.returnDate
                        ? new Date(request.returnDate).toLocaleDateString()
                        : "NULL"}
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
              No book requests found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
