"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
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

export default function EditStudent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matricParam = searchParams.get("matric");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    matricNumber: "",
    faculty: "",
    department: "",
    level: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("students");
    if (stored && matricParam) {
      const allStudents = JSON.parse(stored) as Student[];
      const student = allStudents.find(
        (s: Student) => s.matricNumber === matricParam
      );
      if (student) {
        setFormData(student);
      }
    }
  }, [matricParam]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const stored = localStorage.getItem("students");
    if (!stored) return;

    const allStudents = JSON.parse(stored);
    const index = allStudents.findIndex(
      (s: Student) => s.matricNumber === matricParam
    );

    if (index !== -1) {
      allStudents[index] = formData;
      localStorage.setItem("students", JSON.stringify(allStudents));
      toast.success("Student record saved successfully.");
      router.push("/admin/student-manage");
    } else {
      toast.error("Student not found.");
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-4 space-y-6">
      <header className="flex items-center space-x-2">
        <ArrowLeft
          className="h-5 w-5 cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-lg font-bold">Edit Student</h1>
      </header>

      <h2 className="text-sm font-medium">Edit Student Details</h2>

      <Input
        placeholder="First Name"
        value={formData.firstName}
        onChange={(e) => handleChange("firstName", e.target.value)}
        className="w-80"
      />
      <Input
        placeholder="Last Name"
        value={formData.lastName}
        onChange={(e) => handleChange("lastName", e.target.value)}
        className="w-80"
      />
      <Input
        placeholder="Matric Number"
        value={formData.matricNumber}
        readOnly
        className="w-80 bg-gray-100"
      />

      <Select
        value={formData.faculty}
        onValueChange={(val) => handleChange("faculty", val)}
      >
        <SelectTrigger className="w-80">
          <SelectValue placeholder="Select Faculty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Science">Science</SelectItem>
          <SelectItem value="Arts">Arts</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={formData.department}
        onValueChange={(val) => handleChange("department", val)}
      >
        <SelectTrigger className="w-80">
          <SelectValue placeholder="Select Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Computer Science">Computer Science</SelectItem>
          <SelectItem value="Mathematics">Mathematics</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={formData.level}
        onValueChange={(val) => handleChange("level", val)}
      >
        <SelectTrigger className="w-80">
          <SelectValue placeholder="Select Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="100 Level">100 Level</SelectItem>
          <SelectItem value="200 Level">200 Level</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Email Address"
        value={formData.email}
        onChange={(e) => handleChange("email", e.target.value)}
        className="w-80"
      />
      <Input
        placeholder="Phone Number"
        value={formData.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
        className="w-80"
      />

      <Button
        onClick={handleSubmit}
        className="w-80 bg-indigo-600 text-white hover:bg-indigo-700"
      >
        Save Student
      </Button>
    </main>
  );
}
