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

export interface Request {
  id: number;
  memberId: number;
  bookId: number;
  issuedDate: Date | null;
  requestDate: Date;
  returnDate: Date | null;
  status: string;
}

interface RequestsTableProps {
  requests: Request[];
  onAccept: (memberId: number, bookId: number) => Promise<void>;
  onDecline: (memberId: number, bookId: number) => Promise<void>;
  onReturn: (memberId: number, bookId: number) => Promise<void>;
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
        <div className="rounded-lg bg-white shadow-md p-6 border border-gray-200">
          {/* <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            {isAdmin ? "Book Requests" : "Your Book Requests"}
          </h2> */}

          {/* Mobile view for requests */}
          <div className="md:hidden space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2">
                  {isAdmin && (
                    <p className="font-medium text-gray-700">
                      Member ID: {request.memberId}
                    </p>
                  )}
                  <p className="font-medium text-gray-700">
                    Book ID: {request.bookId}
                  </p>
                  <Badge variant="outline">{request.status}</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Request Date:{" "}
                  {new Date(request.requestDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Issued Date:{" "}
                  {request.issuedDate
                    ? new Date(request.issuedDate).toLocaleDateString()
                    : "-"}
                </p>
                <p className="text-sm text-gray-600">
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
                      returnDate={request.requestDate}
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
                  {isAdmin && <TableHead>Member ID</TableHead>}
                  <TableHead>Book ID</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Issued Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Return Date</TableHead>
                  {isAdmin && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    {isAdmin && (
                      <TableCell className="font-medium">
                        {request.memberId}
                      </TableCell>
                    )}
                    <TableCell className="font-medium">
                      {request.bookId}
                    </TableCell>
                    <TableCell>
                      {new Date(request.requestDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {request.issuedDate
                        ? new Date(request.issuedDate).toLocaleDateString()
                        : "NULL"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{request.status}</Badge>
                    </TableCell>
                    <TableCell>
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
                          returnDate={request.returnDate}
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
