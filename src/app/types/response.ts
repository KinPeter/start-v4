import { UUID } from './misc';

export interface ListResponse<T> {
  entities: T[];
}

export interface IdObject {
  id: UUID;
}

export interface MessageObject {
  message: string;
}
