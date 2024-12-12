import { SchoolClassRepository } from '@/repositories/schoolClassRepository';
import { schoolClass } from '@/db/schema';
import { SchoolClass, NewSchoolClass } from '@/db/types';

// Mock the dbClient methods
const mockDbClient = {
  insert: jest.fn(),
  select: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('SchoolClassRepository', () => {
  let repo: SchoolClassRepository;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    repo = new SchoolClassRepository(mockDbClient);
  });

  describe('create', () => {
    it('should insert a new school class and return it', async () => {
      const data: NewSchoolClass = { name: 'Math 101' };
      const expectedResult: SchoolClass = { id: 1, ...data, year: null };

      mockDbClient.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([expectedResult]),
        }),
      });

      const result = await repo.create(data);

      expect(mockDbClient.insert).toHaveBeenCalledWith(schoolClass);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getById', () => {
    it('should select a school class by id and return it', async () => {
      const id = 1;
      const expectedResult: SchoolClass = { id, name: 'History 201', year: null };

      mockDbClient.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([expectedResult]),
        }),
      });

      const result = await repo.getById(id);

      expect(mockDbClient.select).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAll', () => {
    it('should select all school classes and return them', async () => {
      const expectedResult: SchoolClass[] = [
        { id: 1, name: 'Math 101', year: null },
        { id: 2, name: 'History 201', year: null },
      ];

      mockDbClient.select.mockReturnValue({
        from: jest.fn().mockResolvedValue(expectedResult),
      });

      const result = await repo.getAll();

      expect(mockDbClient.select).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a school class and return it', async () => {
      const id = 1;
      const data: Partial<NewSchoolClass> = { name: 'Math 102' };
      const expectedResult: SchoolClass = { id, name: 'Math 102', year: null };

      mockDbClient.update.mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([expectedResult]),
          }),
        }),
      });

      const result = await repo.update(id, data);

      expect(mockDbClient.update).toHaveBeenCalledWith(schoolClass);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('delete', () => {
    it('should delete a school class and return it', async () => {
      const id = 1;
      const expectedResult: SchoolClass = { id, name: 'Math 101', year: null };

      mockDbClient.delete.mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([expectedResult]),
        }),
      });

      const result = await repo.delete(id);

      expect(mockDbClient.delete).toHaveBeenCalledWith(schoolClass);
      expect(result).toEqual(expectedResult);
    });
  });
});