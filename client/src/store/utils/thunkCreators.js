import axios from "axios";
import socket, { setActiveChatInSocket } from "../../socket";
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
  updateMessageRead,
  setOtherUserTyping,
} from "../conversations";
import { setActiveChat } from "../activeConversation"
import { gotUser, setFetchingStatus } from "../user";

axios.interceptors.request.use(async function (config) {
  const token = await localStorage.getItem("messenger-token");
  config.headers["x-access-token"] = token;

  return config;
});

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get("/auth/user");
    dispatch(gotUser(data));
    if (data.id) {
      socket.emit("go-online", data.id);
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/register", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/login", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await axios.delete("/auth/logout");
    await localStorage.removeItem("messenger-token");
    dispatch(gotUser({}));
    socket.emit("logout", id);
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/conversations");
    dispatch(gotConversations(data));
  } catch (error) {
    console.error(error);
  }
};

const sendMessage = (data, body) => {
  socket.emit("new-message", {
    message: data.message,
    recipientId: body.recipientId,
    sender: data.sender,
    senderName: body.senderName,
  });
};


const saveMessage = async (body) => {
  const { data } = await axios.post("/api/messages", body);
  return data;
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
export const postMessage = (body) => async (dispatch) => {
  try {
    const data = await saveMessage(body);

    if (!body.conversationId) {
      dispatch(addConversation(body.recipientId, data.message));
    } else {
      dispatch(setNewMessage(data.message));
    }

    sendMessage(data, body);
  } catch (error) {
    console.error(error);
  }
};

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};

// send new reads to api to update
const saveMessageReads = async (body) => {
  const { data } = await axios.put("/api/messages/read", body);
  return data;
}

const sendLastReadMessage = (data) => {
  socket.emit("last-read-message", {
    message: data.message,
  });
};

export const updateLastReadMessage = (body) => async (dispatch) => {
  // update db
  const data = await saveMessageReads(body);
  // update conversations in store from current user
  // 2nd param "false" signifies that the updateMessageRead is being passed by current user.
  dispatch(updateMessageRead(data.message, false));
  
  //send read update to socket
  sendLastReadMessage(data);
}

export const joinChat = (conversation) => async (dispatch) => {
  await dispatch(setActiveChat(conversation.otherUser.username));
  setActiveChatInSocket(conversation.otherUser.username);
  const unreadMessages = conversation.messages.filter((message) => message.senderId === conversation.otherUser.id && message.read === false);
  const lastUnreadMessage = unreadMessages.length ? unreadMessages[unreadMessages.length-1] : null;
  if(lastUnreadMessage){
    dispatch(updateLastReadMessage({message: lastUnreadMessage}));
  }
}

export const updateIsTyping = (data) => {
  socket.emit("typing-message", {
    conversationId: data.conversationId,
    isTyping: data.isTyping
  });
}

export const updateTypingTimeout = (data) => async (dispatch) => {
  await dispatch(setOtherUserTyping(data));
}
