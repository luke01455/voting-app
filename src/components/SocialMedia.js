import React from "react";
import { Anchor, Box } from "grommet";
import firebase from "firebase/app";

function logout() {
  firebase.auth().signOut();
}

const SocialMedia = () => (
  <Box direction="row" gap="xxsmall" justify="center" style={{ zIndex: "100"}}>
            <Anchor href="/login" label="Login" margin="small" color="white" />
            <Anchor href="/signup" label="Signup" margin="small" color="white" />
            <Anchor label="Logout" margin="small" onClick={() => logout()} color="white" />
  </Box>
);

export default SocialMedia;
