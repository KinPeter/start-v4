import { BaseEntity } from './misc';

export const ShortcutCategory = {
  TOP: 'TOP',
  CODING: 'CODING',
  GOOGLE: 'GOOGLE',
  HOBBIES: 'HOBBIES',
  FUN: 'FUN',
  OTHERS: 'OTHERS',
} as const;

export type ShortcutCategory = (typeof ShortcutCategory)[keyof typeof ShortcutCategory];

export interface Shortcut extends BaseEntity {
  name: string;
  url: string;
  iconUrl: string;
  category: ShortcutCategory;
  priority: number;
}

export type ShortcutRequest = Omit<Shortcut, 'id'>;

export type ShortcutsByCategory = Record<ShortcutCategory, Shortcut[]>;
