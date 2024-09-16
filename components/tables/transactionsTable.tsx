import { fetchFilteredTransactions } from "@/repositories/request.repository";
import { getAllTransactionsByMember } from "@/repositories/request.repository";
import { getUserById, getUserByName } from "@/repositories/user.repository";
import { getBookById } from "@/repositories/book.repository";
import { CalendarIcon, BookOpenIcon, UserIcon } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function TransactionsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user.role;
  const memberId = Number(session?.user.id);
  let transactions;
  if (userRole === "admin") {
    transactions = await fetchFilteredTransactions(query, currentPage);
  } else {
    transactions = await getAllTransactionsByMember(
      memberId,
      query,
      currentPage
    );
  }

  console.log(transactions);

  const transactionsWithDetails = await Promise.all(
    transactions.map(async (transaction) => {
      let memberName = "";
      let bookTitle = "";

      if ("memberFirstName" in transaction && "memberLastName" in transaction) {
        const member = await getUserByName(
          transaction.memberFirstName,
          transaction.memberLastName
        );
        memberName = `${member?.firstName || ""} ${
          member?.lastName || ""
        }`.trim();
        bookTitle = transaction.bookTitle;
      } else if ("bookId" in transaction && "memberId" in transaction) {
        const member = await getUserById(9);
        const book = await getBookById(9);
        memberName = `${member?.firstName || ""} ${
          member?.lastName || ""
        }`.trim();
        bookTitle = book.title;
      }

      return {
        ...transaction,
        memberName,
        bookTitle,
      };
    })
  );

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {userRole === "admin" && (
              <TableHead className="w-[200px]">Member Name</TableHead>
            )}
            <TableHead>Book Title</TableHead>
            <TableHead>Borrow Date</TableHead>
            <TableHead>Return Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactionsWithDetails.map((transaction) => (
            <TableRow key={transaction.id}>
              {userRole === "admin" && (
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{transaction.memberName}</span>
                  </div>
                </TableCell>
              )}
              <TableCell>
                <div className="flex items-center">
                  <BookOpenIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{transaction.bookTitle}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{transaction.issuedDate?.toLocaleDateString()}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    {transaction.returnDate
                      ? transaction.returnDate.toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
