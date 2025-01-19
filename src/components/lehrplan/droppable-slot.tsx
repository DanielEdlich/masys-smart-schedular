import React, { useState, useCallback, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Ban, X } from 'lucide-react';
import { DraggableLesson } from './draggable-lesson';
import { LessonForm } from '@/components/lehrplan/lesson-form';
import { Lesson, Teacher, SchoolClass, Blocker } from '@/db/types';
import { useToast } from "@/hooks/use-toast";

type DroppableSlotProps = {
  day: string;
  name: string;
  week: string;
  timeslot: number;
  lesson: Lesson | null;
  moveLesson: (
    lesson: Lesson,
    toDay: string | null,
    toSchoolClassId: number | null,
    toWeek: string | null,
    toTimeslot: number | null,
  ) => void;
  addLesson: (
    day: string,
    schoolClassId: number,
    week: string,
    timeslot: number,
    primaryTeacherId: number | null,
    name: string | null,
    secondaryTeacherId?: number | null,
    isBlocker?: boolean,
  ) => Promise<void>;
  editLesson: (
    day: string | null,
    schoolClassId: number | null,
    week: string | null,
    timeslot: number,
    primaryTeacherId: number | null,
    name: string | null,
    secondaryTeacherId?: number | null,
    isBlocker?: boolean,
  ) => Promise<void>;
  deleteLesson: (
    day: string | null,
    schoolClassId: number | null,
    week: string | null,
    timeslot: number,
  ) => Promise<void>;
  teachers: Teacher[];
  draggedLesson: Lesson | null;
  setDraggedLesson: (lesson: Lesson | null) => void;
  onDrop: (lesson: Lesson) => void;
  schoolClassId: number;
  teacherBlockers: Blocker[];
};

export const DroppableSlot: React.FC<DroppableSlotProps> = ({
  day,
  name,
  week,
  timeslot,
  lesson,
  moveLesson,
  addLesson,
  editLesson,
  deleteLesson,
  teachers,
  draggedLesson,
  setDraggedLesson,
  onDrop,
  schoolClassId,
  teacherBlockers
}) => {
  const { toast } = useToast();
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);

  const canDrop = useCallback((item: Lesson) => {
    if (lesson?.isBlocker) return false;
    
    // Check if it's the same slot
    if (item.day === day && item.week === week && item.timeslot === timeslot) {
      return true;
    }

    const primaryTeacher = teachers.find(t => t.id === item.primary_teacher_id);
    const secondaryTeacher = teachers.find(t => t.id === item.secondary_teacher_id);
    
    // Check if the teachers are available through teacherBlockers Array
    const checkTeacherAvailability = (teacher: Teacher | undefined) => {
      if (!teacher) return true;
      
      // Check if teacher has a blocker for this timeslot
      const hasBlocker = teacherBlockers.some(blocker => 
      blocker.teacher_id === teacher.id && 
      blocker.day === day && 
      blocker.timeslot_from <= timeslot && blocker.timeslot_to >= timeslot
      );

      // Check if it's the same teacher in the current lesson (if editing)
      const isCurrentTeacher = teacher.id === lesson?.primary_teacher_id || 
                  teacher.id === lesson?.secondary_teacher_id;

      return !hasBlocker || isCurrentTeacher;
    };

    return checkTeacherAvailability(primaryTeacher) && checkTeacherAvailability(secondaryTeacher);
  }, [day, week, timeslot, lesson, teachers]);

  const handleDrop = useCallback((item: Lesson) => {
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
      if (item.day === null) {
        // If the item is coming from Ablage, remove it from there first
        onDrop(item);
      }
      moveLesson(item, day, schoolClassId, week, timeslot);
    }
  }, [day, schoolClassId, week, timeslot, lesson, canDrop, toast, onDrop, moveLesson]);

  const [{ isOver, canDrop: canDropItem }, drop] = useDrop<Lesson, void, { isOver: boolean; canDrop: boolean }>({
    accept: "LESSON",
    canDrop,
    drop: handleDrop,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  

  React.useEffect(() => {
    const checkAvailability = async () => {
      if (draggedLesson) {
        const canDropHere = await canDrop(draggedLesson);
        setIsUnavailable(!canDropHere);
      } else {
        setIsUnavailable(false);
      }
    };
    checkAvailability();
  }, [draggedLesson, canDrop]);

  React.useEffect(() => {
    if (draggedLesson && !canDropItem) {
      setIsHighlighted(true);
    } else {
      setIsHighlighted(false);
    }
  }, [draggedLesson, canDropItem]);

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

  const dropRef = useCallback(
    (node: HTMLDivElement | null) => {
      drop(node);
    },
    [drop],
  );

  React.useEffect(() => {
    console.log(`DroppableSlot updated: day=${day}, class=${schoolClassId}, week=${week}, timeslot=${timeslot}, hasLesson=${!!lesson}`);
  }, [day, schoolClassId, week, timeslot, lesson]);

  return (
    <div
      ref={dropRef}
      className={`w-32 h-16 relative rounded-md overflow-hidden ${
        isUnavailable ? 'bg-red-200' : isOver && canDropItem ? 'bg-green-200' : ''
      }`}
    >
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

