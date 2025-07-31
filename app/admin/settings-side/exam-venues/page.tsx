"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ExamVenuePage() {
  const router = useRouter();
  const [venues, setVenues] = useState<string[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<string[]>([]);
  const [activeForm, setActiveForm] = useState<null | "add" | "edit">(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("venues");
    if (stored) {
      const parsed = JSON.parse(stored);
      setVenues(parsed);
      setFilteredVenues(parsed);
    }
  }, []);

  useEffect(() => {
    const filtered = venues.filter((venue) =>
      venue.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVenues(filtered);
  }, [searchQuery, venues]);

  const saveToStorage = (updated: string[]) => {
    setVenues(updated);
    setFilteredVenues(updated);
    localStorage.setItem("venues", JSON.stringify(updated));
  };

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    const updated = [...venues, inputValue.trim()];
    saveToStorage(updated);
    setInputValue("");
    setActiveForm(null);
  };

  const handleEdit = () => {
    if (selectedIndex === null || !inputValue.trim()) return;
    const updated = [...venues];
    updated[selectedIndex] = inputValue.trim();
    saveToStorage(updated);
    setInputValue("");
    setActiveForm(null);
  };

  const handleDelete = (index: number) => {
    const updated = venues.filter((_, i) => i !== index);
    saveToStorage(updated);
  };

  return (
    <main className="max-w-6xl mx-auto p-4 space-y-6">
      <header className="flex items-center space-x-2">
        <ArrowLeft
          className="h-5 w-5 cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-lg font-bold">Exam Venues</h1>
      </header>

      <div className="flex justify-between items-center">
        <Input
          placeholder="Search venue name"
          className="w-72"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          className="bg-indigo-600 text-white"
          onClick={() => {
            setActiveForm("add");
            setInputValue("");
          }}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Venue
        </Button>
      </div>

      <div className="space-y-2">
        {filteredVenues.map((venue, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-2 border rounded-md bg-gray-50"
          >
            <span>{venue}</span>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setSelectedIndex(index);
                  setInputValue(venue);
                  setActiveForm("edit");
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {activeForm && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-md flex flex-col items-center">
          <h3 className="text-md font-semibold mb-2 capitalize">
            {activeForm === "add" ? "Add Venue" : "Edit Venue"}
          </h3>
          <Input
            placeholder="Enter exam venue name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-80"
          />
          <Button
            className="mt-3 w-80 bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={activeForm === "add" ? handleAdd : handleEdit}
          >
            Save Venue
          </Button>
        </div>
      )}
    </main>
  );
}
