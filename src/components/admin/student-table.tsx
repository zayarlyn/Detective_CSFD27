"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { House } from "@/lib/constants/houses";

interface Student {
  id: string;
  name: string;
  email: string;
  house: House | null;
  score: number;
}

interface StudentTableProps {
  students: Student[];
  className?: string;
}

export function StudentTable({ students, className }: StudentTableProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800", className)}>
      <table className="w-full text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-zinc-500">Name</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-500">Email</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-500">House</th>
            <th className="px-4 py-3 text-right font-medium text-zinc-500">Score</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
              <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">{student.name}</td>
              <td className="px-4 py-3 text-zinc-500">{student.email}</td>
              <td className="px-4 py-3">
                {student.house ? (
                  <Badge variant={student.house} className="capitalize">{student.house}</Badge>
                ) : (
                  <span className="text-zinc-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-right font-medium text-zinc-900 dark:text-zinc-50">
                {student.score}
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-zinc-400">
                No students yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
