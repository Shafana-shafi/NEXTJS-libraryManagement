import { fetchFilteredBooks } from "@/lib/actions";
import BookCard from "./bookCard";

export default async function Books({
  query,
  currentPage,
  genre,
}: {
  query: string;
  currentPage: number;
  genre: string;
}) {
  const books = await fetchFilteredBooks(query, currentPage, genre);
  if (books.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-8">
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
          />
        ))}
      </div>
    </div>
  );
}
