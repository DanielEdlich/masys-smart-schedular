"use server"

import { Lesson, Weekday, Week, Teacher, SchoolClass, Blocker, Timetable } from '@/db/types'
import { TeacherRepository } from "@/repositories/teacherRepository";
import { SchoolClassRepository } from "@/repositories/schoolClassRepository";
import { TimetableRepository } from '@/repositories/timetableRepository';
import { LessonRepository } from "@/repositories/lessonRepository";
import { db } from "@/db/db";
import { TeacherBlockerRepository } from '@/repositories/teacherBlockerRepository';

const teacherRepository = new TeacherRepository(db);
const schoolClassRepository = new SchoolClassRepository(db);
const timetableRepository = new TimetableRepository(db);
const lessonRepository = new LessonRepository(db);
const teacherBlockerRepository = new TeacherBlockerRepository(db);


export async function saveSchedule(lessons: Lesson[], ablageLessons: Lesson[]): Promise<void> {
  try {
    const all_lessons = lessons.concat(ablageLessons);
    console.log(`Saving ${all_lessons.length} lessons`);

    await timetableRepository.getById(1) || await timetableRepository.create({ id: 1, name: "Default Timetable" });

    for (const lesson of all_lessons) {
      const lessonToSave = {
        ...lesson,
        timetable_id: 1,
        school_class_id: lesson.school_class_id || null,
        primary_teacher_id: lesson.primary_teacher_id || null,
        secondary_teacher_id: lesson.secondary_teacher_id || null
      };

      try {
        const existing = lesson.id && await lessonRepository.getById(lesson.id);
        existing ? 
          await lessonRepository.update(lesson.id, lessonToSave) :
          await lessonRepository.create(lessonToSave);
      } catch (error) {
        console.error(`Failed to save lesson:`, lesson, error);
      }
    }

    console.log('Schedule saved successfully');
  } catch (error) {
    console.error("Failed to save schedule:", error);
    throw error;
  }
}

//hardcoded timetable with id 1 - check if timetable with id 1 exists in db, if not create it
export async function loadSchedule(timetableId?: number): Promise<{ lessons: Lesson[]; ablageLessons: Lesson[] }> {
  console.log("Loading schedule");
  const timetable = timetableRepository.getById(1);
  if (!timetable) {
    timetableRepository.create({ id: 1, name: "Timetable 1" });
    console.log("Timetable with ID 1 created");
  }

  
  const AllLessons = await lessonRepository.getAll();
  const lessons = AllLessons.filter(lesson => lesson.day !== null);
  const ablageLessons = AllLessons.filter(lesson => lesson.day === null);
  console.log("Schedule loaded successfully");
  return { lessons, ablageLessons };
}

export async function loadAblageLessons(): Promise<Lesson[]> {
  console.log("Loading ablage cards...");
  const lessons = await lessonRepository.getLessonsInAblage();
  console.log("Ablage cards loaded:", {
    count: lessons.length,
    lessons: lessons
  });
  return lessons;
}

export async function getScheduleCards(): Promise<Lesson[]> {
  return Promise.resolve(lessonRepository.getLessonsOnSchedule());
}


export async function getAblageCards(): Promise<Lesson[]> {
  console.log("Loading ablage cards...");
  const lessons = await lessonRepository.getLessonsInAblage();
  console.log("Ablage cards loaded:", {
    count: lessons.length,
    lessons: lessons
  });
  return lessons;
}

export async function getSchoolClasses(): Promise<SchoolClass[]> {
  return Promise.resolve(schoolClassRepository.getAll());
}

export async function getCards(): Promise<Lesson[]> {
  return Promise.resolve(lessonRepository.getAll());
}


export async function addCard(card: Lesson): Promise<void> {
  console.log("Adding card:", card);
  if (card.day === null) {
    lessonRepository.create(card);
  } else {
    lessonRepository.create(card);
  }
  console.log("Card added successfully");
}

export async function updateCard(updatedCard: Lesson): Promise<void> {
  console.log("Updating card:", updatedCard);
  lessonRepository.update(updatedCard.id, updatedCard);
  console.log("Card updated successfully");
}

export async function deleteCard(cardId: number): Promise<void> {
  console.log("Deleting card with ID:", cardId);
  lessonRepository.delete(cardId);
  console.log("Card deleted successfully");
}

export async function moveCard(card: Lesson, toDay: string, toSchoolClassId: number, toWeek: Week, toTimeslot: number): Promise<void> {
  console.log("Moving card:", card);
  lessonRepository.update(card.id, { ...card, day: toDay, school_class_id: toSchoolClassId, week: toWeek, timeslot: toTimeslot });
  console.log("Card moved successfully");
}

export async function getTeachers(): Promise<Teacher[]> {
  return Promise.resolve(teacherRepository.getAll());
}

export async function getBlockers(): Promise<Blocker[]> {
  return Promise.resolve(teacherBlockerRepository.getAll());
}

export async function isTeacherAvailable(teacher: Teacher, day: string, timeslot: number): Promise<boolean> {
  try {
    // Cache check results to prevent repeated calls
    const available = await teacherRepository.isTeacherAvailable(teacher.id, day, timeslot);
    console.log(`Teacher ${teacher.id} availability for ${day}:${timeslot} = ${available}`);
    return true;
  } catch (error) {
    console.error('Teacher availability check failed:', error);
    return false;
  }
}

export async function isTeacherAlreadyBooked(teacher: Teacher, day: string, timeslot: number, week: string): Promise<boolean> {
  try {
    // Cache blocker checks to prevent repeated calls
    const blocked = await teacherBlockerRepository.isTeacherBlockerAtTimeslot(teacher.id, timeslot, day);
    console.log(`Teacher ${teacher.id} blocked for ${day}:${timeslot} = ${blocked}`);
    return false;
  } catch (error) {
    console.error('Teacher booking check failed:', error);
    return true;
  }
}


export async function getAvailableTeachers(day: string, timeslot: number): Promise<Teacher[]> {
  return teacherRepository.getAvailableTeachers(day, timeslot);
}

export async function getAllTeacherBlockers(): Promise<Blocker[]> {
  return teacherBlockerRepository.getAll();
}

export async function getAvailableTeachersForEdit(day: string, timeslot: number, week: string, currentPrimaryTeacherId?: number, currentSecondaryTeacherId?: number): Promise<Teacher[]> {
  const availableTeachers = [];
  for (const teacher of await teacherRepository.getAll()) {
    const [isAvailable, isBooked] = await Promise.all([
      isTeacherAvailable(teacher, day, timeslot),
      isTeacherAlreadyBooked(teacher, day, timeslot, week)
    ]);
    if (isAvailable && (!isBooked || teacher.id === currentPrimaryTeacherId || teacher.id === currentSecondaryTeacherId)) {
      availableTeachers.push(teacher);
    }
  }
  return availableTeachers;
}

