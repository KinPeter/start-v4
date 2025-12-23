export enum ApiRoutes {
  AUTH_LOGIN = '/auth/login-code',
  AUTH_VERIFY_CODE = '/auth/verify-login-code',
  AUTH_TOKEN_REFRESH = '/auth/token-refresh',
  AUTH_PASSWORD_LOGIN = '/auth/password-login',
  SETTINGS = '/start-settings/',
  DATA_BACKUP_EMAIL = '/data-backup/email',
  DATA_BACKUP = '/data-backup/data',
  SHORTCUTS = '/shortcuts/',
  NOTES = '/notes/',
  PERSONAL_DATA = '/personal-data/',
  BIRTHDAYS = '/birthdays/',
  PROXY_TRANSLATE = '/proxy/translate',
  ACTIVITIES = '/activities/',
  ACTIVITIES_GOALS = '/activities/goals',
  ACTIVITIES_CHORE = '/activities/chores',
  FLIGHTS = '/flights/',
  STRAVA_ROUTES = '/strava/routes',
  DOCS = '/docs/',
}

export const publicApiRoutes = [
  ApiRoutes.AUTH_VERIFY_CODE,
  ApiRoutes.AUTH_LOGIN,
  ApiRoutes.AUTH_PASSWORD_LOGIN,
];

export const authenticatedApiRoutes = [
  ApiRoutes.AUTH_TOKEN_REFRESH,
  ApiRoutes.DATA_BACKUP_EMAIL,
  ApiRoutes.SETTINGS,
  ApiRoutes.SHORTCUTS,
  ApiRoutes.NOTES,
  ApiRoutes.PERSONAL_DATA,
  ApiRoutes.BIRTHDAYS,
  ApiRoutes.PROXY_TRANSLATE,
  ApiRoutes.ACTIVITIES,
  ApiRoutes.ACTIVITIES_GOALS,
  ApiRoutes.ACTIVITIES_CHORE,
  ApiRoutes.FLIGHTS,
  ApiRoutes.STRAVA_ROUTES,
  ApiRoutes.DOCS,
];
