import React from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Typography,
  Toolbar,
  Box,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import { useState } from "react";
import { lightTheme } from "../utils/theme";


const Header = () => {
  const userId = localStorage.getItem("userId");
  const [value, setValue] = useState(0);
  const tabs = [
    { to: "/user/vehicle", label: "Add Vehicle" },
  ];

  return (
    <AppBar position="sticky" sx={{ background: `${lightTheme.bg}` }}>
      <Toolbar>
        <Typography variant="h4">Task Management</Typography>
        {userId && (
          <Box display="flex" marginLeft={"auto"} marginRight="auto">
            <Tabs
              value={value}
              onChange={(e, val) => {
                setValue(value);
              }}
            >
              {tabs.map((tab) => {
                return (
                  <Tab
                    sx={{ color: "white" }}
                    // className={classes.font}
                    LinkComponent={Link}
                    to={tab.to}
                    label={tab.label}
                  />
                );
              })}
            </Tabs>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
