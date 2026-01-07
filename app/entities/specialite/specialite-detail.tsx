import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './specialite.reducer';

export const SpecialiteDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const specialiteEntity = useAppSelector(state => state.specialite.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="specialiteDetailsHeading">
          <Translate contentKey="medicaApp.specialite.detail.title">Specialite</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{specialiteEntity.id}</dd>
          <dt>
            <span id="nom">
              <Translate contentKey="medicaApp.specialite.nom">Nom</Translate>
            </span>
          </dt>
          <dd>{specialiteEntity.nom}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="medicaApp.specialite.description">Description</Translate>
            </span>
          </dt>
          <dd>{specialiteEntity.description}</dd>
        </dl>
        <Button tag={Link} to="/specialite" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/specialite/${specialiteEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default SpecialiteDetail;
