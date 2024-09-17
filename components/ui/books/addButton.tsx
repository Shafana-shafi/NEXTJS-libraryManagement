"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddButton() {
  const router = useRouter();

  return (
    <button
      className="flex items-center justify-center p-2 bg-rose-800 hover:bg-gray-400 text-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 self-center"
      onClick={() => {
        router.push("/addBook");
      }}
    >
      <Plus className="h-5 w-5" />
    </button>
  );
}
