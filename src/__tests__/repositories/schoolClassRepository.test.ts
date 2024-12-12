/**
 * @jest-environment node
 */

import { schoolClass } from '@/db/schema';
import { NewSchoolClass } from '@/db/types';
import { SchoolClassRepository } from '@/repositories/schoolClassRepository';


describe('SchoolClassRepository', () => {
  let repo: SchoolClassRepository;
  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    repo = new SchoolClassRepository((global as any).db);
  });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    afterAll(async () => await (global as any).db.delete(schoolClass))

  describe('create', () => {
    it('should create a new school class and return it', async () => {
      const newClass: NewSchoolClass = {
        name: 'Math 101',
      };

      const created = await repo.create(newClass);
      expect(created).toBeDefined();
      expect(created?.id).toBeDefined();
      expect(created?.name).toBe('Math 101');
    });
  });

  describe('getById', () => {
    let createdId: number;
    beforeAll(async () => {
      const created = await repo.create({ name: 'History 201'});
      createdId = created!.id;
    });

    it('should return the correct class by id', async () => {
      const result = await repo.getById(createdId);
      expect(result).toBeDefined();
      expect(result?.id).toBe(createdId);
      expect(result?.name).toBe('History 201');
    });

    it('should return undefined if class not found', async () => {
      const result = await repo.getById(999);
      expect(result).toBeUndefined();
    });
  });

  describe('getAll', () => {
    beforeAll(async () => {
      // Create a couple of classes
      await repo.create({ name: 'Chemistry 101' });
      await repo.create({ name: 'Physics 101' });
    });

    it('should return all classes', async () => {
      const all = await repo.getAll();
      // We have created several classes in previous tests, so let's just check that we have more than one.
      expect(all.length).toBeGreaterThanOrEqual(3); 
      // Check that we have the classes created now
      const names = all.map(c => c.name);
      expect(names).toContain('Chemistry 101');
      expect(names).toContain('Physics 101');
    });
  });

  describe('update', () => {
    let classId: number;
    beforeAll(async () => {
      const created = await repo.create({ name: 'Biology 101'});
      classId = created!.id;
    });

    it('should update an existing class', async () => {
      const updated = await repo.update(classId, { name: 'Biology 102' });
      expect(updated).toBeDefined();
      expect(updated?.id).toBe(classId);
      expect(updated?.name).toBe('Biology 102');
    });

    it('should return undefined if trying to update non-existing class', async () => {
      const updated = await repo.update(999, { name: 'Non-existent class' });
      expect(updated).toBeUndefined();
    });
  });

  describe('delete', () => {
    let classId: number;
    beforeAll(async () => {
      const created = await repo.create({ name: 'Geography 101'});
      classId = created!.id;
    });

    it('should delete an existing class and return it', async () => {
      const deleted = await repo.delete(classId);
      expect(deleted).toBeDefined();
      expect(deleted?.id).toBe(classId);
      expect(deleted?.name).toBe('Geography 101');

      const afterDelete = await repo.getById(classId);
      expect(afterDelete).toBeUndefined();
    });

    it('should return undefined if trying to delete non-existing class', async () => {
      const deleted = await repo.delete(999);
      expect(deleted).toBeUndefined();
    });
  });
});