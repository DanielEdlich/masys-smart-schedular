/**
 * @jest-environment node
 */

import { teacher, teacher_availability } from "@/db/schema";
import { NewTeacherAvailability } from "@/db/types";
import { TeacherAvailabilityRepository } from "@/repositories/teacherAvailabilityRepository";

describe("teacherAvailabilityRepository", () => {
  let repo: TeacherAvailabilityRepository;
  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    repo = new TeacherAvailabilityRepository((global as any).db);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (global as any).db.delete(teacher);

    await (global as any).db.insert(teacher).values({
      first_name: "Emma",
      last_name: "Watson",
      email: "emma.watson@mail.com",
      id: 1,
      phone: "",
      priority: 0,
      weekly_capacity: 0,
    });
    await (global as any).db.insert(teacher).values({
      first_name: "Daniel",
      last_name: "Radcliffe",
      email: "daniel.radcliffe@mail.com",
      id: 2,
      phone: "",
      priority: 0,
      weekly_capacity: 0,
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  afterAll(async () => await (global as any).db.delete(teacher_availability));

  describe("create", () => {
    it("should create a new teacher availability and return it", async () => {
      const teacherAvailability: NewTeacherAvailability = {
        teacher_id: 1,
        day: "Monday",
        timeslot_from: 1,
        timeslot_to: 2,
      };

      const created = await repo.create(teacherAvailability);
      expect(created).toBeDefined();
      expect(created?.id).toBeDefined();
      expect(created?.teacher_id).toBe(1);
      expect(created?.day).toBe("Monday");
      expect(created?.timeslot_from).toBe(1);
      expect(created?.timeslot_to).toBe(2);
    });
  });

  describe("getById", () => {
    let createdId: number;
    beforeAll(async () => {
      const created = await repo.create({
        teacher_id: 2,
        day: "Tuesday",
        timeslot_from: 3,
        timeslot_to: 4,
      });
      createdId = created!.id;
    });

    it("should return the correct availability by id", async () => {
      const result = await repo.getById(createdId);
      expect(result).toBeDefined();
      expect(result?.id).toBe(createdId);
      expect(result?.teacher_id).toBe(2);
      expect(result?.day).toBe("Tuesday");
      expect(result?.timeslot_from).toBe(3);
      expect(result?.timeslot_to).toBe(4);
    });

    it("should return undefined if availability not found", async () => {
      const result = await repo.getById(999);
      expect(result).toBeUndefined();
    });
  });

  describe("getAll", () => {
    beforeAll(async () => {
      await repo.create({
        teacher_id: 1,
        day: "Wednesday",
        timeslot_from: 5,
        timeslot_to: 6,
      });
      await repo.create({
        teacher_id: 2,
        day: "Thursday",
        timeslot_from: 7,
        timeslot_to: 8,
      });
    });

    it("should return all teacher availabilities", async () => {
      const all = await repo.getAll();
      expect(all.length).toBeGreaterThanOrEqual(2);
      const days = all.map((a) => a.day);
      expect(days).toContain("Wednesday");
      expect(days).toContain("Thursday");
    });
  });

  describe("getForTeacher", () => {
    beforeAll(async () => {
      await repo.create({
        teacher_id: 1,
        day: "Friday",
        timeslot_from: 9,
        timeslot_to: 10,
      });
    });

    it("should return availabilities for the given teacher", async () => {
      const availabilities = await repo.getForTeacher(1);
      expect(availabilities.length).toBeGreaterThanOrEqual(1);
      const days = availabilities.map((a) => a.day);
      expect(days).toContain("Friday");
    });
  });

  describe("isAvailableAtTimeslot", () => {
    beforeAll(async () => {
      await repo.create({
        teacher_id: 2,
        day: "Saturday",
        timeslot_from: 11,
        timeslot_to: 12,
      });
    });

    it("should return true if teacher is available at the given timeslot and day", async () => {
      const isAvailable = await repo.isTeacherAvailableAtTimeslot(
        2,
        11,
        "Saturday",
      );
      expect(isAvailable).toBe(true);
    });

    it("should return false if teacher is not available at the given timeslot and day", async () => {
      const isAvailable = await repo.isTeacherAvailableAtTimeslot(
        2,
        13,
        "Saturday",
      );
      expect(isAvailable).toBe(false);
    });
  });

  describe("update", () => {
    let teacherAvailabilityId: number;
    beforeAll(async () => {
      const created = await repo.create({
        teacher_id: 1,
        day: "Sunday",
        timeslot_from: 13,
        timeslot_to: 14,
      });
      teacherAvailabilityId = created!.id;
    });

    it("should update an existing teacher availability", async () => {
      const updated = await repo.update(teacherAvailabilityId, { day: "Tuesday" });
      expect(updated).toBeDefined();
      expect(updated?.id).toBe(teacherAvailabilityId);
      expect(updated?.day).toBe("Tuesday");
    });

    it("should return undefined if trying to update non-existing availability", async () => {
      const updated = await repo.update(999, { day: "Sunday" });
      expect(updated).toBeUndefined();
    });
  });

  describe("delete", () => {
    let teacherAvailabilityId: number;
    beforeAll(async () => {
      const created = await repo.create({
        teacher_id: 1,
        day: "Monday",
        timeslot_from: 15,
        timeslot_to: 16,
      });
      teacherAvailabilityId = created!.id;
    });

    it("should delete an existing teacher availability and return it", async () => {
      const deleted = await repo.delete(teacherAvailabilityId);
      expect(deleted).toBeDefined();
      expect(deleted?.id).toBe(teacherAvailabilityId);
      expect(deleted?.day).toBe("Monday");

      const afterDelete = await repo.getById(teacherAvailabilityId);
      expect(afterDelete).toBeUndefined();
    });

    it("should return undefined if trying to delete non-existing availability", async () => {
      const deleted = await repo.delete(999);
      expect(deleted).toBeUndefined();
    });
  });
});
