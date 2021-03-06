import React, { Component } from "react";
import { Link } from "react-router-dom";
import { signin, signInWithGoogle } from "../helpers/auth";
import { dbStore, auth } from "../services/firebase";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      email: "",
      password: "",
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }
  
  googleSignIn = async () => {
    try {
      await signInWithGoogle();
      const userDetails = {
        displayName: auth().currentUser.displayName,
        id: auth().currentUser.uid,
        email: auth().currentUser.email
      }
      this.addUserToTable(userDetails)
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  addUserToTable = (user) => {
    dbStore
      .collection("users")
      //.doc() use if for some reason you want that firestore generates the id
      .doc(user.id)
      .set(user)
      .catch((err) => {
        console.error(err);
      })
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ error: "" });
    try {
      await signin(this.state.email, this.state.password);
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  render() {
    return (
      <div>
        <form autoComplete="off" onSubmit={this.handleSubmit}>
          <h1>
            Login to
            <Link to="/">Chatty</Link>
          </h1>
          <p>Fill in the form below to login to your account.</p>
          <div>
            <input
              placeholder="Email"
              name="email"
              type="email"
              onChange={this.handleChange}
              value={this.state.email}
            />
          </div>
          <div>
            <input
              placeholder="Password"
              name="password"
              onChange={this.handleChange}
              value={this.state.password}
              type="password"
            />
          </div>
          <div>
            {this.state.error ? <p>{this.state.error}</p> : null}
            <button type="submit">Login</button>
          </div>
          <hr />
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
          <p>Or</p>
          <button onClick={this.googleSignIn} type="button">
            Sign in with Google
          </button>
        </form>
      </div>
    );
  }
}
