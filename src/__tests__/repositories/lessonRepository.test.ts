/**
 * @jest-environment node
 */
import { lesson, teacher, timetable, schoolClass } from '@/db/schema';
import { LessonRepository } from '@/repositories/lessonRepository';
import { NewLesson } from '@/db/types';

describe('LessonRepository', () => {
  let repo: LessonRepository;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  beforeAll(async () => {
    repo = new LessonRepository((global as any).db);

    // Ensure necessary foreign key dependencies exist
    await (global as any).db.delete(teacher);
    await (global as any).db.delete(timetable);
    await (global as any).db.delete(schoolClass);

    await (global as any).db.insert(teacher).values({ id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@mail.com', phone: "012344534", priority: "1", weekly_capacity: 30 });
    await (global as any).db.insert(timetable).values({ id: 1, name: '2024 Timetable', school_year: '2024/2025' });
    await (global as any).db.insert(schoolClass).values({ id: 1, name: 'Class 1A', year: '1' });
    
  });
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  afterAll(async () => await (global as any).db.delete(lesson));
  /* eslint-enable @typescript-eslint/no-explicit-any */

  describe('create', () => {
    it('should create a new lesson and return it', async () => {
      const newLesson: NewLesson = {
        date: 'Monday',
        week: 'A',
        timeslot: 1,
        name: 'Math',
        timetable_id: 1,
        school_class_id: 1,
        primary_teacher_id: 1
      };

      const created = await repo.create(newLesson);
      expect(created).toBeDefined();
      expect(created?.id).toBeDefined();
      expect(created?.name).toBe('Math');
    });
  });

  describe('getById', () => {
    let createdId: number;

    beforeAll(async () => {
      const created = await repo.create({
        date: 'Tuesday',
        week: 'B',
        timeslot: 2,
        name: 'Science',
        timetable_id: 1,
        school_class_id: 1,
        primary_teacher_id: 1
      });
      createdId = created!.id;
    });

    it('should return the correct lesson by id', async () => {
      const result = await repo.getById(createdId);
      expect(result).toBeDefined();
      expect(result?.id).toBe(createdId);
      expect(result?.name).toBe('Science');
    });

    it('should return undefined if lesson not found', async () => {
      const result = await repo.getById(999);
      expect(result).toBeUndefined();
    });
  });

  describe('getAll', () => {
    beforeAll(async () => {
      await repo.create({
        date: 'Wednesday',
        week: 'A',
        timeslot: 3,
        name: 'History',
        timetable_id: 1,
        school_class_id: 1,
        primary_teacher_id: 1
      });
      await repo.create({
        date: 'Thursday',
        week: 'B',
        timeslot: 4,
        name: 'Geography',
        timetable_id: 1,
        school_class_id: 1,
        primary_teacher_id: 1
      });
    });

    it('should return all lessons', async () => {
      const all = await repo.getAll();
      expect(all.length).toBeGreaterThanOrEqual(3);
      const names = all.map(l => l.name);
      expect(names).toContain('History');
      expect(names).toContain('Geography');
    });
  });

  describe('update', () => {
    let lessonId: number;

    beforeAll(async () => {
      const created = await repo.create({
        date: 'Friday',
        week: 'A',
        timeslot: 5,
        name: 'Art',
        timetable_id: 1,
        school_class_id: 1,
        primary_teacher_id: 1
      });
      lessonId = created!.id;
    });

    it('should update an existing lesson', async () => {
      const updated = await repo.update(lessonId, { name: 'Art & Craft' });
      expect(updated).toBeDefined();
      expect(updated?.id).toBe(lessonId);
      expect(updated?.name).toBe('Art & Craft');
    });

    it('should return undefined if trying to update non-existing lesson', async () => {
      const updated = await repo.update(999, { name: 'Non-existent lesson' });
      expect(updated).toBeUndefined();
    });
  });

  describe('delete', () => {
    let lessonId: number;

    beforeAll(async () => {
      const created = await repo.create({
        date: 'Saturday',
        week: 'B',
        timeslot: 6,
        name: 'Music',
        timetable_id: 1,
        school_class_id: 1,
        primary_teacher_id: 1
      });
      lessonId = created!.id;
    });

    it('should delete an existing lesson and return it', async () => {
      const deleted = await repo.delete(lessonId);
      expect(deleted).toBeDefined();
      expect(deleted?.id).toBe(lessonId);
      expect(deleted?.name).toBe('Music');

      const afterDelete = await repo.getById(lessonId);
      expect(afterDelete).toBeUndefined();
    });

    it('should return undefined if trying to delete non-existing lesson', async () => {
      const deleted = await repo.delete(999);
      expect(deleted).toBeUndefined();
    });
  });
});
