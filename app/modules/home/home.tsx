import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Alert, Button, Card, CardBody, CardTitle, CardText, Container } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppSelector } from 'app/config/store';
import { AUTHORITIES } from 'app/config/constants';
import { hasAnyAuthority } from 'app/shared/auth/private-route';

export const Home = () => {
  const account = useAppSelector(state => state.authentication.account);

  const isMedecin = account && account.authorities && hasAnyAuthority(account.authorities, [AUTHORITIES.MEDECIN]);
  const isPatient = account && account.authorities && hasAnyAuthority(account.authorities, [AUTHORITIES.PATIENT]);
  const isAdmin = account && account.authorities && hasAnyAuthority(account.authorities, [AUTHORITIES.ADMIN, AUTHORITIES.HOSPITAL_ADMIN]);

  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col md="12" className="text-center mb-5">
          <h1 className="display-4 text-primary fw-bold">
            <FontAwesomeIcon icon="heart" className="me-3" />
            MEDICA
          </h1>
          <p className="lead text-muted">Plateforme Hospitalière Centralisée de Gestion des Rendez-vous</p>
          <hr className="w-25 mx-auto" />
        </Col>

        <Col md="10">
          {account?.login ? (
            <div>
              <Alert color="primary" className="shadow-sm border-0">
                <h4 className="alert-heading">
                  <FontAwesomeIcon icon="user" className="me-2" />
                  Bienvenue, {account.firstName ? account.firstName : account.login}
                </h4>
                <p className="mb-0">
                  Espace connecté :{' '}
                  <strong>
                    {isMedecin && 'PORTAIL MÉDECIN'}
                    {isPatient && 'PORTAIL PATIENT'}
                    {isAdmin && 'ADMINISTRATION'}
                  </strong>
                </p>
              </Alert>

              <Row className="mt-4 g-4">
                {/* --- VUE MÉDECIN : TABLEAU DE BORD --- */}
                {isMedecin && (
                  <Col md="6" className="mx-auto">
                    <Card className="text-center shadow h-100 border-0 bg-light">
                      <CardBody className="py-5">
                        <div className="mb-3 text-primary">
                          <FontAwesomeIcon icon="th-list" size="3x" />
                        </div>
                        <CardTitle tag="h3" className="mb-3">
                          Mon Planning
                        </CardTitle>
                        <CardText className="text-muted mb-4">
                          Accédez à votre agenda journalier, consultez les rendez-vous planifiés et gérez vos disponibilités.
                        </CardText>
                        <Button tag={Link} to="/rendez-vous" color="primary" size="lg" className="px-4 rounded-pill">
                          <FontAwesomeIcon icon="list" className="me-2" />
                          Consulter mon Agenda
                        </Button>
                      </CardBody>
                    </Card>
                  </Col>
                )}

                {/* --- VUE PATIENT : TABLEAU DE BORD --- */}
                {isPatient && (
                  <Col md="6" className="mx-auto">
                    <Card className="text-center shadow h-100 border-0 bg-light">
                      <CardBody className="py-5">
                        <div className="mb-3 text-success">
                          <FontAwesomeIcon icon="list" size="3x" />
                        </div>
                        <CardTitle tag="h3" className="mb-3">
                          Mes Rendez-vous
                        </CardTitle>
                        <CardText className="text-muted mb-4">
                          Consultez l&apos;historique de vos consultations passées et retrouvez les détails de vos prochains examens.
                        </CardText>
                        <Button tag={Link} to="/rendez-vous" color="success" size="lg" className="px-4 rounded-pill">
                          <FontAwesomeIcon icon="eye" className="me-2" />
                          Voir mes Rendez-vous
                        </Button>
                      </CardBody>
                    </Card>
                  </Col>
                )}

                {/* --- VUE ADMINISTRATEUR : TABLEAU DE BORD --- */}
                {isAdmin && (
                  <>
                    <Col md="4">
                      <Card className="text-center shadow-sm h-100 border-0">
                        <CardBody>
                          <div className="mb-3 text-info">
                            <FontAwesomeIcon icon="users" size="2x" />
                          </div>
                          <CardTitle tag="h5">Gestion Médecins</CardTitle>
                          <CardText className="small text-muted">Création et affectation des praticiens.</CardText>
                          <Button tag={Link} to="/medecin" outline color="info" size="sm" className="w-100">
                            Gérer
                          </Button>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md="4">
                      <Card className="text-center shadow-sm h-100 border-0">
                        <CardBody>
                          <div className="mb-3 text-info">
                            <FontAwesomeIcon icon="user" size="2x" />
                          </div>
                          <CardTitle tag="h5">Gestion Patients</CardTitle>
                          <CardText className="small text-muted">Suivi administratif des dossiers patients.</CardText>
                          <Button tag={Link} to="/patient" outline color="info" size="sm" className="w-100">
                            Gérer
                          </Button>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md="4">
                      <Card className="text-center shadow-sm h-100 border-0">
                        <CardBody>
                          <div className="mb-3 text-info">
                            <FontAwesomeIcon icon="heart" size="2x" />
                          </div>
                          <CardTitle tag="h5">Spécialités</CardTitle>
                          <CardText className="small text-muted">Configuration des services médicaux.</CardText>
                          <Button tag={Link} to="/specialite" outline color="info" size="sm" className="w-100">
                            Gérer
                          </Button>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md="12" className="mt-4">
                      <Card className="text-center border-primary bg-white shadow-sm">
                        <CardBody className="d-flex align-items-center justify-content-between">
                          <div className="text-start">
                            <h4 className="mb-1 text-primary">
                              <FontAwesomeIcon icon="tachometer-alt" className="me-2" />
                              Supervision Globale
                            </h4>
                            <p className="mb-0 text-muted">Vue d&apos;ensemble de tous les plannings de l&apos;établissement.</p>
                          </div>
                          <Button tag={Link} to="/rendez-vous" color="primary" size="lg">
                            Accéder au Planning Général
                          </Button>
                        </CardBody>
                      </Card>
                    </Col>
                  </>
                )}
              </Row>
            </div>
          ) : (
            // --- VUE NON CONNECTÉ (PUBLIQUE) ---
            <div className="text-center">
              <Card className="border-0 shadow-sm p-5 bg-white mb-5">
                <CardBody>
                  <h2 className="mb-4 fw-light">Accès Sécurisé au Système Hospitalier</h2>
                  <div className="d-flex justify-content-center gap-3">
                    <Button tag={Link} to="/login" color="primary" size="lg" className="px-5 rounded-pill">
                      <FontAwesomeIcon icon="sign-in-alt" className="me-2" />
                      Se connecter
                    </Button>
                  </div>
                </CardBody>
              </Card>

              <Row className="mt-5 text-muted">
                <Col md="4">
                  <div className="p-3">
                    <FontAwesomeIcon icon="user" size="2x" className="mb-3 text-secondary" />
                    <h5>Espace Patient</h5>
                    <p className="small">Suivi des rendez-vous et historique personnel.</p>
                  </div>
                </Col>
                <Col md="4">
                  <div className="p-3">
                    <FontAwesomeIcon icon="users" size="2x" className="mb-3 text-secondary" />
                    <h5>Espace Médecin</h5>
                    <p className="small">Gestion de planning et activité journalière.</p>
                  </div>
                </Col>
                <Col md="4">
                  <div className="p-3">
                    <FontAwesomeIcon icon="cogs" size="2x" className="mb-3 text-secondary" />
                    <h5>Administration</h5>
                    <p className="small">Pilotage opérationnel et configuration.</p>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
