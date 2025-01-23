import React, { useCallback, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { Button } from "@/components/ui/button";
import { Ban, X } from 'lucide-react';
import { DraggableLesson } from './draggable-lesson';
import { Lesson, Teacher, Blocker } from '@/db/types';
import { useToast } from "@/hooks/use-toast";

type DroppableSlotProps = {
  day: string;
  name: string;
  week: string;
  timeslot: number | null;
  lesson: Lesson | null;
  moveLesson: (
    lesson: Lesson,
    toDay: string | null,
    toSchoolClassId: number | null,
    toWeek: string | null,
    toTimeslot: number | null,
  ) => Promise<void>;
  addLesson: (
    day: string,
    schoolClassId: number,
    week: string,
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
  teachers: Teacher[];
  draggedLesson: Lesson | null;
  setDraggedLesson: (lesson: Lesson | null) => void;
  schoolClassId: number;
  teacherBlockers: Blocker[];
};

export const DroppableSlot: React.FC<DroppableSlotProps> = ({
  day,
  week,
  timeslot,
  lesson,
  moveLesson,
  addLesson,
  editLesson,
  deleteLesson,
  teachers,
  setDraggedLesson,
  schoolClassId,
  teacherBlockers,
}) => {
  const { toast } = useToast();

  const canDrop = useCallback(
    (item: Lesson) => {
      // If this slot is blocked, can't drop
      if (lesson?.isBlocker) return false;

      // Same slot is always allowed (e.g., to allow editing in place)
      if (item.day === day && item.week === week && item.timeslot === timeslot) {
        return true;
      }

      // Check teacher availability
      const primaryTeacher = teachers.find(t => t.id === item.primary_teacher_id);
      const secondaryTeacher = teachers.find(t => t.id === item.secondary_teacher_id);

      const checkTeacherAvailability = (teacher: Teacher | undefined) => {
        if (!teacher) return true;

        if (timeslot === null) return true;

        // Does this teacher have a time-blocker here?
        const hasBlocker = teacherBlockers.some(
          blocker =>
            blocker.teacher_id === teacher.id &&
            blocker.day === day &&
            blocker.timeslot_from <= timeslot &&
            blocker.timeslot_to >= timeslot
        );

        // It's still okay if this teacher is already the one in this slot
        const isCurrentTeacher =
          teacher.id === lesson?.primary_teacher_id || teacher.id === lesson?.secondary_teacher_id;

        return !hasBlocker || isCurrentTeacher;
      };

      return checkTeacherAvailability(primaryTeacher) && checkTeacherAvailability(secondaryTeacher);
    },
    [day, week, timeslot, lesson, teachers, teacherBlockers]
  );

  const handleDrop = useCallback(
    (item: Lesson) => {
      if (
        !lesson?.isBlocker &&
        (item.day === null ||
          item.day !== day ||
          item.school_class_id !== schoolClassId ||
          item.week !== week ||
          item.timeslot !== timeslot)
      ) {
        const dropCheck = canDrop(item);

        if (!dropCheck) {
          toast({
            title: "Lehrer nicht verfügbar",
            description: "Einer oder beide Lehrer sind nicht verfügbar für diese Zeit",
            variant: "destructive",
          });
          return;
        }

        console.log("Moving lesson:", item, "to:", { day, schoolClassId, week, timeslot });

        moveLesson(item, day, schoolClassId, week, timeslot);
      }
    },
    [day, schoolClassId, week, timeslot, lesson, canDrop, toast, moveLesson]
  );

  const [, drop] = useDrop<Lesson, void>({
    accept: "LESSON",
    canDrop,
    drop: handleDrop,
  });

  const toggleBlock = async () => {
    console.log("Toggling block for:", { day, schoolClassId, week, timeslot });
    if (lesson?.isBlocker) {
      await deleteLesson(day, schoolClassId, week, timeslot);
      toast({
        title: "Blocker entfernt",
        description: "Der Zeitblock wurde erfolgreich entfernt.",
      });
    } else {
      await addLesson(day, schoolClassId, week, timeslot, null, "Blocker", null, true);
      toast({
        title: "Blocker hinzugefügt",
        description: "Der Zeitblock wurde erfolgreich hinzugefügt.",
      });
    }
  };

  useEffect(() => {
    console.log(
      `DroppableSlot updated: day=${day}, class=${schoolClassId}, week=${week}, timeslot=${timeslot}, hasLesson=${!!lesson}`
    );
  }, [day, schoolClassId, week, timeslot, lesson]);

  return (
    // @ts-ignore
    <div ref={drop} className="w-32 h-16 relative rounded-md overflow-hidden">
      {lesson?.isBlocker ? (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <Ban className="text-gray-400" />
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-0 right-0 h-4 w-4 p-0 rounded-full bg-white shadow-sm"
            onClick={toggleBlock}
            title="Zeitfenster entsperren"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : lesson ? (
        <DraggableLesson
          lesson={lesson}
          moveLesson={moveLesson}
          editLesson={editLesson}
          deleteLesson={deleteLesson}
          teachers={teachers}
          setDraggedLesson={setDraggedLesson}
        />
      ) : (
        <Button
          variant="ghost"
          className="h-full w-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50"
          onClick={toggleBlock}
          title="Zeitfenster sperren"
        >
          <Ban className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};