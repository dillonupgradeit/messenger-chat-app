import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Avatar } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end"
  },
  profilePic: {
    height: 20,
    width: 20
  },
}));

const ReceiverReadAvatar = (props) => {
  const classes = useStyles();
  const { userWithLastRead } = props;

  return (
    <Box className={classes.root}>
      <Avatar alt={userWithLastRead.username} src={userWithLastRead.photoUrl} className={classes.profilePic} />
    </Box>
  );
};

export default ReceiverReadAvatar;
