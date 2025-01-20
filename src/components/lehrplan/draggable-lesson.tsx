import React, { useCallback, useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slot } from "@radix-ui/react-slot";
import { PencilRuler, Ban } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Lesson, Teacher } from '@/db/types';
import { LessonForm } from '@/components/lehrplan/lesson-form';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type DraggableLessonProps = {
  lesson: Lesson;
  moveLesson: (
    lesson: Lesson,
    toDay: string | null,
    toSchoolClassId: number | null,
    toWeek: string | null,
    toTimeslot: number | null,
  ) => void;
  editLesson: (
    day: string | null,
    schoolClassId: number | null,
    week: string | null,
    timeslot: number,
    primaryTeacherId: number | null,
    name: string | null,
    secondaryTeacherId?: number | null,
    isBlocker?: boolean,
  ) => void;
  deleteLesson: (
    day: string | null,
    schoolClassId: number | null,
    week: string | null,
    timeslot: number | null,
  ) => void;
  isInAblage?: boolean;
  teachers: Teacher[];
  setDraggedLesson: (lesson: Lesson | null) => void;
};

const getTeacherInitials = (teacherId: number | null, teachers: Teacher[]) => {
  const teacher = teachers.find(t => t.id === teacherId);
  return teacher ? `${teacher.first_name[0]}${teacher.last_name[0]}`.toUpperCase() : '';
};

const getTeacherFullName = (teacherId: number | null, teachers: Teacher[]) => {
  const teacher = teachers.find(t => t.id === teacherId);
  return teacher ? `${teacher.first_name} ${teacher.last_name}` : 'No teacher assigned';
};

export const DraggableLesson: React.FC<DraggableLessonProps> = ({
  lesson,
  moveLesson,
  editLesson,
  deleteLesson,
  isInAblage = false,
  teachers,
  setDraggedLesson,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "LESSON",
    item: () => {
      setDraggedLesson(lesson);
      return { 
        ...lesson, 
        day: isInAblage ? null : (lesson.day || null),
        school_class_id: isInAblage ? null : lesson.school_class_id,
        primary_teacher_id: lesson.primary_teacher_id,
        secondary_teacher_id: lesson.secondary_teacher_id
      };
    },
    end: (item, monitor) => {
      setDraggedLesson(null);
      if (!monitor.didDrop()) {
        // If the item was not dropped on a valid target, reset its position
        moveLesson(item, item.day, item.school_class_id, item.week, item.timeslot);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const dragRef = useCallback(
    (node: HTMLDivElement | null) => {
      drag(node);
    },
    [drag],
  );

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    if (lesson.day === null) {
      deleteLesson(null, null, null, lesson.timeslot);
    } else {
      deleteLesson(lesson.day, lesson.school_class_id, lesson.week, lesson.timeslot);
    }
    setIsDeleteDialogOpen(false);
    setIsEditDialogOpen(false);
  };

  return (
    <Card
      ref={dragRef}
      style={{ 
        opacity: isDragging ? 0.5 : 1, 
        backgroundColor: lesson.isBlocker 
          ? '#ff0000' 
          : (lesson.primary_teacher_id && teachers.find(t => t.id === lesson.primary_teacher_id)?.color) || '#FAFAFA'
      }}
      className="shadow-sm border-none w-full h-full"
    >
      <CardContent className="p-2 flex flex-col justify-between text-xs h-full relative overflow-hidden">
        {lesson.isBlocker ? (
          <div className="flex items-center justify-center h-full">
            <Ban className="text-gray-400" />
          </div>
        ) : (
          <>
            <div className="flex items-center w-full justify-between">
              <span className="font-bold truncate w-20">{lesson.name || 'Unnamed'}</span>
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full hover:bg-white/10"
                    onClick={() => setIsEditDialogOpen(true)}
                  >
                    <Slot>
                      <PencilRuler className="h-3 w-3" />
                    </Slot>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Unterricht bearbeiten</DialogTitle>
                  </DialogHeader>
                  <LessonForm
                    day={lesson.day}
                    schoolClassId={lesson.school_class_id}
                    week={lesson.week}
                    timeslot={lesson.timeslot}
                    addLesson={() => {}}
                    editLesson={(day, schoolClassId, week, timeslot, primaryTeacherId, name, secondaryTeacherId, isBlocker) => {
                      editLesson(day, schoolClassId, week, timeslot, primaryTeacherId, name, secondaryTeacherId, isBlocker);
                    }}
                    deleteLesson={handleDelete}
                    onClose={() => setIsEditDialogOpen(false)}
                    existingLesson={lesson}
                    isForAblage={isInAblage}
                    onDelete={handleDelete}
                    teachers={teachers}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute bottom-1 left-1 w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-[11px] font-semibold cursor-help">
                    {getTeacherInitials(lesson.primary_teacher_id, teachers)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {getTeacherFullName(lesson.primary_teacher_id, teachers)}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </CardContent>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Dies wird den Unterricht dauerhaft aus dem Stundenplan entfernen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              handleDelete();
            }}>
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

