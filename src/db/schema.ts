import {
  sqliteTable,
  integer,
  text,
  foreignKey
} from 'drizzle-orm/sqlite-core';

// ---------------------------------------
// TEACHER
// ---------------------------------------
export const teacher = sqliteTable('teacher', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  first_name: text('first_name').notNull(),  // First name
  last_name: text('last_name').notNull(),    // Last name
  email: text('email').notNull(),            // Email
  phone_number: text('phone_number'),        // Phone number
  avatar: text('avatar'),                    // Avatar
  priority: integer('priority')              // Priority
});

// ---------------------------------------
// TEACHER_AVAILABILITY
// ---------------------------------------
export const teacherAvailability = sqliteTable('teacher_availability', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  day: text('day').notNull(),                // Day (e.g. Monday, Tuesday...)
  timeslot_from: integer('timeslot_from').notNull(), // Timeslot start (e.g. 8)
  timeslot_to: integer('timeslot_to').notNull(),     // Timeslot end (e.g. 10)
  teacher_id: integer('teacher_id').notNull()
}, (table) => {
  return {
    teacherFk: foreignKey({
      columns: [table.teacher_id],
      foreignColumns: [teacher.id],
    }).onDelete('cascade').onUpdate('cascade')
  };
});

// ---------------------------------------
// SCHOOL_CLASS
// ---------------------------------------
export const schoolClass = sqliteTable('school_class', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),      // Class name
  year: integer('year'),             // Year
  grade: integer('grade')            // Grade level
});

// ---------------------------------------
// TIMETABLE
// ---------------------------------------
export const timetable = sqliteTable('timetable', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),       // Name of the timetable
  school_year: text('school_year')    // e.g. "2024/2025"
});

// ---------------------------------------
// LESSON
// ---------------------------------------
export const lesson = sqliteTable('lesson', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  date: text('date'),                         // Date (ISO-String, e.g. "2024-12-06")
  timeslot_from: integer('timeslot_from').notNull(), // Timeslot start (e.g. 8)
  timeslot_to: integer('timeslot_to').notNull(),     // Timeslot end (e.g. 10)
  lesson_name: text('lesson_name'),     // Lesson content

  timetable_id: integer('timetable_id').notNull(),
  school_class_id: integer('school_class_id').notNull(),
  primary_teacher_id: integer('primary_teacher_id').notNull(),
  secondary_teacher_id: integer('secondary_teacher_id')
}, (table) => {
  return {
    timetableFk: foreignKey({
      columns: [table.timetable_id],
      foreignColumns: [timetable.id],
    }).onDelete('cascade').onUpdate('cascade'),

    schoolClassFk: foreignKey({
      columns: [table.school_class_id],
      foreignColumns: [schoolClass.id],
    }).onDelete('cascade').onUpdate('cascade'),

    primaryTeacherFk: foreignKey({
      columns: [table.primary_teacher_id],
      foreignColumns: [teacher.id],
    }).onDelete('cascade').onUpdate('cascade'),

    secondaryTeacherFk: foreignKey({
      columns: [table.secondary_teacher_id],
      foreignColumns: [teacher.id],
    }).onDelete('set null').onUpdate('cascade')
  };
});