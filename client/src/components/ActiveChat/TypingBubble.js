import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, Avatar } from "@material-ui/core";
import LensIcon from "@material-ui/icons/Lens";
const useStyles = makeStyles(() => ({
  root: {
    display: "flex"
  },
  avatar: {
    height: 30,
    width: 30,
    marginRight: 11,
    marginTop: 6
  },
  usernameDate: {
    fontSize: 11,
    color: "#BECCE2",
    fontWeight: "bold",
    marginBottom: 5
  },
  bubble: {
    padding: '8px 12px',
    backgroundImage: "linear-gradient(225deg, #74b6e4 0%, #5383c3 100%)",
    borderRadius: "0 10px 10px 10px"
  },
  dotDefaults: {
    padding: '0 1px',
    fontSize: 12,
    color: "#94bae3",
  },
  dot1: {
    animation: `$fade 1000ms ease-in-out infinite alternate`
  },
  dot2: {
    animation: `$fade 1000ms .2s ease-in-out infinite alternate`,
  },
  dot3: {
    animation: `$fade 1000ms .4s ease-in-out infinite alternate`,
  },
  "@keyframes fade": {
    "0%": {
      opacity: 0,
    },
    "100%": {
      opacity: 1,
    }
  },
}));

const TypingBubble = (props) => {
  const classes = useStyles();
  const { otherUser } = props;

  return (
    <Box className={classes.root}>
      <Avatar alt={otherUser.username} src={otherUser.photoUrl} className={classes.avatar}></Avatar>
      <Box>
        <Typography className={classes.usernameDate}>
          {otherUser.username}
        </Typography>
        <Box className={classes.bubble}>
          <LensIcon className={`${classes.dotDefaults} ${classes.dot1}`} />
          <LensIcon className={`${classes.dotDefaults} ${classes.dot2}`} />
          <LensIcon className={`${classes.dotDefaults} ${classes.dot3}`} />
        </Box>
      </Box>
    </Box>
  );
};

export default TypingBubble;
