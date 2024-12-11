import { availability } from '@/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { Availability, NewAvailability } from '@/db/types';

export class TeacherAvailabilityRepository {
  constructor(private readonly dbClient ) {}

  async create(data: NewAvailability): Promise<Availability | undefined> {
    const [result] = await this.dbClient.insert(availability).values(data).returning();
    return result;
  }

  async getById(id: number): Promise<Availability | undefined> {
    const [result] = await this.dbClient.select().from(availability).where(eq(availability.id, id));
    return result;
  }

  async getAll(): Promise<Availability[]> {
    return this.dbClient.select().from(availability);
  }

  async getForTeacher(teacherId: number): Promise<Availability[]> {
    return this.dbClient.select().from(availability).where(eq(availability.teacher_id, teacherId));
  }

  async isAvailableAtTimeslot(teacherId: number, timeslot: number, day: string): Promise<boolean> {
    const query = this.dbClient.select().from(availability).where(
      and(
        eq(availability.teacher_id, teacherId),
        lte(availability.von, timeslot),
        gte(availability.bis, timeslot),
        eq(availability.day, day)
      )
    );

    const results = await query;
    return results.length > 0;
  }

  async update(id: number, data: Partial<NewAvailability>): Promise<Availability | undefined> {
    const [result] = await this.dbClient.update(availability).set(data).where(eq(availability.id, id)).returning();
    return result;
  }

  async delete(id: number): Promise<Availability | undefined> {
    const [result] = await this.dbClient.delete(availability).where(eq(availability.id, id)).returning();
    return result;
  }

  async deleteByTeacherId(teacherId: number): Promise<Availability[] | undefined> {
    const [result] = await this.dbClient.delete(availability).where(eq(availability.teacher_id, teacherId)).returning();
    return result;
  }
}