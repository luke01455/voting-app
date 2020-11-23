import React from "react";
import { Anchor, Box, Text, ResponsiveContext } from "grommet";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";

function NavHeader() {

  return (

  <ResponsiveContext.Consumer>
    {(size) => (
      <Box
        direction="row"
        justify="around"
        alignSelf="center"
        gap="medium"
        pad={{ top: "large", horizontal: "xlarge" }}
      >
        <Anchor
          href="/"
          icon={<Logo />}
          color="black"
          label={
            size !== "xsmall" &&
            size !== "small" && <Text size="large">App Teaser</Text>
          }
        />
        <SocialMedia />
      </Box>
    )}
  </ResponsiveContext.Consumer>
      
      )
        }

export default NavHeader;
