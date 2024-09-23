"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

interface GenreDropdownProps {
  genres: string[];
}

export default function GenreDropdown({ genres }: GenreDropdownProps) {
  const router = useRouter();
  const t = useTranslations("search");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <Select
      onValueChange={(genre) => {
        setSelectedGenre(genre);
        const params = new URLSearchParams(window.location.search);
        if (genre === "all") {
          params.delete("genre");
        } else {
          params.set("genre", genre);
        }
        router.push(`?${params.toString()}`);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <div className="truncate">
          {selectedGenre ? truncateText(selectedGenre, 6) : t("selectGenre")}
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Genres</SelectItem>
        {genres.map((genre) => (
          <SelectItem key={genre} value={genre}>
            {genre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
