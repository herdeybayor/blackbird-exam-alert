"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin-layout";

export default function AddExamPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    faculty: "",
    department: "",
    level: "",
    email: "",
    date: "",
    time: "",
    venue: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get existing exams from localStorage
    const storedExams = localStorage.getItem("exams");
    const exams = storedExams ? JSON.parse(storedExams) : [];

    // Create a new exam object
    const newExam = {
      id: Date.now(), // unique ID
      title: formData.title,
      code: formData.code,
      faculty: formData.faculty,
      department: formData.department,
      level: formData.level,
      email: formData.email,
      date: formData.date,
      time: formData.time,
      venue: formData.venue,
    };

    // Save back to localStorage
    const updatedExams = [...exams, newExam];
    localStorage.setItem("exams", JSON.stringify(updatedExams));

    toast.success("Exam created successfully!");

    router.push("/admin/exam-management");
  };

  return (
    <AdminLayout>
      <main className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Add Exam</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            onChange={handleChange}
            placeholder="Course Title"
            className="w-full p-2 border rounded"
          />
          <input
            name="code"
            onChange={handleChange}
            placeholder="Course Code"
            className="w-full p-2 border rounded"
          />

          <select
            name="faculty"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Faculty</option>
            <option value="Science">Science</option>
          </select>

          <select
            name="department"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Department</option>
            <option value="Computer Science">Computer Science</option>
          </select>

          <select
            name="level"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Level</option>
            <option value="100 Level">100 Level</option>
          </select>

          <input
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full p-2 border rounded"
          />

          <div className="flex gap-2">
            <input
              name="date"
              type="date"
              onChange={handleChange}
              className="w-1/2 p-2 border rounded"
            />
            <input
              name="time"
              type="time"
              onChange={handleChange}
              className="w-1/2 p-2 border rounded"
            />
          </div>

          <select
            name="venue"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Venue</option>
            <option value="3 in 1 Hall">3 in 1 Hall</option>
          </select>

          <button
            type="submit"
            className="w-90 bg-black text-white p-2 rounded mx-auto block text-center"
          >
            Create Exam
          </button>
        </form>
      </main>
    </AdminLayout>
  );
}
