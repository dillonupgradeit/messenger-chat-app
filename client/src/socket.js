import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  updateMessageRead,
  increaseUnreadCount,
  setOtherUserTyping,
} from "./store/conversations";
import { updateLastReadMessage } from "./store/utils/thunkCreators";

const socket = io(window.location.origin);

export const setActiveChatInSocket = (activeChat) => {
  socket.activeChat = activeChat;
}

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  
  socket.on("new-message", (data) => {
    store.dispatch(setNewMessage(data.message, data.sender));
    if(data.senderName === socket.activeChat){
      // update conversation reads from current user
      store.dispatch(updateLastReadMessage(data));
    } else {
      store.dispatch(increaseUnreadCount(data.message));
    }
  });

  socket.on("last-read-message", (data) => {
    // update conversations in store from other user
    // 2nd parameter "true" signifies that the updateMessageRead is being passed from another user.
    store.dispatch(updateMessageRead(data.message, true));
  });

  socket.on("typing-message", (data) => {
    store.dispatch(setOtherUserTyping(data.conversationId, data.isTyping));
    // if timeout interval is set then clear it
    if(socket.typingTimout){
      clearTimeout(socket.typingTimout);
    }
    // if isTyping set to true, set a timeout interval (60s)
    if(data.isTyping){
      socket.typingTimout = setTimeout(() => {
        store.dispatch(setOtherUserTyping(data.conversationId, false));
      }, 60000);
    } 
  });
});

export default socket;
