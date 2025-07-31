"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CalendarIcon, Menu, UserCircle2 } from "lucide-react";

export default function SMSLogPage() {
  return (
    <main className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu className="h-5 w-5 text-gray-800" />
          <h1 className="text-lg font-semibold">SMS Notification Panel</h1>
        </div>
        <UserCircle2 className="h-6 w-6 text-gray-700" />
      </header>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm">Date Sent (From)</label>
          <div className="flex items-center gap-2 border p-2 rounded-md">
            <CalendarIcon className="w-4 h-4" />
            <span>25-04-2025</span>
          </div>
        </div>
        <div>
          <label className="text-sm">Date Sent (To)</label>
          <div className="flex items-center gap-2 border p-2 rounded-md">
            <CalendarIcon className="w-4 h-4" />
            <span>25-10-2025</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-3 gap-4">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Faculty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="arts">Arts</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cs">Computer Science</SelectItem>
            <SelectItem value="math">Mathematics</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="100">100 Level</SelectItem>
            <SelectItem value="200">200 Level</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs */}
      <div className="space-y-3 mt-4">
        {[1, 2, 3, 4, 5].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 p-3 rounded-md text-sm border shadow-sm"
          >
            <div className="flex justify-between items-center mb-1">
              <span>🤝 200+ Recipients</span>
              <span className="text-xs text-gray-500">25-04-2025 4:23 PM</span>
            </div>
            <p>
              Dear [StudentName], your [CourseTitle] exam holds on [ExamDate] at
              [ExamTime] in [ExamVenue]. Good luck!
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
