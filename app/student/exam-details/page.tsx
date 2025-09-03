// app/student/exam-details/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StudentLayout } from "@/components/student-layout";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { getStudentExamById } from "../actions";
import { ArrowLeft } from "lucide-react";

type ExamDetails = {
  id: string;
  courseCode: string;
  courseTitle: string;
  courseUnit: number;
  numberOfStudents: number;
  examDate: Date | null;
  examTime: string | null;
  duration: number | null;
  hall: {
    name: string;
    maxCapacity: number;
  } | null;
  timeTable: {
    name: string;
    session: string;
    faculty: {
      name: string;
    };
  };
  examSessions: Array<{
    id: string;
    examDate: Date;
    examTime: string;
    duration: number;
    studentsAssigned: number;
    sessionNumber: number;
    hall: {
      name: string;
      maxCapacity: number;
    };
  }>;
};

export default function ExamDetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const examId = searchParams.get('id');
  
  const [exam, setExam] = useState<ExamDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExamDetails() {
      if (!examId) {
        setError('Invalid exam ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await getStudentExamById(examId);
        if (result.success && result.exam) {
          setExam(result.exam);
          setError(null);
        } else {
          setError(result.message);
          toast.error(result.message);
        }
      } catch (error) {
        setError('Failed to load exam details');
        toast.error('Failed to load exam details');
      } finally {
        setLoading(false);
      }
    }

    fetchExamDetails();
  }, [examId]);

  const handleSetReminder = () => {
    if (!exam) return;
    
    const current = localStorage.getItem("reminders");
    const parsed = current ? JSON.parse(current) : [];

    const examDate = exam.examDate ? new Date(exam.examDate).toLocaleDateString() : 'TBD';
    const examTime = exam.examTime || 'TBD';

    parsed.push({
      id: Date.now(),
      course: `${exam.courseCode} - ${exam.courseTitle}`,
      date: examDate,
      time: examTime,
    });

    localStorage.setItem("reminders", JSON.stringify(parsed));
    toast.success("You have successfully set a reminder for this exam!");
  };

  const handleBackClick = () => {
    router.back();
  };

  if (loading) {
    return (
      <StudentLayout>
        <main className="max-w-2xl mx-auto p-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading exam details...</p>
          </div>
        </main>
      </StudentLayout>
    );
  }

  if (error || !exam) {
    return (
      <StudentLayout>
        <main className="max-w-2xl mx-auto p-4">
          <div className="text-center py-8">
            <p className="text-destructive">{error || 'Exam not found'}</p>
            <Button 
              variant="outline" 
              onClick={handleBackClick} 
              className="mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </main>
      </StudentLayout>
    );
  }

  const examDate = exam.examDate ? new Date(exam.examDate).toLocaleDateString() : 'TBD';
  const examTime = exam.examTime || 'TBD';
  const hallName = exam.hall?.name || 'TBD';
  const hallCapacity = exam.hall?.maxCapacity || 0;

  return (
    <StudentLayout>
      <main className="max-w-2xl mx-auto p-4 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackClick}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-indigo-600">
              {exam.courseCode} - {exam.courseTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Course Code:</strong> {exam.courseCode}
                </p>
                <p className="text-sm">
                  <strong>Course Title:</strong> {exam.courseTitle}
                </p>
                <p className="text-sm">
                  <strong>Course Unit:</strong> {exam.courseUnit}
                </p>
                <p className="text-sm">
                  <strong>Students Enrolled:</strong> {exam.numberOfStudents}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Faculty:</strong> {exam.timeTable.faculty.name}
                </p>
                <p className="text-sm">
                  <strong>Session:</strong> {exam.timeTable.session}
                </p>
                <p className="text-sm">
                  <strong>Timetable:</strong> {exam.timeTable.name}
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold text-lg mb-3">Exam Schedule</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Exam Date:</strong> {examDate}
                </p>
                <p className="text-sm">
                  <strong>Exam Time:</strong> {examTime}
                </p>
                <p className="text-sm">
                  <strong>Duration:</strong> {exam.duration ? `${exam.duration} minutes` : 'TBD'}
                </p>
                <p className="text-sm">
                  <strong>Exam Venue:</strong> {hallName}
                  {hallCapacity > 0 && ` (Capacity: ${hallCapacity})`}
                </p>
              </div>
            </div>

            {exam.examSessions && exam.examSessions.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-3">Exam Sessions</h3>
                <div className="space-y-3">
                  {exam.examSessions.map((session) => (
                    <div key={session.id} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium">Session {session.sessionNumber}</p>
                      <p className="text-sm">
                        <strong>Date:</strong> {new Date(session.examDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm">
                        <strong>Time:</strong> {session.examTime}
                      </p>
                      <p className="text-sm">
                        <strong>Hall:</strong> {session.hall.name}
                      </p>
                      <p className="text-sm">
                        <strong>Students Assigned:</strong> {session.studentsAssigned}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              className="w-full mt-6"
              onClick={handleSetReminder}
            >
              Set Exam Reminder
            </Button>
          </CardContent>
        </Card>
      </main>
    </StudentLayout>
  );
}
