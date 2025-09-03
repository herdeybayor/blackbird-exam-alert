import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAdmin } from "@/app/helpers/admin";

export default async function Home() {
  const admin = await getAdmin();
  const showAdminPortal = !!admin;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🕒📩</span>
            <h1 className="text-2xl font-bold text-indigo-600">Exam Alert</h1>
          </div>
          
          {/* Conditional Admin Link */}
          {showAdminPortal && (
            <Link href="/admin/dashboard">
              <Button variant="outline" size="sm">
                Admin Portal
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Stay Informed About Your Exams
            </h2>
            <p className="text-xl text-gray-600 max-w-lg mx-auto">
              Access your personalized exam schedule, get reminders, and never miss an important exam again.
            </p>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/student/dashboard">
              <Button size="lg" className="w-full sm:w-auto px-8">
                Student Dashboard
              </Button>
            </Link>
            <Link href="/student/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
                Student Login
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">📅</div>
                <h3 className="font-semibold mb-2">Personalized Schedule</h3>
                <p className="text-sm text-gray-600">
                  View exams specific to your department and faculty
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">🔔</div>
                <h3 className="font-semibold mb-2">Smart Reminders</h3>
                <p className="text-sm text-gray-600">
                  Set personalized reminders for your important exams
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">🏛️</div>
                <h3 className="font-semibold mb-2">Venue Information</h3>
                <p className="text-sm text-gray-600">
                  Get detailed information about exam venues and halls
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-4 mt-8">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
          <p>&copy; 2025 Exam Alert System. Built for academic excellence.</p>
        </div>
      </footer>
    </div>
  );
}
