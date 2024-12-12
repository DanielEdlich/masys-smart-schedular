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
  phone: text('phone_number').notNull(),        // Phone number
  priority: integer('priority').notNull(),          // Priority
  weekly_capacity: integer('weekly_capacity').notNull()  //capacity
});

// ---------------------------------------
// AVAILABILITY
// ---------------------------------------
export const blocker = sqliteTable('blocker', {
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
  year: text('year'),             // Year like 1-3 or 4-6
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
  date: text('date'),                         // Weekday as Enum (Monday, Tuesday, etc)
  week: text('week'), // A or B week or maybe more later
  timeslot: integer('timeslot_from').notNull(), // Timeslot (e.g. 4)
  name: text('name'),     // Lesson name

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