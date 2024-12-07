// repositories/teacherAvailabilityRepository.ts
import { db } from '@/db/db';
import { teacherAvailability } from '@/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { TeacherAvailability, NewTeacherAvailability } from '@/db/types';

export class TeacherAvailabilityRepository {
  constructor(private readonly dbClient = db) {}

  async create(data: NewTeacherAvailability): Promise<TeacherAvailability | undefined> {
    const [result] = await this.dbClient.insert(teacherAvailability).values(data).returning();
    return result;
  }

  async getById(id: number): Promise<TeacherAvailability | undefined> {
    const [result] = await this.dbClient.select().from(teacherAvailability).where(eq(teacherAvailability.id, id));
    return result;
  }

  async getAll(): Promise<TeacherAvailability[]> {
    return this.dbClient.select().from(teacherAvailability);
  }

  async getForTeacher(teacherId: number): Promise<TeacherAvailability[]> {
    return this.dbClient.select().from(teacherAvailability).where(eq(teacherAvailability.teacher_id, teacherId));
  }

  async isTeacherAvailableAtTimeslot(teacherId: number, timeslot: number, day: string): Promise<boolean> {
    const query = this.dbClient.select().from(teacherAvailability).where(
      and(
        eq(teacherAvailability.teacher_id, teacherId),
        lte(teacherAvailability.timeslot_from, timeslot),
        gte(teacherAvailability.timeslot_to, timeslot),
        eq(teacherAvailability.day, day)
      )
    );

    const results = await query;
    return results.length > 0;
  }

  async update(id: number, data: Partial<NewTeacherAvailability>): Promise<TeacherAvailability | undefined> {
    const [result] = await this.dbClient.update(teacherAvailability).set(data).where(eq(teacherAvailability.id, id)).returning();
    return result;
  }

  async delete(id: number): Promise<TeacherAvailability | undefined> {
    const [result] = await this.dbClient.delete(teacherAvailability).where(eq(teacherAvailability.id, id)).returning();
    return result;
  }
}