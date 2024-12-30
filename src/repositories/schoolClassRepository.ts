
import { schoolClass } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { SchoolClass, NewSchoolClass, DbClient } from '@/db/types';


export class SchoolClassRepository {
  constructor(private readonly dbClient: DbClient ) {}

  async create(data: NewSchoolClass): Promise<SchoolClass | undefined> {
    const [result] = await this.dbClient.insert(schoolClass).values(data).returning();
    return result;
  }

  async getById(id: number): Promise<SchoolClass | undefined> {
    const [result] = await this.dbClient.select().from(schoolClass).where(eq(schoolClass.id, id));
    return result;
  }

  async getAll(): Promise<SchoolClass[]> {
    return this.dbClient.select().from(schoolClass);
  }

  async update(id: number, data: Partial<NewSchoolClass>): Promise<SchoolClass | undefined> {
    const [result] = await this.dbClient.update(schoolClass).set(data).where(eq(schoolClass.id, id)).returning();
    return result;
  }

  async delete(id: number): Promise<SchoolClass | undefined> {
    const [result] = await this.dbClient.delete(schoolClass).where(eq(schoolClass.id, id)).returning();
    return result;
  }
}