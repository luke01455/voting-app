import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { auth } from "./services/firebase";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import User from "./pages/User";
import Layout from './components/Layout'


import { Grommet } from "grommet";


const App = () => {

  const [authenticated, setAuthenticated] = useState(false);

  const theme = {
    global: {
      colors: {
        brand: "#228BE6",
      },
      font: {
        family: "Roboto",
        size: "18px",
        height: "20px",
      },
    },
  };

  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        setAuthenticated(true);
        console.log(auth().currentUser, "test");
      } else {
        setAuthenticated(false);
      }
    })
  }, [])

  return (
    <Grommet theme={theme} full>
      <Layout>
      <BrowserRouter>
                <Switch>
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/user" component={User} />
            <Route path="/" component={HomePage} />
            <Route
              exact
              path="/signup"
              render={() => (authenticated ? <Redirect to="/" /> : <Signup />)}
            />
          </Switch>
      </BrowserRouter>
      </Layout>
    </Grommet>
  );
};

export default App;
