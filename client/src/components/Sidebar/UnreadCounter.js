import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "flex-end",
    marginRight: 30,
    flexGrow: 1,
  },
  text: {
    fontSize: 14,
    color: "#ffffff",
    letterSpacing: -0.2,
    padding: "2px 8px",
    fontWeight: "bold"
  },
  bubble: {
    background: "#528ac5",
    borderRadius: "20px"
  }
}));

const UnreadCounter = (props) => {
  const classes = useStyles();

  const { unreadCount } = props;

  return (
    <Box className={classes.root}>
      <Box className={classes.bubble}>
        <Typography className={classes.text}>
          {unreadCount}
        </Typography>
      </Box>
    </Box>
  );
};

export default UnreadCounter;
