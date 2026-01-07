import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Specialite from './specialite';
import SpecialiteDetail from './specialite-detail';
import SpecialiteUpdate from './specialite-update';
import SpecialiteDeleteDialog from './specialite-delete-dialog';

const SpecialiteRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Specialite />} />
    <Route path="new" element={<SpecialiteUpdate />} />
    <Route path=":id">
      <Route index element={<SpecialiteDetail />} />
      <Route path="edit" element={<SpecialiteUpdate />} />
      <Route path="delete" element={<SpecialiteDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default SpecialiteRoutes;
