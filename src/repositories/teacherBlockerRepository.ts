import { blocker } from '@/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { Blocker, NewBlocker } from '@/db/types';

export class TeacherBlockerRepository {
  constructor(private readonly dbClient ) {}

  async create(data: NewBlocker): Promise<Blocker | undefined> {
    const [result] = await this.dbClient.insert(blocker).values(data).returning();
    return result;
  }

  async getById(id: number): Promise<Blocker | undefined> {
    const [result] = await this.dbClient.select().from(blocker).where(eq(blocker.id, id));
    return result;
  }

  async getAll(): Promise<Blocker[]> {
    return this.dbClient.select().from(blocker);
  }

  async getForTeacher(teacherId: number): Promise<Blocker[]> {
    return this.dbClient.select().from(blocker).where(eq(blocker.teacher_id, teacherId));
  }

  async isAvailableAtTimeslot(teacherId: number, timeslot: number, day: string): Promise<boolean> {
    const query = this.dbClient.select().from(blocker).where(
      and(
        eq(blocker.teacher_id, teacherId),
        lte(blocker.von, timeslot),
        gte(blocker.bis, timeslot),
        eq(blocker.day, day)
      )
    );

    const results = await query;
    return results.length > 0;
  }

  async update(id: number, data: Partial<NewBlocker>): Promise<Blocker | undefined> {
    const [result] = await this.dbClient.update(blocker).set(data).where(eq(blocker.id, id)).returning();
    return result;
  }

  async delete(id: number): Promise<Blocker | undefined> {
    const [result] = await this.dbClient.delete(blocker).where(eq(blocker.id, id)).returning();
    return result;
  }

  async deleteByTeacherId(teacherId: number): Promise<Blocker[] | undefined> {
    const [result] = await this.dbClient.delete(blocker).where(eq(blocker.teacher_id, teacherId)).returning();
    return result;
  }
}