import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Teacher, Lesson } from "@/db/types";
import { getAvailableTeachersForTimeslot } from "@/app/actions/classSchedulerActions";

type LessonFormProps = {
  day: string | null;
  schoolClassId: number | null;
  week: string | null;
  timeslot: number;
  teachers: Teacher[];
  addLesson: (
    day: string | null,
    schoolClassId: number | null,
    week: string | null,
    timeslot: number | null,
    primaryTeacherId: number | null,
    name: string | null,
    secondaryTeacherId?: number | null,
    isBlocker?: boolean,
  ) => Promise<void>;
  editLesson: (
    day: string | null,
    schoolClassId: number | null,
    week: string | null,
    timeslot: number | null,
    primaryTeacherId: number | null,
    name: string | null,
    secondaryTeacherId?: number | null,
    isBlocker?: boolean,
  ) => Promise<void>;
  deleteLesson: (
    day: string | null,
    schoolClassId: number | null,
    week: string | null,
    timeslot: number | null,
  ) => Promise<void>;
  existingLesson?: Lesson;
  onClose: () => void;
  onDelete: () => void;
  isForAblage?: boolean;
};

export const LessonForm: React.FC<LessonFormProps> = ({
  day,
  schoolClassId,
  week,
  timeslot,
  teachers,
  addLesson,
  editLesson,
  deleteLesson,
  existingLesson,
  onClose,
  onDelete,
  isForAblage = false,
}) => {
  const [primaryTeacherId, setPrimaryTeacherId] = useState<number | null>(
    existingLesson?.primary_teacher_id || null,
  );
  const [name, setName] = useState<string | null>(existingLesson?.name || null);
  const [secondaryTeacherId, setSecondaryTeacherId] = useState<number | null>(
    existingLesson?.secondary_teacher_id || null,
  );
  const [isBlocker, setIsBlocker] = useState<boolean>(
    existingLesson?.isBlocker || false,
  );
  const [availableTeachers, setAvailableTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    const fetchAvailableTeachers = async () => {
      if (day && week && !isForAblage) {
        const available = await getAvailableTeachersForTimeslot(
          day,
          timeslot + 1,
        );
        setAvailableTeachers(available);
      } else {
        setAvailableTeachers(teachers);
      }
    };

    fetchAvailableTeachers();
  }, [day, timeslot, week, isForAblage, teachers, existingLesson]);

  useEffect(() => {
    if (primaryTeacherId === null) {
      setSecondaryTeacherId(null);
    } else if (
      primaryTeacherId &&
      secondaryTeacherId &&
      primaryTeacherId === secondaryTeacherId
    ) {
      setSecondaryTeacherId(null);
    }
  }, [primaryTeacherId, secondaryTeacherId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (existingLesson) {
      await editLesson(
        day,
        schoolClassId,
        week,
        timeslot,
        primaryTeacherId,
        name,
        secondaryTeacherId,
        isBlocker,
      );
    } else {
      if (isForAblage) {
        await addLesson(
          null,
          null,
          null,
          timeslot,
          primaryTeacherId,
          name,
          secondaryTeacherId,
          isBlocker,
        );
      } else if (day && schoolClassId && week) {
        await addLesson(
          day,
          schoolClassId,
          week,
          timeslot,
          primaryTeacherId,
          name,
          secondaryTeacherId,
          isBlocker,
        );
      }
    }
    onClose();
  };

  const handleDelete = async () => {
    await deleteLesson(day, schoolClassId, week, timeslot);
    onDelete();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Findet statt:</Label>
          <div className="text-sm text-gray-600">
            {isForAblage
              ? "In der Ablage"
              : day && week && schoolClassId
                ? `${timeslot + 1}. Stunde, ${day}, Klasse ${schoolClassId}, Woche ${week}`
                : "Nicht zugewiesen"}
          </div>
        </div>
        {!isBlocker && (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Unterrichtsname</Label>
              <Input
                type="text"
                id="name"
                value={name || ""}
                onChange={(e) => setName(e.target.value)}
                placeholder="z.B. Mathematik, Deutsch, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher">Lehrer</Label>
              <Select
                value={primaryTeacherId?.toString() || "none"}
                onValueChange={(value: string) =>
                  setPrimaryTeacherId(value === "none" ? null : parseInt(value))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {availableTeachers.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: t.color }}
                        ></div>
                        {`${t.first_name} ${t.last_name}`}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryTeacher">
                Zweiter Lehrer (Optional)
              </Label>
              <Select
                value={secondaryTeacherId?.toString() || "none"}
                onValueChange={(value: string) =>
                  setSecondaryTeacherId(
                    value !== "none" ? parseInt(value) : null,
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select secondary teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {availableTeachers
                    .filter(
                      (t) => !primaryTeacherId || t.id !== primaryTeacherId,
                    )
                    .map((t) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: t.color }}
                          ></div>
                          {`${t.first_name} ${t.last_name}`}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        <div className="flex justify-between">
          <Button type="submit">
            {existingLesson ? "Aktualisieren" : "Hinzufügen"}
          </Button>
          {existingLesson && (
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Löschen
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};
