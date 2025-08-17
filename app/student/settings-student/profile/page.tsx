"use client";
import { User, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StudentLayout } from "@/components/student-layout";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    firstName: "Motun",
    lastName: "Rayo",
    matricNumber: "012345678",
    phoneNumber: "+234 801 2345 678",
    email: "bulalabu@school.ng",
    faculty: "Faculty of Science",
    department: "Computer Science Department",
    level: "100 Level",
    profileImage: null as File | null,
  });
  const router = useRouter();

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "profileImage") {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput.files && fileInput.files.length > 0) {
        setProfile({ ...profile, profileImage: fileInput.files[0] });
      }
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Send to API later
    console.log("Profile Submitted:", profile);
    toast.success("Profile updated successfully!");
  };

  return (
    <StudentLayout>
      <div className="min-h-screen bg-white px-4 pt-6 pb-12 text-sm">
        <div className="max-w-6xl mx-auto p-4 space-y-6">
          <header className="flex items-center space-x-2">
            <h1 className="text-lg font-bold">Profile</h1>
          </header>
          {/* Profile avatar */}
          <div className="flex flex-col  mb-4">
            <label className="cursor-pointer ">
              <input
                type="file"
                name="profileImage"
                className="hidden "
                onChange={handleProfileChange}
              />
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mb-1">
                {/* You can show preview here later */}
                <User className="h-6 w-6 text-gray-700" />
              </div>
              <p className="text-xs text-purple-600 underline">
                Change Picture
              </p>
            </label>
          </div>

          {/* Profile Fields */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-600 mb-1">First Name</label>
              <input
                name="firstName"
                value={profile.firstName}
                onChange={handleProfileChange}
                className="w-100 px-3 py-2 rounded-lg bg-gray-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Last Name</label>
              <input
                name="lastName"
                value={profile.lastName}
                onChange={handleProfileChange}
                className="w-100 px-3 py-2 rounded-lg bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Matric Number</label>
              <input
                name="matricNumber"
                value={profile.matricNumber}
                onChange={handleProfileChange}
                className="w-100 px-3 py-2 rounded-lg bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Phone Number</label>
              <input
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleProfileChange}
                className="w-100 px-3 py-2 rounded-lg bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Email Address</label>
              <input
                name="email"
                type="email"
                value={profile.email}
                onChange={handleProfileChange}
                className="w-100 px-3 py-2 rounded-lg bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Faculty</label>

              <select
                className="input w-100 px-3 py-2 rounded-lg bg-gray-100 focus:outline-none "
                name="faculty"
                value={profile.faculty}
                onChange={handleProfileChange}
              >
                <option>Faculty of Science</option>
                <option>Faculty of Arts</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Department</label>
              <select
                className="input w-100 px-3 py-2 rounded-lg bg-gray-100 focus:outline-none"
                name="department"
                value={profile.department}
                onChange={handleProfileChange}
              >
                <option>Computer Science Department</option>
                <option>Mathematics Department</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Level</label>
              <select
                className="input w-100 px-3 py-2 rounded-lg bg-gray-100 focus:outline-none"
                name="level"
                value={profile.level}
                onChange={handleProfileChange}
              >
                <option>100 Level</option>
                <option>200 Level</option>
                <option>300 Level</option>
                <option>400 Level</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 w-100"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </StudentLayout>
  );
}
