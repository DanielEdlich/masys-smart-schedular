"use server";

import { db } from "@/db/db";
import { TeacherRepository } from "@/repositories/teacherRepository";
import { TeacherAvailabilityRepository } from "@/repositories/teacherAvailabilityRepository";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const teacherRepository = new TeacherRepository(db);
const teacherAvailabilityRepo = new TeacherAvailabilityRepository(db);

export async function createTeacher(data: any) {
  const { availability: availabilityData, ...teacherData } = data;
  const newTeacher = await teacherRepository.create(teacherData);
  if (!newTeacher) {
    throw new Error("Failed to create teacher");
  }

  if (availabilityData && availabilityData.length > 0) {
    teacherAvailabilityRepo.create(
      availabilityData.map((singleBlock: any) => ({
        ...singleBlock,
        teacher_id: newTeacher.id,
      })),
    );
  }
  revalidatePath("/lehrer-verwaltung");
}

export async function updateTeacher(data: any) {
  const { id, availability: availabilityData, ...teacherData } = data;

  // 1: Update teacher
  await teacherRepository.update(id, teacherData);

  // 2: Delete existing availability
  await teacherAvailabilityRepo.deleteByTeacherId(id);

  // 3: Insert new availability
  if (availabilityData && availabilityData.length > 0) {
    availabilityData.forEach((block: any) => {
      teacherAvailabilityRepo.create({ ...block, teacher_id: id });
    });
  }
  revalidatePath("/lehrer-verwaltung");
}

export async function deleteTeacher(id: number) {
  // 1: delete availability for teacher
  await teacherAvailabilityRepo.deleteByTeacherId(id);

  // 2: delete teacher
  await teacherRepository.delete(id);
  revalidatePath("/lehrer-verwaltung");
}

export async function getAllTeachers() {
  const _ = cookies();

  // disable cache for this server action
  const teachers = await teacherRepository.getAll();

  // Use Promise.all to wait for all availability data to be fetched
  const teachersWithAvailabilities = await Promise.all(
    teachers.map(async (teacher) => {
      const availability = await teacherAvailabilityRepo.getForTeacher(teacher.id);
      return {
        ...teacher,
        availability: availability || [], // Provide empty array as fallback
      };
    }),
  );

  return teachersWithAvailabilities;
}
