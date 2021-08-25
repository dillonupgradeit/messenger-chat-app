import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  defaultText: {
    fontSize: 12,
    letterSpacing: -0.17,
    fontWeight: "bold",
  },
  previewText: {
    color: "#9CADC8",
  },
  unreadText: {
    color: "#000",
  },
  typingText: {
    color: "#9CADC8",
    fontStyle: "italic",
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();
  
  const { conversation } = props;
  const { latestMessageText, otherUser } = conversation;
  const latestMessageTextClass = conversation.otherUserTyping ? classes.typingText : conversation.unreadCount > 0 ? classes.unreadText : classes.previewText;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={`${classes.defaultText} ${latestMessageTextClass}`}>
          {conversation.otherUserTyping ? "Typing..." : latestMessageText}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatContent;
