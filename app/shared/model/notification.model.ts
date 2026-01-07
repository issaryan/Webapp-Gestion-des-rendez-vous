import dayjs from 'dayjs';
import { IPatient } from 'app/shared/model/patient.model';
import { TypeNotification } from 'app/shared/model/enumerations/type-notification.model';

export interface INotification {
  id?: number;
  type?: keyof typeof TypeNotification;
  message?: string;
  dateEnvoi?: dayjs.Dayjs;
  lu?: boolean;
  patient?: IPatient | null;
}

export const defaultValue: Readonly<INotification> = {
  lu: false,
};
