"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function AddStudent() {
  const router = useRouter();

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

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const {
      firstName,
      lastName,
      matricNumber,
      faculty,
      department,
      level,
      email,
      phone,
    } = formData;

    // Basic Validation: Check if any field is empty
    if (
      !firstName ||
      !lastName ||
      !matricNumber ||
      !faculty ||
      !department ||
      !level ||
      !email ||
      !phone
    ) {
      toast.error("Please fill in all fields before saving.");
      return;
    }
    const stored = localStorage.getItem("students");
    const students = stored ? JSON.parse(stored) : [];

    students.push(formData);
    localStorage.setItem("students", JSON.stringify(students));
    toast.success(" student record added suceesfully ");
    router.push("/admin/student-manage");
  };

  return (
    <main className="max-w-6xl mx-auto p-4  space-y-6">
      <header className="flex items-center space-x-2">
        <ArrowLeft
          className="h-5 w-5 cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-lg font-bold">Add Student</h1>
      </header>

      <h2 className=" text-sm font-medium">Enter Student Details</h2>

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
        onChange={(e) => handleChange("matricNumber", e.target.value)}
        className="w-80"
      />

      <Select onValueChange={(val) => handleChange("faculty", val)}>
        <SelectTrigger className="w-80">
          <SelectValue placeholder="Select Faculty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Science">Science</SelectItem>
          <SelectItem value="Arts">Arts</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(val) => handleChange("department", val)}>
        <SelectTrigger className="w-80">
          <SelectValue placeholder="Select Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Computer Science">Computer Science</SelectItem>
          <SelectItem value="Mathematics">Mathematics</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(val) => handleChange("level", val)}>
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
        className=" w-80 bg-indigo-600 text-white hover:bg-indigo-700"
      >
        Save Student
      </Button>
    </main>
  );
}
