import { db } from '@/db';
import { workoutPrograms, workouts, workoutExercises } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Session } from '@/lib/session';
import { requireAdmin } from '@/lib/middleware';

export async function getPrograms(gender?: 'male' | 'female' | 'all') {
  const allPrograms = await db.query.workoutPrograms.findMany({
    with: {
      workouts: {
        with: {
          workoutExercises: {
            with: {
              exercise: true,
            },
          },
        },
      },
    },
    orderBy: (programs, { desc }) => [desc(programs.createdAt)],
  });
  
  if (gender && gender !== 'all') {
    return allPrograms.filter(p => p.gender === gender || p.gender === 'all');
  }
  
  return allPrograms;
}

export async function getProgramById(id: string) {
  const program = await db.query.workoutPrograms.findFirst({
    where: eq(workoutPrograms.id, id),
    with: {
      workouts: {
        with: {
          workoutExercises: {
            with: {
              exercise: true,
            },
            orderBy: (we, { asc }) => [asc(we.orderIndex)],
          },
        },
        orderBy: (w, { asc }) => [asc(w.orderIndex)],
      },
    },
  });
  
  if (!program) {
    throw new Error('Program not found');
  }
  
  return program;
}

export async function createProgram(
  session: Session | null,
  data: {
    name: string;
    description: string;
    goal: 'muscle_building' | 'functional_hybrid' | 'combat_sports' | 'weight_loss' | 'endurance' | 'strength';
    gender: 'male' | 'female' | 'all';
    duration: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    thumbnailUrl?: string;
    isPremium: boolean;
  }
) {
  requireAdmin(session);
  
  const now = new Date();
  const programId = `program_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(workoutPrograms).values({
    id: programId,
    name: data.name,
    description: data.description,
    goal: data.goal,
    gender: data.gender,
    duration: data.duration,
    difficulty: data.difficulty,
    thumbnailUrl: data.thumbnailUrl || null,
    isPremium: data.isPremium,
    createdAt: now,
    updatedAt: now,
  });
  
  return programId;
}

export async function updateProgram(
  session: Session | null,
  id: string,
  data: Partial<{
    name: string;
    description: string;
    goal: 'muscle_building' | 'functional_hybrid' | 'combat_sports' | 'weight_loss' | 'endurance' | 'strength';
    gender: 'male' | 'female' | 'all';
    duration: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    thumbnailUrl: string;
    isPremium: boolean;
  }>
) {
  requireAdmin(session);
  
  await db.update(workoutPrograms)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(workoutPrograms.id, id));
}

export async function deleteProgram(session: Session | null, id: string) {
  requireAdmin(session);
  
  await db.delete(workoutPrograms).where(eq(workoutPrograms.id, id));
}

export async function addWorkoutToProgram(
  session: Session | null,
  programId: string,
  data: {
    name: string;
    description: string;
    duration: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    orderIndex: number;
  }
) {
  requireAdmin(session);
  
  const now = new Date();
  const workoutId = `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(workouts).values({
    id: workoutId,
    programId,
    name: data.name,
    description: data.description,
    duration: data.duration,
    difficulty: data.difficulty,
    orderIndex: data.orderIndex,
    createdAt: now,
    updatedAt: now,
  });
  
  return workoutId;
}

export async function addExerciseToWorkout(
  session: Session | null,
  workoutId: string,
  data: {
    exerciseId: string;
    sets?: number;
    reps?: number;
    duration?: number;
    restTime?: number;
    notes?: string;
    orderIndex: number;
  }
) {
  requireAdmin(session);
  
  const now = new Date();
  const workoutExerciseId = `we_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.insert(workoutExercises).values({
    id: workoutExerciseId,
    workoutId,
    exerciseId: data.exerciseId,
    sets: data.sets || null,
    reps: data.reps || null,
    duration: data.duration || null,
    restTime: data.restTime || null,
    notes: data.notes || null,
    orderIndex: data.orderIndex,
    createdAt: now,
  });
  
  return workoutExerciseId;
}

export async function updateWorkout(
  session: Session | null,
  id: string,
  data: Partial<{
    name: string;
    description: string;
    duration: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    orderIndex: number;
  }>
) {
  requireAdmin(session);
  
  await db.update(workouts)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(workouts.id, id));
}

export async function deleteWorkout(session: Session | null, id: string) {
  requireAdmin(session);
  
  await db.delete(workouts).where(eq(workouts.id, id));
}

export async function deleteWorkoutExercise(session: Session | null, id: string) {
  requireAdmin(session);
  
  await db.delete(workoutExercises).where(eq(workoutExercises.id, id));
}
