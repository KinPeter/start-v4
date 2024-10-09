import { Shortcut } from '@kinpeter/pk-common';
import { ShortcutCategory } from '../../constants';

export type ShortcutsByCategory = Record<ShortcutCategory, Shortcut[]>;
