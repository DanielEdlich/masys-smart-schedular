jest.mock('@libsql/client', () => {
  return {
    createClient: jest.fn(() => {
      return {
        execute: jest.fn(),
        close: jest.fn(),
      };
    }),
  };
});

import { TeacherRepository } from '@/repositories/teacherRepository';
import { teacher } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NewTeacher } from '@/db/types';

describe('TeacherRepository', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockDbClient: any;
  let repo: TeacherRepository;

  beforeEach(() => {
    mockDbClient = {
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnValue([
        { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' }
      ]),
    };

    repo = new TeacherRepository(mockDbClient);
  });

  it('should create a new teacher', async () => {
    const newTeacher: NewTeacher = { first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' };
    const result = await repo.create(newTeacher);

    expect(mockDbClient.insert).toHaveBeenCalledWith(teacher);
    expect(mockDbClient.values).toHaveBeenCalledWith(newTeacher);
    expect(mockDbClient.returning).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' });
  });

  it('should get a teacher by id', async () => {
    // Anpassen des return values für diesen Test
    mockDbClient.returning.mockReturnValueOnce(undefined);
    mockDbClient.select.mockReturnValueOnce(mockDbClient);
    mockDbClient.where.mockReturnValueOnce([
      { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' }
    ]);

    const result = await repo.getById(1);

    expect(mockDbClient.select).toHaveBeenCalledWith();
    expect(mockDbClient.from).toHaveBeenCalledWith(teacher);
    expect(mockDbClient.where).toHaveBeenCalledWith(eq(teacher.id, 1));
    expect(result).toEqual({ id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' });
  });

  it('should get all teachers', async () => {
    mockDbClient.where.mockReturnValueOnce(undefined);
    mockDbClient.from.mockReturnValueOnce([
      { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' },
      { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com' }
    ]);

    const result = await repo.getAll();
    expect(mockDbClient.select).toHaveBeenCalledWith();
    expect(mockDbClient.from).toHaveBeenCalledWith(teacher);
    expect(result).toEqual([
      { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' },
      { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com' }
    ]);
  });

  it('should update a teacher', async () => {
    const updateData = { first_name: 'Johnny' };
    mockDbClient.update.mockReturnThis();
    mockDbClient.returning.mockReturnValueOnce([
      { id: 1, first_name: 'Johnny', last_name: 'Doe', email: 'john.doe@example.com' }
    ]);

    const result = await repo.update(1, updateData);

    expect(mockDbClient.update).toHaveBeenCalledWith(teacher);
    expect(mockDbClient.set).toHaveBeenCalledWith(updateData);
    expect(mockDbClient.where).toHaveBeenCalledWith(eq(teacher.id, 1));
    expect(result).toEqual({ id: 1, first_name: 'Johnny', last_name: 'Doe', email: 'john.doe@example.com' });
  });

  it('should delete a teacher', async () => {
    mockDbClient.delete.mockReturnThis();
    mockDbClient.returning.mockReturnValueOnce([
      { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' }
    ]);

    const result = await repo.delete(1);

    expect(mockDbClient.delete).toHaveBeenCalledWith(teacher);
    expect(mockDbClient.where).toHaveBeenCalledWith(eq(teacher.id, 1));
    expect(result).toEqual({ id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' });
  });
});