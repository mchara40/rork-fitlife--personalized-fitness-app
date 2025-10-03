import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  gender: text('gender', { enum: ['male', 'female', 'all'] }).notNull().default('all'),
  role: text('role', { enum: ['user', 'admin'] }).notNull().default('user'),
  trialUsed: integer('trial_used', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  plan: text('plan', { enum: ['1_month', '3_months', '6_months', '1_year'] }).notNull(),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  isTrial: integer('is_trial', { mode: 'boolean' }).notNull().default(false),
  autoRenew: integer('auto_renew', { mode: 'boolean' }).notNull().default(false),
  stripeSubscriptionId: text('stripe_subscription_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const paymentCards = sqliteTable('payment_cards', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  cardFingerprint: text('card_fingerprint').notNull(),
  last4: text('last4').notNull(),
  brand: text('brand').notNull(),
  stripePaymentMethodId: text('stripe_payment_method_id').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const exercises = sqliteTable('exercises', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  videoUrl: text('video_url'),
  thumbnailUrl: text('thumbnail_url'),
  type: text('type', { enum: ['strength', 'cardio', 'flexibility', 'plyometric'] }).notNull(),
  muscleGroups: text('muscle_groups').notNull(),
  equipment: text('equipment').notNull(),
  instructions: text('instructions').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const workoutPrograms = sqliteTable('workout_programs', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  goal: text('goal', { 
    enum: ['muscle_building', 'functional_hybrid', 'combat_sports', 'weight_loss', 'endurance', 'strength'] 
  }).notNull(),
  gender: text('gender', { enum: ['male', 'female', 'all'] }).notNull(),
  duration: integer('duration').notNull(),
  difficulty: text('difficulty', { enum: ['beginner', 'intermediate', 'advanced'] }).notNull(),
  thumbnailUrl: text('thumbnail_url'),
  isPremium: integer('is_premium', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const workouts = sqliteTable('workouts', {
  id: text('id').primaryKey(),
  programId: text('program_id').notNull().references(() => workoutPrograms.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  duration: integer('duration').notNull(),
  difficulty: text('difficulty', { enum: ['beginner', 'intermediate', 'advanced'] }).notNull(),
  orderIndex: integer('order_index').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const workoutExercises = sqliteTable('workout_exercises', {
  id: text('id').primaryKey(),
  workoutId: text('workout_id').notNull().references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: text('exercise_id').notNull().references(() => exercises.id, { onDelete: 'cascade' }),
  sets: integer('sets'),
  reps: integer('reps'),
  duration: integer('duration'),
  restTime: integer('rest_time'),
  notes: text('notes'),
  orderIndex: integer('order_index').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const exerciseLogs = sqliteTable('exercise_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  exerciseId: text('exercise_id').notNull().references(() => exercises.id),
  workoutId: text('workout_id').notNull().references(() => workouts.id),
  programId: text('program_id').notNull().references(() => workoutPrograms.id),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const setLogs = sqliteTable('set_logs', {
  id: text('id').primaryKey(),
  exerciseLogId: text('exercise_log_id').notNull().references(() => exerciseLogs.id, { onDelete: 'cascade' }),
  setNumber: integer('set_number').notNull(),
  weight: real('weight'),
  reps: integer('reps'),
  duration: integer('duration'),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  subscriptions: many(subscriptions),
  paymentCards: many(paymentCards),
  exerciseLogs: many(exerciseLogs),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

export const paymentCardsRelations = relations(paymentCards, ({ one }) => ({
  user: one(users, {
    fields: [paymentCards.userId],
    references: [users.id],
  }),
}));

export const workoutProgramsRelations = relations(workoutPrograms, ({ many }) => ({
  workouts: many(workouts),
  exerciseLogs: many(exerciseLogs),
}));

export const workoutsRelations = relations(workouts, ({ one, many }) => ({
  program: one(workoutPrograms, {
    fields: [workouts.programId],
    references: [workoutPrograms.id],
  }),
  workoutExercises: many(workoutExercises),
  exerciseLogs: many(exerciseLogs),
}));

export const exercisesRelations = relations(exercises, ({ many }) => ({
  workoutExercises: many(workoutExercises),
  exerciseLogs: many(exerciseLogs),
}));

export const workoutExercisesRelations = relations(workoutExercises, ({ one }) => ({
  workout: one(workouts, {
    fields: [workoutExercises.workoutId],
    references: [workouts.id],
  }),
  exercise: one(exercises, {
    fields: [workoutExercises.exerciseId],
    references: [exercises.id],
  }),
}));

export const exerciseLogsRelations = relations(exerciseLogs, ({ one, many }) => ({
  user: one(users, {
    fields: [exerciseLogs.userId],
    references: [users.id],
  }),
  exercise: one(exercises, {
    fields: [exerciseLogs.exerciseId],
    references: [exercises.id],
  }),
  workout: one(workouts, {
    fields: [exerciseLogs.workoutId],
    references: [workouts.id],
  }),
  program: one(workoutPrograms, {
    fields: [exerciseLogs.programId],
    references: [workoutPrograms.id],
  }),
  setLogs: many(setLogs),
}));

export const setLogsRelations = relations(setLogs, ({ one }) => ({
  exerciseLog: one(exerciseLogs, {
    fields: [setLogs.exerciseLogId],
    references: [exerciseLogs.id],
  }),
}));
