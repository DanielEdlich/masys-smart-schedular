import { teacherBlocker } from '@/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { TeacherBlocker, NewTeacherBlocker, DbClient } from '@/db/types';

export class TeacherBlockerRepository {
  constructor(private readonly dbClient: DbClient ) {}

  async create(data: NewTeacherBlocker): Promise<TeacherBlocker | undefined> {
    const [result] = await this.dbClient.insert(teacherBlocker).values(data).returning();
    return result;
  }

  async getById(id: number): Promise<TeacherBlocker | undefined> {
    const [result] = await this.dbClient.select().from(teacherBlocker).where(eq(teacherBlocker.id, id));
    return result;
  }

  async getAll(): Promise<TeacherBlocker[]> {
    return this.dbClient.select().from(teacherBlocker);
  }

  async getForTeacher(teacherId: number): Promise<TeacherBlocker[]> {
    return this.dbClient.select().from(teacherBlocker).where(eq(teacherBlocker.teacher_id, teacherId));
  }

  async isTeacherBlockerAtTimeslot(teacherId: number, timeslot: number, day: string): Promise<boolean> {
    const query = this.dbClient.select().from(teacherBlocker).where(
      and(
        eq(teacherBlocker.teacher_id, teacherId),
        lte(teacherBlocker.timeslot_from, timeslot),
        gte(teacherBlocker.timeslot_to, timeslot),
        eq(teacherBlocker.day, day)
      )
    );

    const results = await query;
    return results.length > 0;
  }

  async update(id: number, data: Partial<NewTeacherBlocker>): Promise<TeacherBlocker | undefined> {
    const [result] = await this.dbClient.update(teacherBlocker).set(data).where(eq(teacherBlocker.id, id)).returning();
    return result;
  }

  async delete(id: number): Promise<TeacherBlocker | undefined> {
    const [result] = await this.dbClient.delete(teacherBlocker).where(eq(teacherBlocker.id, id)).returning();
    return result;
  }
}