import { db } from '@/db';
import { exercises } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Session } from '@/lib/session';
import { requireAdmin } from '@/lib/middleware';

export async function getExercises() {
  return await db.query.exercises.findMany({
    orderBy: (exercises, { asc }) => [asc(exercises.name)],
  });
}

export async function getExerciseById(id: string) {
  const exercise = await db.query.exercises.findFirst({
    where: eq(exercises.id, id),
  });
  
  if (!exercise) {
    throw new Error('Exercise not found');
  }
  
  return exercise;
}

export async function createExercise(
  session: Session | null,
  data: {
    name: string;
    description: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    type: 'strength' | 'cardio' | 'flexibility' | 'plyometric';
    muscleGroups: string[];
    equipment: string[];
    instructions: string[];
  }
) {
  requireAdmin(session);
  
  const now = new Date();
  const exerciseId = `exercise_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(exercises).values({
    id: exerciseId,
    name: data.name,
    description: data.description,
    videoUrl: data.videoUrl || null,
    thumbnailUrl: data.thumbnailUrl || null,
    type: data.type,
    muscleGroups: JSON.stringify(data.muscleGroups),
    equipment: JSON.stringify(data.equipment),
    instructions: JSON.stringify(data.instructions),
    createdAt: now,
    updatedAt: now,
  });
  
  return exerciseId;
}

export async function updateExercise(
  session: Session | null,
  id: string,
  data: Partial<{
    name: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    type: 'strength' | 'cardio' | 'flexibility' | 'plyometric';
    muscleGroups: string[];
    equipment: string[];
    instructions: string[];
  }>
) {
  requireAdmin(session);
  
  const updateData: Record<string, unknown> = {
    ...data,
    updatedAt: new Date(),
  };
  
  if (data.muscleGroups) {
    updateData.muscleGroups = JSON.stringify(data.muscleGroups);
  }
  if (data.equipment) {
    updateData.equipment = JSON.stringify(data.equipment);
  }
  if (data.instructions) {
    updateData.instructions = JSON.stringify(data.instructions);
  }
  
  await db.update(exercises)
    .set(updateData)
    .where(eq(exercises.id, id));
}

export async function deleteExercise(session: Session | null, id: string) {
  requireAdmin(session);
  
  await db.delete(exercises).where(eq(exercises.id, id));
}
