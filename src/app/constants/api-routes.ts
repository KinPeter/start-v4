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
  PROXY_KOREAN = '/proxy/korean',
  CYCLING = '/cycling',
  CYCLING_WEEKLY_GOAL = '/cycling/weekly-goal',
  CYCLING_MONTHLY_GOAL = '/cycling/monthly-goal',
  CYCLING_CHORE = '/cycling/chore',
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
  ApiRoutes.PROXY_KOREAN,
  ApiRoutes.CYCLING,
  ApiRoutes.CYCLING_CHORE,
  ApiRoutes.CYCLING_MONTHLY_GOAL,
  ApiRoutes.CYCLING_WEEKLY_GOAL,
];
