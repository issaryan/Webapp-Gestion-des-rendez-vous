import patient from 'app/entities/patient/patient.reducer';
import medecin from 'app/entities/medecin/medecin.reducer';
import specialite from 'app/entities/specialite/specialite.reducer';
import rendezVous from 'app/entities/rendez-vous/rendez-vous.reducer';
import notification from 'app/entities/notification/notification.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  patient,
  medecin,
  specialite,
  rendezVous,
  notification,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
