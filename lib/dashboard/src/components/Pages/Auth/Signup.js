// SignUp.js
import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();

  const signUpSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleSubmit = async (values) => {
    console.log('User Signed Up:', values);
    // call signUp API
    const response = await signUp(values);

    if (response) {
      navigate('/login');
    }
    if (!response) {
      console.error('Sign up failed:', response.statusText);
    }
  };

  const signUp = async ({fullName, email, password}) => {
    const data = {
      name: fullName,
      email,
      password
    }
    const response = await fetch('http://localhost:8000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('Sign up failed:', response.statusText);
      return null;
    }
  }

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
