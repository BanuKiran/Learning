import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import useAuth from '../hooks/useAuth';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { login } = useAuth();

  const validationSchema = () => {
    return Yup.object().shape({
      username: Yup.string().required('This field is required!'),
      password: Yup.string().required('This field is required!'),
    });
  };

  const handleLogin = (formValue: { username: string; password: string }) => {
    const { username, password } = formValue;
    setLoading(true);
    setMessage('');

    login(username, password).then(
      () => {
        window.location.pathname = '/home';
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        setLoading(false);
        setMessage(resMessage);
      }
    );
  };
  const initialValues = {
    username: '',
    password: '',
  };

  return (
    <div className="green-flex-box">
      <div className="login-container">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          <Form>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Field name="username" type="text" className="form-control" />
              <ErrorMessage name="username" component="div" className="alert alert-danger" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage name="password" component="div" className="alert alert-danger" />
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading && <span className="spinner-border spinner-border-sm" />}
                <span>Login</span>
              </button>
            </div>

            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
          </Form>
        </Formik>
      </div>
      <div className="pwd-link-container">
        <Link to={'/forgot-password'} className="nav-link" style={{ color: '#5e7b35' }}>
          Forgot password?
        </Link>
      </div>
    </div>
  );
}
