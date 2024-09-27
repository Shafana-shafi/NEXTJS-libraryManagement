"use client";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

interface AddButtonProps {
  buttonFor: string; // Renamed from 'for'
}

export default function AddButton({ buttonFor }: AddButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    const route = buttonFor === "book" ? "/addBook" : "/addProfessor";
    router.push(route);
  };

  return (
    <button
      className="flex items-center justify-center p-2 bg-rose-800 hover:bg-gray-400 text-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 self-center"
      onClick={handleClick}
    >
      <Plus className="h-5 w-5" />
    </button>
  );
}
