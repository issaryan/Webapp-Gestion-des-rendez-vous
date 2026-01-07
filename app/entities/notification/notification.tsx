import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Row, Col, Badge, ListGroup, ListGroupItem } from 'reactstrap';
import { JhiItemCount, JhiPagination, TextFormat, Translate, getPaginationState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APP_DATE_FORMAT, AUTHORITIES } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities, partialUpdateEntity } from './notification.reducer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';

export const Notification = () => {
  const dispatch = useAppDispatch();
  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const notificationList = useAppSelector(state => state.notification.entities);
  const loading = useAppSelector(state => state.notification.loading);
  const totalItems = useAppSelector(state => state.notification.totalItems);

  // Récupération du contexte utilisateur
  const account = useAppSelector(state => state.authentication.account);
  const isPatient = account && account.authorities && hasAnyAuthority(account.authorities, [AUTHORITIES.PATIENT]);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      }),
    );
  };

  useEffect(() => {
    getAllEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  // Fonction pour marquer comme lu
  const markAsRead = notification => {
    if (!notification.lu) {
      dispatch(partialUpdateEntity({ id: notification.id, lu: true }));
    }
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    getAllEntities();
  };

  // Helper pour l'icône selon le type
  const getTypeIcon = type => {
    switch (type) {
      case 'SMS':
        return 'mobile-alt';
      case 'EMAIL':
        return 'envelope';
      default:
        return 'bell';
    }
  };

  return (
    <div className="mt-4">
      <Card className="shadow-sm border-0">
        <CardBody className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 id="notification-heading" data-cy="NotificationHeading" className="text-primary mb-0">
              <FontAwesomeIcon icon="inbox" className="me-3" />
              <Translate contentKey="medicaApp.notification.home.title">Notifications</Translate>
            </h2>
            <Button color="light" onClick={handleSyncList} disabled={loading} className="rounded-pill">
              <FontAwesomeIcon icon="sync" spin={loading} />{' '}
              <Translate contentKey="medicaApp.notification.home.refreshListLabel">Refresh</Translate>
            </Button>
          </div>

          {notificationList && notificationList.length > 0 ? (
            <ListGroup flush>
              {notificationList.map((notification, i) => (
                <ListGroupItem
                  key={`entity-${i}`}
                  className={`border-bottom py-3 px-0 ${!notification.lu ? 'bg-light fw-bold' : ''}`}
                  style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                  onClick={() => markAsRead(notification)}
                >
                  <Row className="align-items-center">
                    <Col xs="1" className="text-center">
                      <div
                        className={`rounded-circle d-inline-flex align-items-center justify-content-center ${!notification.lu ? 'bg-primary text-white' : 'bg-secondary text-white'}`}
                        style={{ width: '40px', height: '40px' }}
                      >
                        <FontAwesomeIcon icon={getTypeIcon(notification.type)} />
                      </div>
                    </Col>
                    <Col xs="9">
                      <div className="d-flex justify-content-between">
                        <h5 className="mb-1 text-dark">
                          <Translate contentKey={`medicaApp.TypeNotification.${notification.type}`} />
                        </h5>
                        <small className="text-muted">
                          {notification.dateEnvoi ? (
                            <TextFormat type="date" value={notification.dateEnvoi} format={APP_DATE_FORMAT} />
                          ) : null}
                        </small>
                      </div>
                      <p className="mb-1 text-secondary">{notification.message}</p>
                      {/* Affichage du patient ciblé uniquement si on est Admin */}
                      {!isPatient && notification.patient && (
                        <small className="text-info">
                          <FontAwesomeIcon icon="user" className="me-1" />
                          Pour : {notification.patient.nom}
                        </small>
                      )}
                    </Col>
                    <Col xs="2" className="text-end">
                      {!notification.lu && (
                        <Badge color="danger" pill className="me-2">
                          New
                        </Badge>
                      )}
                      {notification.lu && <FontAwesomeIcon icon="check-double" className="text-success" title="Lu" />}
                    </Col>
                  </Row>
                </ListGroupItem>
              ))}
            </ListGroup>
          ) : (
            !loading && (
              <div className="text-center py-5 text-muted">
                <FontAwesomeIcon icon="inbox" size="3x" className="mb-3" />
                <p>Aucune notification pour le moment.</p>
              </div>
            )
          )}

          {totalItems ? (
            <div className="mt-4 d-flex justify-content-center">
              <JhiPagination
                activePage={paginationState.activePage}
                onSelect={handlePagination}
                maxButtons={5}
                itemsPerPage={paginationState.itemsPerPage}
                totalItems={totalItems}
              />
            </div>
          ) : (
            ''
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Notification;
