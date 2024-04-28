import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../store/actions";
import { useLogin } from "../../Hooks/UseLogin";
import {MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';


// Formik and Yup for validation
import { useFormik } from "formik";
import * as Yup from "yup";

const Login = () => {
  const { login, error, isLoading } = useLogin();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (email, password) => {
    login(email, password).then(() => navigate('/dashboard'));
  };

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required("Please enter your email"),
      password: Yup.string().required("Please enter your password"),
    }),
    onSubmit: values => {
      handleSubmit(values.email, values.password);
    },
  });

  document.title = "Login | Upzet - React Admin & Dashboard Template";

  return (
    <MDBContainer fluid className="p-3 my-5 h-custom">
      <MDBRow>
        <MDBCol md='6'>
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="img-fluid" alt="Sample" />
        </MDBCol>
        <MDBCol md='6'>
          <div className="d-flex flex-row align-items-center justify-content-center">
            <p className="lead fw-normal mb-0 me-3">Sign in with</p>
            <MDBBtn floating size='sm' tag='a' className='me-2' color="primary">
              <MDBIcon fab icon='facebook-f' />
            </MDBBtn>
            <MDBBtn floating size='sm' tag='a' className='me-2' color="info">
              <MDBIcon fab icon='twitter' />
            </MDBBtn>
            <MDBBtn floating size='sm' tag='a' className='me-2' color="primary">
              <MDBIcon fab icon='linkedin-in' />
            </MDBBtn>
          </div>
          <div className="divider d-flex align-items-center my-4">
            <p className="text-center fw-bold mx-3 mb-0">Or</p>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <MDBInput
              wrapperClass='mb-4'
              label='Email address'
              id='email'
              type='email'
              size="lg"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            <MDBInput
              wrapperClass='mb-4'
              label='Password'
              id='password'
              type='password'
              size="lg"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <div className="d-flex justify-content-between mb-4">
              <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
              <a href="#!">Forgot password?</a>
            </div>
            <MDBBtn className="mb-0 px-5" size='lg' type="submit">Login</MDBBtn>
            <p className="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <a href="#!" className="link-danger">Register</a></p>
          </form>
        </MDBCol>
      </MDBRow>
      <div className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
        <div className="text-white mb-3 mb-md-0">
          Copyright © {new Date().getFullYear()} Upzet. Crafted with
          <MDBIcon icon="heart" className="text-danger mx-1" />
          by Themesdesign
        </div>
        <div>
          <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white' }}>
            <MDBIcon fab icon='facebook-f' size="lg"/>
          </MDBBtn>
          <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white'  }}>
            <MDBIcon fab icon='twitter' size="lg"/>
          </MDBBtn>
          <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white'  }}>
            <MDBIcon fab icon='google' size="lg"/>
          </MDBBtn>
          <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white'  }}>
            <MDBIcon fab icon='linkedin-in' size="lg"/>
          </MDBBtn>
        </div>
      </div>
    </MDBContainer>
  );
};

export default Login;
