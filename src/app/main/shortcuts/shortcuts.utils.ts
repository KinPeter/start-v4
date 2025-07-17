import { UUID } from '../../types/misc';
import { Shortcut, ShortcutCategory } from '../../types/shortcuts';
import { ShortcutsByCategory } from '../../types';

export function distributeShortcuts(shortcuts: Shortcut[]): {
  byCategory: ShortcutsByCategory;
  byId: Record<UUID, Shortcut>;
} {
  const byId: Record<UUID, Shortcut> = {};
  const byCategory: ShortcutsByCategory = {
    [ShortcutCategory.TOP]: [],
    [ShortcutCategory.CODING]: [],
    [ShortcutCategory.GOOGLE]: [],
    [ShortcutCategory.HOBBIES]: [],
    [ShortcutCategory.FUN]: [],
    [ShortcutCategory.OTHERS]: [],
  };
  shortcuts.forEach(s => {
    byId[s.id] = s;
    byCategory[s.category].push(s);
  });
  Object.values(byCategory).forEach((list: Shortcut[]) => {
    list.sort((a, b) => a.priority - b.priority);
  });
  return { byId, byCategory };
}
