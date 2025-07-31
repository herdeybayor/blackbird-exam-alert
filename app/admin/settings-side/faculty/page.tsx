"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react"; // at the top

export default function FacultyPage() {
  const [faculties, setFaculties] = useState([
    {
      name: "",
      departments: [""],
    },
  ]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [activeForm, setActiveForm] = useState<
    null | "add-faculty" | "add-department" | "edit-faculty" | "edit-department"
  >(null);
  const [selectedFacultyIndex, setSelectedFacultyIndex] = useState<
    number | null
  >(null);
  const [selectedDepartmentIndex, setSelectedDepartmentIndex] = useState<
    number | null
  >(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const storedFaculties = localStorage.getItem("faculties");
    if (storedFaculties) {
      setFaculties(JSON.parse(storedFaculties));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("faculties", JSON.stringify(faculties));
  }, [faculties]);
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-5xl text-center">Loading...</h1>
      </div>
    );

  const handleAddFaculty = () => {
    if (!inputValue.trim()) return;
    setFaculties([...faculties, { name: inputValue, departments: [] }]);
    setInputValue("");
    setActiveForm(null);
  };

  const handleAddDepartment = () => {
    if (
      selectedFacultyIndex === null ||
      !inputValue.trim() ||
      selectedFacultyIndex >= faculties.length
    )
      return;
    const newFaculties = [...faculties];
    newFaculties[selectedFacultyIndex].departments.push(inputValue);
    setFaculties(newFaculties);
    setInputValue("");
    setActiveForm(null);
  };

  const handleDeleteFaculty = (index: number) => {
    const updated = faculties.filter((_, i) => i !== index);
    setFaculties(updated);
  };

  const handleDeleteDepartment = (facultyIndex: number, deptIndex: number) => {
    const updated = [...faculties];
    updated[facultyIndex].departments.splice(deptIndex, 1);
    setFaculties(updated);
  };

  const handleEditFaculty = () => {
    if (selectedFacultyIndex === null || !inputValue.trim()) return;
    const updated = [...faculties];
    updated[selectedFacultyIndex].name = inputValue;
    setFaculties(updated);
    setActiveForm(null);
    setInputValue("");
  };

  const handleEditDepartment = () => {
    if (
      selectedFacultyIndex === null ||
      selectedDepartmentIndex === null ||
      !inputValue.trim()
    )
      return;
    const updated = [...faculties];
    updated[selectedFacultyIndex].departments[selectedDepartmentIndex] =
      inputValue;
    setFaculties(updated);
    setActiveForm(null);
    setInputValue("");
  };

  return (
    <main className="max-w-6xl mx-auto p-4  space-y-6">
      <header className="flex items-center space-x-2">
        <ArrowLeft
          className="h-5 w-5 cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-lg font-bold">Faculty</h1>
      </header>
      <Button
        className="bg-indigo-600 text-white"
        onClick={() => {
          setActiveForm("add-faculty");
          setInputValue("");
        }}
      >
        + Add Faculty
      </Button>

      {faculties.map((faculty, index) => (
        <div
          key={index}
          className="border p-4 rounded-md shadow-sm space-y-2 bg-blue-50"
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-bold text-md">{faculty.name}</h2>
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setSelectedFacultyIndex(index);
                  setInputValue(faculty.name);
                  setActiveForm("edit-faculty");
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteFaculty(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="ml-4">
            {faculty.departments.map((dept, deptIndex) => (
              <div
                key={deptIndex}
                className="flex items-center text-sm my-1 gap-x-2"
              >
                <span>{dept}</span>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedFacultyIndex(index);
                      setSelectedDepartmentIndex(deptIndex);
                      setInputValue(dept);
                      setActiveForm("edit-department");
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteDepartment(index, deptIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="text-indigo-600 text-xs"
              onClick={() => {
                setSelectedFacultyIndex(index);
                setInputValue("");
                setActiveForm("add-department");
              }}
            >
              + Add Department
            </Button>
          </div>
        </div>
      ))}

      {activeForm && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-md flex flex-col items-center">
          <h3 className="text-md font-semibold mb-2 capitalize">
            {activeForm.replace("-", " ")}
          </h3>
          <Input
            placeholder={`Enter ${
              activeForm.includes("faculty") ? "faculty" : "department"
            } name`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-80"
          />
          <Button
            className="mt-3 w-80 bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={() => {
              if (activeForm === "add-faculty") handleAddFaculty();
              else if (activeForm === "add-department") handleAddDepartment();
              else if (activeForm === "edit-faculty") handleEditFaculty();
              else if (activeForm === "edit-department") handleEditDepartment();
            }}
          >
            Save
          </Button>
        </div>
      )}
    </main>
  );
}
