"use client";

import { useState } from "react";
import {
  Faculty,
  FacultyHall,
  TimeTable,
  TimeTableCourse,
  Semester,
} from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
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
  FolderOpen,
  Folder,
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
} from "./actions";
import { AdminLayout } from "@/components/admin-layout";

type FacultyWithRelations = Faculty & {
  facultyHalls: FacultyHall[];
  timeTables: (TimeTable & { courses: TimeTableCourse[] })[];
};

type ExpandedState = {
  faculties: Set<string>;
  timetables: Set<string>;
};

type FormState = {
  type: 'faculty' | 'hall' | 'timetable' | 'course' | null;
  parentId?: string;
  facultyId?: string;
};

export function FacultyManageClient({
  faculties: initialFaculties,
}: {
  faculties: FacultyWithRelations[];
}) {
  const [faculties] = useState(initialFaculties);
  const [loading, setLoading] = useState(false);
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
  const showForm = (type: FormState['type'], parentId?: string, facultyId?: string) => {
    setActiveForm({ type, parentId, facultyId });
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
      window.location.reload();
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
      window.location.reload();
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
      window.location.reload();
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
      window.location.reload();
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
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    const result = await createTimeTable(
      activeForm.facultyId,
      newTimetableName.trim(),
      newTimetableSession.trim(),
      newTimetableSemester as Semester
    );

    if (result.success) {
      toast.success(result.message);
      hideForm();
      window.location.reload();
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
      window.location.reload();
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
      window.location.reload();
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
      window.location.reload();
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  // Helper function to get faculty name by ID
  const getFacultyById = (facultyId: string) => {
    return faculties.find(f => f.id === facultyId);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
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
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                              <div className="flex items-end gap-2">
                                <Button onClick={handleCreateTimetable} disabled={loading} className="flex-1">
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
                                          >
                                            <Plus className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteTimetable(timetable.id);
                                            }}
                                            disabled={loading}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </CollapsibleTrigger>
                                  
                                  <CollapsibleContent>
                                    <div className="p-3 space-y-3 bg-muted/10">
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
                                                <div>
                                                  <span className="font-medium">{course.courseCode}</span>
                                                  <span className="text-muted-foreground ml-2">{course.courseTitle}</span>
                                                  <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="secondary" className="text-xs">
                                                      {course.courseUnit} units
                                                    </Badge>
                                                    <Badge variant="secondary" className="text-xs">
                                                      <Users className="h-2 w-2 mr-1" />
                                                      {course.numberOfStudents}
                                                    </Badge>
                                                  </div>
                                                </div>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => handleDeleteCourse(course.id)}
                                                  disabled={loading}
                                                >
                                                  <Trash2 className="h-3 w-3" />
                                                </Button>
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
      </div>
    </AdminLayout>
  );
}
