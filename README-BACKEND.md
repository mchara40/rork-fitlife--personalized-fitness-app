# Fitness App Backend Documentation

## Overview

This fitness app now has a complete backend infrastructure with:
- Database schema using Drizzle ORM with SQLite
- User authentication and authorization
- Admin role management
- Subscription and payment tracking
- Exercise logging system
- Free trial management with payment card fingerprinting

## Database Schema

### Tables

1. **users** - User accounts with authentication
   - id, email, name, passwordHash, gender, role, trialUsed
   
2. **subscriptions** - User subscription plans
   - id, userId, plan, startDate, endDate, isActive, isTrial, autoRenew, stripeSubscriptionId
   
3. **paymentCards** - Payment card tracking (prevents trial abuse)
   - id, userId, cardFingerprint, last4, brand, stripePaymentMethodId
   
4. **exercises** - Exercise library
   - id, name, description, videoUrl, thumbnailUrl, type, muscleGroups, equipment, instructions
   
5. **workoutPrograms** - Workout programs
   - id, name, description, goal, gender, duration, difficulty, thumbnailUrl, isPremium
   
6. **workouts** - Individual workouts within programs
   - id, programId, name, description, duration, difficulty, orderIndex
   
7. **workoutExercises** - Exercises within workouts
   - id, workoutId, exerciseId, sets, reps, duration, restTime, notes, orderIndex
   
8. **exerciseLogs** - User exercise performance logs
   - id, userId, exerciseId, workoutId, programId, date, notes
   
9. **setLogs** - Individual set logs
   - id, exerciseLogId, setNumber, weight, reps, duration, completed

## API Functions

### Authentication (`lib/auth.ts`)
- `hashPassword(password)` - Hash passwords with bcrypt
- `verifyPassword(password, hash)` - Verify password against hash
- `createUser(data)` - Create new user account
- `authenticateUser(email, password)` - Authenticate user login
- `isAdmin(role)` - Check if user has admin role

### Session Management (`lib/session.ts`)
- `saveSession(session)` - Save user session to AsyncStorage
- `getSession()` - Retrieve current session
- `clearSession()` - Clear session on logout
- `generateToken()` - Generate session token

### Middleware (`lib/middleware.ts`)
- `requireAuth(session)` - Require authenticated user
- `requireAdmin(session)` - Require admin role

### Exercises API (`api/exercises.ts`)
- `getExercises()` - Get all exercises
- `getExerciseById(id)` - Get single exercise
- `createExercise(session, data)` - Create exercise (admin only)
- `updateExercise(session, id, data)` - Update exercise (admin only)
- `deleteExercise(session, id)` - Delete exercise (admin only)

### Programs API (`api/programs.ts`)
- `getPrograms(gender?)` - Get all programs, optionally filtered by gender
- `getProgramById(id)` - Get program with workouts and exercises
- `createProgram(session, data)` - Create program (admin only)
- `updateProgram(session, id, data)` - Update program (admin only)
- `deleteProgram(session, id)` - Delete program (admin only)
- `addWorkoutToProgram(session, programId, data)` - Add workout to program (admin only)
- `addExerciseToWorkout(session, workoutId, data)` - Add exercise to workout (admin only)
- `updateWorkout(session, id, data)` - Update workout (admin only)
- `deleteWorkout(session, id)` - Delete workout (admin only)
- `deleteWorkoutExercise(session, id)` - Delete exercise from workout (admin only)

### Subscriptions API (`api/subscriptions.ts`)
- `getUserSubscription(session)` - Get user's active subscription
- `checkTrialEligibility(userId, cardFingerprint)` - Check if user can start trial
- `startFreeTrial(session, cardData)` - Start 14-day free trial
- `createSubscription(session, data)` - Create paid subscription
- `cancelSubscription(session, subscriptionId)` - Cancel subscription
- `hasActiveSubscription(userId)` - Check if user has active subscription
- `getSubscriptionPrice(plan)` - Get price for subscription plan
- `getSubscriptionDuration(plan)` - Get duration for subscription plan

### Exercise Logs API (`api/exercise-logs.ts`)
- `getUserExerciseLogs(session)` - Get all user's exercise logs
- `getExerciseHistory(session, exerciseId)` - Get history for specific exercise
- `createExerciseLog(session, data)` - Log exercise performance
- `updateExerciseLog(session, logId, data)` - Update exercise log
- `deleteExerciseLog(session, logId)` - Delete exercise log

