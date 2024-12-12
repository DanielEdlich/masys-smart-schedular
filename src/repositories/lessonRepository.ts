import { lesson } from '@/db/schema';
import { eq, or } from 'drizzle-orm';
import { DbClient, Lesson, NewLesson } from '@/db/types';
export class LessonRepository {
  constructor(private readonly dbClient: DbClient ) {}

  async create(data: NewLesson): Promise<Lesson | undefined> {
    const [result] = await this.dbClient.insert(lesson).values(data).returning();
    return result;
  }

  async getById(id: number): Promise<Lesson | undefined> {
    const [result] = await this.dbClient.select().from(lesson).where(eq(lesson.id, id));
    return result;
  }

  async getAll(): Promise<Lesson[]> {
    return this.dbClient.select().from(lesson);
  }

  async getLessonsByTeacher(teacherId: number): Promise<Lesson[]> {
    return this.dbClient.select().from(lesson).where(
      or(eq(lesson.primary_teacher_id, teacherId), eq(lesson.secondary_teacher_id, teacherId))
    );
  }

  async getLessonsByTimetable(timetableId: number): Promise<Lesson[]> {
    return this.dbClient.select().from(lesson).where(eq(lesson.timetable_id, timetableId));
  }

  async update(id: number, data: Partial<NewLesson>): Promise<Lesson | undefined> {
    const [result] = await this.dbClient.update(lesson).set(data).where(eq(lesson.id, id)).returning();
    return result;
  }

  async delete(id: number): Promise<Lesson | undefined> {
    const [result] = await this.dbClient.delete(lesson).where(eq(lesson.id, id)).returning();
    return result;
  }
}