import { Exercise } from '@/types/fitness';

export const exercises: Exercise[] = [
  {
    id: 'ex1',
    name: 'Barbell Bench Press',
    description: 'Classic chest exercise for building upper body strength',
    videoUrl: 'https://example.com/bench-press.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
    type: 'strength',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    equipment: ['barbell', 'bench'],
    instructions: [
      'Lie flat on bench with feet on floor',
      'Grip bar slightly wider than shoulder width',
      'Lower bar to chest with control',
      'Press bar up explosively',
      'Lock out arms at top'
    ]
  },
  {
    id: 'ex2',
    name: 'Barbell Back Squat',
    description: 'Fundamental lower body compound movement',
    videoUrl: 'https://example.com/squat.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400',
    type: 'strength',
    muscleGroups: ['quads', 'glutes', 'hamstrings', 'core'],
    equipment: ['barbell', 'squat rack'],
    instructions: [
      'Position bar on upper back',
      'Stand with feet shoulder-width apart',
      'Descend by breaking at hips and knees',
      'Go to parallel or below',
      'Drive through heels to stand'
    ]
  },
  {
    id: 'ex3',
    name: 'Deadlift',
    description: 'King of all exercises for total body strength',
    videoUrl: 'https://example.com/deadlift.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
    type: 'strength',
    muscleGroups: ['back', 'glutes', 'hamstrings', 'core', 'forearms'],
    equipment: ['barbell'],
    instructions: [
      'Stand with feet hip-width apart',
      'Grip bar just outside legs',
      'Keep back straight and chest up',
      'Drive through heels to lift',
      'Stand tall at top, squeeze glutes'
    ]
  },
  {
    id: 'ex4',
    name: 'Pull-ups',
    description: 'Bodyweight back and bicep builder',
    videoUrl: 'https://example.com/pullups.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400',
    type: 'strength',
    muscleGroups: ['back', 'biceps', 'core'],
    equipment: ['pull-up bar'],
    instructions: [
      'Hang from bar with overhand grip',
      'Pull shoulder blades down and back',
      'Pull chin over bar',
      'Lower with control',
      'Maintain hollow body position'
    ]
  },
  {
    id: 'ex5',
    name: 'Overhead Press',
    description: 'Build strong shoulders and upper body',
    videoUrl: 'https://example.com/ohp.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400',
    type: 'strength',
    muscleGroups: ['shoulders', 'triceps', 'core'],
    equipment: ['barbell'],
    instructions: [
      'Start with bar at shoulder height',
      'Grip slightly wider than shoulders',
      'Press bar overhead',
      'Lock out arms at top',
      'Lower with control'
    ]
  },
  {
    id: 'ex6',
    name: 'Burpees',
    description: 'Full body conditioning exercise',
    videoUrl: 'https://example.com/burpees.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
    type: 'cardio',
    muscleGroups: ['full body'],
    equipment: ['none'],
    instructions: [
      'Start standing',
      'Drop to plank position',
      'Perform push-up',
      'Jump feet to hands',
      'Jump up explosively'
    ]
  },
  {
    id: 'ex7',
    name: 'Box Jumps',
    description: 'Explosive lower body power development',
    videoUrl: 'https://example.com/box-jumps.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    type: 'plyometric',
    muscleGroups: ['quads', 'glutes', 'calves'],
    equipment: ['plyo box'],
    instructions: [
      'Stand facing box',
      'Swing arms back',
      'Jump explosively onto box',
      'Land softly with bent knees',
      'Step down carefully'
    ]
  },
  {
    id: 'ex8',
    name: 'Kettlebell Swings',
    description: 'Posterior chain power and conditioning',
    videoUrl: 'https://example.com/kb-swings.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
    type: 'strength',
    muscleGroups: ['glutes', 'hamstrings', 'core', 'shoulders'],
    equipment: ['kettlebell'],
    instructions: [
      'Start with kettlebell between legs',
      'Hinge at hips',
      'Swing kettlebell forward',
      'Drive hips forward explosively',
      'Let kettlebell swing to shoulder height'
    ]
  },
  {
    id: 'ex9',
    name: 'Battle Ropes',
    description: 'High intensity upper body and core conditioning',
    videoUrl: 'https://example.com/battle-ropes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
    type: 'cardio',
    muscleGroups: ['shoulders', 'arms', 'core'],
    equipment: ['battle ropes'],
    instructions: [
      'Hold rope ends in each hand',
      'Stand with feet shoulder-width',
      'Create waves with alternating arms',
      'Maintain athletic stance',
      'Keep core engaged'
    ]
  },
  {
    id: 'ex10',
    name: 'Dumbbell Rows',
    description: 'Build a thick, strong back',
    videoUrl: 'https://example.com/db-rows.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    type: 'strength',
    muscleGroups: ['back', 'biceps'],
    equipment: ['dumbbells', 'bench'],
    instructions: [
      'Place one knee on bench',
      'Hinge forward at hips',
      'Pull dumbbell to hip',
      'Squeeze shoulder blade',
      'Lower with control'
    ]
  }
];

export const getExerciseById = (id: string): Exercise | undefined => {
  return exercises.find(ex => ex.id === id);
};
