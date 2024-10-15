// SignUp.js
import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import * as Yup from 'yup';

const SignUp = () => {
  const signUpSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleSubmit = (values) => {
    console.log('User Signed Up:', values);
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="justify-content-center w-100">
        <Col xs={10} sm={8} md={6} lg={4}>
          <Card className="shadow-lg">
            <Card.Body>
              <h2 className="text-center mb-4">Sign Up</h2>
              <Formik
                initialValues={{ fullName: '', email: '', password: '' }}
                validationSchema={signUpSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched }) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="fullName">Full Name</label>
                      <Field
                        name="fullName"
                        type="text"
                        className={`form-control ${touched.fullName && errors.fullName ? 'is-invalid' : ''}`}
                      />
                      <ErrorMessage name="fullName" component="div" className="invalid-feedback" />
                    </div>

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

                    <Button type="submit" variant="primary" className="w-100">
                      Sign Up
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

export default SignUp;
