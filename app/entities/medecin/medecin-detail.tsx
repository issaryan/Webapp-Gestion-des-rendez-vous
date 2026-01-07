import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './medecin.reducer';

export const MedecinDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const medecinEntity = useAppSelector(state => state.medecin.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="medecinDetailsHeading">
          <Translate contentKey="medicaApp.medecin.detail.title">Medecin</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{medecinEntity.id}</dd>
          <dt>
            <span id="matricule">
              <Translate contentKey="medicaApp.medecin.matricule">Matricule</Translate>
            </span>
          </dt>
          <dd>{medecinEntity.matricule}</dd>
          <dt>
            <span id="nom">
              <Translate contentKey="medicaApp.medecin.nom">Nom</Translate>
            </span>
          </dt>
          <dd>{medecinEntity.nom}</dd>
          <dt>
            <span id="prenom">
              <Translate contentKey="medicaApp.medecin.prenom">Prenom</Translate>
            </span>
          </dt>
          <dd>{medecinEntity.prenom}</dd>
          <dt>
            <span id="telephone">
              <Translate contentKey="medicaApp.medecin.telephone">Telephone</Translate>
            </span>
          </dt>
          <dd>{medecinEntity.telephone}</dd>
          <dt>
            <span id="email">
              <Translate contentKey="medicaApp.medecin.email">Email</Translate>
            </span>
          </dt>
          <dd>{medecinEntity.email}</dd>
          <dt>
            <Translate contentKey="medicaApp.medecin.internalUser">Internal User</Translate>
          </dt>
          <dd>{medecinEntity.internalUser ? medecinEntity.internalUser.login : ''}</dd>
          <dt>
            <Translate contentKey="medicaApp.medecin.specialite">Specialite</Translate>
          </dt>
          <dd>{medecinEntity.specialite ? medecinEntity.specialite.nom : ''}</dd>
        </dl>
        <Button tag={Link} to="/medecin" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/medecin/${medecinEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default MedecinDetail;
