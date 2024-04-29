import React from "react";
import Routes from "./Routes/index";

// Import Scss
import './assets/scss/theme.scss';
import { AuthContextProvider } from "./Context/AuthContext";

// Fake Backend 
import fakeBackend from "./helpers/AuthType/fakeBackend";

// Activating fake backend

// Firebase
// Import Firebase Configuration file
// import { initFirebaseBackend } from "./helpers/firebase_helper"

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_APIKEY,
//   authDomain: process.env.REACT_APP_AUTHDOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASEURL,
//   projectId: process.env.REACT_APP_PROJECTID,
//   storageBucket: process.env.REACT_APP_STORAGEBUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
//   appId: process.env.REACT_APP_APPID,
//   measurementId: process.env.REACT_APP_MEASUREMENTID,
// }

// init firebase backend
// initFirebaseBackend(firebaseConfig)


function App() {
  axios.defaults.withCredentials = true
  return (
    <AuthContextProvider>
    <React.Fragment>
      <Routes />
    </React.Fragment>
    </AuthContextProvider>
  );
}

export default App;
