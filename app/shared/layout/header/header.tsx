import './header.scss';

import React, { useState } from 'react';
import { Translate, Storage } from 'react-jhipster';
import { Navbar, Nav, NavbarToggler, Collapse } from 'reactstrap';
import LoadingBar from 'react-redux-loading-bar';

import { Home, Brand } from './header-components';
import { AdminMenu, EntitiesMenu, AccountMenu, LocaleMenu } from '../menus';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { setLocale } from 'app/shared/reducers/locale';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isOpenAPIEnabled: boolean;
  currentLocale: string;
}

const Header = (props: IHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const dispatch = useAppDispatch();

  // LOGIQUE UI : Récupération des droits pour l'affichage conditionnel
  const account = useAppSelector(state => state.authentication.account);

  // Le menu "Entités" (Gestion CRUD) n'est visible que pour les Admins (Tech & Hôpital)
  // On utilise une vérification sécurisée pour éviter les erreurs si account est vide au chargement
  const isAuthorizedForEntities =
    account && account.authorities && hasAnyAuthority(account.authorities, [AUTHORITIES.ADMIN, AUTHORITIES.HOSPITAL_ADMIN]);

  const handleLocaleChange = event => {
    const langKey = event.target.value;
    Storage.session.set('locale', langKey);
    dispatch(setLocale(langKey));
  };

  const renderDevRibbon = () => {
    return props.isInProduction === false ? (
      <div className="ribbon dev">
        <a href="">
          <Translate contentKey={`global.ribbon.${props.ribbonEnv}`} />
        </a>
      </div>
    ) : null;
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  /* jhipster-needle-add-element-to-menu - JHipster will add new menu items here */

  return (
    <div id="app-header">
      {renderDevRibbon()}
      <LoadingBar className="loading-bar" />
      <Navbar data-cy="navbar" dark expand="md" fixed="top" className="bg-primary">
        <NavbarToggler aria-label="Menu" onClick={toggleMenu} />
        <Brand />
        <Collapse isOpen={menuOpen} navbar>
          <Nav id="header-tabs" className="ms-auto" navbar>
            <Home />
            {/* Seuls les admins voient le menu Entités */}
            {props.isAuthenticated && isAuthorizedForEntities && <EntitiesMenu />}

            {/* Seul l'admin technique voit le menu Administration */}
            {/* CORRECTION ICI : Ajout de showDatabase={!props.isInProduction} */}
            {props.isAuthenticated && props.isAdmin && (
              <AdminMenu showOpenAPI={props.isOpenAPIEnabled} showDatabase={!props.isInProduction} />
            )}

            <LocaleMenu currentLocale={props.currentLocale} onClick={handleLocaleChange} />
            <AccountMenu isAuthenticated={props.isAuthenticated} />
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
