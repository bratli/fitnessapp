import * as z from "zod";

// --- User schema ---

export const userSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;

// --- CreateUser input schema ---

export const createUserInputSchema = z.object({
  email: z.email(),
  name: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

// --- Health endpoint response schema ---

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  timestamp: z.string(),
});

// --- Exercise schemas ---

export const BODY_PARTS = [
  "Kne",
  "Skulder",
  "Ankel",
  "Hofte",
  "Rygg",
  "Lår",
] as const;

export const bodyPartSchema = z.enum(BODY_PARTS);
export type BodyPart = z.infer<typeof bodyPartSchema>;

// --- Workout schemas ---

export const createSetInputSchema = z.object({
  setNumber: z.number().int().min(1),
  reps: z.number().int().min(0).optional(),
  weight: z.number().min(0).optional(),
  duration: z.number().int().min(0).optional(),
});

export type CreateSetInput = z.infer<typeof createSetInputSchema>;

export const addExerciseInputSchema = z.object({
  exerciseId: z.string(),
  sets: z.array(createSetInputSchema).min(1),
});

export type AddExerciseInput = z.infer<typeof addExerciseInputSchema>;

export const createWorkoutInputSchema = z.object({
  name: z.string().min(1).max(200),
  exercises: z.array(addExerciseInputSchema).min(1),
});

export type CreateWorkoutInput = z.infer<typeof createWorkoutInputSchema>;

export const updateWorkoutInputSchema = z.object({
  name: z.string().min(1).max(200),
  exercises: z.array(addExerciseInputSchema).min(1),
});

export type UpdateWorkoutInput = z.infer<typeof updateWorkoutInputSchema>;

export const updateSetInputSchema = z.object({
  reps: z.number().int().min(0).optional(),
  weight: z.number().min(0).optional(),
  duration: z.number().int().min(0).optional(),
  completed: z.boolean().optional(),
});

export type UpdateSetInput = z.infer<typeof updateSetInputSchema>;

export type HealthResponse = z.infer<typeof healthResponseSchema>;

// --- Auth schemas ---

export const registerInputSchema = z.object({
  username: z
    .string()
    .min(3, "Brukernavn må ha minst 3 tegn")
    .max(30, "Brukernavn kan ha maks 30 tegn")
    .regex(/^[a-zA-Z0-9_-]+$/, "Brukernavn kan kun inneholde bokstaver, tall, _ og -"),
  email: z.email("Ugyldig e-postadresse"),
  password: z.string().min(8, "Passord må ha minst 8 tegn"),
  name: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

export const loginInputSchema = z.object({
  username: z.string().min(1, "Brukernavn er påkrevd"),
  password: z.string().min(1, "Passord er påkrevd"),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

// --- Example safeParse usage ---

export function validateCreateUserInput(data: unknown) {
  return createUserInputSchema.safeParse(data);
}
