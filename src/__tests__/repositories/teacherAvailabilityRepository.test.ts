// teacherAvailabilityRepository.test.ts

import { TeacherAvailabilityRepository } from '@/repositories/teacherAvailabilityRepository';
import { availability } from '@/db/schema';
import { Availability, NewAvailability } from '@/db/types';

// Mock the dbClient methods
const mockDbClient = {
  insert: jest.fn(),
  select: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('TeacherAvailabilityRepository', () => {
  let repository: TeacherAvailabilityRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new TeacherAvailabilityRepository(mockDbClient);
  });

  describe('create', () => {
    it('should insert a new availability record and return it', async () => {
      const data: NewAvailability = {
        day: 'Monday',
        von: 8,
        bis: 10,
        teacher_id: 1,
      };
      const expectedResult: Availability = { id: 1, ...data };

      mockDbClient.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([expectedResult]),
        }),
      });

      const result = await repository.create(data);

      expect(mockDbClient.insert).toHaveBeenCalledWith(availability);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getById', () => {
    it('should return an availability record by id', async () => {
      const id = 1;
      const expectedResult: Availability = {
        id,
        day: 'Monday',
        von: 8,
        bis: 10,
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
    it('should return all availability records', async () => {
      const expectedResults: Availability[] = [
        {
          id: 1,
          day: 'Monday',
          von: 8,
          bis: 10,
          teacher_id: 1,
        },
        {
          id: 2,
          day: 'Tuesday',
          von: 9,
          bis: 11,
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
    it('should return availability records for a specific teacher', async () => {
      const teacherId = 1;
      const expectedResults: Availability[] = [
        {
          id: 1,
          day: 'Monday',
          von: 8,
          bis: 10,
          teacher_id: teacherId,
        },
        {
          id: 3,
          day: 'Wednesday',
          von: 10,
          bis: 12,
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

  describe('isAvailabilityAtTimeslot', () => {
    it('should return true if teacher is available at given timeslot and day', async () => {
      const teacherId = 1;
      const timeslot = 9;
      const day = 'Monday';
      const expectedResults: Availability[] = [
        {
          id: 1,
          day,
          von: 8,
          bis: 10,
          teacher_id: teacherId,
        },
      ];

      mockDbClient.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue(expectedResults),
        }),
      });

      const result = await repository.isAvailableAtTimeslot(teacherId, timeslot, day);

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

      const result = await repository.isAvailableAtTimeslot(teacherId, timeslot, day);

      expect(mockDbClient.select).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('update', () => {
    it('should update an availability record and return it', async () => {
      const id = 1;
      const data: Partial<NewAvailability> = {
        von: 9,
        bis: 11,
      };
      const expectedResult: Availability = {
        id,
        day: 'Monday',
        von: 9,
        bis: 11,
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

      expect(mockDbClient.update).toHaveBeenCalledWith(availability);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('delete', () => {
    it('should delete an availability record and return it', async () => {
      const id = 1;
      const expectedResult: Availability = {
        id,
        day: 'Monday',
        von: 8,
        bis: 10,
        teacher_id: 1,
      };

      mockDbClient.delete.mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([expectedResult]),
        }),
      });

      const result = await repository.delete(id);

      expect(mockDbClient.delete).toHaveBeenCalledWith(availability);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteByTeacherId', () => {
    it('should delete availability records by teacher ID and return them', async () => {
      const teacherId = 1;
      const expectedResults: Availability[] = [
        {
          id: 1,
          day: 'Monday',
          von: 8,
          bis: 10,
          teacher_id: teacherId,
        },
        {
          id: 3,
          day: 'Wednesday',
          von: 10,
          bis: 12,
          teacher_id: teacherId,
        },
      ];

      mockDbClient.delete.mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([expectedResults]),
        }),
      });

      const results = await repository.deleteByTeacherId(teacherId);

      expect(mockDbClient.delete).toHaveBeenCalledWith(availability);
      expect(results).toEqual(expectedResults);
    });
  });
});