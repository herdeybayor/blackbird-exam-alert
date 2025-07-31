"use client";

import { User, Menu } from "lucide-react";
import { KeyRound, GraduationCap, MapPin, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SMSNotificationPanel() {
  const router = useRouter();
  return (
    <main className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu className="h-5 w-5 text-gray-800" />
          <h1 className="text-lg font-semibold">Setting</h1>
        </div>
        <User className="h-6 w-6 text-gray-700" />
      </header>

      {/* SMS Template */}

      <Button
        variant="ghost"
        className="w-full flex justify-start gap-3"
        onClick={() => router.push("/admin/settings-side/password")}
      >
        <KeyRound className="h-5 w-5" />
        Password
      </Button>

      <Button
        variant="ghost"
        className="w-full flex justify-start gap-3"
        onClick={() => router.push("/admin/settings-side/faculty")}
      >
        <GraduationCap className="h-5 w-5" />
        Faculty
      </Button>

      <Button
        variant="ghost"
        className="w-full flex justify-start gap-3"
        onClick={() => router.push("/admin/settings-side/exam-venues")}
      >
        <MapPin className="h-5 w-5" />
        Exam Venues
      </Button>

      <Button
        variant="ghost"
        className="w-full flex justify-start gap-3"
        onClick={() => router.push("/admin/login")}
      >
        <LogOut className="h-5 w-5" />
        Log Out
      </Button>
    </main>
  );
}
