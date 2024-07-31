export function capitalize(str: string): string {
  const lower = str.toLocaleLowerCase();
  return str.charAt(0).toLocaleUpperCase() + lower.slice(1);
}
