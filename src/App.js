import React, { useEffect } from 'react';
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter,
} from "react-router-dom";
import Home from './pages/Home';
import { auth } from './services/firebase';
import Signup from './pages/Signup';
import Login from './pages/Login';

const App = () => {

  useEffect (() => {
    auth().onAuthStateChanged((user) => {
            if (user) {
              console.log(user)
        } else {
      }
    })
  }, [])
    return  (
     <div>
       <BrowserRouter>
                 <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" component={Login} />
            {/* <Route
              exact
              path="/signup"
              render={() =>
                currentUser ? (
                  <Redirect to="/" />
                ) : (
                  <SignInAndSignUpPage />
                )
              }
            /> */}
          </Switch>
          </BrowserRouter>
     </div>
    )
}

export default App;