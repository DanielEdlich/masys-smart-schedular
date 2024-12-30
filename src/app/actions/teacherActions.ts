'use server';

import { db } from '@/db/db';
import { TeacherRepository } from '@/repositories/teacherRepository';
import { TeacherBlockerRepository } from '@/repositories/teacherBlockerRepository';

const teacherRepository = new TeacherRepository(db);
const blockerRepository = new TeacherBlockerRepository(db);

export async function createTeacher(data: any) {
  const { blocker: blockerData, ...teacherData } = data;
  const newTeacher = await teacherRepository.create(teacherData);
  if (!newTeacher) {
    throw new Error('Failed to create teacher');
  }

  if (blockerData && blockerData.length > 0) {

    blockerRepository.create(blockerData.map((singleBlock: any) => ({ ...singleBlock, teacher_id: newTeacher.id })));

  }
}

export async function updateTeacher(data: any) {
  const { id, blocker: blockerData, ...teacherData } = data;

  // 1: Update teacher
  await teacherRepository.update(id, teacherData);

  // 2: Delete existing blocker
  await blockerRepository.deleteByTeacherId(id);

  // 3: Insert new blocker
  if (blockerData && blockerData.length > 0) {
    blockerData.forEach((block: any) => {
      blockerRepository.create({ ...block, teacher_id: id });
    });
  }

}

export async function deleteTeacher(id: number) {
  // 1: delete blocker for teacher
  await blockerRepository.deleteByTeacherId(id);

  // 2: delete teacher
  await teacherRepository.delete(id);

}

export async function getAllTeachers() {
  const teachers = await teacherRepository.getAll();

  // Use Promise.all to wait for all blocker data to be fetched
  const teachersWithBlocker = await Promise.all(
    teachers.map(async (teacher) => {
      const blocker = await blockerRepository.getForTeacher(teacher.id);
      return {
        ...teacher,
        blocker: blocker || [] // Provide empty array as fallback
      };
    })
  );

  return teachersWithBlocker;
}

