import { teacher } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Teacher, NewTeacher, DbClient } from '@/db/types';

export class TeacherRepository {

  constructor(private readonly dbClient: DbClient ) { }
  
  async create(data: NewTeacher): Promise<Teacher | undefined> {
    const [result] = await this.dbClient.insert(teacher).values(data).returning();
    return result;
  }

  async getById(id: number): Promise<Teacher | undefined> {
    const [result] = await this.dbClient.select().from(teacher).where(eq(teacher.id, id));
    return result;
  }

  async getAll(): Promise<Teacher[]> {
    return this.dbClient.select().from(teacher);
  }

  async update(id: number, data: Partial<NewTeacher>): Promise<Teacher | undefined> {
    const [result] = await this.dbClient.update(teacher).set(data).where(eq(teacher.id, id)).returning();
    return result;
  }

  async delete(id: number): Promise<Teacher | undefined> {
    const [result] = await this.dbClient.delete(teacher).where(eq(teacher.id, id)).returning();
    return result;
  }
}