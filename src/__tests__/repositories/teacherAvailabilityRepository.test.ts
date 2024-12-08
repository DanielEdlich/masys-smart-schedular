
/**
 * @jest-environment node
 */

import { teacher, teacherAvailability } from '@/db/schema';
import {  NewTeacherAvailability } from '@/db/types';
import { TeacherAvailabilityRepository } from '@/repositories/teacherAvailabilityRepository';
import { TeacherRepository } from '@/repositories/teacherRepository';

describe('TeacherAvailabilityRepository', () => {
  let repo: TeacherAvailabilityRepository;
  beforeAll(async () => {
    repo = new TeacherAvailabilityRepository((global as any).db);

    const teacherRepo = new TeacherRepository((global as any).db);
    await (global as any).db.delete(teacher);
    await teacherRepo.create({
      first_name: 'Emma',
      last_name: 'Watson',
      email: 'emma.watson@mail.com',
      id: 1
    });
    await teacherRepo.create({ 
      first_name: 'Daniel', 
      last_name: 'Radcliffe', 
      email: 'daniel.radcliffe@mail.com',
      id: 2
    });
  });

  afterAll(async () => await (global as any).db.delete(teacherAvailability));

  describe('create', () => {
    it('should create a new teacher availability and return it', async () => {
      const newAvailability: NewTeacherAvailability = {
        teacher_id: 1,
        day: 'Monday',
        timeslot_from: 1,
        timeslot_to: 2,
      };

      const created = await repo.create(newAvailability);
      expect(created).toBeDefined();
      expect(created?.id).toBeDefined();
      expect(created?.teacher_id).toBe(1);
      expect(created?.day).toBe('Monday');
      expect(created?.timeslot_from).toBe(1);
      expect(created?.timeslot_to).toBe(2);
    });
  });

  describe('getById', () => {
    let createdId: number;
    beforeAll(async () => {
      const created = await repo.create({
        teacher_id: 2,
        day: 'Tuesday',
        timeslot_from: 3,
        timeslot_to: 4,
      });
      createdId = created!.id;
    });

    it('should return the correct availability by id', async () => {
      const result = await repo.getById(createdId);
      expect(result).toBeDefined();
      expect(result?.id).toBe(createdId);
      expect(result?.teacher_id).toBe(2);
      expect(result?.day).toBe('Tuesday');
      expect(result?.timeslot_from).toBe(3);
      expect(result?.timeslot_to).toBe(4);
    });

    it('should return undefined if availability not found', async () => {
      const result = await repo.getById(999);
      expect(result).toBeUndefined();
    });
  });

  describe('getAll', () => {
    beforeAll(async () => {
      await repo.create({
        teacher_id: 1,
        day: 'Wednesday',
        timeslot_from: 5,
        timeslot_to: 6,
      });
      await repo.create({
        teacher_id: 2,
        day: 'Thursday',
        timeslot_from: 7,
        timeslot_to: 8,
      });
    });

    it('should return all teacher availabilities', async () => {
      const all = await repo.getAll();
      expect(all.length).toBeGreaterThanOrEqual(2);
      const days = all.map(a => a.day);
      expect(days).toContain('Wednesday');
      expect(days).toContain('Thursday');
    });
  });

  describe('getForTeacher', () => {
    beforeAll(async () => {
      await repo.create({
        teacher_id: 1,
        day: 'Friday',
        timeslot_from: 9,
        timeslot_to: 10,
      });
    });

    it('should return availabilities for the given teacher', async () => {
      const availabilities = await repo.getForTeacher(1);
      expect(availabilities.length).toBeGreaterThanOrEqual(1);
      const days = availabilities.map(a => a.day);
      expect(days).toContain('Friday');
    });
  });

  describe('isTeacherAvailableAtTimeslot', () => {
    beforeAll(async () => {
      await repo.create({
        teacher_id: 2,
        day: 'Saturday',
        timeslot_from: 11,
        timeslot_to: 12,
      });
    });

    it('should return true if teacher is available at the given timeslot and day', async () => {
      const isAvailable = await repo.isTeacherAvailableAtTimeslot(2, 11, 'Saturday');
      expect(isAvailable).toBe(true);
    });

    it('should return false if teacher is not available at the given timeslot and day', async () => {
      const isAvailable = await repo.isTeacherAvailableAtTimeslot(2, 13, 'Saturday');
      expect(isAvailable).toBe(false);
    });
  });

  describe('update', () => {
    let availabilityId: number;
    beforeAll(async () => {
      const created = await repo.create({
        teacher_id: 1,
        day: 'Sunday',
        timeslot_from: 13,
        timeslot_to: 14,
      });
      availabilityId = created!.id;
    });

    it('should update an existing teacher availability', async () => {
      const updated = await repo.update(availabilityId, { day: 'UpdatedDay' });
      expect(updated).toBeDefined();
      expect(updated?.id).toBe(availabilityId);
      expect(updated?.day).toBe('UpdatedDay');
    });

    it('should return undefined if trying to update non-existing availability', async () => {
      const updated = await repo.update(999, { day: 'Non-existent day' });
      expect(updated).toBeUndefined();
    });
  });

  describe('delete', () => {
    let availabilityId: number;
    beforeAll(async () => {
      const created = await repo.create({
        teacher_id: 1,
        day: 'Monday',
        timeslot_from: 15,
        timeslot_to: 16,
      });
      availabilityId = created!.id;
    });

    it('should delete an existing teacher availability and return it', async () => {
      const deleted = await repo.delete(availabilityId);
      expect(deleted).toBeDefined();
      expect(deleted?.id).toBe(availabilityId);
      expect(deleted?.day).toBe('Monday');

      const afterDelete = await repo.getById(availabilityId);
      expect(afterDelete).toBeUndefined();
    });

    it('should return undefined if trying to delete non-existing availability', async () => {
      const deleted = await repo.delete(999);
      expect(deleted).toBeUndefined();
    });
  });
});