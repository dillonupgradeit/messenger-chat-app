import axios from "axios";
import socket from "../../socket";
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
  setNewReads,
} from "../conversations";
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

const saveMessage = async (body) => {
  const { data } = await axios.post("/api/messages", body);
  return data;
};

const sendMessage = (data, body) => {
  socket.emit("new-message", {
    message: data.message,
    recipientId: body.recipientId,
    sender: data.sender,
  });
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
const saveReads = async (body) => {
  const { data } = await axios.post("/api/last-reads", body);
  return data;
};

// notify other users of read updates via socket
const updateReads = (data) => {
  socket.emit("update-read", { 
    lastReads: data.lastReads 
  });
};


export const updateLastReads = (body) => async (dispatch) => {
  try {
    // save reads in database 
    await saveReads(body);
    // update reads in state
    dispatch(setNewReads(body));
    //notify other user/s to update state
    updateReads({ lastReads: body });
  } catch(error){
    console.log(error)
  }
}

export const updateLastReadMessages = (data) => async (dispatch) => {
  try {
    const userLastRead = data.lastReads.find(read => read.userId === data.userId);
    // if received new message in conversation in activeChat
    // update lastReads with most recent received message and notify other users
    let updated = false;
    const updatedLastRead = data.lastReads.map((read) => {
      if(read.userId === data.userId && read.messageId !== data.message.id){
        updated = true;
        return {
          ...read,
          messageId: data.message.id,
        }
      } 
      return read;
    });
    // if no lastRead exists for user for conversation, initialize one
    if (!userLastRead) {
      updated = true;
      updatedLastRead.push({
        conversationId: data.message.conversationId,
        userId: data.userId,
        messageId: data.message.id,
      });
    }
    if(updated){
      // update db and notify other user/s
      dispatch(updateLastReads(updatedLastRead));
    }

  } catch(error) {
    console.log(error);
  }

};
