import React, { useCallback, useMemo } from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent, UnreadCounter } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab"
    }
  }
}));

const Chat = (props) => {
  const classes = useStyles();
  const { conversation } = props;
  const { otherUser } = conversation;
  const user = useMemo(() => props.user || {}, [ props ]);

  const handleClick = async (conversation) => {
    await props.setActiveChat(conversation.otherUser.username);
  };

  // get current user's last read
  const userLastRead = conversation.lastReads.find(read => read.userId === user.id);
  // calculate unread count
  const unreadCount = useCallback(() => {
    let unreadCount = 0;
    if (userLastRead) {
      // if last read exists in db count all messages not sent by user, since last read message, by messageId
      unreadCount = conversation.messages.filter(message => message.senderId !== user.id && message.id > userLastRead.messageId).length;
    } else if (conversation.messages.length !== 0) {
      // else count all messages not sent by current user
      unreadCount = conversation.messages.filter(mes => mes.senderId !== user.id).length;
    }
    return unreadCount;
  }, [conversation, user, userLastRead]);

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
      {unreadCount() > 0 && <UnreadCounter unreadCount={unreadCount()} />}
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    }
  };
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