## React Hooks

### Authentication
- `useAuth()` - Access auth context (session, login, register, logout, isAdmin)

### Programs
- `usePrograms(gender?)` - Query all programs
- `useProgram(id)` - Query single program
- `useCreateProgram()` - Mutation to create program
- `useUpdateProgram()` - Mutation to update program
- `useDeleteProgram()` - Mutation to delete program

### Exercises
- `useExercises()` - Query all exercises
- `useExercise(id)` - Query single exercise
- `useCreateExercise()` - Mutation to create exercise
- `useUpdateExercise()` - Mutation to update exercise
- `useDeleteExercise()` - Mutation to delete exercise

### Subscriptions
- `useSubscription()` - Query user's subscription
- `useStartFreeTrial()` - Mutation to start free trial
- `useCreateSubscription()` - Mutation to create subscription
- `useCancelSubscription()` - Mutation to cancel subscription

### Exercise Logs
- `useExerciseLogs()` - Query user's exercise logs
- `useExerciseHistory(exerciseId)` - Query exercise history
- `useCreateExerciseLog()` - Mutation to create log
- `useUpdateExerciseLog()` - Mutation to update log
- `useDeleteExerciseLog()` - Mutation to delete log

## Setup Instructions

### 1. Initialize Database

Run the initialization script to create the admin user:

```bash
bun run scripts/init-db.ts
```

This creates an admin account:
- Email: admin@fitness.com
- Password: admin123

**Important:** Change the admin password after first login!

### 2. Admin Features

Admin users can:
- Create, update, and delete exercises
- Create, update, and delete workout programs
- Add workouts to programs
- Add exercises to workouts
- Manage all content in the app

### 3. Subscription Plans

Available plans:
- **1 Month**: $29.99 (30 days)
- **3 Months**: $79.99 (90 days)
- **6 Months**: $149.99 (180 days)
- **1 Year**: $249.99 (365 days)

### 4. Free Trial

- 14 days free trial available for new users
- Requires payment card (for verification)
- Card fingerprint tracked to prevent abuse
- Same card cannot be used for multiple trial accounts
- Trial automatically marked as used after activation

### 5. Payment Integration

The backend is ready for Stripe integration:
- `stripeSubscriptionId` field in subscriptions table
- `stripePaymentMethodId` field in payment cards table
- Card fingerprinting for fraud prevention

To integrate Stripe:
1. Install Stripe SDK: `bun add stripe @stripe/stripe-react-native`
2. Add Stripe publishable key to environment
3. Implement payment flow in frontend
4. Connect subscription creation to Stripe webhooks

## Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **Session Management**: Token-based authentication
3. **Role-Based Access**: Admin vs User permissions
4. **Trial Abuse Prevention**: Card fingerprint tracking
5. **Subscription Validation**: Automatic expiration checking

## Next Steps

1. **Create Login/Register Screens**: Build UI for authentication
2. **Create Admin Dashboard**: Build UI for content management
3. **Integrate Stripe**: Add payment processing
4. **Add Subscription Paywall**: Restrict premium content
5. **Build Exercise Logging UI**: Allow users to log workouts
6. **Add Progress Tracking**: Visualize user progress over time

## Example Usage

### Login
```typescript
const { login } = useAuth();
await login('admin@fitness.com', 'admin123');
```

### Create Exercise (Admin)
```typescript
const { mutate: createExercise } = useCreateExercise();
createExercise({
  name: 'Bench Press',
  description: 'Chest exercise',
  type: 'strength',
  muscleGroups: ['chest', 'triceps'],
  equipment: ['barbell', 'bench'],
  instructions: ['Lie on bench', 'Lower bar to chest', 'Press up'],
});
```

### Start Free Trial
```typescript
const { mutate: startTrial } = useStartFreeTrial();
startTrial({
  cardFingerprint: 'card_fingerprint_from_stripe',
  last4: '4242',
  brand: 'visa',
  stripePaymentMethodId: 'pm_xxx',
});
```

### Log Exercise
```typescript
const { mutate: createLog } = useCreateExerciseLog();
createLog({
  exerciseId: 'exercise_123',
  workoutId: 'workout_456',
  programId: 'program_789',
  date: new Date(),
  sets: [
    { setNumber: 1, weight: 135, reps: 10, completed: true },
    { setNumber: 2, weight: 135, reps: 8, completed: true },
    { setNumber: 3, weight: 135, reps: 6, completed: true },
  ],
});
```
