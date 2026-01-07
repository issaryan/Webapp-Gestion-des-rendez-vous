import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './notification.reducer';

export const NotificationDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const notificationEntity = useAppSelector(state => state.notification.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="notificationDetailsHeading">
          <Translate contentKey="medicaApp.notification.detail.title">Notification</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{notificationEntity.id}</dd>
          <dt>
            <span id="type">
              <Translate contentKey="medicaApp.notification.type">Type</Translate>
            </span>
          </dt>
          <dd>{notificationEntity.type}</dd>
          <dt>
            <span id="message">
              <Translate contentKey="medicaApp.notification.message">Message</Translate>
            </span>
          </dt>
          <dd>{notificationEntity.message}</dd>
          <dt>
            <span id="dateEnvoi">
              <Translate contentKey="medicaApp.notification.dateEnvoi">Date Envoi</Translate>
            </span>
          </dt>
          <dd>
            {notificationEntity.dateEnvoi ? <TextFormat value={notificationEntity.dateEnvoi} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="lu">
              <Translate contentKey="medicaApp.notification.lu">Lu</Translate>
            </span>
          </dt>
          <dd>{notificationEntity.lu ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="medicaApp.notification.patient">Patient</Translate>
          </dt>
          <dd>{notificationEntity.patient ? notificationEntity.patient.nom : ''}</dd>
        </dl>
        <Button tag={Link} to="/notification" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/notification/${notificationEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default NotificationDetail;
