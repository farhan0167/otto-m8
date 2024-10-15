import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../../contexts/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); // Use useNavigate here

  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await fakeLoginAPI(values);
      login(response.user, response.token);
      navigate('/'); // Navigate after login
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const fakeLoginAPI = async ({ email, password }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'test@example.com' && password === 'password123') {
          resolve({ user: { id: 1, name: 'Test User', email }, token: 'abc123token' });
        } else {
          reject('Invalid credentials');
        }
      }, 1000);
    });
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="justify-content-center w-100">
        <Col xs={10} sm={8} md={6} lg={4}>
          <Card className="shadow-lg">
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={loginSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="email">Email Address</label>
                      <Field
                        name="email"
                        type="email"
                        className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                      />
                      <ErrorMessage name="email" component="div" className="invalid-feedback" />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password">Password</label>
                      <Field
                        name="password"
                        type="password"
                        className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                      />
                      <ErrorMessage name="password" component="div" className="invalid-feedback" />
                    </div>

                    <Button type="submit" variant="primary" className="w-100" disabled={isSubmitting}>
                      {isSubmitting ? 'Logging in...' : 'Login'}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
