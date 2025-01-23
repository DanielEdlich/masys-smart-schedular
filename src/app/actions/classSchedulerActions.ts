"use server"

import { Lesson, Teacher, SchoolClass, Blocker } from '@/db/types'
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
    // Step 1: Ensure timetable exists (later we can support multiple timetables)
    const timetable = await timetableRepository.getById(1);
    if (!timetable) {
      await timetableRepository.create({ id: 1, name: "Default Timetable" });
    }
    
    // Step 2: Get all existing lessons to track duplicates
    const existingLessons = await lessonRepository.getAll();
    console.log('Existing lessons:', existingLessons.length);

    // Step 3: Create a Set of lesson IDs for O(1) lookup
    const processedIds = new Set<number>();
    
    // Step 4: Combine and deduplicate lessons
    const all_lessons = [...lessons, ...ablageLessons].filter(lesson => {
      if (processedIds.has(lesson.id)) {
        console.log('Duplicate lesson found:', lesson);
        return false;
      }
      processedIds.add(lesson.id);
      return true;
    });


    // Step 5: Delete lessons that are no longer in the schedule
    const newLessonIds = new Set(all_lessons.map(l => l.id));
    const lessonsToDelete = existingLessons.filter(l => !newLessonIds.has(l.id));
    
    for (const lesson of lessonsToDelete) {
      await lessonRepository.delete(lesson.id);
      console.log('Deleted old lesson:', lesson.id);
    }

    // Step 6: Save or update remaining lessons
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
        if (existing) {
          await lessonRepository.update(lesson.id, lessonToSave);
          console.log('Updated lesson:', lesson.id);
        } else {
          await lessonRepository.create(lessonToSave);
          console.log('Created new lesson:', lesson.id);
        }
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

export async function getTeachers(): Promise<Teacher[]> {
  return Promise.resolve(teacherRepository.getAll());
}

export async function getBlockers(): Promise<Blocker[]> {
  return Promise.resolve(teacherBlockerRepository.getAll());
}



export async function getAvailableTeachersForTimeslot(day: string, timeslot: number): Promise<Teacher[]> {
  const availableTeachers = teacherRepository.getAvailableTeachers(day, timeslot);
  return availableTeachers;
}

export async function getAllTeacherBlockers(): Promise<Blocker[]> {
  return teacherBlockerRepository.getAll();
}

export async function getAvailableTeachersForEdit(day: string, timeslot: number): Promise<Teacher[]> {
  const availableTeachers = teacherRepository.getAvailableTeachers(day, timeslot);
  return availableTeachers;
}

