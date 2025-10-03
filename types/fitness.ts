export type Gender = 'male' | 'female' | 'all';

export type WorkoutGoal = 
  | 'muscle_building'
  | 'functional_hybrid'
  | 'combat_sports'
  | 'weight_loss'
  | 'endurance'
  | 'strength';

export type ExerciseType = 'strength' | 'cardio' | 'flexibility' | 'plyometric';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  type: ExerciseType;
  muscleGroups: string[];
  equipment: string[];
  instructions: string[];
}

export interface WorkoutExercise {
  exerciseId: string;
  sets?: number;
  reps?: number;
  duration?: number;
  restTime?: number;
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: WorkoutExercise[];
}

export interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  goal: WorkoutGoal;
  gender: Gender;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  workouts: Workout[];
  thumbnailUrl?: string;
  isPremium: boolean;
}

export interface ExerciseLog {
  id: string;
  exerciseId: string;
  workoutId: string;
  programId: string;
  date: string;
  sets: SetLog[];
  notes?: string;
}

export interface SetLog {
  setNumber: number;
  weight?: number;
  reps?: number;
  duration?: number;
  completed: boolean;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  type: 'weight' | 'reps' | 'duration';
  value: number;
  date: string;
}

export interface UserProgress {
  totalWorkouts: number;
  totalExercises: number;
  currentStreak: number;
  longestStreak: number;
  personalRecords: PersonalRecord[];
  weeklyStats: {
    week: string;
    workouts: number;
    exercises: number;
  }[];
}

export type SubscriptionPlan = '1_month' | '3_months' | '6_months' | '1_year';

export interface Subscription {
  plan: SubscriptionPlan;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isTrial: boolean;
  autoRenew: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  gender: Gender;
  subscription: Subscription | null;
  trialUsed: boolean;
  paymentCards: string[];
}
