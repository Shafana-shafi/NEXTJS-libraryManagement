// File: app/[locale]/components/overdueRequestsTable.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";

type OverdueRequest = {
  id: number;
  memberId: number;
  bookId: number;
  requestDate: string;
  issuedDate: string | null;
  returnDate: string | null;
  status: string;
  memberFirstName: string;
  memberLastName: string;
  bookTitle: string;
  daysOverdue: number;
  memberEmail: string;
};

interface OverdueRequestsTableProps {
  requests: OverdueRequest[];
  adminEmail: string;
}

export default function OverdueRequestsTable({
  requests,
  adminEmail,
}: OverdueRequestsTableProps) {
  const t = useTranslations("OverdueRequestsTable");

  const sendReminderEmail = (request: OverdueRequest) => {
    const subject = t("reminderEmailSubject", { bookTitle: request.bookTitle });
    const body = t("reminderEmailBody", {
      firstName: request.memberFirstName,
      lastName: request.memberLastName,
      bookTitle: request.bookTitle,
      issuedDate: request.issuedDate,
      daysOverdue: request.daysOverdue,
    });

    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${
      request.memberEmail
    }&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      body
    )}&bcc=${adminEmail}`;
    window.open(mailtoLink, "_blank");
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-rose-700 text-white">
            <TableHead className="font-semibold py-3">
              {t("memberName")}
            </TableHead>
            <TableHead className="font-semibold py-3">
              {t("bookTitle")}
            </TableHead>
            <TableHead className="font-semibold py-3">
              {t("issuedDate")}
            </TableHead>
            <TableHead className="font-semibold py-3">
              {t("daysOverdue")}
            </TableHead>
            <TableHead className="font-semibold py-3">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id} className="hover:bg-rose-50">
              <TableCell className="font-medium text-rose-800">
                {request.memberFirstName} {request.memberLastName}
              </TableCell>
              <TableCell className="text-rose-700">
                {request.bookTitle}
              </TableCell>
              <TableCell className="text-rose-700">
                {request.issuedDate}
              </TableCell>
              <TableCell>
                <span className="px-2 py-1 rounded-full bg-rose-100 text-rose-800 font-medium">
                  {t("daysOverdueCount", { count: request.daysOverdue })}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  className="bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-4 rounded flex items-center"
                  onClick={() => sendReminderEmail(request)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {t("sendReminder")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {requests.length === 0 && (
        <p className="text-center text-rose-500 py-4">
          {t("noOverdueRequestsFound")}
        </p>
      )}
    </div>
  );
}
