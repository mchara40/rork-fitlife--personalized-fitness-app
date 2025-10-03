import { db } from '@/db';
import { exerciseLogs, setLogs } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { Session } from '@/lib/session';
import { requireAuth } from '@/lib/middleware';

export async function getUserExerciseLogs(session: Session | null) {
  const user = requireAuth(session);
  
  return await db.query.exerciseLogs.findMany({
    where: eq(exerciseLogs.userId, user.userId),
    with: {
      setLogs: true,
      exercise: true,
      workout: true,
      program: true,
    },
    orderBy: [desc(exerciseLogs.date)],
  });
}

export async function getExerciseHistory(session: Session | null, exerciseId: string) {
  const user = requireAuth(session);
  
  return await db.query.exerciseLogs.findMany({
    where: and(
      eq(exerciseLogs.userId, user.userId),
      eq(exerciseLogs.exerciseId, exerciseId)
    ),
    with: {
      setLogs: true,
    },
    orderBy: [desc(exerciseLogs.date)],
  });
}

export async function createExerciseLog(
  session: Session | null,
  data: {
    exerciseId: string;
    workoutId: string;
    programId: string;
    date: Date;
    notes?: string;
    sets: {
      setNumber: number;
      weight?: number;
      reps?: number;
      duration?: number;
      completed: boolean;
    }[];
  }
) {
  const user = requireAuth(session);
  
  const now = new Date();
  const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(exerciseLogs).values({
    id: logId,
    userId: user.userId,
    exerciseId: data.exerciseId,
    workoutId: data.workoutId,
    programId: data.programId,
    date: data.date,
    notes: data.notes || null,
    createdAt: now,
  });
  
  for (const set of data.sets) {
    const setId = `set_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await db.insert(setLogs).values({
      id: setId,
      exerciseLogId: logId,
      setNumber: set.setNumber,
      weight: set.weight || null,
      reps: set.reps || null,
      duration: set.duration || null,
      completed: set.completed,
      createdAt: now,
    });
  }
  
  return logId;
}

export async function updateExerciseLog(
  session: Session | null,
  logId: string,
  data: {
    notes?: string;
    sets?: {
      id?: string;
      setNumber: number;
      weight?: number;
      reps?: number;
      duration?: number;
      completed: boolean;
    }[];
  }
) {
  const user = requireAuth(session);
  
  const log = await db.query.exerciseLogs.findFirst({
    where: eq(exerciseLogs.id, logId),
  });
  
  if (!log) {
    throw new Error('Exercise log not found');
  }
  
  if (log.userId !== user.userId) {
    throw new Error('Unauthorized');
  }
  
  if (data.notes !== undefined) {
    await db.update(exerciseLogs)
      .set({ notes: data.notes })
      .where(eq(exerciseLogs.id, logId));
  }
  
  if (data.sets) {
    await db.delete(setLogs).where(eq(setLogs.exerciseLogId, logId));
    
    const now = new Date();
    for (const set of data.sets) {
      const setId = `set_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await db.insert(setLogs).values({
        id: setId,
        exerciseLogId: logId,
        setNumber: set.setNumber,
        weight: set.weight || null,
        reps: set.reps || null,
        duration: set.duration || null,
        completed: set.completed,
        createdAt: now,
      });
    }
  }
}

export async function deleteExerciseLog(session: Session | null, logId: string) {
  const user = requireAuth(session);
  
  const log = await db.query.exerciseLogs.findFirst({
    where: eq(exerciseLogs.id, logId),
  });
  
  if (!log) {
    throw new Error('Exercise log not found');
  }
  
  if (log.userId !== user.userId) {
    throw new Error('Unauthorized');
  }
  
  await db.delete(exerciseLogs).where(eq(exerciseLogs.id, logId));
}
