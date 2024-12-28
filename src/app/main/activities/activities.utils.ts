import {
  StravaActivityResponse,
  StravaBikeData,
  StravaBikeDataResponse,
  StravaRideStats,
  StravaRideStatsResponse,
} from './activities.types';

export function metersToKms(meters: number): number {
  return Math.round(meters / 100) / 10;
}

export function secondsToHours(seconds: number): number {
  return Math.round((seconds / 60 / 60) * 10) / 10;
}

export function convertRideStats(res: StravaRideStatsResponse): StravaRideStats {
  return {
    achievementCount: res.achievement_count,
    activityCount: res.count,
    distance: metersToKms(res.distance),
    elevationGain: Math.floor(res.elevation_gain),
    movingTime: secondsToHours(res.moving_time),
  };
}

export function convertBikeData(res: StravaBikeDataResponse): StravaBikeData {
  return {
    distance: metersToKms(res.distance),
    name: res.name,
    nickname: res.nickname,
    id: res.id,
  };
}

export function getPrimaryBikeData(bikes: StravaBikeDataResponse[]): StravaBikeData {
  // Strava removed the primary flag, temporary solution to match by name
  // TODO handle saving primary bike on the backend
  const primaryBike = bikes.find(({ name }) => name.includes('Giant FastRoad SL 3'));
  if (!primaryBike) {
    throw new Error('No primary bike found on Strava');
  }
  return convertBikeData(primaryBike);
}

export function getStats(activities: StravaActivityResponse[]): StravaRideStats {
  const rides = activities.filter(({ sport_type }) =>
    ['Ride', 'MountainBikeRide', 'VirtualRide', 'EBikeRide', 'GravelRide'].includes(sport_type)
  );
  const statsBase: StravaRideStats = {
    activityCount: rides.length,
    movingTime: 0,
    elevationGain: 0,
    distance: 0,
  };
  const stats = rides.reduce((acc, { total_elevation_gain, moving_time, distance }) => {
    return {
      ...acc,
      movingTime: acc.movingTime + moving_time,
      distance: acc.distance + distance,
      elevationGain: acc.elevationGain + Math.floor(total_elevation_gain),
    };
  }, statsBase);

  stats.distance = metersToKms(stats.distance);
  stats.movingTime = secondsToHours(stats.movingTime);

  return stats;
}
