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

type EditClassDialogProps = {
  schoolClass: SchoolClass;
  onEditClass: (updatedClass: SchoolClass) => Promise<void>;
  onCancel: () => void;
  teachers: Teacher[];
};

export function EditClassDialog({
  schoolClass,
  onEditClass,
  onCancel,
  teachers,
}: EditClassDialogProps) {
  const [editedClass, setEditedClass] = useState<SchoolClass>(schoolClass);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setEditedClass(schoolClass);
  }, [schoolClass]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedClass({ ...editedClass, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditedClass({
      ...editedClass,
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
      await onEditClass(editedClass);
    } catch (error) {
      console.error("Failed to edit class:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Klasse bearbeiten</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-gray-500">Klassenname</p>
          <Input
            name="name"
            placeholder="Klassenname"
            value={editedClass.name}
            onChange={handleInputChange}
            required
          />
          <p className="text-xs text-gray-500">Jahrgang</p>
          <Input
            name="year"
            placeholder="Jahrgang (z.B. 1-3, 4-6)"
            value={editedClass.year ?? ""}
            onChange={handleInputChange}
          />
          <p className="text-xs text-gray-500">Zug</p>
          <Select
            name="track"
            value={editedClass.track}
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
          <p className="text-xs text-gray-500">Klassenlehrer</p>
          <Select
            name="primary_teacher_id"
            value={editedClass.primary_teacher_id.toString()}
            onValueChange={(value) =>
              handleSelectChange("primary_teacher_id", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Klassenlehrer auswählen" />
            </SelectTrigger>
            <p className="text-xs text-gray-500">
              Co-Klassenlehrer auswählen (optional)
            </p>
            <SelectContent>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id.toString()}>
                  {`${teacher.first_name} ${teacher.last_name}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            name="secondary_teacher_id"
            value={editedClass.secondary_teacher_id?.toString() ?? "null"}
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
                <SelectItem key={teacher.id} value={teacher.id.toString()}>
                  {`${teacher.first_name} ${teacher.last_name}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Speichern..." : "Speichern"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
