import React, { useContext } from 'react';
import { Navigate , Route} from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext'; // Update the import path as needed

const AuthProtected = ({ children }) => {
  // Use useContext hook to access the context
  const user = JSON.parse(localStorage.getItem('user'))

  if (!user) {
    // User not logged in, redirect to login page
    return <Navigate to="/login" />;
  }
  
    // User is logged in, render the children components
    return children;
  };


const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return (<> <Component {...props} /> </>);
      }}
    />
  );
};

export { AuthProtected, AccessRoute };
