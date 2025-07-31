"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { X } from "lucide-react";
type Student = {
  firstName: string;
  lastName: string;
  matricNumber: string;
  faculty: string;
  department: string;
  level: string;
  email: string;
  phone: string;
};

export default function DeleteStudent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matricParam = searchParams.get("matric");

  const handleDelete = () => {
    const stored = localStorage.getItem("students");
    if (!stored || !matricParam) return;

    const allStudents = JSON.parse(stored);
    const updatedStudents = allStudents.filter(
      (student: Student) => student.matricNumber !== matricParam
    );

    localStorage.setItem("students", JSON.stringify(updatedStudents));
    toast.success("Student record deleted successfully.");
    router.push("/admin/student-manage");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white/50 backdrop-blur-sm">
      <div className="bg-white rounded-md shadow-lg p-6 w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          onClick={() => router.back()}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-center text-lg font-semibold mb-2">
          Delete Student
        </h2>
        <p className="text-center text-sm text-gray-700 mb-6">
          Are you sure you want to delete this student?
        </p>

        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            className="w-32"
            onClick={() => router.back()}
          >
            No, Go Back
          </Button>
          <Button
            className="w-32 bg-red-500 hover:bg-red-600 text-white"
            onClick={handleDelete}
          >
            Yes, Delete
          </Button>
        </div>
      </div>
    </main>
  );
}
