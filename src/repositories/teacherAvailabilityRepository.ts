import { eq, and, gte, lte } from "drizzle-orm";
import { TeacherAvailability, NewTeacherAvailability, DbClient } from "@/db/types";
import { teacher_availability, teacher } from "@/db/schema";

export class TeacherAvailabilityRepository {
  constructor(private readonly dbClient: DbClient) {}

  async create(data: NewTeacherAvailability): Promise<TeacherAvailability | undefined> {
    const [result] = await this.dbClient
      .insert(teacher_availability)
      .values(data)
      .returning();
    return result;
  }

  async getById(id: number): Promise<TeacherAvailability | undefined> {
    const [result] = await this.dbClient
      .select()
      .from(teacher_availability)
      .where(eq(teacher_availability.id, id));
    return result;
  }

  async getAll(): Promise<TeacherAvailability[]> {
    return this.dbClient.select().from(teacher_availability);
  }

  async getForTeacher(teacherId: number): Promise<TeacherAvailability[]> {
    return this.dbClient
      .select()
      .from(teacher_availability)
      .where(eq(teacher_availability.teacher_id, teacherId));
  }

  async isTeacherAvailableAtTimeslot(
    teacherId: number,
    timeslot: number,
    day: string,
  ): Promise<boolean> {
    const query = this.dbClient
      .select()
      .from(teacher_availability)
      .where(
        and(
          eq(teacher_availability.teacher_id, teacherId),
          lte(teacher_availability.timeslot_from, timeslot),
          gte(teacher_availability.timeslot_to, timeslot),
          eq(teacher_availability.day, day),
        ),
      );

    const results = await query;
    return results.length > 0;
  }

  async update(
    id: number,
    data: Partial<NewTeacherAvailability>,
  ): Promise<TeacherAvailability | undefined> {
    const [result] = await this.dbClient
      .update(teacher_availability)
      .set(data)
      .where(eq(teacher_availability.id, id))
      .returning();
    return result;
  }

  async delete(id: number): Promise<TeacherAvailability | undefined> {
    const [result] = await this.dbClient
      .delete(teacher_availability)
      .where(eq(teacher_availability.id, id))
      .returning();
    return result;
  }

  async deleteByTeacherId(teacherId: number): Promise<TeacherAvailability[] | undefined> {
    const result = await this.dbClient
      .delete(teacher_availability)
      .where(eq(teacher_availability.teacher_id, teacherId))
      .returning();
    return result;
  }
}
