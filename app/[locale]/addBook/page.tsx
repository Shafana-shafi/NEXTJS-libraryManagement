import AddBookForm from "@/components/ui/books/addBookForm";
import { createBook } from "@/repositories/book.repository";
import NavBar from "@/ui/components/navBar";
import SideNav from "@/ui/components/sidenav";

export default function AddBookPage() {
  return (
    <div className="flex h-screen flex-col">
      <NavBar />
      <div className="flex flex-grow">
        <SideNav />
        <div className="flex flex-col w-full p-4 justify-center">
          <AddBookForm />
        </div>
      </div>
    </div>
  );
}
