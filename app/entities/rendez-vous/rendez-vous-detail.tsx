import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col, Card, CardHeader, CardBody, Badge } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, AUTHORITIES } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from './rendez-vous.reducer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';

export const RendezVousDetail = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const rendezVousEntity = useAppSelector(state => state.rendezVous.entity);

  // Récupération des droits pour l'affichage conditionnel
  const account = useAppSelector(state => state.authentication.account);
  const isPatient = account && account.authorities && hasAnyAuthority(account.authorities, [AUTHORITIES.PATIENT]);
  const isMedecin = account && account.authorities && hasAnyAuthority(account.authorities, [AUTHORITIES.MEDECIN]);

  // Fonction pour la couleur du badge
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
    <div className="d-flex justify-content-center mt-4">
      <Col md="8">
        <Card className="shadow border-0">
          <CardHeader className="bg-white border-bottom-0 pt-4 pb-0 text-center">
            <h2 className="text-primary mb-3">
              <FontAwesomeIcon icon="calendar-check" className="me-2" />
              <Translate contentKey="medicaApp.rendezVous.detail.title">RendezVous</Translate>
            </h2>
            <p className="text-muted">Détails de la consultation</p>
          </CardHeader>
          <CardBody className="px-5 pb-5">
            <Row>
              {/* DATE ET HEURE - Mis en avant */}
              <Col md="12" className="text-center mb-4 p-3 bg-light rounded">
                <h4 className="mb-0">
                  {rendezVousEntity.dateHeure ? (
                    <TextFormat value={rendezVousEntity.dateHeure} type="date" format={APP_DATE_FORMAT} />
                  ) : null}
                </h4>
                <div className="mt-2">
                  <Badge color={getStatusColor(rendezVousEntity.statut)} pill className="px-3 py-2 fs-6">
                    <Translate contentKey={`medicaApp.StatutRendezVous.${rendezVousEntity.statut}`} />
                  </Badge>
                </div>
              </Col>

              {/* MOTIF & NOTES */}
              <Col md="12" className="mb-4">
                <h5 className="text-secondary">
                  <Translate contentKey="medicaApp.rendezVous.motif">Motif</Translate>
                </h5>
                <p className="fs-5 fw-bold">{rendezVousEntity.motif}</p>
                {rendezVousEntity.notes && (
                  <div className="alert alert-light border">
                    <strong>
                      <Translate contentKey="medicaApp.rendezVous.notes">Notes</Translate> :
                    </strong>{' '}
                    <br />
                    {rendezVousEntity.notes}
                  </div>
                )}
              </Col>

              <hr />

              {/* ACTEURS DU RENDEZ-VOUS */}
              <Row className="mt-3">
                {/* Masqué si je suis médecin */}
                {!isMedecin && (
                  <Col md="6">
                    <h6 className="text-muted">
                      <Translate contentKey="medicaApp.rendezVous.medecin">Medecin</Translate>
                    </h6>
                    {rendezVousEntity.medecin ? (
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon="user-md" className="text-info me-2 fs-4" />
                        <div>
                          <strong>
                            Dr. {rendezVousEntity.medecin.nom} {rendezVousEntity.medecin.prenom}
                          </strong>
                          <br />
                          <small className="text-muted">{rendezVousEntity.medecin.specialite?.nom}</small>
                        </div>
                      </div>
                    ) : (
                      '-'
                    )}
                  </Col>
                )}

                {/* Masqué si je suis patient */}
                {!isPatient && (
                  <Col md="6">
                    <h6 className="text-muted">
                      <Translate contentKey="medicaApp.rendezVous.patient">Patient</Translate>
                    </h6>
                    {rendezVousEntity.patient ? (
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon="user" className="text-success me-2 fs-4" />
                        <div>
                          <strong>
                            {rendezVousEntity.patient.nom} {rendezVousEntity.patient.prenom}
                          </strong>
                          <br />
                          <small className="text-muted">ID: {rendezVousEntity.patient.identifiant}</small>
                        </div>
                      </div>
                    ) : (
                      '-'
                    )}
                  </Col>
                )}
              </Row>
            </Row>

            <div className="mt-5 d-flex justify-content-center gap-2">
              <Button tag={Link} to="/rendez-vous" replace color="outline-secondary" className="rounded-pill px-4">
                <FontAwesomeIcon icon="arrow-left" />{' '}
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button tag={Link} to={`/rendez-vous/${rendezVousEntity.id}/edit`} replace color="primary" className="rounded-pill px-4">
                <FontAwesomeIcon icon="pencil-alt" />{' '}
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.edit">Edit</Translate>
                </span>
              </Button>
            </div>
          </CardBody>
        </Card>
      </Col>
    </div>
  );
};

export default RendezVousDetail;
