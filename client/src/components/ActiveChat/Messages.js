import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, lastReads, otherUser, userId } = props;

  const otherUsersWithLastReads = (messageId, lastReads) => {
    return lastReads.map(read => {
      return read.messageId === messageId && read.userId !== userId && otherUser;
    });
  }

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} otherUsers={otherUsersWithLastReads(message.id, lastReads)} />
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
