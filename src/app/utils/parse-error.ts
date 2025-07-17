// eslint-disable-next-line
export function parseError(e: any): string {
  let message = '';

  if (e.message) {
    message += ' ' + e.message;
  }
  if (e?.error?.detail && typeof e.error.detail === 'string') {
    message += ' ' + e.error.detail;
  }
  if (e?.error.detail && (typeof e.error.detail === 'object' || Array.isArray(e.error.detail))) {
    message += ' ' + JSON.stringify(e.error.detail);
  }
  return message || 'Unknown error';
}
