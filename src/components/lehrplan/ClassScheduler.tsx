"use client";

import React, { useState, useCallback, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Ablage } from '@/components/lehrplan/ablage';
import { DroppableSlot } from '@/components/lehrplan/droppable-slot';
import { Lesson, Teacher, SchoolClass, Blocker, Timetable } from '@/db/types';
import { getSchoolClasses, getTeachers, addCard, deleteCard, moveCard, loadSchedule, getBlockers, getAvailableTeachers, getAvailableTeachersForEdit, getScheduleCards, getAblageCards, saveSchedule, getAllTeacherBlockers } from '@/app/actions/classSchedulerActions';
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';



const weekdays = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag"
] as const;

const weeks = ["A", "B"] as const;

const timeSlots = Array.from({ length: 8 }, (_, i) => i + 1);

type WeekSchedule = {
  [week in string]: (Lesson | null)[];
};

type ClassSchedule = {
  [schoolClassId: number]: WeekSchedule;
};

type Schedule = Record<string, ClassSchedule>;

type ClassSchedulerProps = {
  initialSchedule?: Schedule;
};

export default function ClassScheduler({
  initialSchedule,
}: ClassSchedulerProps = {}) {
  const [schedule, setSchedule] = useState<Schedule>(initialSchedule || {} as Schedule);
  const [ablageLessons, setAblageLessons] = useState<Lesson[]>([]);
  const [schoolClasses, setSchoolClasses] = useState<SchoolClass[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [blockers, setBlockers] = useState<Blocker[]>([]);
  const [draggedLesson, setDraggedLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [teacherBlockers ] = useState<Blocker[]>([]);

  const { toast } = useToast();

  const sortedSchoolClasses = React.useMemo(() => {
    return [...schoolClasses].sort((a, b) => {
      if (a.track !== b.track) return a.track.localeCompare(b.track);
      if (a.year !== b.year) return (a.year ?? '').localeCompare(b.year ?? '');
      return a.name.localeCompare(b.name);
    });
  }, [schoolClasses]);

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedClasses, fetchedTeachers, fetchedBlockers, fetchedLessons, fetchedAblageLessons, teacherBlockers] = await Promise.all([
          getSchoolClasses(),
          getTeachers(),
          getBlockers(),
          getScheduleCards(),
          getAblageCards(),
          getAllTeacherBlockers()
        ]);

        if (!controller.signal.aborted) {
          setSchoolClasses(fetchedClasses);
          setTeachers(fetchedTeachers);
          setBlockers(fetchedBlockers);
          setBlockers(teacherBlockers);

          const newSchedule = initializeSchedule(fetchedClasses, fetchedLessons);
          
          setAblageLessons(fetchedAblageLessons);
          setSchedule(newSchedule);
          console.log("Ablage lessons", fetchedAblageLessons);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Error fetching data:", error);
          toast({
            title: "Fehler beim Laden",
            description: "Die Daten konnten nicht geladen werden. Bitte versuchen Sie es erneut.",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [toast]);

  const initializeSchedule = (classes: SchoolClass[], lessons: Lesson[]): Schedule => {
    console.log('Initializing schedule with:', { 
      classCount: classes.length, 
      lessonCount: lessons.length 
    });
  
    // Create empty schedule structure
    const newSchedule = weekdays.reduce((schedule, day) => {
      schedule[day] = classes.reduce((classSchedule, schoolClass) => {
        classSchedule[schoolClass.id] = weeks.reduce((weekSchedule, week) => {
          weekSchedule[week] = Array(timeSlots.length).fill(null);
          return weekSchedule;
        }, {} as WeekSchedule);
        return classSchedule;
      }, {} as ClassSchedule);
      return schedule;
    }, {} as Schedule);
  
    // Insert lessons into schedule
    lessons.forEach((lesson) => {
      try {
        if (!lesson) {
          console.warn('Skipping null/undefined lesson');
          return;
        }
  
        const { day, school_class_id, week, timeslot } = lesson;
  
        if (!day || !school_class_id || !week || timeslot === undefined) {
          console.warn('Skipping invalid lesson:', lesson);
          return;
        }
  
        if (!newSchedule[day]?.[school_class_id]?.[week]) {
          console.warn(
            'Invalid schedule position:',
            { day, school_class_id, week, timeslot }
          );
          return;
        }
        
        newSchedule[day][school_class_id][week][timeslot] = lesson;
        
      } catch (error) {
        console.error('Error adding lesson to schedule:', error);
      }
    });
  
    console.log('Schedule initialized');
    return newSchedule;
  };

  const updateScheduleState = useCallback((updater: (prevSchedule: Schedule) => Schedule) => {
    setSchedule(updater);
    setHasUnsavedChanges(true);
  }, []);

  //check teacherBlockers for the given teacherId and return true or false
  const isTeacherAvailable = async (
    teacher: Teacher | undefined,
    day: string,
    timeslot: number,
    week: string,
    draggedLesson?: Lesson
  ): Promise<boolean> => {
    // If no teacher, they're available
    if (!teacher) return true;
  
    // Find all blockers for this teacher
    const teacherBlockers = blockers.filter(
      blocker => 
        blocker.teacher_id === teacher.id && 
        blocker.day === day
    );
  
    // Check if any blocker covers the requested timeslot
    const isBlocked = teacherBlockers.some(blocker => 
      timeslot >= blocker.timeslot_from && 
      timeslot <= blocker.timeslot_to
    );

    // check if the teacher is already booked for this timeslot on the same day in the week(A or B)
    const isBooked = Object.values(schedule).some(classSchedule => 
      Object.values(classSchedule).some(weekSchedule => 
        weekSchedule[week]?.[timeslot] && (
          (weekSchedule[week][timeslot]?.primary_teacher_id === teacher.id ||
           weekSchedule[week][timeslot]?.secondary_teacher_id === teacher.id) &&
           // Exclude current lesson from check
           (weekSchedule[week][timeslot]?.id !== draggedLesson?.id)

        )
      )
    );
    
    return !isBlocked && !isBooked;
  };

  const moveLessonHandler = useCallback(
    async (lesson: Lesson, toDay: string, toSchoolClassId: number, toWeek: string, toTimeslot: number) => {
      
      try {
        // First check position
        if (lesson.day === toDay && 
            lesson.school_class_id === toSchoolClassId &&
            lesson.week === toWeek && 
            lesson.timeslot === toTimeslot) {
          return;
        }
  
        // Then do teacher checks
        const primaryTeacher = teachers.find(t => t.id === lesson.primary_teacher_id);
        const secondaryTeacher = teachers.find(t => t.id === lesson.secondary_teacher_id);
  
        const [primaryAvailable, secondaryAvailable] = await Promise.all([
                isTeacherAvailable(primaryTeacher, toDay, toTimeslot, toWeek as string, lesson),
                isTeacherAvailable(secondaryTeacher, toDay, toTimeslot, toWeek as string, lesson)
        ]);
  
        if (!primaryAvailable || !secondaryAvailable) {
          toast({
            title: "Lehrer nicht verfügbar",
            description: "Einer oder beide Lehrer sind nicht verfügbar für diese Zeit",
            variant: "destructive",
          });
          return;
        }

        // the schedule state is not saved
        setHasUnsavedChanges(true);

        // Finally update UI state
        updateScheduleState((prevSchedule) => {
          const newSchedule = { ...prevSchedule };
          if (lesson.day && lesson.school_class_id !== null && lesson.week) {
            newSchedule[lesson.day][lesson.school_class_id][lesson.week][lesson.timeslot] = null;
          }
          if (!newSchedule[toDay][toSchoolClassId][toWeek]) {
            newSchedule[toDay][toSchoolClassId][toWeek] = Array(timeSlots.length).fill(null);
          }
          newSchedule[toDay][toSchoolClassId][toWeek][toTimeslot] = {
            ...lesson,
            day: toDay,
            school_class_id: toSchoolClassId,
            week: toWeek,
            timeslot: toTimeslot,
          };
          return newSchedule;
        });
  
        if (lesson.day === null) {
          setAblageLessons(prev => prev.filter(l => l.id !== lesson.id));
        }
  
      } catch (error) {
        console.error("Move failed:", error);
        toast({
          title: "Fehler",
          description: "Verschieben nicht möglich",
          variant: "destructive"
        });
      }
    },
    [teachers, moveCard, updateScheduleState, setAblageLessons, toast]
  );

  const addLessonHandler = useCallback(
    async (
      day: string  | null,
      schoolClassId: number,
      week: string | null,
      timeslot: number | null,
      primaryTeacherId: number | null,
      name: string | null,
      secondaryTeacherId?: number | null,
      isBlocker?: boolean,
    ) => {
      const newLesson: Lesson = {
        id: Date.now(),
        day: day as unknown as string,
        week,
        timeslot,
        name,
        timetable_id: 1,
        school_class_id: schoolClassId,
        primary_teacher_id: primaryTeacherId,
        secondary_teacher_id: secondaryTeacherId || null,
        isBlocker: isBlocker || false,
      };

      try {
        await addCard(newLesson);
        toast({
          title: isBlocker ? "Blocker hinzugefügt" : "Unterricht hinzugefügt",
          description: isBlocker ? "Der Zeitblock wurde erfolgreich hinzugefügt." : "Der neue Unterricht wurde erfolgreich hinzugefügt.",
        });

        updateScheduleState((prevSchedule) => {
          const newSchedule = { ...prevSchedule };
          if (!newSchedule[day]) newSchedule[day] = {};
          if (!newSchedule[day][schoolClassId]) newSchedule[day][schoolClassId] = {};
          if (!newSchedule[day][schoolClassId][week]) newSchedule[day][schoolClassId][week] = Array(timeSlots.length).fill(null);
          newSchedule[day][schoolClassId][week][timeslot] = newLesson;
          return newSchedule;
        });
      } catch (error) {
        console.error("Error adding lesson:", error);
        toast({
          title: "Fehler",
          description: isBlocker ? "Der Zeitblock konnte nicht hinzugefügt werden. Bitte versuchen Sie es erneut." : "Der Unterricht konnte nicht hinzugefügt werden. Bitte versuchen Sie es erneut.",
          variant: "destructive",
        });
      }
    },
    [toast, addCard, updateScheduleState],
  );

  const editLessonHandler = useCallback(
    async (
      day: string  | null,
      schoolClassId: number | null,
      week: string | null,
      timeslot: number,
      primaryTeacherId: number | null,
      name: string | null,
      secondaryTeacherId?: number | null,
      isBlocker?: boolean,
    ) => {
      const updatedLesson: Lesson = {
        id: day === null ? Date.now() : Number(`${day == null ? 0 : 1}${schoolClassId}${week === 'A' ? 1 : 2}${timeslot}`),
        day,
        school_class_id: schoolClassId,
        week,
        timeslot,
        name,
        timetable_id: 1,
        primary_teacher_id: primaryTeacherId,
        secondary_teacher_id: secondaryTeacherId || null,
        isBlocker: isBlocker || false,
      };

      try {

        setHasUnsavedChanges(true);

        toast({
          title: "Unterricht aktualisiert",
          description: "Der Unterricht wurde erfolgreich aktualisiert.",
        });

        if (day === null) {
          setAblageLessons((prevLessons) => 
            prevLessons.map((lesson) => 
              lesson.timeslot === timeslot ? updatedLesson : lesson
            )
          );
        } else {
          updateScheduleState((prevSchedule) => {
            const newSchedule = { ...prevSchedule };
            if (!newSchedule[day]) newSchedule[day] = {};
            if (!newSchedule[day][schoolClassId]) newSchedule[day][schoolClassId] = {};
            if (!newSchedule[day][schoolClassId][week]) newSchedule[day][schoolClassId][week] = Array(timeSlots.length).fill(null);
            newSchedule[day][schoolClassId][week][timeslot] = updatedLesson;
            return newSchedule;
          });
        }
      } catch (error) {
        console.error("Error updating lesson:", error);
        toast({
          title: "Fehler",
          description: "Der Unterricht konnte nicht aktualisiert werden. Bitte versuchen Sie es erneut.",
          variant: "destructive",
        });
      }
    },
    [toast, updateScheduleState],
  );

  const deleteLessonHandler = useCallback(
    async (day: string  | null, schoolClassId: number | null, week: string | null, timeslot: number | null) => {
      try {
        if (day === null) {
          const lessonToDelete = ablageLessons.find((lesson) => lesson.timeslot === timeslot);
          if (lessonToDelete) {
            setHasUnsavedChanges(true);
            setAblageLessons((prevLessons) => {
              const updatedLessons = prevLessons.filter((lesson) => lesson.id !== lessonToDelete.id);
              return updatedLessons.map((lesson, idx) => ({ ...lesson, timeslot: idx }));
            });
          }
        } else {
          updateScheduleState((prevSchedule) => {
            const newSchedule = { ...prevSchedule };
            if (newSchedule[day]?.[schoolClassId]?.[week]) {
              const lessonToDelete = newSchedule[day][schoolClassId][week][timeslot];
              if (lessonToDelete) {
                setHasUnsavedChanges(true);
                newSchedule[day][schoolClassId][week][timeslot] = null;
                toast({
                  title: lessonToDelete.isBlocker ? "Blocker entfernt" : "Unterricht gelöscht",
                  description: lessonToDelete.isBlocker ? "Der Zeitblock wurde erfolgreich entfernt." : "Der Unterricht wurde erfolgreich gelöscht.",
                });
              }
            }
            return newSchedule;
          });
        }
      } catch (error) {
        console.error("Error deleting lesson:", error);
        toast({
          title: "Fehler",
          description: "Der Unterricht konnte nicht gelöscht werden. Bitte versuchen Sie es erneut.",
          variant: "destructive",
        });
      }
    },
    [ablageLessons, setAblageLessons, deleteCard, toast, updateScheduleState],
  );

  const handleDropToAblage = useCallback(async (lesson: Lesson) => {
    console.log("Dropping lesson to Ablage:", lesson);
    try {
      if (lesson.day !== null) {
        await deleteCard(lesson.id);
        updateScheduleState((prevSchedule) => {
          const newSchedule = { ...prevSchedule };
          if (lesson.day && lesson.school_class_id !== null && lesson.week !== null) {
            if (newSchedule[lesson.day]?.[lesson.school_class_id]?.[lesson.week]) {
              newSchedule[lesson.day][lesson.school_class_id][lesson.week][lesson.timeslot] = null;
            }
          }
          return newSchedule;
        });
        const newLesson: Lesson = { 
          ...lesson, 
          day: null, 
          week: null, 
          school_class_id: null, 
          timeslot: ablageLessons?.length ?? 0,
        };
        await addCard(newLesson);
        setAblageLessons((prevLessons) => [...(prevLessons || []), newLesson]);
      } else {
        // If the lesson is already in Ablage, just update its position
        setAblageLessons((prevLessons) => {
          if (!prevLessons) return [lesson];
          const updatedLessons = prevLessons.filter((l) => l.id !== lesson.id);
          updatedLessons.splice(lesson.timeslot, 0, lesson);
          return updatedLessons.map((l, index) => ({ ...l, timeslot: index, day: null }));
        });
      }
    } catch (error) {
      console.error("Error dropping lesson to Ablage:", error);
      toast({
        title: "Fehler",
        description: "Der Unterricht konnte nicht in die Ablage verschoben werden. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    }
  }, [ablageLessons, deleteCard, addCard, toast, updateScheduleState]);

  const addLessonToAblage = useCallback(
    async (
      primaryTeacherId: number | null,
      name: string | null,
      secondaryTeacherId?: number | null
    ) => {
      const newLesson: Lesson = {
        id: Date.now(),
        day: null,
        week: null,
        timeslot: ablageLessons?.length ?? 0,
        name,
        timetable_id: 1,
        school_class_id: null,
        primary_teacher_id: primaryTeacherId,
        secondary_teacher_id: secondaryTeacherId || null,
        isBlocker: false,
      };
      try {
        await addCard(newLesson);
        setAblageLessons((prevLessons) => [...(prevLessons || []), newLesson]);
        setHasUnsavedChanges(true);
        console.log("Current ablage lessons:", ablageLessons);
        
        toast({
          title: "Unterricht hinzugefügt",
          description: "Der neue Unterricht wurde erfolgreich zur Ablage hinzugefügt.",
        });
      } catch (error) {
        console.error("Error adding lesson to Ablage:", error);
        toast({
          title: "Fehler",
          description: "Der Unterricht konnte nicht zur Ablage hinzugefügt werden. Bitte versuchen Sie es erneut.",
          variant: "destructive",
        });
      }
    },
    [ablageLessons, addCard, toast],
  );

  const handleSaveSchedule = useCallback(async () => {
    try {
      const allLessons = Object.values(schedule).flatMap(classSchedule =>
        Object.values(classSchedule).flatMap(weekSchedule =>
          Object.values(weekSchedule).flatMap(daySchedule =>
            (daySchedule || []).filter((lesson): lesson is Lesson => lesson !== null)
          )
        )
      );

      await saveSchedule(allLessons, ablageLessons);
      setHasUnsavedChanges(false);
      toast({
        title: "Gespeichert",
        description: "Der Stundenplan wurde erfolgreich gespeichert.",
      });
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast({
        title: "Fehler beim Speichern",
        description: "Der Stundenplan konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    }
  }, [schedule, ablageLessons, toast]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 flex flex-col h-screen w-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Class Scheduler</h1>
          <div className="flex items-center space-x-4">
            <Button onClick={handleSaveSchedule} disabled={!hasUnsavedChanges || isLoading}>
              <Save className="w-4 h-4 mr-2" />
              Stundenplan speichern
            </Button>
          </div>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p>Lädt den Stundenplan...</p>
          </div>
        ) : (
          <div className="overflow-auto flex-grow pb-64">
            <div className="w-full relative">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-20 bg-white">
                  <tr className="sticky top-0 z-20">
                    <th className="border p-2 bg-purple-50 sticky left-0 z-30 min-w-[100px]"></th>
                    <th className="border p-2 bg-purple-50 sticky left-[100px] z-30 min-w-[50px]"></th>
                    {sortedSchoolClasses.map((schoolClass) => (
                      <th
                        key={schoolClass.id}
                        colSpan={2}
                        className="border p-2 bg-purple-50"
                      >
                        {`${schoolClass.track}${schoolClass.year} ${schoolClass.name}`}
                      </th>
                    ))}
                  </tr>
                  <tr className="sticky top-[41px] z-20 bg-white">
                    <th className="border p-2 bg-purple-50 sticky left-0 z-30"></th>
                    <th className="border p-2 bg-purple-50 sticky z-30 min-w-[50px]"></th>
                    {sortedSchoolClasses.flatMap((schoolClass) =>
                      weeks.map((week) => (
                        <th
                          key={`${schoolClass.id}-${week}`}
                          className="border p-2 bg-purple-50"
                        >
                          Woche {week}
                        </th>
                      )),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {weekdays.map((day) => (
                    <React.Fragment key={day}>
                      {timeSlots.map((slot, slotIndex) => (
                        <tr key={`${day}-${slot}`}>
                          {slotIndex === 0 && (
                            <th
                              rowSpan={8}
                              className="border p-2 bg-purple-50 sticky left-0 z-10 w-32"
                            >
                              {day}
                            </th>
                          )}
                          <td className="border p-2 bg-purple-50 sticky left-[100px] z-10 w-16 text-center">
                            {slot}
                          </td>
                          {sortedSchoolClasses.map((schoolClass) =>
                            weeks.map((week) => (
                              <td
                                key={`${day}-${schoolClass.id}-${week}-${slot}`}
                                className="border p-1"
                              >
                                <DroppableSlot
                                  day={day}
                                  name={schoolClass.name}
                                  schoolClassId={schoolClass.id}
                                  week={week}
                                  timeslot={slotIndex}
                                  lesson={
                                    schedule[day]?.[schoolClass.id]?.[week]?.[slotIndex] || null
                                  }
                                  moveLesson={moveLessonHandler}
                                  addLesson={addLessonHandler}
                                  editLesson={editLessonHandler}
                                  deleteLesson={deleteLessonHandler}
                                  teachers={teachers}
                                  draggedLesson={draggedLesson}
                                  setDraggedLesson={setDraggedLesson}
                                  onDrop={handleDropToAblage}
                                  teacherBlockers={teacherBlockers}
                                />
                              </td>
                            )),
                          )}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <Ablage 
          lessons={ablageLessons || []} 
          onDrop={handleDropToAblage} 
          moveLesson={moveLessonHandler} 
          addLessonToAblage={addLessonToAblage}
          editLesson={editLessonHandler}
          deleteLesson={deleteLessonHandler}
          teachers={teachers}
          isTeacherAvailable={isTeacherAvailable}
          setDraggedLesson={setDraggedLesson}
        />
        <Toaster />
      </div>
    </DndProvider>
  );
}

