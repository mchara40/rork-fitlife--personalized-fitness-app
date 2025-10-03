import { WorkoutProgram } from '@/types/fitness';

export const workoutPrograms: WorkoutProgram[] = [
  {
    id: 'prog1',
    name: 'Mass Builder Pro',
    description: 'Build serious muscle mass with this 12-week hypertrophy program. Perfect for intermediate to advanced lifters.',
    goal: 'muscle_building',
    gender: 'all',
    duration: 12,
    difficulty: 'intermediate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600',
    isPremium: true,
    workouts: [
      {
        id: 'w1',
        name: 'Push Day A',
        description: 'Chest, shoulders, and triceps focus',
        duration: 60,
        difficulty: 'intermediate',
        exercises: [
          { exerciseId: 'ex1', sets: 4, reps: 8, restTime: 120 },
          { exerciseId: 'ex5', sets: 4, reps: 10, restTime: 90 },
          { exerciseId: 'ex1', sets: 3, reps: 12, restTime: 60 }
        ]
      },
      {
        id: 'w2',
        name: 'Pull Day A',
        description: 'Back and biceps development',
        duration: 60,
        difficulty: 'intermediate',
        exercises: [
          { exerciseId: 'ex3', sets: 4, reps: 6, restTime: 180 },
          { exerciseId: 'ex4', sets: 4, reps: 8, restTime: 120 },
          { exerciseId: 'ex10', sets: 3, reps: 12, restTime: 60 }
        ]
      },
      {
        id: 'w3',
        name: 'Leg Day A',
        description: 'Lower body strength and size',
        duration: 75,
        difficulty: 'intermediate',
        exercises: [
          { exerciseId: 'ex2', sets: 5, reps: 5, restTime: 180 },
          { exerciseId: 'ex3', sets: 3, reps: 8, restTime: 120 }
        ]
      }
    ]
  },
  {
    id: 'prog2',
    name: 'Functional Hybrid Athlete',
    description: 'Combine strength, power, and conditioning for complete athletic performance.',
    goal: 'functional_hybrid',
    gender: 'all',
    duration: 8,
    difficulty: 'advanced',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600',
    isPremium: true,
    workouts: [
      {
        id: 'w4',
        name: 'Strength + Conditioning',
        description: 'Build strength then finish with metabolic work',
        duration: 45,
        difficulty: 'advanced',
        exercises: [
          { exerciseId: 'ex2', sets: 5, reps: 3, restTime: 180 },
          { exerciseId: 'ex5', sets: 4, reps: 5, restTime: 120 },
          { exerciseId: 'ex6', sets: 5, reps: 15, restTime: 60 },
          { exerciseId: 'ex8', sets: 4, duration: 30, restTime: 60 }
        ]
      },
      {
        id: 'w5',
        name: 'Power Development',
        description: 'Explosive movements for athletic power',
        duration: 40,
        difficulty: 'advanced',
        exercises: [
          { exerciseId: 'ex7', sets: 5, reps: 5, restTime: 120 },
          { exerciseId: 'ex8', sets: 5, reps: 15, restTime: 90 },
          { exerciseId: 'ex6', sets: 4, reps: 10, restTime: 60 }
        ]
      }
    ]
  },
  {
    id: 'prog3',
    name: 'Combat Sports Performance',
    description: 'Train like a fighter with this MMA-inspired program focused on power, endurance, and explosiveness.',
    goal: 'combat_sports',
    gender: 'all',
    duration: 10,
    difficulty: 'advanced',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600',
    isPremium: true,
    workouts: [
      {
        id: 'w6',
        name: 'Fight Conditioning',
        description: 'High intensity combat conditioning',
        duration: 30,
        difficulty: 'advanced',
        exercises: [
          { exerciseId: 'ex6', sets: 10, reps: 10, restTime: 30 },
          { exerciseId: 'ex9', sets: 6, duration: 30, restTime: 30 },
          { exerciseId: 'ex7', sets: 5, reps: 8, restTime: 45 }
        ]
      },
      {
        id: 'w7',
        name: 'Strength for Fighters',
        description: 'Build functional strength for combat',
        duration: 45,
        difficulty: 'advanced',
        exercises: [
          { exerciseId: 'ex3', sets: 5, reps: 5, restTime: 180 },
          { exerciseId: 'ex4', sets: 4, reps: 8, restTime: 120 },
          { exerciseId: 'ex8', sets: 4, reps: 20, restTime: 90 }
        ]
      }
    ]
  },
  {
    id: 'prog4',
    name: 'Beginner Strength Foundation',
    description: 'Perfect starting point for building strength and learning proper form.',
    goal: 'strength',
    gender: 'all',
    duration: 8,
    difficulty: 'beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
    isPremium: false,
    workouts: [
      {
        id: 'w8',
        name: 'Full Body A',
        description: 'Learn the fundamental movements',
        duration: 45,
        difficulty: 'beginner',
        exercises: [
          { exerciseId: 'ex2', sets: 3, reps: 10, restTime: 120 },
          { exerciseId: 'ex1', sets: 3, reps: 10, restTime: 120 },
          { exerciseId: 'ex10', sets: 3, reps: 10, restTime: 90 }
        ]
      }
    ]
  },
  {
    id: 'prog5',
    name: 'Women\'s Strength & Tone',
    description: 'Build lean muscle and strength with this female-focused program.',
    goal: 'muscle_building',
    gender: 'female',
    duration: 10,
    difficulty: 'intermediate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600',
    isPremium: true,
    workouts: [
      {
        id: 'w9',
        name: 'Lower Body Sculpt',
        description: 'Build strong, toned legs and glutes',
        duration: 50,
        difficulty: 'intermediate',
        exercises: [
          { exerciseId: 'ex2', sets: 4, reps: 12, restTime: 90 },
          { exerciseId: 'ex3', sets: 3, reps: 10, restTime: 120 }
        ]
      },
      {
        id: 'w10',
        name: 'Upper Body Definition',
        description: 'Sculpt arms, shoulders, and back',
        duration: 45,
        difficulty: 'intermediate',
        exercises: [
          { exerciseId: 'ex4', sets: 3, reps: 8, restTime: 120 },
          { exerciseId: 'ex5', sets: 3, reps: 12, restTime: 90 },
          { exerciseId: 'ex10', sets: 3, reps: 12, restTime: 60 }
        ]
      }
    ]
  }
];

export const getProgramById = (id: string): WorkoutProgram | undefined => {
  return workoutPrograms.find(p => p.id === id);
};
