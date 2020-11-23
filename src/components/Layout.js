import React, { useState } from "react";
import { Notification, FormClose } from "grommet-icons";
import {
    Box,
    Button,
    Collapsible,
    Heading,
    ResponsiveContext,
    Layer,
  } from "grommet";
import SocialMedia from "./SocialMedia";

const Layout = ( { children }) => {
    const [showSidebar, setShowSidebar] = useState(false);

      const AppBar = (props) => (
        <Box
          tag="header"
          direction="row"
          align="center"
          justify="around"
          background="brand"
          pad={{ left: "medium", right: "small", vertical: "small" }}
          elevation="medium"
          style={{ zIndex: "1" }}
          {...props}
        />
      )
  return (
    <ResponsiveContext.Consumer>
       
    {(size) => (
      <Box fill>
        <AppBar>
          <Heading level="3" margin="none">
            YorN
          </Heading>
          <SocialMedia/>
          <Button
            icon={<Notification />}
            onClick={() => setShowSidebar(!showSidebar)}
          />
        </AppBar>
        <Box direction="row" flex overflow={{ horizontal: "hidden" }}>
          <Box flex align="center" justify="center">
              {children}
          </Box>
          {!showSidebar || size !== "small" ? (
            <Collapsible direction="horizontal" open={showSidebar}>
              <Box
                width="medium"
                background="light-2"
                elevation="small"
                align="center"
                justify="center"
              >
                sidebar
              </Box>
            </Collapsible>
          ) : (
            <Layer>
              <Box
                background="light-2"
                tag="header"
                justify="end"
                align="center"
                direction="row"
              >
                <Button
                  icon={<FormClose />}
                  onClick={() => setShowSidebar(false)}
                />
              </Box>
              <Box
                fill
                background="light-2"
                align="center"
                justify="center"
              >
                sidebar
              </Box>
            </Layer>
          )}
        </Box>
      </Box>
    )}
  </ResponsiveContext.Consumer>
      
      )
        }

export default Layout;
