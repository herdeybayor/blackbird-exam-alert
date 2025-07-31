"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import {
  UserIcon,
  CalendarIcon,
  MessageSquareIcon,
  Menu,
  UserCircleIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    students: 120,
    exams: 45,
    smsSent: 300,
  });

  useEffect(() => {
    const fetchFakeStats = async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulated data (could be from your database later)
      const fakeData = {
        students: 150,
        exams: 50,
        smsSent: 340,
      };

      setStats(fakeData);
    };

    fetchFakeStats();
  }, []);

  const recentSMS = [
    {
      sentTo: "200 students",
      date: "25 October 2025",
      content:
        "Dear [StudentName], your [CourseTitle] exam holds on [ExamDate] at [ExamTime] in [ExamVenue]. Good luck!",
    },
    {
      sentTo: "150 students",
      date: "20 October 2025",
      content:
        "Reminder: Your [CourseTitle] exam is scheduled for [ExamDate] at [ExamTime].",
    },
  ];

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-6 shadow-lg">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-3">
          <Menu className="h-6 w-6" />
          <h1 className="text-xl md:text-2xl font-bold">Welcome, Admin!</h1>
        </div>
        <UserCircleIcon className="h-8 w-8" />
      </header>

      <div className="flex flex-col sm:flex-row gap-4 ">
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => router.push("/admin/exam-manage")}
        >
          Exams
        </Button>
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => router.push("/admin/student-manage")}
        >
          Students
        </Button>
      </div>

      <section className="space-y-4">
        <Card className="bg-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Number of Students</CardTitle>
            <UserIcon className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.students}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Scheduled Exams</CardTitle>
            <CalendarIcon className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.exams}</p>
          </CardContent>
        </Card>

        <Card className="bg-indigo-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>SMS Sent This Month</CardTitle>
            <MessageSquareIcon className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.smsSent}</p>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-md font-semibold">Recently Sent SMS</h2>
        <ScrollArea className="h-40 rounded-md border p-2 mt-2 flex flex-col gap-1">
          {recentSMS.map((sms, index) => (
            <div key={index} className="mb-6 ">
              <p className="text-sm font-medium">Sent To: {sms.sentTo}</p>
              <p className="text-xs text-gray-500">Date Sent: {sms.date}</p>
              <p className="text-sm mt-1">{sms.content}</p>
              <Separator className="my-2" />
            </div>
          ))}
        </ScrollArea>
      </section>
    </main>
  );
}
