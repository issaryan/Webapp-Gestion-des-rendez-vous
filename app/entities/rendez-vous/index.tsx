import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import RendezVous from './rendez-vous';
import RendezVousDetail from './rendez-vous-detail';
import RendezVousUpdate from './rendez-vous-update';
import RendezVousDeleteDialog from './rendez-vous-delete-dialog';

const RendezVousRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<RendezVous />} />
    <Route path="new" element={<RendezVousUpdate />} />
    <Route path=":id">
      <Route index element={<RendezVousDetail />} />
      <Route path="edit" element={<RendezVousUpdate />} />
      <Route path="delete" element={<RendezVousDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default RendezVousRoutes;
