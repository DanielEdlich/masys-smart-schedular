// db/types.ts
import { teacher, availability, schoolClass, timetable, lesson } from '@/db/schema';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

export type Teacher = InferSelectModel<typeof teacher>;
export type NewTeacher = InferInsertModel<typeof teacher>;

export type Availability = InferSelectModel<typeof availability>;
export type NewAvailability = InferInsertModel<typeof availability>;

export type SchoolClass = InferSelectModel<typeof schoolClass>;
export type NewSchoolClass = InferInsertModel<typeof schoolClass>;

export type Timetable = InferSelectModel<typeof timetable>;
export type NewTimetable = InferInsertModel<typeof timetable>;

export type Lesson = InferSelectModel<typeof lesson>;
export type NewLesson = InferInsertModel<typeof lesson>;
