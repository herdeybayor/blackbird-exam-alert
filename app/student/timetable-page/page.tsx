// app/student/timetable/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function TimetablePage() {
  const router = useRouter();

  const sampleExams = [
    {
      id: 1,
      course: "Introduction To Computer Science",
      date: "25-04-2025",
    },
    {
      id: 2,
      course: "Data Structures",
      date: "30-04-2025",
    },
  ];

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Timetable</h1>
      <div className="space-y-4">
        {sampleExams.map((exam) => (
          <div
            key={exam.id}
            className="p-3 border rounded shadow-sm bg-blue-50 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{exam.course}</p>
              <p className="text-sm text-gray-500">{exam.date}</p>
            </div>
            <Button
              onClick={() => router.push(`/student/exams/${exam.id}`)}
              className="text-sm"
            >
              View
            </Button>
          </div>
        ))}
      </div>
    </main>
  );
}
