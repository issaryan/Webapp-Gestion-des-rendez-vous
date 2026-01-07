import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, Card, CardBody, CardHeader } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { createEntity, getEntity, reset, updateEntity } from './patient.reducer';

export const PatientUpdate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const patientEntity = useAppSelector(state => state.patient.entity);
  const loading = useAppSelector(state => state.patient.loading);
  const updating = useAppSelector(state => state.patient.updating);
  const updateSuccess = useAppSelector(state => state.patient.updateSuccess);

  const handleClose = () => {
    navigate('/patient' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }

    const entity = {
      ...patientEntity,
      ...values,
      // InternalUser est géré automatiquement par le backend lors de la création
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...patientEntity,
        };

  return (
    <div className="mt-4">
      <Row className="justify-content-center">
        <Col md="8">
          <Card className="shadow-sm">
            <CardHeader className="bg-primary text-white">
              <h2 id="medicaApp.patient.home.createOrEditLabel" data-cy="PatientCreateUpdateHeading" className="mb-0">
                <FontAwesomeIcon icon={isNew ? 'user-plus' : 'pencil-alt'} />{' '}
                <Translate contentKey="medicaApp.patient.home.createOrEditLabel">Create or edit a Patient</Translate>
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
                      id="patient-id"
                      label={translate('global.field.id')}
                      validate={{ required: true }}
                    />
                  ) : null}

                  <Row>
                    <Col md="6">
                      <ValidatedField
                        label={translate('medicaApp.patient.identifiant')}
                        id="patient-identifiant"
                        name="identifiant"
                        placeholder="Ex: PAT-2024-X99"
                        data-cy="identifiant"
                        type="text"
                        validate={{
                          required: { value: true, message: translate('entity.validation.required') },
                        }}
                      />
                    </Col>
                    <Col md="6">
                      <ValidatedField
                        label={translate('medicaApp.patient.dateNaissance')}
                        id="patient-dateNaissance"
                        name="dateNaissance"
                        data-cy="dateNaissance"
                        type="date"
                        validate={{
                          required: { value: true, message: translate('entity.validation.required') },
                        }}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      <ValidatedField
                        label={translate('medicaApp.patient.nom')}
                        id="patient-nom"
                        name="nom"
                        data-cy="nom"
                        type="text"
                        validate={{
                          required: { value: true, message: translate('entity.validation.required') },
                        }}
                      />
                    </Col>
                    <Col md="6">
                      <ValidatedField
                        label={translate('medicaApp.patient.prenom')}
                        id="patient-prenom"
                        name="prenom"
                        data-cy="prenom"
                        type="text"
                        validate={{
                          required: { value: true, message: translate('entity.validation.required') },
                        }}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      <ValidatedField
                        label={translate('medicaApp.patient.email')}
                        id="patient-email"
                        name="email"
                        data-cy="email"
                        type="text"
                        validate={{
                          required: { value: true, message: translate('entity.validation.required') },
                          pattern: {
                            value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                            message: translate('entity.validation.pattern', { pattern: '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$' }),
                          },
                        }}
                      />
                    </Col>
                    <Col md="6">
                      <ValidatedField
                        label={translate('medicaApp.patient.telephone')}
                        id="patient-telephone"
                        name="telephone"
                        data-cy="telephone"
                        type="text"
                        validate={{
                          required: { value: true, message: translate('entity.validation.required') },
                        }}
                      />
                    </Col>
                  </Row>

                  <ValidatedField
                    label={translate('medicaApp.patient.adresse')}
                    id="patient-adresse"
                    name="adresse"
                    data-cy="adresse"
                    type="textarea"
                    rows="3"
                  />

                  <div className="mt-4 d-flex justify-content-end">
                    <Button
                      tag={Link}
                      id="cancel-save"
                      data-cy="entityCreateCancelButton"
                      to="/patient"
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

export default PatientUpdate;
