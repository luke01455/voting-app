import React, { useEffect, useState } from 'react';
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter,
} from "react-router-dom";
import HomePage from './pages/HomePage';
import { auth } from './services/firebase';
import Signup from './pages/Signup';
import Login from './pages/Login';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false)

  useEffect (() => {

    auth().onAuthStateChanged((user) => {
      if (user) {
  setAuthenticated(true)
  console.log(auth().currentUser, "test")
  } else {
  setAuthenticated(false)
}
})
}, [])

    return  (
     <div>
       <BrowserRouter>
                 <Switch>
                 <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" component={Login} />
            <Route path="/" component={HomePage} />

            <Route
              exact
              path="/signup"
              render={() =>
                authenticated ? (
                  <Redirect to="/" />
                ) : (
                  <Signup />
                )
              }
            />
          </Switch>
          </BrowserRouter>
     </div>
    )
}

export default App;