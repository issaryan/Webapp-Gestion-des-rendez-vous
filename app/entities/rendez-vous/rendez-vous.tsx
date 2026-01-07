import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table, Badge, Card, CardHeader, CardBody } from 'reactstrap';
import { Translate, TextFormat, getSortState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, AUTHORITIES } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities } from './rendez-vous.reducer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';

export const RendezVous = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // CORRECTION ICI : Construction explicite de l'état initial de pagination
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(
      {
        ...getSortState(location, 'id'), // Récupère seulement { sort, order }
        activePage: 1,
        itemsPerPage: ITEMS_PER_PAGE,
      },
      location.search,
    ),
  );

  const rendezVousList = useAppSelector(state => state.rendezVous.entities);
  const loading = useAppSelector(state => state.rendezVous.loading);
  const totalItems = useAppSelector(state => state.rendezVous.totalItems);

  // Récupération des droits pour l'affichage conditionnel des colonnes
  const account = useAppSelector(state => state.authentication.account);
  // Vérification sécurisée pour éviter les erreurs si 'authorities' est undefined
  const isPatient = account && account.authorities && hasAnyAuthority(account.authorities, [AUTHORITIES.PATIENT]);
  const isMedecin = account && account.authorities && hasAnyAuthority(account.authorities, [AUTHORITIES.MEDECIN]);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (location.search !== endURL) {
      navigate(`${location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get('page');
    const sort = params.get(SORT);
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [location.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };

  // Fonction utilitaire pour la couleur des badges de statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRME':
        return 'success';
      case 'PLANIFIE':
        return 'info';
      case 'EFFECTUE':
        return 'primary';
      case 'ANNULE':
        return 'danger';
      case 'MANQUE':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="mt-4">
      <Card className="shadow-sm border-0">
        <CardHeader className="bg-white border-0 d-flex justify-content-between align-items-center pt-4 pb-3">
          <h2 id="rendez-vous-heading" data-cy="RendezVousHeading" className="mb-0 text-primary">
            <FontAwesomeIcon icon="calendar-check" className="me-2" />
            <Translate contentKey="medicaApp.rendezVous.home.title">Rendez Vous</Translate>
          </h2>
          <div className="d-flex justify-content-end">
            <Button className="me-2" color="light" onClick={handleSyncList} disabled={loading}>
              <FontAwesomeIcon icon="sync" spin={loading} />{' '}
              <Translate contentKey="medicaApp.rendezVous.home.refreshListLabel">Refresh List</Translate>
            </Button>
            <Link to="/rendez-vous/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
              <FontAwesomeIcon icon="plus" />
              &nbsp;
              <Translate contentKey="medicaApp.rendezVous.home.createLabel">Create new Rendez Vous</Translate>
            </Link>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            {rendezVousList && rendezVousList.length > 0 ? (
              <Table responsive hover striped className="mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="hand" onClick={sort('id')}>
                      <Translate contentKey="medicaApp.rendezVous.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand" onClick={sort('dateHeure')}>
                      <Translate contentKey="medicaApp.rendezVous.dateHeure">Date Heure</Translate> <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand" onClick={sort('motif')}>
                      <Translate contentKey="medicaApp.rendezVous.motif">Motif</Translate> <FontAwesomeIcon icon="sort" />
                    </th>
                    <th className="hand" onClick={sort('statut')}>
                      <Translate contentKey="medicaApp.rendezVous.statut">Statut</Translate> <FontAwesomeIcon icon="sort" />
                    </th>
                    {/* Colonne Médecin cachée pour les médecins */}
                    {!isMedecin && (
                      <th>
                        <Translate contentKey="medicaApp.rendezVous.medecin">Medecin</Translate> <FontAwesomeIcon icon="sort" />
                      </th>
                    )}
                    {/* Colonne Patient cachée pour les patients */}
                    {!isPatient && (
                      <th>
                        <Translate contentKey="medicaApp.rendezVous.patient">Patient</Translate> <FontAwesomeIcon icon="sort" />
                      </th>
                    )}
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rendezVousList.map((rendezVous, i) => (
                    <tr key={`entity-${i}`} data-cy="entityTable">
                      <td>
                        <Button tag={Link} to={`/rendez-vous/${rendezVous.id}`} color="link" size="sm">
                          {rendezVous.id}
                        </Button>
                      </td>
                      <td>
                        {rendezVous.dateHeure ? <TextFormat type="date" value={rendezVous.dateHeure} format={APP_DATE_FORMAT} /> : null}
                      </td>
                      <td className="fw-bold text-dark">{rendezVous.motif}</td>
                      <td>
                        <Badge color={getStatusColor(rendezVous.statut)} pill className="px-3 py-2">
                          <Translate contentKey={`medicaApp.StatutRendezVous.${rendezVous.statut}`} />
                        </Badge>
                      </td>
                      {!isMedecin && (
                        <td>
                          {rendezVous.medecin ? (
                            <Link to={`/medecin/${rendezVous.medecin.id}`} className="text-decoration-none">
                              Dr. {rendezVous.medecin.nom}
                            </Link>
                          ) : (
                            ''
                          )}
                        </td>
                      )}
                      {!isPatient && (
                        <td>
                          {rendezVous.patient ? (
                            <Link to={`/patient/${rendezVous.patient.id}`} className="text-decoration-none">
                              {rendezVous.patient.nom} {rendezVous.patient.prenom}
                            </Link>
                          ) : (
                            ''
                          )}
                        </td>
                      )}
                      <td className="text-end">
                        <div className="btn-group flex-btn-group-container">
                          <Button tag={Link} to={`/rendez-vous/${rendezVous.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                            <FontAwesomeIcon icon="eye" />{' '}
                            <span className="d-none d-md-inline">
                              <Translate contentKey="entity.action.view">View</Translate>
                            </span>
                          </Button>
                          <Button
                            tag={Link}
                            to={`/rendez-vous/${rendezVous.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                            color="primary"
                            size="sm"
                            data-cy="entityEditButton"
                          >
                            <FontAwesomeIcon icon="pencil-alt" />{' '}
                            <span className="d-none d-md-inline">
                              <Translate contentKey="entity.action.edit">Edit</Translate>
                            </span>
                          </Button>
                          <Button
                            tag={Link}
                            to={`/rendez-vous/${rendezVous.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                            color="danger"
                            size="sm"
                            data-cy="entityDeleteButton"
                          >
                            <FontAwesomeIcon icon="trash" />{' '}
                            <span className="d-none d-md-inline">
                              <Translate contentKey="entity.action.delete">Delete</Translate>
                            </span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              !loading && (
                <div className="alert alert-warning m-3">
                  <Translate contentKey="medicaApp.rendezVous.home.notFound">No Rendez Vous found</Translate>
                </div>
              )
            )}
          </div>
        </CardBody>
        {totalItems ? (
          <div className="p-3 bg-light border-top">
            <div className="d-flex justify-content-center">
              <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
            </div>
            <div className="d-flex justify-content-center">
              <JhiPagination
                activePage={paginationState.activePage}
                onSelect={handlePagination}
                maxButtons={5}
                itemsPerPage={paginationState.itemsPerPage}
                totalItems={totalItems}
              />
            </div>
          </div>
        ) : (
          ''
        )}
      </Card>
    </div>
  );
};

export default RendezVous;
