import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, Card, CardBody, CardHeader } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getMedecins } from 'app/entities/medecin/medecin.reducer';
import { getEntities as getPatients } from 'app/entities/patient/patient.reducer';
import { StatutRendezVous } from 'app/shared/model/enumerations/statut-rendez-vous.model';
import { createEntity, getEntity, reset, updateEntity } from './rendez-vous.reducer';
import { AUTHORITIES } from 'app/config/constants';
import { hasAnyAuthority } from 'app/shared/auth/private-route';

export const RendezVousUpdate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  // Récupération du compte connecté pour l'auto-remplissage
  const account = useAppSelector(state => state.authentication.account);
  const isPatient = account && account.authorities && hasAnyAuthority(account.authorities, [AUTHORITIES.PATIENT]);
  const isMedecin = account && account.authorities && hasAnyAuthority(account.authorities, [AUTHORITIES.MEDECIN]);

  const medecins = useAppSelector(state => state.medecin.entities);
  const patients = useAppSelector(state => state.patient.entities);
  const rendezVousEntity = useAppSelector(state => state.rendezVous.entity);
  const loading = useAppSelector(state => state.rendezVous.loading);
  const updating = useAppSelector(state => state.rendezVous.updating);
  const updateSuccess = useAppSelector(state => state.rendezVous.updateSuccess);
  const statutRendezVousValues = Object.keys(StatutRendezVous);

  const handleClose = () => {
    navigate('/rendez-vous' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getMedecins({}));
    dispatch(getPatients({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  // LOGIQUE INTELLIGENTE : Trouver l'entité liée à l'utilisateur connecté
  // Note : Cela suppose que les listes 'medecins' et 'patients' contiennent l'objet internalUser avec le login.
  // Le backend doit envoyer cette info (ce qui est le cas avec nos DTOs).
  const connectedPatient = isPatient ? patients.find(p => p.internalUser?.login === account.login) : null;
  const connectedMedecin = isMedecin ? medecins.find(m => m.internalUser?.login === account.login) : null;

  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }
    values.dateHeure = convertDateTimeToServer(values.dateHeure);

    // Si l'utilisateur est restreint (Patient/Médecin), on force la valeur de son entité
    // au cas où il aurait essayé de modifier le HTML (sécurité frontend)
    const selectedMedecinId = isMedecin ? connectedMedecin?.id : values.medecin;
    const selectedPatientId = isPatient ? connectedPatient?.id : values.patient;

    const entity = {
      ...rendezVousEntity,
      ...values,
      medecin: medecins.find(it => it.id.toString() === selectedMedecinId?.toString()),
      patient: patients.find(it => it.id.toString() === selectedPatientId?.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          dateHeure: displayDefaultDateTime(),
          statut: 'PLANIFIE', // Statut par défaut à la création
          // Pré-remplissage si nouveau RDV
          patient: isPatient ? connectedPatient?.id : null,
          medecin: isMedecin ? connectedMedecin?.id : null,
        }
      : {
          statut: 'PLANIFIE',
          ...rendezVousEntity,
          dateHeure: convertDateTimeFromServer(rendezVousEntity.dateHeure),
          medecin: rendezVousEntity?.medecin?.id,
          patient: rendezVousEntity?.patient?.id,
        };

  return (
    <div className="mt-4">
      <Row className="justify-content-center">
        <Col md="8">
          <Card className="shadow-sm">
            <CardHeader className="bg-primary text-white">
              <h2 id="medicaApp.rendezVous.home.createOrEditLabel" data-cy="RendezVousCreateUpdateHeading" className="mb-0">
                <FontAwesomeIcon icon={isNew ? 'calendar-plus' : 'edit'} />{' '}
                <Translate contentKey="medicaApp.rendezVous.home.createOrEditLabel">Create or edit a RendezVous</Translate>
              </h2>
            </CardHeader>
            <CardBody>
              {loading ? (
                <div className="text-center">
                  <FontAwesomeIcon icon="sync" spin /> Loading...
                </div>
              ) : (
                <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
                  {!isNew ? (
                    <ValidatedField
                      name="id"
                      required
                      readOnly
                      id="rendez-vous-id"
                      label={translate('global.field.id')}
                      validate={{ required: true }}
                    />
                  ) : null}

                  <Row>
                    <Col md="6">
                      <ValidatedField
                        label={translate('medicaApp.rendezVous.dateHeure')}
                        id="rendez-vous-dateHeure"
                        name="dateHeure"
                        data-cy="dateHeure"
                        type="datetime-local"
                        placeholder="YYYY-MM-DD HH:mm"
                        validate={{
                          required: { value: true, message: translate('entity.validation.required') },
                        }}
                      />
                    </Col>
                    <Col md="6">
                      <ValidatedField
                        label={translate('medicaApp.rendezVous.statut')}
                        id="rendez-vous-statut"
                        name="statut"
                        data-cy="statut"
                        type="select"
                        // Un patient ne devrait pas pouvoir changer le statut d'un RDV à sa guise (sauf annulation, mais restons simple)
                        // On laisse actif pour l'instant, ou on pourrait le désactiver si isPatient
                      >
                        {statutRendezVousValues.map(statutRendezVous => (
                          <option value={statutRendezVous} key={statutRendezVous}>
                            {translate(`medicaApp.StatutRendezVous.${statutRendezVous}`)}
                          </option>
                        ))}
                      </ValidatedField>
                    </Col>
                  </Row>

                  <ValidatedField
                    label={translate('medicaApp.rendezVous.motif')}
                    id="rendez-vous-motif"
                    name="motif"
                    data-cy="motif"
                    type="text"
                    placeholder="Ex: Consultation de routine, Douleurs abdominales..."
                    validate={{
                      required: { value: true, message: translate('entity.validation.required') },
                    }}
                  />

                  <Row>
                    <Col md="6">
                      <ValidatedField
                        id="rendez-vous-medecin"
                        name="medecin"
                        data-cy="medecin"
                        label={translate('medicaApp.rendezVous.medecin')}
                        type="select"
                        disabled={isMedecin} // Désactivé si je suis médecin (auto-sélectionné)
                      >
                        <option value="" key="0">
                          -- Choisir un médecin --
                        </option>
                        {medecins
                          ? medecins.map(otherEntity => (
                              <option value={otherEntity.id} key={otherEntity.id}>
                                {otherEntity.nom} {otherEntity.prenom} - {otherEntity.specialite?.nom}
                              </option>
                            ))
                          : null}
                      </ValidatedField>
                    </Col>
                    <Col md="6">
                      <ValidatedField
                        id="rendez-vous-patient"
                        name="patient"
                        data-cy="patient"
                        label={translate('medicaApp.rendezVous.patient')}
                        type="select"
                        disabled={isPatient} // Désactivé si je suis patient (auto-sélectionné)
                      >
                        <option value="" key="0">
                          -- Choisir un patient --
                        </option>
                        {patients
                          ? patients.map(otherEntity => (
                              <option value={otherEntity.id} key={otherEntity.id}>
                                {otherEntity.nom} {otherEntity.prenom} ({otherEntity.identifiant})
                              </option>
                            ))
                          : null}
                      </ValidatedField>
                    </Col>
                  </Row>

                  <ValidatedField
                    label={translate('medicaApp.rendezVous.notes')}
                    id="rendez-vous-notes"
                    name="notes"
                    data-cy="notes"
                    type="textarea"
                    rows="4"
                    placeholder="Notes internes ou observations médicales (facultatif)"
                  />

                  <div className="mt-4 d-flex justify-content-end">
                    <Button
                      tag={Link}
                      id="cancel-save"
                      data-cy="entityCreateCancelButton"
                      to="/rendez-vous"
                      replace
                      color="secondary"
                      className="me-2"
                    >
                      <FontAwesomeIcon icon="arrow-left" />
                      &nbsp;
                      <span className="d-none d-md-inline">
                        <Translate contentKey="entity.action.back">Back</Translate>
                      </span>
                    </Button>
                    &nbsp;
                    <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                      <FontAwesomeIcon icon="save" />
                      &nbsp;
                      <Translate contentKey="entity.action.save">Save</Translate>
                    </Button>
                  </div>
                </ValidatedForm>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RendezVousUpdate;
