import { fetchFilteredBooksForUsers } from "@/lib/actions";
import BookCard from "./bookCard";
import { createRequest } from "@/repositories/request.repository";
import { revalidatePath } from "next/cache";

export default async function Books({
  query,
  currentPage,
  genre,
  memberId,
}: {
  query: string;
  currentPage: number;
  genre: string;
  memberId: number;
}) {
  const books = await fetchFilteredBooksForUsers(query, currentPage, genre);
  if (books.length === 0) return null;

  async function handleCreateRequest(bookId: number) {
    "use server";
    try {
      const request = {
        bookId: bookId,
        memberId: memberId,
        requestDate: new Date(),
        issuedDate: null,
        returnDate: null,
        status: "requested",
      };
      await createRequest(request);
      revalidatePath("/userBooks");
      return { success: true, message: "Book request submitted successfully." };
    } catch (error) {
      console.error("Error requesting book:", error);
      return { success: false, message: "Failed to submit book request." };
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-rose-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books?.map((book) => (
          <BookCard
            key={book.id}
            id={book.id}
            title={book.title}
            author={book.author}
            publisher={book.publisher}
            genre={book.genre}
            availableCopies={book.availableCopies}
            price={book.price}
            onCreateRequest={handleCreateRequest}
            imageUrl={book.imgUrl}
          />
        ))}
      </div>
    </div>
  );
}
