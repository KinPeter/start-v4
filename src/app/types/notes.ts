import { BaseEntity } from './misc';

export interface Link {
  name: string;
  url: string;
}

export interface Note extends BaseEntity {
  createdAt: string;
  text: string | null;
  links: Link[];
  archived: boolean;
  pinned: boolean;
}

export type NoteRequest = Omit<Note, 'createdAt' | 'id'>;
