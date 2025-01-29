import React from "react";
import { useDrop } from "react-dnd";
import { Lesson } from "@/db/types";
import { DraggableLesson } from "./draggable-lesson";
import { Teacher } from "@/db/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LessonForm } from "@/components/lehrplan/lesson-form";
import { useToast } from "@/hooks/use-toast";

type AblageProps = {
  lessons: Lesson[];
  onDrop: (lesson: Lesson) => void;
  moveLesson: (
    lesson: Lesson,
    toDay: string | null,
    toName: string | null,
    toWeek: string | null,
    toTimeslot: number | null,
  ) => Promise<void>;
  addLessonToAblage: (
    primary_teacher_id: number | null,
    type: string | null,
    secondary_teacher_id?: number | null,
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
  teachers: Teacher[];
  isTeacherAvailable: (
    teacher: Teacher,
    day: string,
    timeslot: number,
  ) => Promise<boolean>;
  isTeacherAlreadyBooked: (
    teacher: Teacher,
    day: string,
    timeslot: number,
    week: string,
  ) => Promise<boolean>;
  setDraggedLesson: (lesson: Lesson | null) => void;
};

export const Ablage: React.FC<AblageProps> = ({
  lessons = [],
  onDrop,
  moveLesson,
  addLessonToAblage,
  editLesson,
  deleteLesson,
  teachers,
  isTeacherAvailable,
  isTeacherAlreadyBooked,
  setDraggedLesson,
}) => {
  const [, drop] = useDrop({
    accept: "LESSON",
    drop: (item: Lesson) => {
      if (item.day !== null) {
        onDrop(item);
      } else {
        // If the item is already in Ablage, just update its position
        handleMoveLesson(item, "Ablage", "Ablage", "Ablage", lessons.length);
      }
    },
  });

  const [isNewLessonDialogOpen, setIsNewLessonDialogOpen] =
    React.useState(false);
  const { toast } = useToast();

  const handleMoveLesson = async (
    lesson: Lesson,
    toDay: string | null,
    toName: string | null,
    toWeek: string | null,
    toTimeslot: number | null,
  ) => {
    if (toDay === "Ablage" && toName === "Ablage") {
      // Moving within Ablage

      if (toTimeslot === null) {
        return;
      }

      const updatedLessons = lessons.filter((c) => c.id !== lesson.id);
      const newLesson = { ...lesson, timeslot: toTimeslot };
      updatedLessons.splice(toTimeslot, 0, newLesson);
      const reindexedLessons = updatedLessons.map((c, index) => ({
        ...c,
        timeslot: index,
      }));
      reindexedLessons.forEach((l) => onDrop(l));
    } else {
      // Moving to main schedule
      const primaryTeacher = teachers.find(
        (t) => t.id === lesson.primary_teacher_id,
      );
      if (primaryTeacher) {
        if (toTimeslot === null) {
          return;
        }
        const isAvailable = await isTeacherAvailable(
          primaryTeacher,
          toDay || "",
          toTimeslot + 1,
        );
        const isBooked = await isTeacherAlreadyBooked(
          primaryTeacher,
          toDay || "",
          toTimeslot,
          toWeek || "",
        );

        if (isAvailable) {
          if (isBooked) {
            toast({
              title: "Lehrer bereits gebucht",
              description:
                "Der Lehrer ist zu dieser Zeit bereits in einer anderen Klasse eingeplant",
              variant: "destructive",
            });
          } else {
            // Remove the lesson from Ablage
            onDrop(lesson);
            // Move the lesson to the main schedule
            moveLesson(lesson, toDay, toName, toWeek, toTimeslot);
          }
        } else {
          toast({
            title: "Lehrer nicht verfügbar",
            description: "Der Lehrer ist nicht verfügbar für diese Zeit",
            variant: "destructive",
          });
        }
      }
    }
  };

  return (
    <div
      // @ts-expect-error - ref is deprecated but still used in DnD
      ref={drop}
      className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
      style={{ height: "180px" }}
    >
      <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Ablage</h2>
        <Button onClick={() => setIsNewLessonDialogOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Neuer Unterricht
        </Button>
      </div>
      <div className="p-4 overflow-x-auto">
        <div className="flex gap-2" style={{ width: "max-content" }}>
          {lessons.map((lesson, index) => (
            <div key={lesson.id} className="w-32 h-16">
              <DraggableLesson
                lesson={{ ...lesson, timeslot: lesson.timeslot }}
                // @ts-expect-error - ref is deprecated but still used with DnD
                moveLesson={handleMoveLesson}
                editLesson={editLesson}
                deleteLesson={async (day, name, week, timeslot) => {
                  const lessonToDelete = lessons.find(
                    (l) => l.timeslot === timeslot,
                  );
                  if (lessonToDelete) {
                    await deleteLesson(null, null, null, timeslot);
                  }
                }}
                isInAblage={true}
                teachers={teachers}
                setDraggedLesson={setDraggedLesson}
              />
            </div>
          ))}
        </div>
      </div>
      <Dialog
        open={isNewLessonDialogOpen}
        onOpenChange={setIsNewLessonDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neuen Unterricht hinzufügen</DialogTitle>
          </DialogHeader>
          <LessonForm
            day={null}
            schoolClassId={null}
            week={null}
            timeslot={lessons.length}
            addLesson={async (
              _,
              __,
              ___,
              ____,
              primaryTeacherId,
              name,
              secondaryTeacherId,
            ) => {
              await addLessonToAblage(
                primaryTeacherId,
                name,
                secondaryTeacherId,
              );
              setIsNewLessonDialogOpen(false);
            }}
            editLesson={editLesson}
            deleteLesson={deleteLesson}
            onClose={() => setIsNewLessonDialogOpen(false)}
            isForAblage={true}
            teachers={teachers}
            onDelete={() => {}}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
