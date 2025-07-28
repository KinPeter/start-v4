import type { BaseEntity, UUID } from './misc';

export interface CyclingChore {
  id: UUID;
  name: string;
  kmInterval: number;
  lastKm: number;
}

export interface Activities extends BaseEntity {
  cyclingWeeklyGoal: number | null;
  cyclingMonthlyGoal: number | null;
  walkWeeklyGoal: number | null;
  walkMonthlyGoal: number | null;
  chores: CyclingChore[] | null;
}

export type SetGoalsRequest = Pick<
  Activities,
  'cyclingWeeklyGoal' | 'cyclingMonthlyGoal' | 'walkWeeklyGoal' | 'walkMonthlyGoal'
>;
export type CyclingChoreRequest = Omit<CyclingChore, 'id'>;

// ======================================================================
// Strava related types

export interface StravaAuthResponse {
  access_token: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  athlete: {
    id: number;
    weight: number;
  };
}

export interface StravaBikeDataResponse {
  distance: number; // meters
  id: string;
  name: string;
  nickname: string;
  primary: boolean;
  retired: boolean;
}

export interface StravaAthleteResponse {
  id: number;
  bikes: StravaBikeDataResponse[];
}

export interface StravaRideStatsResponse {
  achievement_count?: number;
  count: number;
  distance: number; // meters
  elapsed_time: number; // seconds
  elevation_gain: number; // meters
  moving_time: number; // seconds
}

export interface StravaAthleteStatsResponse {
  biggest_ride_distance: number; // meters
  ytd_ride_totals: StravaRideStatsResponse;
  all_ride_totals: StravaRideStatsResponse;
  recent_ride_totals: StravaRideStatsResponse;
}

export type SportType =
  | 'Ride'
  | 'MountainBikeRide'
  | 'VirtualRide'
  | 'EBikeRide'
  | 'GravelRide'
  | 'Walk';

export interface StravaActivityResponse {
  distance: number; // meters
  sport_type: SportType;
  moving_time: number; // seconds
  start_date: string; // ISO string UTC
  total_elevation_gain: number; // meters
}

export interface StravaActivityStats {
  achievementCount?: number;
  activityCount: number;
  distance: number; // kilometers
  movingTime: number; // hours
  elevationGain: number; // meters
}

export interface StravaBikeData {
  distance: number; // kilometers
  id: string;
  name: string;
  nickname: string;
}

export interface StravaAthleteData {
  id: number;
  primaryBike: StravaBikeData;
  longestRideEver: number; // kilometers
  allRideTotals: StravaActivityStats;
  ytdRideTotals: StravaActivityStats;
  recentRideTotals: StravaActivityStats;
  rideThisWeek: StravaActivityStats;
  rideThisMonth: StravaActivityStats;
  walkThisWeek: StravaActivityStats;
  walkThisMonth: StravaActivityStats;
}

export interface StravaRoutesSyncResponse {
  routesSynced: number;
  totalRoutes: number;
}
