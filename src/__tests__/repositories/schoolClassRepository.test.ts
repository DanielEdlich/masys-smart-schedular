/**
 * @jest-environment node
 */

import { schoolClass, teacher } from "@/db/schema";
import { NewSchoolClass, SchoolClassTrack } from "@/db/types";
import { SchoolClassRepository } from "@/repositories/schoolClassRepository";

describe("SchoolClassRepository", () => {
  let repo: SchoolClassRepository;
  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    repo = new SchoolClassRepository((global as any).db);

    // Ensure necessary foreign key dependencies exist
    await (global as any).db.delete(teacher);
    await (global as any).db.delete(schoolClass);

    await (global as any).db.insert(teacher).values({
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@mail.com",
      phone: "012344534",
      priority: "1",
      weekly_capacity: 30,
    });
    await (global as any).db.insert(teacher).values({
      id: 2,
      first_name: "Elsa",
      last_name: "Grey",
      email: "elsa.grey@mail.com",
      phone: "23231241231",
      priority: "2",
      weekly_capacity: 15,
    });
    await (global as any).db.insert(schoolClass).values({
      id: 1,
      name: "Flying Tigers",
      year: "1-3",
      primary_teacher_id: "1",
      secondary_teacher_id: "2",
      track: SchoolClassTrack.B,
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  afterAll(async () => await (global as any).db.delete(schoolClass));

  describe("create", () => {
    it("should create a new school class and return it", async () => {
      const newClass: NewSchoolClass = {
        name: "Math 101",
        year: "1-3",
        track: SchoolClassTrack.B,
        primary_teacher_id: 1,
        secondary_teacher_id: 2,
      };

      const created = await repo.create(newClass);
      expect(created).toBeDefined();
      expect(created?.id).toBeDefined();
      expect(created?.name).toBe("Math 101");
      expect(created?.year).toBe("1-3");
      expect(created?.track).toBe(SchoolClassTrack.B);
      expect(created?.primary_teacher_id).toBe(1);
      expect(created?.secondary_teacher_id).toBe(2);
    });
  });

  describe("getById", () => {
    let createdId: number;
    beforeAll(async () => {
      const created = await repo.create({
        name: "History 201",
        year: "4-6",
        track: "B",
        primary_teacher_id: 1,
        secondary_teacher_id: 2,
      });
      createdId = created!.id;
    });

    it("should return the correct class by id", async () => {
      const result = await repo.getById(createdId);
      expect(result).toBeDefined();
      expect(result?.id).toBe(createdId);
      expect(result?.name).toBe("History 201");
      expect(result?.year).toBe("4-6");
      expect(result?.track).toBe(SchoolClassTrack.B);
      expect(result?.primary_teacher_id).toBe(1);
      expect(result?.secondary_teacher_id).toBe(2);
    });

    it("should return undefined if class not found", async () => {
      const result = await repo.getById(999);
      expect(result).toBeUndefined();
    });
  });

  describe("getAll", () => {
    beforeAll(async () => {
      // Create a couple of classes
      await repo.create({
        name: "Chemistry 101",
        year: "1-3",
        track: SchoolClassTrack.A,
        primary_teacher_id: 1,
        secondary_teacher_id: 2,
      });
      await repo.create({
        name: "Physics 101",
        year: "4-6",
        track: SchoolClassTrack.B,
        primary_teacher_id: 1,
        secondary_teacher_id: 2,
      });
    });

    it("should return all classes", async () => {
      const all = await repo.getAll();
      // We have created several classes in previous tests, so let's just check that we have more than one.
      expect(all.length).toBeGreaterThanOrEqual(3);
      // Check that we have the classes created now
      const names = all.map((c) => c.name);
      expect(names).toContain("Chemistry 101");
      expect(names).toContain("Physics 101");
    });
  });

  describe("update", () => {
    let classId: number;
    beforeAll(async () => {
      const created = await repo.create({
        name: "Biology 101",
        year: "1-3",
        track: SchoolClassTrack.B,
        primary_teacher_id: 1,
        secondary_teacher_id: 2,
      });
      classId = created!.id;
    });

    it("should update an existing class", async () => {
      const updated = await repo.update(classId, {
        name: "Biology 102",
        year: "4-6",
        track: SchoolClassTrack.B,
        primary_teacher_id: 2,
        secondary_teacher_id: 1,
      });
      expect(updated).toBeDefined();
      expect(updated?.id).toBe(classId);
      expect(updated?.name).toBe("Biology 102");
      expect(updated?.year).toBe("4-6");
      expect(updated?.track).toBe(SchoolClassTrack.B);
      expect(updated?.primary_teacher_id).toBe(2);
      expect(updated?.secondary_teacher_id).toBe(1);
    });

    it("should return undefined if trying to update non-existing class", async () => {
      const updated = await repo.update(999, { name: "Non-existent class" });
      expect(updated).toBeUndefined();
    });
  });

  describe("delete", () => {
    let classId: number;
    beforeAll(async () => {
      const created = await repo.create({
        name: "Geography 101",
        year: "1-3",
        track: SchoolClassTrack.A,
        primary_teacher_id: 1,
        secondary_teacher_id: 2,
      });
      classId = created!.id;
    });

    it("should delete an existing class and return it", async () => {
      const deleted = await repo.delete(classId);
      expect(deleted).toBeDefined();
      expect(deleted?.id).toBe(classId);
      expect(deleted?.name).toBe("Geography 101");
      expect(deleted?.year).toBe("1-3");
      expect(deleted?.track).toBe(SchoolClassTrack.A);
      expect(deleted?.primary_teacher_id).toBe(1);
      expect(deleted?.secondary_teacher_id).toBe(2);

      const afterDelete = await repo.getById(classId);
      expect(afterDelete).toBeUndefined();
    });

    it("should return undefined if trying to delete non-existing class", async () => {
      const deleted = await repo.delete(999);
      expect(deleted).toBeUndefined();
    });
  });
});
