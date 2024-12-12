// TeacherBlockerRepository.test.ts

import { TeacherBlockerRepository } from '@/repositories/teacherBlockerRepository';
import { blocker } from '@/db/schema';
import { Blocker, NewBlocker } from '@/db/types';

// Mock the dbClient methods
const mockDbClient = {
  insert: jest.fn(),
  select: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('TeacherBlockerRepository', () => {
  let repository: TeacherBlockerRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new TeacherBlockerRepository(mockDbClient);
  });

  describe('create', () => {
    it('should insert a new blocker record and return it', async () => {
      const data: NewBlocker = {
        day: 'Monday',
        timeslot_from: 8,
        timeslot_to: 10,
        teacher_id: 1,
      };
      const expectedResult: Blocker = { id: 1, ...data };

      mockDbClient.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([expectedResult]),
        }),
      });

      const result = await repository.create(data);

      expect(mockDbClient.insert).toHaveBeenCalledWith(blocker);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getById', () => {
    it('should return an blocker record by id', async () => {
      const id = 1;
      const expectedResult: Blocker = {
        id,
        day: 'Monday',
        timeslot_from: 8,
        timeslot_to: 10,
        teacher_id: 1,
      };

      mockDbClient.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([expectedResult]),
        }),
      });

      const result = await repository.getById(id);

      expect(mockDbClient.select).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAll', () => {
    it('should return all blocker records', async () => {
      const expectedResults: Blocker[] = [
        {
          id: 1,
          day: 'Monday',
          timeslot_from: 8,
          timeslot_to: 10,
          teacher_id: 1,
        },
        {
          id: 2,
          day: 'Tuesday',
          timeslot_from: 9,
          timeslot_to: 11,
          teacher_id: 2,
        },
      ];

      mockDbClient.select.mockReturnValue({
        from: jest.fn().mockResolvedValue(expectedResults),
      });

      const results = await repository.getAll();

      expect(mockDbClient.select).toHaveBeenCalled();
      expect(results).toEqual(expectedResults);
    });
  });

  describe('getForTeacher', () => {
    it('should return blocker records for a specific teacher', async () => {
      const teacherId = 1;
      const expectedResults: Blocker[] = [
        {
          id: 1,
          day: 'Monday',
          timeslot_from: 8,
          timeslot_to: 10,
          teacher_id: teacherId,
        },
        {
          id: 3,
          day: 'Wednesday',
          timeslot_from: 10,
          timeslot_to: 12,
          teacher_id: teacherId,
        },
      ];

      mockDbClient.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue(expectedResults),
        }),
      });

      const results = await repository.getForTeacher(teacherId);

      expect(mockDbClient.select).toHaveBeenCalled();
      expect(results).toEqual(expectedResults);
    });
  });

  describe('isBlockerAtTimeslot', () => {
    it('should return true if teacher is available at given timeslot and day', async () => {
      const teacherId = 1;
      const timeslot = 9;
      const day = 'Monday';
      const expectedResults: Blocker[] = [
        {
          id: 1,
          day,
          timeslot_from: 8,
          timeslot_to: 10,
          teacher_id: teacherId,
        },
      ];

      mockDbClient.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue(expectedResults),
        }),
      });

      const result = await repository.isBlockedAtTimeslot(teacherId, timeslot, day);

      expect(mockDbClient.select).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if teacher is not available at given timeslot and day', async () => {
      const teacherId = 1;
      const timeslot = 12;
      const day = 'Monday';

      mockDbClient.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      const result = await repository.isBlockedAtTimeslot(teacherId, timeslot, day);

      expect(mockDbClient.select).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('update', () => {
    it('should update an blocker record and return it', async () => {
      const id = 1;
      const data: Partial<NewBlocker> = {
        timeslot_from: 9,
        timeslot_to: 11,
      };
      const expectedResult: Blocker = {
        id,
        day: 'Monday',
        timeslot_from: 9,
        timeslot_to: 11,
        teacher_id: 1,
      };

      mockDbClient.update.mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([expectedResult]),
          }),
        }),
      });

      const result = await repository.update(id, data);

      expect(mockDbClient.update).toHaveBeenCalledWith(blocker);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('delete', () => {
    it('should delete an blocker record and return it', async () => {
      const id = 1;
      const expectedResult: Blocker = {
        id,
        day: 'Monday',
        timeslot_from: 8,
        timeslot_to: 10,
        teacher_id: 1,
      };

      mockDbClient.delete.mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([expectedResult]),
        }),
      });

      const result = await repository.delete(id);

      expect(mockDbClient.delete).toHaveBeenCalledWith(blocker);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteByTeacherId', () => {
    it('should delete blocker records by teacher ID and return them', async () => {
      const teacherId = 1;
      const expectedResults: Blocker[] = [
        {
          id: 1,
          day: 'Monday',
          timeslot_from: 8,
          timeslot_to: 10,
          teacher_id: teacherId,
        },
        {
          id: 3,
          day: 'Wednesday',
          timeslot_from: 10,
          timeslot_to: 12,
          teacher_id: teacherId,
        },
      ];

      mockDbClient.delete.mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([expectedResults]),
        }),
      });

      const results = await repository.deleteByTeacherId(teacherId);

      expect(mockDbClient.delete).toHaveBeenCalledWith(blocker);
      expect(results).toEqual(expectedResults);
    });
  });
});