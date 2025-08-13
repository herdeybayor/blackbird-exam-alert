"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin-layout";

export default function SMSNotificationPanel() {
  const [autoSMS, setAutoSMS] = useState(true);

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-xl md:text-2xl font-bold">SMS Notification Panel</h1>
          <p className="text-muted-foreground mt-1">Configure automatic SMS notifications for students</p>
        </header>

        {/* Auto SMS Toggle */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-medium">Auto SMS Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Automatically send SMS notifications to students about their exams
              </p>
            </div>
            <Switch
              checked={autoSMS}
              onCheckedChange={setAutoSMS}
              className="data-[state=checked]:bg-indigo-600"
            />
          </div>
        </Card>

        {/* SMS Template */}
        <Card className="p-6">
          <h3 className="text-base font-medium mb-4">SMS Template</h3>
          <div className="bg-muted p-4 rounded-lg border-l-4 border-indigo-500">
            <p className="text-sm font-mono">
              &ldquo;Dear [StudentName], your [CourseTitle] exam holds on [ExamDate] at [ExamTime] in [ExamVenue]. Good luck!&rdquo;
            </p>
          </div>
          <div className="mt-4 text-xs text-muted-foreground space-y-1">
            <p><strong>Available placeholders:</strong></p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <code className="bg-muted px-2 py-1 rounded text-xs">[StudentName]</code>
              <code className="bg-muted px-2 py-1 rounded text-xs">[CourseTitle]</code>
              <code className="bg-muted px-2 py-1 rounded text-xs">[ExamDate]</code>
              <code className="bg-muted px-2 py-1 rounded text-xs">[ExamTime]</code>
              <code className="bg-muted px-2 py-1 rounded text-xs">[ExamVenue]</code>
              <code className="bg-muted px-2 py-1 rounded text-xs">[Faculty]</code>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}