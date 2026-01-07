import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';

export interface IPatient {
  id?: number;
  identifiant?: string;
  nom?: string;
  prenom?: string;
  dateNaissance?: dayjs.Dayjs;
  email?: string;
  telephone?: string;
  adresse?: string | null;
  internalUser?: IUser | null;
}

export const defaultValue: Readonly<IPatient> = {};
