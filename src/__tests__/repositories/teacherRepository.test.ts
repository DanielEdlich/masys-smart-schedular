/**
 * @jest-environment node
 */

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
    const newTeacher: NewTeacher = {
      first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com',
      phone: '',
      priority: 0,
      weekly_capacity: 0
    };
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


describe('TeacherRepository', () => {
  let repo: TeacherRepository;

  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    repo = new TeacherRepository((global as any).db);
  });
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  afterAll(async () => await (global as any).db.delete(teacher));

  describe('create', () => {
    it('should create a new teacher and return it', async () => {
      const newTeacher: NewTeacher = {
        first_name: 'Emma',
        last_name: 'Watson',
        email: 'emma.watson@mail.com',
        phone: '',
        priority: 0,
        weekly_capacity: 0
      };

      const created = await repo.create(newTeacher);
      expect(created).toBeDefined();
      expect(created?.id).toBeDefined();
      expect(created?.first_name).toBe('Emma');
      expect(created?.last_name).toBe('Watson');
      expect(created?.email).toBe('emma.watson@mail.com');
    });
  });

  describe('getById', () => {
    let createdId: number;

    beforeAll(async () => {
      const created = await repo.create({
        first_name: 'Daniel',
        last_name: 'Radcliffe',
        email: 'daniel.radcliffe@mail.com',
        phone: '',
        priority: 0,
        weekly_capacity: 0
      });
      createdId = created!.id;
    });

    it('should return the correct teacher by id', async () => {
      const result = await repo.getById(createdId);
      expect(result).toBeDefined();
      expect(result?.id).toBe(createdId);
      expect(result?.first_name).toBe('Daniel');
      expect(result?.last_name).toBe('Radcliffe');
      expect(result?.email).toBe('daniel.radcliffe@mail.com');
    });

    it('should return undefined if teacher not found', async () => {
      const result = await repo.getById(999);
      expect(result).toBeUndefined();
    });
  });

  describe('getAll', () => {
    beforeAll(async () => {
      await repo.create({
        first_name: 'Morgan',
        last_name: 'Freeman',
        email: 'morgan.freeman@mail.com',
        phone: '',
        priority: 0,
        weekly_capacity: 0
      });
      await repo.create({
        first_name: 'Scarlett',
        last_name: 'Johansson',
        email: 'scarlett.johansson@mail.com',
        phone: '',
        priority: 0,
        weekly_capacity: 0
      });
    });

    it('should return all teachers', async () => {
      const all = await repo.getAll();
      expect(all.length).toBeGreaterThanOrEqual(2);
      const names = all.map(t => `${t.first_name} ${t.last_name}`);
      expect(names).toContain('Morgan Freeman');
      expect(names).toContain('Scarlett Johansson');
    });
  });

  describe('update', () => {
    let teacherId: number;

    beforeAll(async () => {
      const created = await repo.create({
        first_name: 'Leonardo',
        last_name: 'DiCaprio',
        email: 'leonardo.dicaprio@mail.com',
        phone: '',
        priority: 0,
        weekly_capacity: 0
      });
      teacherId = created!.id;
    });

    it('should update an existing teacher', async () => {
      const updatedTeacherData = { 
        first_name: 'Leonardo', 
        last_name: 'DiCaprio', 
        email: 'leo.dicaprio@mail.com' 
      };

      const updated = await repo.update(teacherId, updatedTeacherData);
      expect(updated).toBeDefined();
      expect(updated?.id).toBe(teacherId);
      expect(updated?.first_name).toBe('Leonardo');
      expect(updated?.last_name).toBe('DiCaprio');
      expect(updated?.email).toBe('leo.dicaprio@mail.com');
    });

    it('should return undefined if trying to update non-existing teacher', async () => {
      const updated = await repo.update(999, { 
        first_name: 'Keanu', 
        last_name: 'Reeves', 
        email: 'keanu.reeves@mail.com' 
      });
      expect(updated).toBeUndefined();
    });
  });

  describe('delete', () => {
    let teacherId: number;

    beforeAll(async () => {
      const created = await repo.create({
        first_name: 'Robert',
        last_name: 'Downey',
        email: 'robert.downey@mail.com',
        phone: '',
        priority: 0,
        weekly_capacity: 0
      });
      teacherId = created!.id;
    });

    it('should delete an existing teacher and return it', async () => {
      const deleted = await repo.delete(teacherId);
      expect(deleted).toBeDefined();
      expect(deleted?.id).toBe(teacherId);
      expect(deleted?.first_name).toBe('Robert');
      expect(deleted?.last_name).toBe('Downey');
      expect(deleted?.email).toBe('robert.downey@mail.com');

      const afterDelete = await repo.getById(teacherId);
      expect(afterDelete).toBeUndefined();
    });

    it('should return undefined if trying to delete non-existing teacher', async () => {
      const deleted = await repo.delete(999);
      expect(deleted).toBeUndefined();
    });
  });
});