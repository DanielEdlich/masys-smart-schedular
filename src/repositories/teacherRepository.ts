import { blocker, teacher } from "@/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { Teacher, NewTeacher, DbClient } from "@/db/types";

export class TeacherRepository {
  constructor(private readonly dbClient: DbClient) {}

  async create(data: NewTeacher): Promise<Teacher | undefined> {
    const [result] = await this.dbClient
      .insert(teacher)
      .values(data)
      .returning();
    return result;
  }

  async getById(id: number): Promise<Teacher | undefined> {
    const [result] = await this.dbClient
      .select()
      .from(teacher)
      .where(eq(teacher.id, id));
    return result;
  }

  async getAll(): Promise<Teacher[]> {
    return this.dbClient.select().from(teacher);
  }

  async update(
    id: number,
    data: Partial<NewTeacher>,
  ): Promise<Teacher | undefined> {
    const [result] = await this.dbClient
      .update(teacher)
      .set(data)
      .where(eq(teacher.id, id))
      .returning();
    return result;
  }

  async delete(id: number): Promise<Teacher | undefined> {
    const [result] = await this.dbClient
      .delete(teacher)
      .where(eq(teacher.id, id))
      .returning();
    return result;
  }


  // get all teachers that are NOT blocked at the given timeslot
  async getAvailableTeachers(day: string, timeslot: number): Promise<Teacher[]> {

    const query = this.dbClient
      .select()
      .from(blocker)
      .where(
        and(
          eq(blocker.day, day),
          lte(blocker.timeslot_from, timeslot),
          gte(blocker.timeslot_to, timeslot),
        ),
      );

    const results = await query;
    const blockedTeacherIds = results.map((blocker) => blocker.teacher_id);

    const allTeachers = await this.dbClient.select().from(teacher);

    return allTeachers.filter((teacher) => !blockedTeacherIds.includes(teacher.id));
  }

  // check if teacher is available at the given timeslot
  async isTeacherAvailable(teacherId: number, day: string, timeslot: number): Promise<boolean> {
    const query = this.dbClient
      .select()
      .from(blocker)
      .where(
        and(
          eq(blocker.teacher_id, teacherId),
          eq(blocker.day, day),
          lte(blocker.timeslot_from, timeslot),
          gte(blocker.timeslot_to, timeslot),
        ),
      );

    const results = await query;
    return results.length === 0;
  }
}
