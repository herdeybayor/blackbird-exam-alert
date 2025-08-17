"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Faculty,
  FacultyHall,
  TimeTable,
  TimeTableCourse,
  CourseExamSession,
  Semester,
} from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";
import {
  Plus,
  Trash2,
  Building,
  Calendar,
  BookOpen,
  Users,
  School,
  ChevronDown,
  ChevronRight,
  Edit,
  Clock,
  MapPin,
  Wand2,
  RotateCcw,
  CalendarClock,
  Printer,
} from "lucide-react";
import {
  createFaculty,
  deleteFaculty,
  addFacultyHall,
  deleteFacultyHall,
  createTimeTable,
  deleteTimeTable,
  addCourseToTimeTable,
  deleteCourse,
  updateTimeTableExamStartDate,
  scheduleExam,
  autoScheduleExams,
  clearExamSchedule,
} from "./actions";
import { AdminLayout } from "@/components/admin-layout";

type FacultyWithRelations = Faculty & {
  facultyHalls: FacultyHall[];
  timeTables: (TimeTable & { 
    courses: (TimeTableCourse & { 
      hall: FacultyHall | null;
      examSessions: (CourseExamSession & { hall: FacultyHall })[];
    })[] 
  })[];
};

type ExpandedState = {
  faculties: Set<string>;
  timetables: Set<string>;
};

type FormState = {
  type: 'faculty' | 'hall' | 'timetable' | 'course' | 'exam-date' | 'schedule-exam' | null;
  parentId?: string;
  facultyId?: string;
  courseId?: string;
};

