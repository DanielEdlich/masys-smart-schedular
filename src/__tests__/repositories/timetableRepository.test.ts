/**
 * @jest-environment node
 */
import { timetable } from '@/db/schema';
import { NewTimetable } from '@/db/types';
import { TimetableRepository } from '@/repositories/timetableRepository';

describe('TimetableRepository', () => {
  let repo: TimetableRepository;
  
  /* eslint-disable @typescript-eslint/no-explicit-any */
  beforeAll(async () => {
    repo = new TimetableRepository((global as any).db);
  });

  afterAll(async () => await (global as any).db.delete(timetable));
  /* eslint-enable @typescript-eslint/no-explicit-any */

  describe('create', () => {
    it('should create a new timetable and return it', async () => {
      const newTimetable: NewTimetable = {
        name: '2024 Timetable',
        school_year: '2024/2025'
      };

      const created = await repo.create(newTimetable);
      expect(created).toBeDefined();
      expect(created?.id).toBeDefined();
      expect(created?.name).toBe('2024 Timetable');
      expect(created?.school_year).toBe('2024/2025');
    });
  });

  describe('getById', () => {
    let createdId: number;

    beforeAll(async () => {
      const created = await repo.create({
        name: '2023 Timetable',
        school_year: '2023/2024'
      });
      createdId = created!.id;
    });

    it('should return the correct timetable by id', async () => {
      const result = await repo.getById(createdId);
      expect(result).toBeDefined();
      expect(result?.id).toBe(createdId);
      expect(result?.name).toBe('2023 Timetable');
      expect(result?.school_year).toBe('2023/2024');
    });

    it('should return undefined if timetable not found', async () => {
      const result = await repo.getById(999);
      expect(result).toBeUndefined();
    });
  });

  describe('getAll', () => {
    beforeAll(async () => {
      await repo.create({
        name: '2022 Timetable',
        school_year: '2022/2023'
      });
      await repo.create({
        name: '2021 Timetable',
        school_year: '2021/2022'
      });
    });

    it('should return all timetables', async () => {
      const all = await repo.getAll();
      expect(all.length).toBeGreaterThanOrEqual(2);
      const names = all.map(t => t.name);
      expect(names).toContain('2022 Timetable');
      expect(names).toContain('2021 Timetable');
    });
  });

  describe('update', () => {
    let timetableId: number;

    beforeAll(async () => {
      const created = await repo.create({
        name: '2020 Timetable',
        school_year: '2020/2021'
      });
      timetableId = created!.id;
    });

    it('should update an existing timetable', async () => {
      const updatedTimetableData = {
        name: 'Updated 2020 Timetable',
        school_year: '2020/2021'
      };

      const updated = await repo.update(timetableId, updatedTimetableData);
      expect(updated).toBeDefined();
      expect(updated?.id).toBe(timetableId);
      expect(updated?.name).toBe('Updated 2020 Timetable');
      expect(updated?.school_year).toBe('2020/2021');
    });

    it('should return undefined if trying to update non-existing timetable', async () => {
      const updated = await repo.update(999, {
        name: 'Non-existent Timetable',
        school_year: '9999/10000'
      });
      expect(updated).toBeUndefined();
    });
  });

  describe('delete', () => {
    let timetableId: number;

    beforeAll(async () => {
      const created = await repo.create({
        name: '2019 Timetable',
        school_year: '2019/2020'
      });
      timetableId = created!.id;
    });

    it('should delete an existing timetable and return it', async () => {
      const deleted = await repo.delete(timetableId);
      expect(deleted).toBeDefined();
      expect(deleted?.id).toBe(timetableId);
      expect(deleted?.name).toBe('2019 Timetable');

      const afterDelete = await repo.getById(timetableId);
      expect(afterDelete).toBeUndefined();
    });

    it('should return undefined if trying to delete non-existing timetable', async () => {
      const deleted = await repo.delete(999);
      expect(deleted).toBeUndefined();
    });
  });
});
