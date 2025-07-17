import { BaseEntity } from './misc';

export interface PersonalData extends BaseEntity {
  name: string;
  identifier: string;
  expiry: string | null;
}

export type PersonalDataRequest = Omit<PersonalData, 'id'>;
