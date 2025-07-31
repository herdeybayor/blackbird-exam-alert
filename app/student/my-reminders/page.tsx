"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Reminder {
  id: number;
  date: string;
  course: string;
  time: string;
}

export default function MyRemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: 1,
      date: "Fri 16",
      course: "(CSC101) Introduction To Computer Science",
      time: "11:30 PM",
    },
    {
      id: 2,
      date: "sat 17",
      course: "(CSC102) priniciples of programming",
      time: "11:30 PM",
    },
  ]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("reminders");

    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setReminders(parsed);
      } else {
        // If it's empty or invalid, use the fallback
        setReminders([
          {
            id: 1,
            date: "Fri 16",
            course: "(CSC101) Introduction To Computer Science",
            time: "11:30 PM",
          },
          {
            id: 2,
            date: "sat 17",
            course: "(CSC102) priniciples of programming",
            time: "11:30 PM",
          },
        ]);
      }
    } else {
      // Nothing in localStorage
      setReminders([
        {
          id: 1,
          date: "Fri 16",
          course: "(CSC101) Introduction To Computer Science",
          time: "11:30 PM",
        },
        {
          id: 2,
          date: "sat 17",
          course: "(CSC102) priniciples of programming",
          time: "11:30 PM",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  const handleDelete = (id: number) => {
    setReminders((prev) => prev.filter((rem) => rem.id !== id));
    setConfirmDeleteId(null);
    toast.success("Exam reminder deleted successfully.");
  };

  return (
    <main className="max-w-6xl mx-auto p-4 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">My Reminders</h1>
      </header>

      <section className="space-y-3">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className="bg-gray-100 rounded-md p-3 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-semibold">{reminder.course}</p>
              <p className="text-xs text-gray-500">
                {reminder.date} at {reminder.time}
              </p>
            </div>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => setConfirmDeleteId(reminder.id)}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </section>

      {confirmDeleteId !== null && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-sm">
            <h2 className="font-bold mb-2">Delete Reminder</h2>
            <p className="text-sm mb-4">
              Are you sure you want to delete this reminder?
            </p>
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setConfirmDeleteId(null)}
              >
                No, Go Back
              </Button>
              <Button
                className="bg-red-500 text-white flex-1 hover:bg-red-600"
                onClick={() => handleDelete(confirmDeleteId)}
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
