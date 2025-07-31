// app/student/exams/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const mockExamData = {
  1: {
    course: "Introduction To Computer Science",
    code: "CSC101",
    department: "Computer Science",
    faculty: "Science",
    level: "100 Level",
    date: "25-04-2025",
    time: "11:30 PM",
    venue: "3 in 1 Hall",
  },
  2: {
    course: "Data Structures",
    code: "CSC201",
    department: "Computer Science",
    faculty: "Science",
    level: "200 Level",
    date: "30-04-2025",
    time: "2:00 PM",
    venue: "3 in 1 Hall",
  },
};

export default function ExamDetailsPage() {
  const rawId = useParams().id;

  if (!rawId) {
    return <p>Invalid exam ID</p>; // or use `notFound()` in Next.js 13+
  }

  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const numericId = parseInt(id);
  const exam = mockExamData[numericId as 1 | 2];

  const handleSetReminder = () => {
    const current = localStorage.getItem("reminders");
    const parsed = current ? JSON.parse(current) : [];

    parsed.push({
      id: Date.now(),
      course: `${exam.code} ${exam.course}`,
      date: exam.date,
      time: exam.time,
    });

    localStorage.setItem("reminders", JSON.stringify(parsed));
    toast.success("You have successfully set a reminder for this exam!");
  };

  return (
    <main className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-lg font-bold text-indigo-600">{exam.course}</h2>
      <div className="bg-gray-100 rounded p-4 space-y-1 text-sm">
        <p>
          <strong>Course Code:</strong> {exam.code}
        </p>
        <p>
          <strong>Department:</strong> {exam.department}
        </p>
        <p>
          <strong>Faculty:</strong> {exam.faculty}
        </p>
        <p>
          <strong>Level:</strong> {exam.level}
        </p>
        <p>
          <strong>Exam Date:</strong> {exam.date}
        </p>
        <p>
          <strong>Exam Time:</strong> {exam.time}
        </p>
        <p>
          <strong>Exam Venue:</strong> {exam.venue}
        </p>
      </div>
      <Button
        className="bg-indigo-600 text-white w-full"
        onClick={handleSetReminder}
      >
        Set Exam Reminder
      </Button>
    </main>
  );
}
