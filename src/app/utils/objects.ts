export function omit<T extends object>(obj: T, fields: string[]): T {
  const newObj: T = { ...obj };
  // eslint-disable-next-line
  fields.forEach(field => delete (newObj as any)[field]);
  return newObj;
}
