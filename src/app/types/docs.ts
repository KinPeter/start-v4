import { BaseEntity } from './misc';

export interface Document extends BaseEntity {
  title: string;
  tags: string[];
  content: string;
}

export type DocumentRequest = Omit<Document, 'id'>;

export interface DocumentListItem extends BaseEntity {
  title: string;
  tags: string[];
}
