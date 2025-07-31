"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { User, Menu } from "lucide-react";

export default function SMSNotificationPanel() {
  const [autoSMS, setAutoSMS] = useState(true);

  return (
    <main className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu className="h-5 w-5 text-gray-800" />
          <h1 className="text-lg font-semibold">SMS Notification Panel</h1>
        </div>
        <User className="h-6 w-6 text-gray-700" />
      </header>

      {/* Auto SMS Toggle */}
      <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-md border">
        <span className="text-sm font-medium">Auto SMS</span>
        <Switch
          checked={autoSMS}
          onCheckedChange={setAutoSMS}
          className="data-[state=checked]:bg-indigo-600"
        />
      </div>

      {/* SMS Template */}
      <Card className="p-4 bg-gray-100 text-sm">
        <p>
          “Dear [StudentName], your [CourseTitle] exam holds on [ExamDate] at
          [ExamTime] in [ExamVenue]. Good luck!”
        </p>
      </Card>
    </main>
  );
}
