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

type ClassDialogProps = {
  initialClass: Omit<SchoolClass, "id">;
  onSubmit: (classData: Omit<SchoolClass, "id"> | SchoolClass) => Promise<void>;
  onCancel: () => void;
  teachers: Teacher[];
  title: string;
  isEditing?: boolean;
};

const TeacherSelectItem = ({ teacher }: { teacher: Teacher }) => (
  <SelectItem key={teacher.id} value={teacher.id.toString()}>
    <span
      style={{
        display: "inline-block",
        width: "10px",
        height: "10px",
        backgroundColor: teacher.color,
        marginRight: "8px",
      }}
    ></span>
    {`${teacher.first_name} ${teacher.last_name}`}
  </SelectItem>
);

export function ClassDialog({
  initialClass,
  onSubmit,
  onCancel,
  teachers,
  title,
  isEditing = false,
}: ClassDialogProps) {
  const [classData, setClassData] = useState<
    Omit<SchoolClass, "id"> | SchoolClass
  >(initialClass);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setClassData(initialClass);
  }, [initialClass]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassData({ ...classData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setClassData({
      ...classData,
      [name]: name.includes("teacher")
        ? value === "null"
          ? null
          : parseInt(value)
        : value,
    });
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
            <p className="text-xs text-gray-500">Zug auswählen</p>
            <Select
              name="track"
              value={classData.track}
              onValueChange={(value) => handleSelectChange("track", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Zug auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Zug A</SelectItem>
                <SelectItem value="B">Zug B</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs text-gray-500">Klassenlehrer auswählen</p>
            <Select
              name="primary_teacher_id"
              value={classData.primary_teacher_id.toString()}
              onValueChange={(value) =>
                handleSelectChange("primary_teacher_id", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Klassenlehrer auswählen" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <TeacherSelectItem key={teacher.id} teacher={teacher} />
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs text-gray-500">
              Co-Klassenlehrer auswählen (optional)
            </p>
            <Select
              name="secondary_teacher_id"
              value={classData.secondary_teacher_id?.toString() ?? "null"}
              onValueChange={(value) =>
                handleSelectChange("secondary_teacher_id", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Co-Klassenlehrer auswählen (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">Keiner</SelectItem>
                {teachers.map((teacher) => (
                  <TeacherSelectItem key={teacher.id} teacher={teacher} />
                ))}
              </SelectContent>
            </Select>
          </div>
          <div
            className={`flex ${isEditing ? "justify-end space-x-2" : "justify-center"}`}
          >
            {isEditing && (
              <>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Abbrechen
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Speichern..." : "Speichern"}
                </Button>
              </>
            )}
            {!isEditing && (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Hinzufügen..." : "Klasse hinzufügen"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
