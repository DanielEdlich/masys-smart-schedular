import { LibSQLDatabase } from "drizzle-orm/libsql";
import { Client } from "@libsql/client";
import { teacher, blocker, schoolClass, timetable, lesson } from "@/db/schema";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";

export type Teacher = InferSelectModel<typeof teacher>;
export type NewTeacher = InferInsertModel<typeof teacher>;

export type Blocker = InferSelectModel<typeof blocker>;
export type NewBlocker = InferInsertModel<typeof blocker>;

export type SchoolClass = InferSelectModel<typeof schoolClass>;
export type NewSchoolClass = InferInsertModel<typeof schoolClass>;

export type Timetable = InferSelectModel<typeof timetable>;
export type NewTimetable = InferInsertModel<typeof timetable>;

export type Lesson = InferSelectModel<typeof lesson>;
export type NewLesson = InferInsertModel<typeof lesson>;

export enum SchoolClassTrack {
  A = "A",
  B = "B",
}

export interface DbClient extends LibSQLDatabase<Record<string, never>> {
  $client: Client;
}

export enum Week {
  A = "A",
  B = "B",
}

export enum Weekday {
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag"
}



// Update other types that used className
export type ClassSchedule = {
  [classId: number]: WeekSchedule;
};

export type Schedule = {
  [day in Weekday]: ClassSchedule;
};

export type WeekSchedule = {
  [week in Week]: (Lesson | null)[];
};

