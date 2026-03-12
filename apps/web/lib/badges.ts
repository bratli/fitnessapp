export type BadgeCategory = "consistency";

export interface BadgeDefinition {
  id: string;
  category: BadgeCategory;
  threshold: number;
  /** The stat key used for evaluation */
  statKey: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { id: "first_workout", category: "consistency", threshold: 1, statKey: "total_workouts" },
  { id: "total_workouts_5", category: "consistency", threshold: 5, statKey: "total_workouts" },
  { id: "total_workouts_25", category: "consistency", threshold: 25, statKey: "total_workouts" },
  { id: "total_workouts_100", category: "consistency", threshold: 100, statKey: "total_workouts" },
  { id: "streak_3", category: "consistency", threshold: 3, statKey: "streak" },
  { id: "streak_7", category: "consistency", threshold: 7, statKey: "streak" },
  { id: "streak_30", category: "consistency", threshold: 30, statKey: "streak" },
];
