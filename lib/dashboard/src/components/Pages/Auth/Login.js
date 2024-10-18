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
      //const response = await fakeLoginAPI(values);
      const response = await loginUser(values);
      login(response.access_token);
      navigate('/'); // Navigate after login
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const fakeLoginAPI = async ({ email, password }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'test@example.com' && password === 'password123') {
          resolve({ token: 'abc123token' });
        } else {
          reject('Invalid credentials');
        }
      }, 1000);
    });
  };

  const loginUser = async ({email, password}) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
        const response = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error("Login failed:", response.statusText);
            return null;
        }
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
  }

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="justify-content-center w-100">
        <Col xs={10} sm={8} md={6} lg={4}>
          <Card className="shadow-lg">
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>
              <Formik
                initialValues={{ email: 'default_user@example.com.admin', password: 'admin12345' }}
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
