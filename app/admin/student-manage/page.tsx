"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { MenuIcon, UserPlus, User } from "lucide-react";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

interface Student {
  firstName: string;
  lastName: string;
  matricNumber: string;
  faculty: string;
  department: string;
  level: string;
  email: string;
  phone: string;
}

export default function StudentManage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedStudents = localStorage.getItem("students");
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    } else {
      const initialData: Student[] = [
        {
          firstName: "Jane",
          lastName: "Bulaba",
          matricNumber: "20250112",
          faculty: "Science",
          department: "Computer Science",
          level: "200 Level",
          email: "janebulabu@school.ng",
          phone: "+234 801 2345 678",
        },
      ];
      setStudents(initialData);
      localStorage.setItem("students", JSON.stringify(initialData));
    }
  }, []);

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <main className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header with Menu and User Icon */}
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MenuIcon className="h-6 w-6" />
          <h1 className="text-lg font-bold">Student Management</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full flex items-center space-x-2"
            onClick={() => router.push("/admin/add-student")}
          >
            {/* UserPlus icon inside button */}
            <UserPlus className="h-4 w-4" />
            <span>Add Student</span>
          </Button>
          {/* User icon at top right */}
          <User className="h-6 w-6 text-gray-600" />
        </div>
      </header>

      {/* Search and Filters */}
      <div className="space-y-4">
        <Input
          placeholder="Search student name"
          className="rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm">Faculty</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="Arts">Arts</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm">Department</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Computer Science">
                  Computer Science
                </SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm">Level</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100">100 Level</SelectItem>
                <SelectItem value="200">200 Level</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Student Cards */}
      <ScrollArea className="h-[400px] pr-2">
        <div className="space-y-4">
          {filteredStudents.map((student, index) => (
            <Card key={index} className="bg-blue-50">
              <CardContent className="p-4">
                <div className="flex justify-end gap-2 mb-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      router.push(
                        `/admin/edit-student?matric=${student.matricNumber}`
                      )
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      router.push(
                        `/admin/delete-student?matric=${student.matricNumber}`
                      )
                    }
                  >
                    Delete
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <p>
                    <span className="font-medium">First Name</span>
                    <br />
                    {student.firstName}
                  </p>
                  <p>
                    <span className="font-medium">Last Name</span>
                    <br />
                    {student.lastName}
                  </p>
                  <p>
                    <span className="font-medium">Matric Number</span>
                    <br />
                    {student.matricNumber}
                  </p>
                  <p>
                    <span className="font-medium">Faculty</span>
                    <br />
                    {student.faculty}
                  </p>
                  <p>
                    <span className="font-medium">Department</span>
                    <br />
                    {student.department}
                  </p>
                  <p>
                    <span className="font-medium">Level</span>
                    <br />
                    {student.level}
                  </p>
                  <p>
                    <span className="font-medium">Email Address</span>
                    <br />
                    {student.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone Number</span>
                    <br />
                    {student.phone}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </main>
  );
}
