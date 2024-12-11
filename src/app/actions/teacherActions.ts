'use server'

import { db } from '@/db/db'
import { TeacherRepository } from '@/repositories/teacherRepository'
import { TeacherAvailabilityRepository } from '@/repositories/teacherAvailabilityRepository'

const teacherRepository = new TeacherRepository(db)
const availabilityRepository = new TeacherAvailabilityRepository(db)

export async function createTeacher(data: any) {
  const { availability: availabilityData, ...teacherData } = data
  const newTeacher = await teacherRepository.create(teacherData)
  if (!newTeacher) {
    throw new Error('Failed to create teacher')
  }
  
  if (availabilityData && availabilityData.length > 0) {

    availabilityRepository.create(availabilityData.map((a: any) => ({ ...a, teacher_id: newTeacher.id })))
    
  }
}

export async function updateTeacher(data: any) {
  const { id, availability: availabilityData, ...teacherData } = data
  
  // 1: Update teacher
  await teacherRepository.update(id, teacherData)
  //await db.update(teacher).set(teacherData).where(eq(teacher.id, id))
  
  // 2: Delete existing availability
  await availabilityRepository.deleteByTeacherId(id)
  
  // 3: Insert new availability
  if (availabilityData && availabilityData.length > 0) {
    availabilityData.forEach((a: any) => {  
       availabilityRepository.create({ ...a, teacher_id: id }) 
    })
  }

}

export async function deleteTeacher(id: number) {
  // 1: delete availability for teacher
  await availabilityRepository.deleteByTeacherId(id)

  // 2: delete teacher
  await teacherRepository.delete(id)

}

export async function getAllTeachers() {
  const teachers = await teacherRepository.getAll();
  
  // Use Promise.all to wait for all availability data to be fetched
  const teachersWithAvailability = await Promise.all(
    teachers.map(async (teacher) => {
      const availability = await availabilityRepository.getForTeacher(teacher.id);
      return {
        ...teacher,
        availability: availability || [] // Provide empty array as fallback
      };
    })
  );

  return teachersWithAvailability;
}

