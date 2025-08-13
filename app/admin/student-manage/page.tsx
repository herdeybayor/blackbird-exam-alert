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
import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin-layout";

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
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Student Management</h1>
            <p className="text-muted-foreground mt-1">Manage student records and information</p>
          </div>
          <Button
            className="bg-indigo-500 hover:bg-indigo-600 text-white flex items-center space-x-2"
            onClick={() => router.push("/admin/add-student")}
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Student</span>
          </Button>
        </header>

        {/* Search and Filters */}
        <div className="space-y-4">
          <Input
            placeholder="Search student name"
            className="max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Faculty</label>
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Level</label>
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
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Students ({filteredStudents.length})</h2>
          <ScrollArea className="h-[600px] pr-2">
            <div className="space-y-4">
              {filteredStudents.map((student, index) => (
                <Card key={index} className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">{student.matricNumber}</p>
                      </div>
                      <div className="flex gap-2">
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
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">Faculty</span>
                        <p className="font-medium">{student.faculty}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Department</span>
                        <p className="font-medium">{student.department}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Level</span>
                        <p className="font-medium">{student.level}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Email</span>
                        <p className="font-medium">{student.email}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium text-muted-foreground">Phone</span>
                        <p className="font-medium">{student.phone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </AdminLayout>
  );
}
