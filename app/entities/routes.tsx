import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Patient from './patient';
import Medecin from './medecin';
import Specialite from './specialite';
import RendezVous from './rendez-vous';
import Notification from './notification';
/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="patient/*" element={<Patient />} />
        <Route path="medecin/*" element={<Medecin />} />
        <Route path="specialite/*" element={<Specialite />} />
        <Route path="rendez-vous/*" element={<RendezVous />} />
        <Route path="notification/*" element={<Notification />} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
