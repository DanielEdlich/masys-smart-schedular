import { timetable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Timetable, NewTimetable, DbClient } from '@/db/types';

export class TimetableRepository {
  constructor(private readonly dbClient: DbClient ) {}

  async create(data: NewTimetable): Promise<Timetable | undefined> {
    const [result] = await this.dbClient.insert(timetable).values(data).returning();
    return result;
  }

  async getById(id: number): Promise<Timetable | undefined> {
    const [result] = await this.dbClient.select().from(timetable).where(eq(timetable.id, id));
    return result;
  }

  async getAll(): Promise<Timetable[]> {
    return this.dbClient.select().from(timetable);
  }

  async update(id: number, data: Partial<NewTimetable>): Promise<Timetable | undefined> {
    const [result] = await this.dbClient.update(timetable).set(data).where(eq(timetable.id, id)).returning();
    return result;
  }

  async delete(id: number): Promise<Timetable | undefined> {
    const [result] = await this.dbClient.delete(timetable).where(eq(timetable.id, id)).returning();
    return result;
  }
}