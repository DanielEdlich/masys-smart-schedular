"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SchoolClass, Teacher } from "@/db/types";

interface ClassDialogProps<T> {
  initialClass: T;
  onSubmit: (classData: T) => Promise<void>;
  onCancel: () => void;
  teachers: Teacher[];
  title: string;
  isEditing: boolean;
}

function TeacherSelectItem({ teacher }: { teacher: Teacher }) {
  return (
    <SelectItem key={teacher.id} value={teacher.id.toString()}>
      <span
        className="inline-block w-2.5 h-2.5 rounded-full mr-2"
        style={{ backgroundColor: teacher.color }}
      />
      {teacher.first_name} {teacher.last_name}
    </SelectItem>
  );
}

export function ClassDialog<T extends SchoolClass | Omit<SchoolClass, "id">>({
  initialClass,
  onSubmit,
  onCancel,
  teachers,
  title,
  isEditing,
}: ClassDialogProps<T>) {
  const [classData, setClassData] = useState<T>(initialClass);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setClassData(initialClass);
  }, [initialClass]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassData({ ...classData, [e.target.name]: e.target.value } as T);
  };

  const handleSelectChange = (name: string, value: string) => {
    const parsedValue = name.includes("teacher")
      ? value === "null"
        ? null
        : parseInt(value)
      : value;
    setClassData({ ...classData, [name]: parsedValue } as T);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(classData);
      onCancel();
    } catch (error) {
      console.error(`${isEditing ? "Editing" : "Adding"} class failed:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-xs text-gray-500">Klassenname</p>
            <Input
              name="name"
              placeholder="Klassenname"
              value={classData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <p className="text-xs text-gray-500">Jahrgang (z.B. 1-3, 4-6)</p>
            <Input
              name="year"
              placeholder="Jahrgang (z.B. 1-3, 4-6)"
              value={classData.year ?? ""}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <p className="text-xs text-gray-500">Zug</p>
            <Select
              name="track"
              value={classData.track}
              onValueChange={(value) => handleSelectChange("track", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Zug wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Zug A</SelectItem>
                <SelectItem value="B">Zug B</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs text-gray-500">Klassenlehrer</p>
            <Select
              name="primary_teacher_id"
              value={
                classData.primary_teacher_id
                  ? classData.primary_teacher_id.toString()
                  : "null"
              }
              onValueChange={(value) =>
                handleSelectChange("primary_teacher_id", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Klassenlehrer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">Keiner</SelectItem>
                {teachers.map((teacher) => (
                  <TeacherSelectItem key={teacher.id} teacher={teacher} />
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs text-gray-500">Co-Klassenlehrer (optional)</p>
            <Select
              name="secondary_teacher_id"
              value={
                classData.secondary_teacher_id
                  ? classData.secondary_teacher_id.toString()
                  : "null"
              }
              onValueChange={(value) =>
                handleSelectChange("secondary_teacher_id", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Co-Klassenlehrer (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">Keiner</SelectItem>
                {teachers.map((teacher) => (
                  <TeacherSelectItem key={teacher.id} teacher={teacher} />
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditing
                  ? "Speichert..."
                  : "Fügt hinzu..."
                : isEditing
                  ? "Speichern"
                  : "Hinzufügen"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
