export enum ApiRoutes {
  AUTH_LOGIN = '/auth/login',
  AUTH_VERIFY_CODE = '/auth/verify-code',
  AUTH_TOKEN_REFRESH = '/auth/token-refresh',
  AUTH_PASSWORD_LOGIN = '/auth/password-login',
  SETTINGS = '/start-settings',
  DATA_BACKUP_EMAIL = '/data-backup/email',
  DATA_BACKUP = '/data-backup/data',
  SHORTCUTS = '/shortcuts',
  NOTES = '/notes',
  PERSONAL_DATA = '/personal-data',
  PROXY_BIRTHDAYS = '/proxy/birthdays',
  PROXY_TRANSLATE = '/proxy/translate',
  ACTIVITIES = '/activities',
  ACTIVITIES_GOALS = '/activities/goals',
  ACTIVITIES_CHORE = '/activities/chore',
  FLIGHTS = '/flights',
}

export const publicApiRoutes = [
  ApiRoutes.AUTH_VERIFY_CODE,
  ApiRoutes.AUTH_LOGIN,
  ApiRoutes.AUTH_PASSWORD_LOGIN,
];

export const authenticatedApiRoutes = [
  ApiRoutes.AUTH_TOKEN_REFRESH,
  ApiRoutes.DATA_BACKUP,
  ApiRoutes.SETTINGS,
  ApiRoutes.SHORTCUTS,
  ApiRoutes.NOTES,
  ApiRoutes.PERSONAL_DATA,
  ApiRoutes.PROXY_BIRTHDAYS,
  ApiRoutes.PROXY_TRANSLATE,
  ApiRoutes.ACTIVITIES,
  ApiRoutes.ACTIVITIES_GOALS,
  ApiRoutes.ACTIVITIES_CHORE,
];
