import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './patient.reducer';

export const PatientDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const patientEntity = useAppSelector(state => state.patient.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="patientDetailsHeading">
          <Translate contentKey="medicaApp.patient.detail.title">Patient</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{patientEntity.id}</dd>
          <dt>
            <span id="identifiant">
              <Translate contentKey="medicaApp.patient.identifiant">Identifiant</Translate>
            </span>
          </dt>
          <dd>{patientEntity.identifiant}</dd>
          <dt>
            <span id="nom">
              <Translate contentKey="medicaApp.patient.nom">Nom</Translate>
            </span>
          </dt>
          <dd>{patientEntity.nom}</dd>
          <dt>
            <span id="prenom">
              <Translate contentKey="medicaApp.patient.prenom">Prenom</Translate>
            </span>
          </dt>
          <dd>{patientEntity.prenom}</dd>
          <dt>
            <span id="dateNaissance">
              <Translate contentKey="medicaApp.patient.dateNaissance">Date Naissance</Translate>
            </span>
          </dt>
          <dd>
            {patientEntity.dateNaissance ? (
              <TextFormat value={patientEntity.dateNaissance} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="email">
              <Translate contentKey="medicaApp.patient.email">Email</Translate>
            </span>
          </dt>
          <dd>{patientEntity.email}</dd>
          <dt>
            <span id="telephone">
              <Translate contentKey="medicaApp.patient.telephone">Telephone</Translate>
            </span>
          </dt>
          <dd>{patientEntity.telephone}</dd>
          <dt>
            <span id="adresse">
              <Translate contentKey="medicaApp.patient.adresse">Adresse</Translate>
            </span>
          </dt>
          <dd>{patientEntity.adresse}</dd>
          <dt>
            <Translate contentKey="medicaApp.patient.internalUser">Internal User</Translate>
          </dt>
          <dd>{patientEntity.internalUser ? patientEntity.internalUser.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/patient" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/patient/${patientEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default PatientDetail;
