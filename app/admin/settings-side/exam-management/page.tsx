"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const mockExams = [
  {
    id: 1,
    title: "Introduction to Computer Science",
    code: "20250112",
    department: "Computer Science",
    faculty: "Science",
    level: "100 Level",
    date: "25-04-2025",
    time: "11:30 PM",
    venue: "3 in 1 Hall",
  },
  // You can add more mock data if needed
];

export default function ExamManagementPage() {
  const router = useRouter();
  const [exams] = useState(mockExams);

  return (
    <main className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">📋 Exam Schedule Management</h2>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          onClick={() => router.push("/admin/settings-side/add-exam")}
        >
          ➕ Add Exam
        </button>
      </div>

      <input
        type="text"
        placeholder="Search course title"
        className="w-full p-2 border rounded"
      />

      {exams.map((exam) => (
        <div key={exam.id} className="border rounded p-4 shadow space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">{exam.title}</h3>
            <div className="space-x-2">
              <button
                className="text-blue-600"
                onClick={() => router.push("/admin/settings-side/edit-exam")}
              >
                Edit
              </button>
              <button
                className="text-red-600"
                onClick={() => router.push(`/admin/delete-exam?id=${exam.id}`)}
              >
                Delete
              </button>
            </div>
          </div>
          <p>Course Code: {exam.code}</p>
          <p>Department: {exam.department}</p>
          <p>Faculty: {exam.faculty}</p>
          <p>Level: {exam.level}</p>
          <p>Exam Date: {exam.date}</p>
          <p>Exam Time: {exam.time}</p>
          <p>Exam Venue: {exam.venue}</p>
        </div>
      ))}
    </main>
  );
}
