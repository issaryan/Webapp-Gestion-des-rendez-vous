import React, { useState, useEffect } from 'react';
import { Translate, translate, ValidatedField, ValidatedForm, isEmail } from 'react-jhipster';
import { Row, Col, Card, CardBody, CardHeader, Button, Alert } from 'reactstrap';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { handleRegister, reset } from './register.reducer';

export const Register = () => {
  const dispatch = useAppDispatch();

  const [password, setPassword] = useState('');

  const successMessage = useAppSelector(state => state.register.successMessage);

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, []);

  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage));
    }
  }, [successMessage]);

  const handleValidSubmit = ({ username, email, firstPassword }) => {
    dispatch(handleRegister({ login: username, email, password: firstPassword, langKey: 'fr' }));
  };

  const updatePassword = event => setPassword(event.target.value);

  return (
    <div className="medical-auth-page">
      <Col md="6" lg="5">
        <Card className="auth-card">
          <CardHeader>
            <div className="mb-3 text-success">
              <FontAwesomeIcon icon="user-plus" size="3x" />
            </div>
            <h1>Créer mon Compte Patient</h1>
            <p className="text-muted mb-0">Rejoignez Medica pour gérer votre santé</p>
          </CardHeader>
          <CardBody>
            <ValidatedForm onSubmit={handleValidSubmit}>
              <ValidatedField
                name="username"
                label={translate('global.form.username.label')}
                placeholder={translate('global.form.username.placeholder')}
                validate={{
                  required: { value: true, message: translate('register.messages.validate.login.required') },
                  pattern: {
                    value: /^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$/,
                    message: translate('register.messages.validate.login.pattern'),
                  },
                  minLength: { value: 1, message: translate('register.messages.validate.login.minlength') },
                  maxLength: { value: 50, message: translate('register.messages.validate.login.maxlength') },
                }}
                data-cy="username"
              />

              <ValidatedField
                name="email"
                label={translate('global.form.email.label')}
                placeholder={translate('global.form.email.placeholder')}
                type="email"
                validate={{
                  required: { value: true, message: translate('global.messages.validate.email.required') },
                  minLength: { value: 5, message: translate('global.messages.validate.email.minlength') },
                  maxLength: { value: 254, message: translate('global.messages.validate.email.maxlength') },
                  validate: v => isEmail(v) || translate('global.messages.validate.email.invalid'),
                }}
                data-cy="email"
              />

              <Row>
                <Col md="6">
                  <ValidatedField
                    name="firstPassword"
                    label={translate('global.form.newpassword.label')}
                    placeholder={translate('global.form.newpassword.placeholder')}
                    type="password"
                    onChange={updatePassword}
                    validate={{
                      required: { value: true, message: translate('global.messages.validate.newpassword.required') },
                      minLength: { value: 4, message: translate('global.messages.validate.newpassword.minlength') },
                      maxLength: { value: 50, message: translate('global.messages.validate.newpassword.maxlength') },
                    }}
                    data-cy="firstPassword"
                  />
                </Col>
                <Col md="6">
                  <ValidatedField
                    name="secondPassword"
                    label={translate('global.form.confirmpassword.label')}
                    placeholder={translate('global.form.confirmpassword.placeholder')}
                    type="password"
                    validate={{
                      required: { value: true, message: translate('global.messages.validate.confirmpassword.required') },
                      minLength: { value: 4, message: translate('global.messages.validate.confirmpassword.minlength') },
                      maxLength: { value: 50, message: translate('global.messages.validate.confirmpassword.maxlength') },
                      validate: v => v === password || translate('global.messages.validate.confirmpassword.match'),
                    }}
                    data-cy="secondPassword"
                  />
                </Col>
              </Row>

              <div className="mt-4 d-grid gap-2">
                <Button id="register-submit" color="success" type="submit" size="lg" data-cy="submit">
                  <FontAwesomeIcon icon="save" className="me-2" />
                  <Translate contentKey="register.form.button">Register</Translate>
                </Button>
              </div>
            </ValidatedForm>

            <div className="mt-4 text-center">
              <p className="text-muted small">
                Déjà inscrit ?{' '}
                <Link to="/login" className="fw-bold text-success text-decoration-none">
                  Connectez-vous ici
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </Col>
    </div>
  );
};

export default Register;
