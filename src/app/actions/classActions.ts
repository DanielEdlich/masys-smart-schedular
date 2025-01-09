'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/db/db'
import { TeacherRepository } from '@/repositories/teacherRepository'
import { SchoolClassRepository } from '@/repositories/schoolClassRepository'
import { SchoolClass } from '@/db/types'

const teacherRepository = new TeacherRepository(db)
const schoolClassRepository = new SchoolClassRepository(db)

export async function getClasses() {
  const classes = await schoolClassRepository.getAll();
  return classes
}

export async function getTeachers() {

  const teachers = await teacherRepository.getAll();
  
  return teachers
}

export async function addClass(newClass: Omit<SchoolClass, 'id'>) {
  
  const classWithId = await schoolClassRepository.create(newClass)
  if (!classWithId) {
    throw new Error('Failed to create class')
  }
  
  revalidatePath('/schulklassen-verwaltung')
  return classWithId
}

export async function editClass(updatedClass: SchoolClass) {
  
  const classWithId = await schoolClassRepository.update(updatedClass.id, updatedClass)
  if (!classWithId) {
    throw new Error('Failed to update class')
  }

  revalidatePath('/schulklassen-verwaltung')
  return classWithId
}

export async function deleteClass(id: number) {
  
  const deletedClass = await schoolClassRepository.delete(id)
  if (!deletedClass) {
    throw new Error('Failed to delete class')
  }
  revalidatePath('/schulklassen-verwaltung')
}

