import type { BaseEntity, UUID } from './misc';

export interface CyclingChore {
  id: UUID;
  name: string;
  kmInterval: number;
  lastKm: number;
}

export interface ActivityStats {
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
  lastMonth: number;
}

export interface Activities extends BaseEntity {
  cyclingWeeklyGoal: number | null;
  cyclingMonthlyGoal: number | null;
  walkWeeklyGoal: number | null;
  walkMonthlyGoal: number | null;
  stepsWeeklyGoal: number | null;
  stepsMonthlyGoal: number | null;
  chores: CyclingChore[] | null;
  currentBikeKms: number;
  walk: ActivityStats;
  cycling: ActivityStats;
  steps: ActivityStats;
}

export type SetGoalsRequest = Pick<
  Activities,
  'cyclingWeeklyGoal' | 'cyclingMonthlyGoal' | 'walkWeeklyGoal' | 'walkMonthlyGoal'
>;
export type CyclingChoreRequest = Omit<CyclingChore, 'id'>;

export interface StepsSyncResponse {
  daysSynced: number;
  totalDays: number;
}

export interface StepsItem {
  date: string; // YYYY-MM-DD
  steps: number;
}

export interface StepsResponse {
  entities: StepsItem[];
}
