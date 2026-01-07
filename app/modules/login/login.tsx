import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { login } from 'app/shared/reducers/authentication';
import { Button, Row, Col, Card, CardBody, CardHeader, Form, Input, InputGroup, InputGroupText, Alert, Label } from 'reactstrap'; // Note: J'utilise Form/Input standard Reactstrap pour plus de flexibilité visuelle ici, ou ValidatedForm si vous préférez. Je garde le standard Reactstrap pour le design.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate, translate } from 'react-jhipster';

export const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const loginError = useAppSelector(state => state.authentication.loginError);

  // Redirection si déjà connecté
  const { from } = location.state || { from: { pathname: '/', search: location.search } };
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleLogin = e => {
    e.preventDefault();
    dispatch(login(username, password, rememberMe));
  };

  return (
    <div className="medical-auth-page">
      <Col md="5" lg="4">
        <Card className="auth-card">
          <CardHeader>
            <div className="mb-3 text-primary">
              <FontAwesomeIcon icon="user-md" size="3x" />
            </div>
            <h1>Connexion Medica</h1>
            <p className="text-muted mb-0">Accédez à votre espace sécurisé</p>
          </CardHeader>
          <CardBody>
            {loginError ? (
              <Alert color="danger" data-cy="loginError">
                <Translate contentKey="login.messages.error.authentication">
                  <strong>Failed to sign in!</strong> Please check your credentials and try again.
                </Translate>
              </Alert>
            ) : null}

            <Form onSubmit={handleLogin}>
              <div className="mb-3">
                <Label className="visually-hidden" for="username">
                  Identifiant
                </Label>
                <InputGroup>
                  <InputGroupText>
                    <FontAwesomeIcon icon="user" />
                  </InputGroupText>
                  <Input
                    placeholder={translate('global.form.username.placeholder')}
                    type="text"
                    name="username"
                    className="form-control"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    autoFocus
                    data-cy="username"
                  />
                </InputGroup>
              </div>

              <div className="mb-3">
                <Label className="visually-hidden" for="password">
                  Mot de passe
                </Label>
                <InputGroup>
                  <InputGroupText>
                    <FontAwesomeIcon icon="lock" />
                  </InputGroupText>
                  <Input
                    placeholder={translate('login.form.password.placeholder')}
                    type="password"
                    name="password"
                    className="form-control"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    data-cy="password"
                  />
                </InputGroup>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <Input
                    type="checkbox"
                    className="form-check-input"
                    name="rememberMe"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                  <Label className="form-check-label text-muted small" check>
                    <Translate contentKey="login.form.rememberme">Remember me</Translate>
                  </Label>
                </div>
                <Link to="/account/reset/request" className="small text-decoration-none">
                  <Translate contentKey="login.password.forgot">Forgot password?</Translate>
                </Link>
              </div>

              <div className="d-grid gap-2">
                <Button color="primary" type="submit" size="lg" data-cy="submit">
                  <FontAwesomeIcon icon="sign-in-alt" className="me-2" />
                  <Translate contentKey="login.form.button">Sign in</Translate>
                </Button>
              </div>
            </Form>

            <div className="mt-4 text-center">
              <p className="text-muted small">
                Nouveau patient ?{' '}
                <Link to="/account/register" className="fw-bold text-primary text-decoration-none">
                  <Translate contentKey="global.menu.account.register">Register</Translate>
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </Col>
    </div>
  );
};

export default Login;
