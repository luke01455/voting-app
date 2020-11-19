import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { signup, signInWithGoogle  } from '../helpers/auth';
import { dbStore, auth } from "../services/firebase";

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      email: '',
      password: '',
    }
  }
  
  handleChange = (event) =>  {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  googleSignIn = async () =>  {
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
   handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ error: '' });
    try {
      await signup(this.state.email, this.state.password);

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

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <h1>
            Sign Up to
          <Link to="/">Chatty</Link>
          </h1>
          <p>Fill in the form below to create an account.</p>
          <div>
            <input placeholder="Email" name="email" type="email" onChange={this.handleChange} value={this.state.email}></input>
          </div>
          <div>
            <input placeholder="Password" name="password" onChange={this.handleChange} value={this.state.password} type="password"></input>
          </div>
          <div>
            {this.state.error ? <p>{this.state.error}</p> : null}
            <button type="submit">Sign up</button>
          </div>
          <hr></hr>
          <p>Already have an account? <Link to="/login">Login</Link></p>
          <p>Or</p>
        <button onClick={this.googleSignIn} type="button">
          Sign in with Google
        </button>
        </form>
      </div>
    )
  }
}