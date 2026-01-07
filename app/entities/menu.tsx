import React from 'react';
import { Translate } from 'react-jhipster';

import MenuItem from 'app/shared/layout/menus/menu-item';

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <MenuItem icon="asterisk" to="/patient">
        <Translate contentKey="global.menu.entities.patient" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/medecin">
        <Translate contentKey="global.menu.entities.medecin" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/specialite">
        <Translate contentKey="global.menu.entities.specialite" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/rendez-vous">
        <Translate contentKey="global.menu.entities.rendezVous" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/notification">
        <Translate contentKey="global.menu.entities.notification" />
      </MenuItem>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
