import { teacher_availability, teacher } from "@/db/schema";
import { eq, and, gte, lte, inArray } from "drizzle-orm";
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
      .from(teacher_availability)
      .where(
        and(
          eq(teacher_availability.day, day),
          lte(teacher_availability.timeslot_from, timeslot),
          gte(teacher_availability.timeslot_to, timeslot),
        ),
      );

    const results = await query;
    const availableTeacherIds = results.map((availability) => availability.teacher_id);

    const allTeachers = await this.dbClient
      .select()
      .from(teacher)
      .where(inArray(teacher.id, availableTeacherIds)); // FIXME hoffen das es so geht

    return allTeachers; 
    // return allTeachers.filter((teacher) => !availableTeacherIds.includes(teacher.id));
    // return allTeachers.filter((teacher) => availableTeacherIds.includes(teacher.id));
  }

  // check if teacher is available at the given timeslot
  async isTeacherAvailable(teacherId: number, day: string, timeslot: number): Promise<boolean> {
    const query = this.dbClient
      .select()
      .from(teacher_availability)
      .where(
        and(
          eq(teacher_availability.teacher_id, teacherId),
          eq(teacher_availability.day, day),
          lte(teacher_availability.timeslot_from, timeslot),
          gte(teacher_availability.timeslot_to, timeslot),
        ),
      );

    const results = await query;
    return results.length === 0;
  }
}
