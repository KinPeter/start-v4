export enum StoreKeys {
  AUTH = 'pk-start-auth',
  SETTINGS = 'pk-start-settings',
  APP_BAR = 'pk-start-app-bar',
  BIRTHDAYS = 'pk-start-birthdays',
  KOREAN = 'pk-start-korean',
  LOCATION = 'pk-start-location',
  ACTIVITIES = 'pk-start-activities',
  STRAVA = 'pk-start-strava',
}

export const focusableSelectors = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
];
