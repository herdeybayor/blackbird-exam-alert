// app/student/timetable/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StudentLayout } from "@/components/student-layout";
import { useState, useEffect } from "react";
import { getStudentExams } from "../actions";
import { toast } from "sonner";

type ExamData = {
  id: string;
  courseCode: string;
  courseTitle: string;
  examDate: Date | null;
  examTime: string | null;
  hall: {
    name: string;
  } | null;
  timeTableName: string;
  timeTableSession: string;
  faculty: string;
};

const bgColors = [
  "bg-[#FEE2E2]", // red-ish background
  "bg-[#D1FAE5]", // green-ish background
  "bg-[#DBEAFE]", // blue-ish background
  "bg-[#FEF9C3]", // yellow-ish background
  "bg-[#F3E8FF]", // purple-ish background
  "bg-[#FEF3C7]", // orange-ish background
];

export default function TimetablePage() {
  const router = useRouter();
  const [exams, setExams] = useState<ExamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExams() {
      try {
        setLoading(true);
        const result = await getStudentExams();
        if (result.success) {
          setExams(result.exams);
          setError(null);
        } else {
          setError(result.message);
          toast.error(result.message);
        }
      } catch (error) {
        setError("Failed to load timetable");
        toast.error("Failed to load timetable");
      } finally {
        setLoading(false);
      }
    }

    fetchExams();
  }, []);

  return (
    <StudentLayout>
      <main className="max-w-6xl mx-auto p-4 space-y-6">
        <header className="">
          <h1 className="text-xl md:text-2xl font-bold">Timetable</h1>
          <p className="text-muted-foreground mt-1">
            View your upcoming exams and schedule
          </p>
        </header>
        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading your timetable...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-8">
            <p className="text-destructive">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()} 
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && exams.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No exams scheduled for your faculty.</p>
            <p className="text-sm text-muted-foreground mt-2">Check back later for updates.</p>
          </div>
        )}

        {/* Timetable Grid */}
        {!loading && !error && exams.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
            {exams.map((exam, index) => {
              const bgColor = bgColors[index % bgColors.length];
              const examDate = exam.examDate ? new Date(exam.examDate).toLocaleDateString() : 'TBD';
              const examTime = exam.examTime || 'TBD';
              const hallName = exam.hall?.name || 'TBD';
              
              return (
                <div
                  key={exam.id}
                  className={`rounded-xl p-4 shadow-md ${bgColor} cursor-pointer hover:shadow-lg transition`}
                  onClick={() => router.push(`/student/exam-details?id=${exam.id}`)}
                >
                  <p className="text-sm text-gray-600">
                    {examDate} • {examTime}
                  </p>
                  <h2 className="text-lg font-bold mt-1">{exam.courseCode}</h2>
                  <p className="text-sm text-gray-600 mb-1">{exam.courseTitle}</p>
                  <p className="text-gray-700">{hallName}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    Session: {exam.timeTableSession}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </StudentLayout>
  );
}
