import dayjs from 'dayjs';
import { IMedecin } from 'app/shared/model/medecin.model';
import { IPatient } from 'app/shared/model/patient.model';
import { StatutRendezVous } from 'app/shared/model/enumerations/statut-rendez-vous.model';

export interface IRendezVous {
  id?: number;
  dateHeure?: dayjs.Dayjs;
  motif?: string | null;
  notes?: string | null;
  statut?: keyof typeof StatutRendezVous;
  medecin?: IMedecin | null;
  patient?: IPatient | null;
}

export const defaultValue: Readonly<IRendezVous> = {};
