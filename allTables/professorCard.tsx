"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Professor {
  id: number;
  name: string;
  department: string;
  bio: string | null;
}

interface ProfessorCardProps {
  professor: Professor;
}

export default function ProfessorCard({ professor }: ProfessorCardProps) {
  return (
    <Card className="flex flex-col h-full p-4 rounded-lg shadow-lg bg-white">
      <div className="flex-grow">
        <h3 className="text-lg font-bold mb-1 text-rose-800">
          {professor.name}
        </h3>
        <p className="text-sm text-rose-600 mb-2">{professor.department}</p>
        <p className="text-sm mb-4 text-rose-700">{professor.bio}</p>
      </div>
      <Link href={`/professors/${professor.id}`} passHref>
        <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white">
          Schedule Meeting
        </Button>
      </Link>
    </Card>
  );
}
