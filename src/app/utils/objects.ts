export function omit<T extends Record<string, unknown>>(obj: T, fields: string[]): T {
  const newObj: T = { ...obj };
  fields.forEach(field => delete newObj[field]);
  return newObj;
}