export function FacultyManageClient({
  faculties,
}: {
  faculties: FacultyWithRelations[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const [expandedState, setExpandedState] = useState<ExpandedState>({
    faculties: new Set(),
    timetables: new Set(),
  });
  const [activeForm, setActiveForm] = useState<FormState>({ type: null });

  // Form state
  const [newFacultyName, setNewFacultyName] = useState("");
  const [newHallName, setNewHallName] = useState("");
  const [newHallCapacity, setNewHallCapacity] = useState("");
  const [newTimetableName, setNewTimetableName] = useState("");
  const [newTimetableSession, setNewTimetableSession] = useState("");
  const [newTimetableSemester, setNewTimetableSemester] = useState<Semester | "">("");
  const [newCourseCode, setNewCourseCode] = useState("");
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseUnit, setNewCourseUnit] = useState("");
  const [newCourseStudents, setNewCourseStudents] = useState("");
  
  // Exam scheduling form state
  const [examStartDate, setExamStartDate] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examTime, setExamTime] = useState("");
  const [examDuration, setExamDuration] = useState("180");
  const [selectedHall, setSelectedHall] = useState("");

  // Expansion handlers
  const toggleFaculty = (facultyId: string) => {
    setExpandedState(prev => ({
      ...prev,
      faculties: prev.faculties.has(facultyId)
        ? new Set([...prev.faculties].filter(id => id !== facultyId))
        : new Set([...prev.faculties, facultyId])
    }));
  };

  const toggleTimetable = (timetableId: string) => {
    setExpandedState(prev => ({
      ...prev,
      timetables: prev.timetables.has(timetableId)
        ? new Set([...prev.timetables].filter(id => id !== timetableId))
        : new Set([...prev.timetables, timetableId])
    }));
  };

  // Form handlers
  const showForm = (type: FormState['type'], parentId?: string, facultyId?: string, courseId?: string) => {
    setActiveForm({ type, parentId, facultyId, courseId });
  };

  const hideForm = () => {
    setActiveForm({ type: null });
    // Reset form state
    setNewFacultyName("");
    setNewHallName("");
    setNewHallCapacity("");
    setNewTimetableName("");
    setNewTimetableSession("");
    setNewTimetableSemester("");
    setNewCourseCode("");
    setNewCourseTitle("");
    setNewCourseUnit("");
    setNewCourseStudents("");
    setExamStartDate("");
    setExamDate("");
    setExamTime("");
    setExamDuration("180");
    setSelectedHall("");
  };

  // Action handlers
  const handleCreateFaculty = async () => {
    if (!newFacultyName.trim()) {
      toast.error("Please enter a faculty name");
      return;
    }

    setLoading(true);
    const result = await createFaculty(newFacultyName.trim());

    if (result.success) {
      toast.success(result.message);
      hideForm();
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleDeleteFaculty = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this faculty? This will also delete all associated halls and timetables."
      )
    ) {
      return;
    }

    setLoading(true);
    const result = await deleteFaculty(id);

    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleAddHall = async () => {
    if (!activeForm.facultyId || !newHallName.trim() || !newHallCapacity) {
      toast.error("Please fill all fields");
      return;
    }

    const capacity = parseInt(newHallCapacity);
    if (isNaN(capacity) || capacity <= 0) {
      toast.error("Please enter a valid capacity");
      return;
    }

    setLoading(true);
    const result = await addFacultyHall(
      activeForm.facultyId,
      newHallName.trim(),
      capacity
    );

    if (result.success) {
      toast.success(result.message);
      hideForm();
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleDeleteHall = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hall?")) {
      return;
    }

    setLoading(true);
    const result = await deleteFacultyHall(id);

    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleCreateTimetable = async () => {
    if (
      !activeForm.facultyId ||
      !newTimetableName.trim() ||
      !newTimetableSession.trim() ||
      !newTimetableSemester
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const startDate = examStartDate ? new Date(examStartDate) : undefined;

    setLoading(true);
    const result = await createTimeTable(
      activeForm.facultyId,
      newTimetableName.trim(),
      newTimetableSession.trim(),
      newTimetableSemester as Semester,
      startDate
    );

    if (result.success) {
      toast.success(result.message);
      hideForm();
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleDeleteTimetable = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this timetable? This will also delete all associated courses."
      )
    ) {
      return;
    }

    setLoading(true);
    const result = await deleteTimeTable(id);

    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleAddCourse = async () => {
    if (
      !activeForm.parentId ||
      !newCourseCode.trim() ||
      !newCourseTitle.trim() ||
      !newCourseUnit ||
      !newCourseStudents
    ) {
      toast.error("Please fill all fields");
      return;
    }

    const unit = parseInt(newCourseUnit);
    const students = parseInt(newCourseStudents);

    if (isNaN(unit) || unit <= 0 || isNaN(students) || students <= 0) {
      toast.error(
        "Please enter valid numbers for course unit and number of students"
      );
      return;
    }

    setLoading(true);
    const result = await addCourseToTimeTable(
      activeForm.parentId,
      newCourseCode.trim(),
      newCourseTitle.trim(),
      unit,
      students
    );

    if (result.success) {
      toast.success(result.message);
      hideForm();
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) {
      return;
    }

    setLoading(true);
    const result = await deleteCourse(id);

    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  // Exam scheduling handlers
  const handleUpdateExamStartDate = async () => {
    if (!activeForm.parentId || !examStartDate) {
      toast.error("Please select an exam start date");
      return;
    }

    setLoading(true);
    const result = await updateTimeTableExamStartDate(activeForm.parentId, new Date(examStartDate));

    if (result.success) {
      toast.success(result.message);
      hideForm();
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleScheduleExam = async () => {
    if (!activeForm.courseId || !examDate || !examTime || !examDuration || !selectedHall) {
      toast.error("Please fill all fields");
      return;
    }

    const duration = parseInt(examDuration);
    if (isNaN(duration) || duration <= 0) {
      toast.error("Please enter a valid duration");
      return;
    }

    setLoading(true);
    const result = await scheduleExam(
      activeForm.courseId,
      new Date(examDate),
      examTime,
      duration,
      selectedHall
    );

    if (result.success) {
      toast.success(result.message);
      hideForm();
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleAutoSchedule = async (timeTableId: string) => {
    if (!confirm("This will automatically schedule all unscheduled courses. Continue?")) {
      return;
    }

    setLoading(true);
    const result = await autoScheduleExams(timeTableId);

    if (result.success) {
      toast.success(result.message);
      if (result.conflicts && result.conflicts.length > 0) {
        console.log("Scheduling conflicts:", result.conflicts);
      }
      // Small delay to ensure database transaction is committed
      setTimeout(() => {
        router.refresh();
      }, 100);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleClearSchedule = async (timeTableId: string) => {
    if (!confirm("This will clear all exam schedules for this timetable. Continue?")) {
      return;
    }

    setLoading(true);
    const result = await clearExamSchedule(timeTableId);

    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  // State for print content
  const [printContent, setPrintContent] = useState<React.ReactNode>(null);
  
  // Print to PDF functionality
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Exam Timetable",
    pageStyle: `
      @page {
        size: A4;
        margin: 0.75in;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
          font-size: 12px;
          line-height: 1.4;
        }
        .no-print {
          display: none !important;
        }
        .print-page-break {
          page-break-before: always;
        }
        .print-only {
          display: block !important;
        }
        h1 {
          font-size: 18px;
          margin-bottom: 16px;
        }
        h2 {
          font-size: 16px;
          margin-bottom: 12px;
        }
        h3 {
          font-size: 14px;
          margin-bottom: 8px;
        }
        table {
          border-collapse: collapse;
          width: 100%;
        }
        th, td {
          border: 1px solid #000;
          padding: 4px 8px;
          text-align: left;
        }
        th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
      }
    `,
  });

  // Function to create a printable timetable for a specific timetable
  const createPrintableTimetable = (faculty: FacultyWithRelations, timetable: TimeTable & { courses: (TimeTableCourse & { hall: FacultyHall | null; examSessions: (CourseExamSession & { hall: FacultyHall })[]; })[] }) => {
    return (
      <div className="p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2">{faculty.name}</h1>
          <h2 className="text-xl font-semibold mb-1">Examination Timetable</h2>
          <div className="text-base text-gray-600">
            <div>{timetable.name}</div>
            <div>Session: {timetable.session} | Semester: {timetable.semester === 'FIRST' ? '1st' : '2nd'}</div>
            {timetable.examStartDate && (
              <div>Exam Start Date: {new Date(timetable.examStartDate).toLocaleDateString()}</div>
            )}
          </div>
        </div>
        
        {timetable.courses.length > 0 ? (
          <table className="w-full border-collapse border-2 border-gray-600 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-600 px-3 py-2 text-left font-bold">Course Code</th>
                <th className="border border-gray-600 px-3 py-2 text-left font-bold">Course Title</th>
                <th className="border border-gray-600 px-3 py-2 text-center font-bold">Units</th>
                <th className="border border-gray-600 px-3 py-2 text-center font-bold">Students</th>
                <th className="border border-gray-600 px-3 py-2 text-center font-bold">Date</th>
                <th className="border border-gray-600 px-3 py-2 text-center font-bold">Time</th>
                <th className="border border-gray-600 px-3 py-2 text-center font-bold">Hall</th>
              </tr>
            </thead>
            <tbody>
              {timetable.courses.map((course) => {
                if (course.examSessions.length > 0) {
                  return course.examSessions.map((session, index) => (
                    <tr key={`${course.id}-${session.id}`} className="border-b">
                      {index === 0 && (
                        <>
                          <td rowSpan={course.examSessions.length} className="border border-gray-600 px-3 py-2 font-semibold align-top">
                            {course.courseCode}
                          </td>
                          <td rowSpan={course.examSessions.length} className="border border-gray-600 px-3 py-2 align-top">
                            {course.courseTitle}
                          </td>
                          <td rowSpan={course.examSessions.length} className="border border-gray-600 px-3 py-2 text-center align-top">
                            {course.courseUnit}
                          </td>
                          <td rowSpan={course.examSessions.length} className="border border-gray-600 px-3 py-2 text-center align-top">
                            {course.numberOfStudents}
                          </td>
                        </>
                      )}
                      <td className="border border-gray-600 px-3 py-2 text-center">
                        {new Date(session.examDate).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-600 px-3 py-2 text-center">
                        {session.examTime}
                      </td>
                      <td className="border border-gray-600 px-3 py-2 text-center">
                        {session.hall.name}<br/>
                        <span className="text-xs text-gray-600">({session.studentsAssigned} students)</span>
                      </td>
                    </tr>
                  ));
                } else {
                  return (
                    <tr key={course.id} className="border-b">
                      <td className="border border-gray-600 px-3 py-2 font-semibold">{course.courseCode}</td>
                      <td className="border border-gray-600 px-3 py-2">{course.courseTitle}</td>
                      <td className="border border-gray-600 px-3 py-2 text-center">{course.courseUnit}</td>
                      <td className="border border-gray-600 px-3 py-2 text-center">{course.numberOfStudents}</td>
                      <td className="border border-gray-600 px-3 py-2 text-center">
                        {course.examDate ? new Date(course.examDate).toLocaleDateString() : 'TBD'}
                      </td>
                      <td className="border border-gray-600 px-3 py-2 text-center">
                        {course.examTime || 'TBD'}
                      </td>
                      <td className="border border-gray-600 px-3 py-2 text-center">
                        {course.hall?.name || 'TBD'}
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No courses scheduled in this timetable</p>
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-600">
          <p>Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    );
  };
  
  // Function to handle printing a specific timetable
  const handlePrintTimetable = (faculty: FacultyWithRelations, timetable: TimeTable & { courses: (TimeTableCourse & { hall: FacultyHall | null; examSessions: (CourseExamSession & { hall: FacultyHall })[]; })[] }) => {
    setPrintContent(createPrintableTimetable(faculty, timetable));
    // Small delay to ensure state is updated
    setTimeout(() => {
      handlePrint();
    }, 100);
  };


  return (
    <AdminLayout>
      <div ref={printRef} className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Faculty Management</h1>
          <Button
            onClick={() => showForm('faculty')}
            className="flex items-center gap-2"
            disabled={loading}
          >
            <Plus className="h-4 w-4" />
            Add Faculty
          </Button>
        </div>

        {/* Global Add Faculty Form */}
        {activeForm.type === 'faculty' && (
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                Create New Faculty
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="faculty-name">Faculty Name</Label>
                  <Input
                    id="faculty-name"
                    placeholder="Enter faculty name"
                    value={newFacultyName}
                    onChange={(e) => setNewFacultyName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateFaculty()}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handleCreateFaculty} disabled={loading} className="flex-1">
                    {loading ? "Creating..." : "Create"}
                  </Button>
                  <Button variant="outline" onClick={hideForm}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hierarchical Faculty List */}
        <div className="space-y-4">
          {faculties.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <School className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg mb-2">No faculties found</p>
                <p className="text-sm text-muted-foreground">Create your first faculty to get started</p>
              </CardContent>
            </Card>
          ) : (
            faculties.map((faculty) => (
              <Card key={faculty.id} className="overflow-hidden">
                <Collapsible
                  open={expandedState.faculties.has(faculty.id)}
                  onOpenChange={() => toggleFaculty(faculty.id)}
                >
                  <CollapsibleTrigger asChild>
                    <div className="p-4 hover:bg-muted/50 cursor-pointer border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {expandedState.faculties.has(faculty.id) ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          <School className="h-5 w-5 text-primary" />
                          <div>
                            <h3 className="font-semibold text-lg">{faculty.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                {faculty.facultyHalls.length} halls
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {faculty.timeTables.length} timetables
                              </span>
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                {faculty.timeTables.reduce((acc, tt) => acc + tt.courses.length, 0)} courses
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFaculty(faculty.id);
                          }}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="p-4 space-y-6 bg-muted/20">
                      {/* Quick Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => showForm('hall', undefined, faculty.id)}
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-3 w-3" />
                          Add Hall
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => showForm('timetable', undefined, faculty.id)}
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-3 w-3" />
                          Add Timetable
                        </Button>
                      </div>

                      {/* Add Hall Form */}
                      {activeForm.type === 'hall' && activeForm.facultyId === faculty.id && (
                        <Card className="border-2 border-blue-200 bg-blue-50/50">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                              <Building className="h-4 w-4" />
                              Add Hall to {faculty.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label htmlFor="hall-name">Hall Name</Label>
                                <Input
                                  id="hall-name"
                                  placeholder="Enter hall name"
                                  value={newHallName}
                                  onChange={(e) => setNewHallName(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="hall-capacity">Max Capacity</Label>
                                <Input
                                  id="hall-capacity"
                                  type="number"
                                  placeholder="Enter capacity"
                                  value={newHallCapacity}
                                  onChange={(e) => setNewHallCapacity(e.target.value)}
                                />
                              </div>
                              <div className="flex items-end gap-2">
                                <Button onClick={handleAddHall} disabled={loading} className="flex-1">
                                  {loading ? "Adding..." : "Add Hall"}
                                </Button>
                                <Button variant="outline" onClick={hideForm}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Add Timetable Form */}
                      {activeForm.type === 'timetable' && activeForm.facultyId === faculty.id && (
                        <Card className="border-2 border-green-200 bg-green-50/50">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                              <Calendar className="h-4 w-4" />
                              Add Timetable to {faculty.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div>
                                <Label htmlFor="timetable-name">Timetable Name</Label>
                                <Input
                                  id="timetable-name"
                                  placeholder="Enter timetable name"
                                  value={newTimetableName}
                                  onChange={(e) => setNewTimetableName(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="timetable-session">Session</Label>
                                <Input
                                  id="timetable-session"
                                  placeholder="e.g., 2023/2024"
                                  value={newTimetableSession}
                                  onChange={(e) => setNewTimetableSession(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="timetable-semester">Semester</Label>
                                <Select
                                  value={newTimetableSemester}
                                  onValueChange={(value) => setNewTimetableSemester(value as Semester)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select semester" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="FIRST">First Semester</SelectItem>
                                    <SelectItem value="SECOND">Second Semester</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="exam-start-date">Exam Start Date</Label>
                                <Input
                                  id="exam-start-date"
                                  type="date"
                                  value={examStartDate}
                                  onChange={(e) => setExamStartDate(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={handleCreateTimetable} disabled={loading}>
                                {loading ? "Creating..." : "Create"}
                              </Button>
                              <Button variant="outline" onClick={hideForm}>
                                Cancel
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Halls Section */}
                      {faculty.facultyHalls.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-blue-600" />
                            <h4 className="font-medium">Halls ({faculty.facultyHalls.length})</h4>
                          </div>
                          <div className="grid gap-2 ml-6">
                            {faculty.facultyHalls.map((hall) => (
                              <div key={hall.id} className="flex items-center justify-between p-3 bg-background rounded border">
                                <div>
                                  <span className="font-medium">{hall.name}</span>
                                  <Badge variant="secondary" className="ml-2">
                                    <Users className="h-3 w-3 mr-1" />
                                    {hall.maxCapacity}
                                  </Badge>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteHall(hall.id)}
                                  disabled={loading}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Timetables Section */}
                      {faculty.timeTables.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-green-600" />
                            <h4 className="font-medium">Timetables ({faculty.timeTables.length})</h4>
                          </div>
                          <div className="space-y-2 ml-6">
                            {faculty.timeTables.map((timetable) => (
                              <Card key={timetable.id} className="overflow-hidden">
                                <Collapsible
                                  open={expandedState.timetables.has(timetable.id)}
                                  onOpenChange={() => toggleTimetable(timetable.id)}
                                >
                                  <CollapsibleTrigger asChild>
                                    <div className="p-3 hover:bg-muted/50 cursor-pointer border-b border-border/50">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          {expandedState.timetables.has(timetable.id) ? (
                                            <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                          ) : (
                                            <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                          )}
                                          <div>
                                            <span className="font-medium">{timetable.name}</span>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                              <Badge variant="outline" className="text-xs">
                                                {timetable.session}
                                              </Badge>
                                              <Badge variant="secondary" className="text-xs">
                                                {timetable.semester === 'FIRST' ? '1st' : '2nd'} Semester
                                              </Badge>
                                              <span>{timetable.courses.length} courses</span>
                                              {timetable.examStartDate && (
                                                <Badge variant="default" className="text-xs flex items-center gap-1">
                                                  <CalendarClock className="h-2 w-2" />
                                                  {new Date(timetable.examStartDate).toLocaleDateString()}
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              showForm('course', timetable.id, faculty.id);
                                            }}
                                            title="Add Course"
                                            className="no-print"
                                          >
                                            <Plus className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              showForm('exam-date', timetable.id, faculty.id);
                                            }}
                                            title="Set Exam Start Date"
                                            className="no-print"
                                          >
                                            <CalendarClock className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleAutoSchedule(timetable.id);
                                            }}
                                            disabled={loading}
                                            title="Auto Schedule Exams"
                                            className="no-print"
                                          >
                                            <Wand2 className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleClearSchedule(timetable.id);
                                            }}
                                            disabled={loading}
                                            title="Clear Schedule"
                                            className="no-print"
                                          >
                                            <RotateCcw className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handlePrintTimetable(faculty, timetable);
                                            }}
                                            title="Print Timetable"
                                            className="no-print"
                                          >
                                            <Printer className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteTimetable(timetable.id);
                                            }}
                                            disabled={loading}
                                            title="Delete Timetable"
                                            className="no-print"
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </CollapsibleTrigger>
                                  
                                  <CollapsibleContent>
                                    <div className="p-3 space-y-3 bg-muted/10">
                                      {/* Set Exam Start Date Form */}
                                      {activeForm.type === 'exam-date' && activeForm.parentId === timetable.id && (
                                        <Card className="border-2 border-purple-200 bg-purple-50/50">
                                          <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-sm">
                                              <CalendarClock className="h-3 w-3" />
                                              Set Exam Start Date for {timetable.name}
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-3">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                              <div>
                                                <Label htmlFor="exam-start-date-input" className="text-xs">Exam Start Date</Label>
                                                <Input
                                                  id="exam-start-date-input"
                                                  type="date"
                                                  value={examStartDate}
                                                  onChange={(e) => setExamStartDate(e.target.value)}
                                                  className="h-8"
                                                />
                                              </div>
                                              <div className="flex items-end gap-2">
                                                <Button onClick={handleUpdateExamStartDate} disabled={loading} size="sm">
                                                  {loading ? "Updating..." : "Set Date"}
                                                </Button>
                                                <Button variant="outline" onClick={hideForm} size="sm">
                                                  Cancel
                                                </Button>
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      )}

                                      {/* Add Course Form */}
                                      {activeForm.type === 'course' && activeForm.parentId === timetable.id && (
                                        <Card className="border-2 border-orange-200 bg-orange-50/50">
                                          <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-sm">
                                              <BookOpen className="h-3 w-3" />
                                              Add Course to {timetable.name}
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-3">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                              <div>
                                                <Label htmlFor="course-code" className="text-xs">Course Code</Label>
                                                <Input
                                                  id="course-code"
                                                  placeholder="e.g., CSC101"
                                                  value={newCourseCode}
                                                  onChange={(e) => setNewCourseCode(e.target.value)}
                                                  className="h-8"
                                                />
                                              </div>
                                              <div>
                                                <Label htmlFor="course-title" className="text-xs">Course Title</Label>
                                                <Input
                                                  id="course-title"
                                                  placeholder="Enter title"
                                                  value={newCourseTitle}
                                                  onChange={(e) => setNewCourseTitle(e.target.value)}
                                                  className="h-8"
                                                />
                                              </div>
                                              <div>
                                                <Label htmlFor="course-unit" className="text-xs">Unit</Label>
                                                <Input
                                                  id="course-unit"
                                                  type="number"
                                                  placeholder="3"
                                                  value={newCourseUnit}
                                                  onChange={(e) => setNewCourseUnit(e.target.value)}
                                                  className="h-8"
                                                />
                                              </div>
                                              <div>
                                                <Label htmlFor="course-students" className="text-xs">Students</Label>
                                                <Input
                                                  id="course-students"
                                                  type="number"
                                                  placeholder="150"
                                                  value={newCourseStudents}
                                                  onChange={(e) => setNewCourseStudents(e.target.value)}
                                                  className="h-8"
                                                />
                                              </div>
                                            </div>
                                            <div className="flex gap-2">
                                              <Button onClick={handleAddCourse} disabled={loading} size="sm">
                                                {loading ? "Adding..." : "Add Course"}
                                              </Button>
                                              <Button variant="outline" onClick={hideForm} size="sm">
                                                Cancel
                                              </Button>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      )}

                                      {/* Schedule Individual Exam Form */}
                                      {activeForm.type === 'schedule-exam' && activeForm.courseId && (
                                        <Card className="border-2 border-indigo-200 bg-indigo-50/50">
                                          <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-sm">
                                              <Clock className="h-3 w-3" />
                                              Schedule Exam for {timetable.courses.find(c => c.id === activeForm.courseId)?.courseCode}
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-3">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                              <div>
                                                <Label htmlFor="exam-date" className="text-xs">Exam Date</Label>
                                                <Input
                                                  id="exam-date"
                                                  type="date"
                                                  value={examDate}
                                                  onChange={(e) => setExamDate(e.target.value)}
                                                  className="h-8"
                                                />
                                              </div>
                                              <div>
                                                <Label htmlFor="exam-time" className="text-xs">Exam Time</Label>
                                                <Select value={examTime} onValueChange={setExamTime}>
                                                  <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="Select time" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="9:00">9:00 AM</SelectItem>
                                                    <SelectItem value="14:00">2:00 PM</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                              <div>
                                                <Label htmlFor="exam-duration" className="text-xs">Duration (minutes)</Label>
                                                <Input
                                                  id="exam-duration"
                                                  type="number"
                                                  placeholder="180"
                                                  value={examDuration}
                                                  onChange={(e) => setExamDuration(e.target.value)}
                                                  className="h-8"
                                                />
                                              </div>
                                              <div>
                                                <Label htmlFor="exam-hall" className="text-xs">Hall</Label>
                                                <Select value={selectedHall} onValueChange={setSelectedHall}>
                                                  <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="Select hall" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    {faculty.facultyHalls.map((hall) => (
                                                      <SelectItem key={hall.id} value={hall.id}>
                                                        {hall.name} (capacity: {hall.maxCapacity})
                                                      </SelectItem>
                                                    ))}
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                            </div>
                                            <div className="flex gap-2">
                                              <Button onClick={handleScheduleExam} disabled={loading} size="sm">
                                                {loading ? "Scheduling..." : "Schedule Exam"}
                                              </Button>
                                              <Button variant="outline" onClick={hideForm} size="sm">
                                                Cancel
                                              </Button>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      )}

                                      {/* Courses List */}
                                      {timetable.courses.length > 0 ? (
                                        <div className="space-y-2">
                                          <div className="flex items-center gap-2">
                                            <BookOpen className="h-3 w-3 text-orange-600" />
                                            <span className="text-sm font-medium">Courses ({timetable.courses.length})</span>
                                          </div>
                                          <div className="grid gap-1 ml-4">
                                            {timetable.courses.map((course) => (
                                              <div key={course.id} className="flex items-center justify-between p-2 bg-background rounded border text-sm">
                                                <div className="flex-1">
                                                  <div className="flex items-center gap-2">
                                                    <span className="font-medium">{course.courseCode}</span>
                                                    <span className="text-muted-foreground">{course.courseTitle}</span>
                                                  </div>
                                                  <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="secondary" className="text-xs">
                                                      {course.courseUnit} units
                                                    </Badge>
                                                    <Badge variant="secondary" className="text-xs">
                                                      <Users className="h-2 w-2 mr-1" />
                                                      {course.numberOfStudents}
                                                    </Badge>
                                                    {course.examSessions.length > 0 ? (
                                                      <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                          <Badge variant="default" className="text-xs">
                                                            {course.examSessions.length} session{course.examSessions.length > 1 ? 's' : ''}
                                                          </Badge>
                                                          {course.examSessions.length > 1 && (
                                                            <Badge variant="secondary" className="text-xs">
                                                              Multi-hall exam
                                                            </Badge>
                                                          )}
                                                        </div>
                                                        <div className="space-y-1">
                                                          {course.examSessions.map((session, index) => (
                                                            <div key={session.id} className="bg-muted/30 p-3 rounded-md border transition-colors hover:bg-muted/40">
                                                              <div className="flex items-center justify-between mb-2">
                                                                <div className="flex items-center gap-2">
                                                                  <Badge variant="outline" className="text-xs font-mono bg-white">
                                                                    Session {index + 1}
                                                                  </Badge>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                  <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                                                                    <Users className="h-3 w-3 text-blue-600" />
                                                                    <span className="font-medium">{session.studentsAssigned}</span>
                                                                  </span>
                                                                </div>
                                                              </div>
                                                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                                <div className="flex items-center gap-2 text-xs bg-blue-50 px-2 py-1 rounded">
                                                                  <Calendar className="h-3 w-3 text-blue-600" />
                                                                  <span className="font-medium">{new Date(session.examDate).toLocaleDateString()}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs bg-green-50 px-2 py-1 rounded">
                                                                  <Clock className="h-3 w-3 text-green-600" />
                                                                  <span className="font-medium">{session.examTime}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs bg-orange-50 px-2 py-1 rounded">
                                                                  <MapPin className="h-3 w-3 text-orange-600" />
                                                                  <span className="font-medium">{session.hall.name}</span>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          ))}
                                                        </div>
                                                      </div>
                                                    ) : course.examDate ? (
                                                      <div className="bg-muted/30 p-3 rounded-md border">
                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                          <div className="flex items-center gap-2 text-xs bg-blue-50 px-2 py-1 rounded">
                                                            <Calendar className="h-3 w-3 text-blue-600" />
                                                            <span className="font-medium">{new Date(course.examDate).toLocaleDateString()}</span>
                                                          </div>
                                                          <div className="flex items-center gap-2 text-xs bg-green-50 px-2 py-1 rounded">
                                                            <Clock className="h-3 w-3 text-green-600" />
                                                            <span className="font-medium">{course.examTime}</span>
                                                          </div>
                                                          {course.hall && (
                                                            <div className="flex items-center gap-2 text-xs bg-orange-50 px-2 py-1 rounded">
                                                              <MapPin className="h-3 w-3 text-orange-600" />
                                                              <span className="font-medium">{course.hall.name}</span>
                                                            </div>
                                                          )}
                                                        </div>
                                                      </div>
                                                    ) : (
                                                      <div className="bg-yellow-50 border border-yellow-200 p-2 rounded-md">
                                                        <div className="flex items-center gap-2">
                                                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                          <span className="text-xs text-yellow-700 font-medium">No exam scheduled yet</span>
                                                        </div>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-1 no-print">
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => showForm('schedule-exam', timetable.id, faculty.id, course.id)}
                                                    title="Schedule Exam"
                                                  >
                                                    <Edit className="h-3 w-3" />
                                                  </Button>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteCourse(course.id)}
                                                    disabled={loading}
                                                    title="Delete Course"
                                                  >
                                                    <Trash2 className="h-3 w-3" />
                                                  </Button>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="text-center py-4 text-sm text-muted-foreground">
                                          No courses added yet
                                        </div>
                                      )}
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Empty states */}
                      {faculty.facultyHalls.length === 0 && faculty.timeTables.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <div className="space-y-2">
                            <p>No halls or timetables created yet</p>
                            <p className="text-sm">Use the buttons above to get started</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))
          )}
        </div>
        
        {/* Hidden print content */}
        <div className="hidden print:block">
          {printContent}
        </div>
      </div>
    </AdminLayout>
  );
}
