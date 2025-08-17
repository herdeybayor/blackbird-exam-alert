"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";

interface ExamFormData {
  courseTitle: string;
  courseCode: string;
  faculty: string;
  department: string;
  level: string;
  email: string;
  examDate: string;
  examTime: string;
  venue: string;
  id?: number; // optional for new exams
}

// ✅ This should ideally come from a global store or API
const mockExams = [
  {
    id: 1,
    title: "Introduction to Computer Science",
    code: "210",
    department: "Computer Science",
    faculty: "Science",
    level: "100 Level",
    date: "2025-04-25",
    time: "11:30",
    venue: "3 in 1 Hall",
    email: "bulalab@school.ng",
  },
  {
    id: 2,
    title: "Data Structures and Algorithms",
    code: "202",
    department: "Computer Science",
    faculty: "Science",
    level: "200 Level",
    date: "2025-04-27",
    time: "09:00",
    venue: "ICT Hall",
    email: "algo@school.ng",
  },
];

export default function EditExamPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examId = Number(searchParams.get("id"));

  const [formData, setFormData] = useState<ExamFormData | null>(null);

  // ✅ Load correct exam when page loads
  useEffect(() => {
    const exam = mockExams.find((e) => e.id === examId);
    if (exam) {
      setFormData({
        courseTitle: exam.title,
        courseCode: exam.code,
        faculty: exam.faculty,
        department: exam.department,
        level: exam.level,
        email: exam.email,
        examDate: exam.date,
        examTime: exam.time,
        venue: exam.venue,
      });
    }
  }, [examId]);

  if (!formData) return <p className="p-4">Loading exam...</p>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // get current exams from localStorage
    const storedExams = localStorage.getItem("exams");
    const exams = storedExams ? JSON.parse(storedExams) : mockExams;

    // update the right exam
    const updatedExams = exams.map((exam: ExamFormData) =>
      exam.id === examId
        ? {
            ...exam,
            title: formData.courseTitle,
            code: formData.courseCode,
            faculty: formData.faculty,
            department: formData.department,
            level: formData.level,
            email: formData.email,
            date: formData.examDate,
            time: formData.examTime,
            venue: formData.venue,
          }
        : exam
    );

    // save back to localStorage
    localStorage.setItem("exams", JSON.stringify(updatedExams));

    toast.success("Exam updated successfully!");
    router.push("/admin/exam-management");
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h2 className="text-xl font-semibold mb-1">Edit Exam</h2>
        <p className="text-sm text-gray-500 mb-4">Edit Exam Schedule</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Course Title
            </label>
            <input
              type="text"
              name="courseTitle"
              value={formData.courseTitle}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Course Code
            </label>
            <input
              type="text"
              name="courseCode"
              value={formData.courseCode}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Faculty</label>
            <select
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option>Faculty of Science</option>
              <option>Faculty of Arts</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option>Computer Science Department</option>
              <option>Mathematics Department</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Level</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option>100 Level</option>
              <option>200 Level</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Exam Date
              </label>
              <div className="flex items-center border rounded p-2">
                <Calendar className="w-4 h-4 mr-2" />
                <input
                  type="date"
                  name="examDate"
                  value={formData.examDate}
                  onChange={handleChange}
                  className="w-full outline-none"
                />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Exam Time
              </label>
              <div className="flex items-center border rounded p-2">
                <Clock className="w-4 h-4 mr-2" />
                <input
                  type="time"
                  name="examTime"
                  value={formData.examTime}
                  onChange={handleChange}
                  className="w-full outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Exam Venue</label>
            <select
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option>3 in 1 Hall</option>
              <option>Main Auditorium</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-90 bg-black text-center block mx-auto text-white py-2 rounded mt-4"
          >
            Save Exam
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
