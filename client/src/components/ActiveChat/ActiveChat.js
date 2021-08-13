import React, { useMemo, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";
import { updateLastReadMessages } from "../../store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column"
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between"
  }
}));

const ActiveChat = (props) => {
  const classes = useStyles();
  const { user } = props;
  const conversation = useMemo(() => props.conversation || {}, [props]);

  const updateLastRead = useCallback(() => {
    // get all messages received by user
    const receivedMessages = conversation.messages.filter(mes => mes.senderId !== user.id);
    // if user has received message, update last read message and update user
    if(receivedMessages.length > 0){
      const getLastReceivedMessage = receivedMessages.reduce((max, message) => (max.id > message.id) ? max : message);
      props.updateLastReadMessages({userId: user.id, lastReads: conversation.lastReads, message: getLastReceivedMessage });
    }
  },[ props, conversation, user ]);
  
  useEffect(() => {
    if(conversation.messages && conversation.messages.length > 0){
      updateLastRead();
    }
  },[updateLastRead, conversation]);

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            <Messages
              messages={conversation.messages}
              lastReads={conversation.lastReads}
              otherUser={conversation.otherUser}
              userId={user.id}
            />
            <Input
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
              user={user}
            />
          </Box>
        </>
      )}
    </Box>
  );
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateLastReadMessages: (data) => {
      dispatch(updateLastReadMessages(data));
    }
  };
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversation:
      state.conversations &&
      state.conversations.find(
        (conversation) => conversation.otherUser.username === state.activeConversation
      )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveChat);
