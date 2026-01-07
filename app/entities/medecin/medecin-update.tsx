import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, Card, CardBody, CardHeader } from 'reactstrap'; // Ajout de Card pour le style
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

// On retire l'import de getUsers car on ne gère plus l'utilisateur manuellement
import { getEntities as getSpecialites } from 'app/entities/specialite/specialite.reducer';
import { createEntity, getEntity, reset, updateEntity } from './medecin.reducer';

export const MedecinUpdate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  // On ne récupère plus la liste des users
  const specialites = useAppSelector(state => state.specialite.entities);
  const medecinEntity = useAppSelector(state => state.medecin.entity);
  const loading = useAppSelector(state => state.medecin.loading);
  const updating = useAppSelector(state => state.medecin.updating);
  const updateSuccess = useAppSelector(state => state.medecin.updateSuccess);

  const handleClose = () => {
    navigate('/medecin' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }
    // On ne charge plus les utilisateurs ici
    dispatch(getSpecialites({}));
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
      ...medecinEntity,
      ...values,
      // On ne touche pas à internalUser ici, le backend gère la création,
      // ou on garde l'existant en cas de mise à jour via ...medecinEntity
      specialite: specialites.find(it => it.id.toString() === values.specialite?.toString()),
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
          ...medecinEntity,
          specialite: medecinEntity?.specialite?.id,
        };

  return (
    <div className="mt-4">
      <Row className="justify-content-center">
        <Col md="8">
          <Card className="shadow-sm">
            <CardHeader className="bg-primary text-white">
              <h2 id="medicaApp.medecin.home.createOrEditLabel" data-cy="MedecinCreateUpdateHeading" className="mb-0">
                <FontAwesomeIcon icon={isNew ? 'user-plus' : 'pencil-alt'} />{' '}
                <Translate contentKey="medicaApp.medecin.home.createOrEditLabel">Create or edit a Medecin</Translate>
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
                      id="medecin-id"
                      label={translate('global.field.id')}
                      validate={{ required: true }}
                    />
                  ) : null}

                  <Row>
                    <Col md="6">
                      <ValidatedField
                        label={translate('medicaApp.medecin.matricule')}
                        id="medecin-matricule"
                        name="matricule"
                        placeholder="Ex: MED-2024-001"
                        data-cy="matricule"
                        type="text"
                        validate={{
                          required: { value: true, message: translate('entity.validation.required') },
                        }}
                      />
                    </Col>
                    <Col md="6">
                      <ValidatedField
                        id="medecin-specialite"
                        name="specialite"
                        data-cy="specialite"
                        label={translate('medicaApp.medecin.specialite')}
                        type="select"
                      >
                        <option value="" key="0">
                          -- Sélectionner une spécialité --
                        </option>
                        {specialites
                          ? specialites.map(otherEntity => (
                              <option value={otherEntity.id} key={otherEntity.id}>
                                {otherEntity.nom}
                              </option>
                            ))
                          : null}
                      </ValidatedField>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      <ValidatedField
                        label={translate('medicaApp.medecin.nom')}
                        id="medecin-nom"
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
                        label={translate('medicaApp.medecin.prenom')}
                        id="medecin-prenom"
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
                        label={translate('medicaApp.medecin.email')}
                        id="medecin-email"
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
                        label={translate('medicaApp.medecin.telephone')}
                        id="medecin-telephone"
                        name="telephone"
                        data-cy="telephone"
                        type="text"
                        validate={{
                          required: { value: true, message: translate('entity.validation.required') },
                        }}
                      />
                    </Col>
                  </Row>

                  {/* Le champ InternalUser a été supprimé ici */}

                  <div className="mt-4 d-flex justify-content-end">
                    <Button
                      tag={Link}
                      id="cancel-save"
                      data-cy="entityCreateCancelButton"
                      to="/medecin"
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

export default MedecinUpdate;
