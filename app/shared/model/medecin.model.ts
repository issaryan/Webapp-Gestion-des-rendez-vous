import { IUser } from 'app/shared/model/user.model';
import { ISpecialite } from 'app/shared/model/specialite.model';

export interface IMedecin {
  id?: number;
  matricule?: string;
  nom?: string;
  prenom?: string;
  telephone?: string;
  email?: string;
  internalUser?: IUser | null;
  specialite?: ISpecialite | null;
}

export const defaultValue: Readonly<IMedecin> = {};
