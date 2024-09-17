import { authOptions } from "@/lib/authOptions";
import {
  updateAvailableBookCopiesOnIssue,
  updateAvailableBookCopiesOnReturn,
} from "@/repositories/book.repository";
import {
  updateRequestStatus,
  updateRequestStatusOnReturn,
} from "@/repositories/request.repository";
import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";

const today = new Date();
const session = await getServerSession(authOptions);

const isAdmin = session?.user.role === "admin";

export async function handleAccept(
  memberId: number,
  bookId: number,
  requestId: number
) {
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

export async function handleDecline(
  memberId: number,
  bookId: number,
  requestId: number
) {
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

export async function handleReturn(
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
