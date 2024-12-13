// teacherRepository.test.ts

import { TeacherRepository } from '@/repositories/teacherRepository';
import { teacher } from '@/db/schema';
import { Teacher, NewTeacher } from '@/db/types';
import { eq } from 'drizzle-orm';

describe('TeacherRepository', () => {
  let repository: TeacherRepository;
  let mockDbClient: any;

  beforeEach(() => {
    mockDbClient = {
      insert: jest.fn(),
      select: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    repository = new TeacherRepository(mockDbClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new teacher and return it', async () => {
      const data: NewTeacher = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        weekly_capacity: 10,
        phone: '1234567890',
        priority: 1,
      };

      const expectedResult: Teacher = { id: 1, ...data };

      mockDbClient.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([expectedResult]),
        }),
      });

      const result = await repository.create(data);

      expect(mockDbClient.insert).toHaveBeenCalledWith(teacher);
      expect(mockDbClient.insert().values).toHaveBeenCalledWith(data);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getById', () => {
    it('should return a teacher by ID', async () => {
      const id = 1;
      const expectedResult: Teacher = {
        id,
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        weekly_capacity: 10,
        phone: '0987654321',
        priority: 2,
      };

      mockDbClient.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([expectedResult]),
        }),
      });

      const result = await repository.getById(id);

      expect(mockDbClient.select).toHaveBeenCalled();
      expect(mockDbClient.select().from).toHaveBeenCalledWith(teacher);
      expect(mockDbClient.select().from().where).toHaveBeenCalledWith(eq(teacher.id, id));
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAll', () => {
    it('should return all teachers', async () => {
      const expectedResult: Teacher[] = [
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          phone: '1234567890',
          priority: 1,
          weekly_capacity: 10
        },
        {
          id: 2,
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane.smith@example.com',
          phone: '0987654321',
          priority: 2,
          weekly_capacity: 10
        },
      ];

      mockDbClient.select.mockReturnValue({
        from: jest.fn().mockResolvedValue(expectedResult),
      });

      const result = await repository.getAll();

      expect(mockDbClient.select).toHaveBeenCalled();
      expect(mockDbClient.select().from).toHaveBeenCalledWith(teacher);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a teacher and return the updated teacher', async () => {
      const id = 1;
      const data: Partial<NewTeacher> = {
        email: 'john.new@example.com',
      };
      const expectedResult: Teacher = {
        id,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.new@example.com',
        phone: '1234567890',
        weekly_capacity: 10,
        priority: 1,
      };

      mockDbClient.update.mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([expectedResult]),
          }),
        }),
      });

      const result = await repository.update(id, data);

      expect(mockDbClient.update).toHaveBeenCalledWith(teacher);
      expect(mockDbClient.update().set).toHaveBeenCalledWith(data);
      expect(mockDbClient.update().set().where).toHaveBeenCalledWith(eq(teacher.id, id));
      expect(result).toEqual(expectedResult);
    });
  });

  describe('delete', () => {
    it('should delete a teacher and return the deleted teacher', async () => {
      const id = 1;
      const expectedResult: Teacher = {
        id,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        weekly_capacity: 10,
        phone: '1234567890',
        priority: 1,
      };

      mockDbClient.delete.mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([expectedResult]),
        }),
      });

      const result = await repository.delete(id);

      expect(mockDbClient.delete).toHaveBeenCalledWith(teacher);
      expect(mockDbClient.delete().where).toHaveBeenCalledWith(eq(teacher.id, id));
      expect(result).toEqual(expectedResult);
    });
  });
});