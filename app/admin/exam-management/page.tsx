"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { useEffect } from "react";

const mockExams = [
  {
    id: 1,
    title: "Introduction to Computer Science",
    code: "210",
    department: "Computer Science",
    faculty: "Science",
    level: "100 Level",
    date: "25-04-2025",
    time: "11:30 AM",
    venue: "3 in 1 Hall",
  },
  {
    id: 2,
    title: "Data Structures and Algorithms",
    code: "202",
    department: "Computer Science",
    faculty: "Science",
    level: "200 Level",
    date: "27-04-2025",
    time: "09:00 AM",
    venue: "ICT Hall",
  },
  {
    id: 3,
    title: "Database Management Systems",
    code: "208",
    department: "Information Systems",
    faculty: "Science",
    level: "300 Level",
    date: "29-04-2025",
    time: "02:00 PM",
    venue: "Lab 2",
  },
  {
    id: 4,
    title: "Artificial Intelligence",
    code: "204",
    department: "Computer Science",
    faculty: "Science",
    level: "400 Level",
    date: "02-05-2025",
    time: "10:00 AM",
    venue: "Auditorium",
  },
];

// Load exams from localStorage if available

export default function ExamManagementPage() {
  const router = useRouter();
  const [exams, setExams] = useState(mockExams);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedExams = localStorage.getItem("exams");
    if (storedExams) {
      setExams(JSON.parse(storedExams));
    } else {
      localStorage.setItem("exams", JSON.stringify(mockExams)); // first-time seed
    }
  }, []);
  // Filter exams based on search term
  const filteredExams = exams.filter((exam) =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete with confirmation
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this exam?")) {
      const updated = exams.filter((exam) => exam.id !== id);
      setExams(updated);
      localStorage.setItem("exams", JSON.stringify(updated));
    }
  };

  return (
    <AdminLayout>
      <main className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Exam Schedule Management</h2>
          <button
            className="bg-black text-white px-4 py-2 rounded "
            onClick={() => router.push("/admin/exam-management/add-exam")}
          >
            Add Exam
          </button>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search course title"
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Exams List */}
        {filteredExams.map((exam) => (
          <div key={exam.id} className="border rounded p-4 shadow space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">{exam.title}</h3>
              <div className="space-x-2">
                <button
                  className="text-blue-600"
                  onClick={() =>
                    router.push(
                      `/admin/exam-management/edit-exam?id=${exam.id}`
                    )
                  }
                >
                  Edit
                </button>

                <button
                  className="text-red-600"
                  onClick={() => handleDelete(exam.id)}
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

        {/* If no match found */}
        {filteredExams.length === 0 && (
          <p className="text-gray-500">No exams found.</p>
        )}
      </main>
    </AdminLayout>
  );
}
