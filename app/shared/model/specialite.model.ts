export interface ISpecialite {
  id?: number;
  nom?: string;
  description?: string | null;
}

export const defaultValue: Readonly<ISpecialite> = {};
