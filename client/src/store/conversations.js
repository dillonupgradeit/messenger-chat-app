import {
  addNewConvoToStore,
  addOnlineUserToStore,
  addSearchedUsersToStore,
  removeOfflineUserFromStore,
  addMessageToStore,
  updateMessageReadToStore,
  increaseUnreadCountToStore,
  setOtherUserTypingToStore,
} from "./utils/reducerFunctions";

// ACTIONS

const GET_CONVERSATIONS = "GET_CONVERSATIONS";
const SET_MESSAGE = "SET_MESSAGE";
const ADD_ONLINE_USER = "ADD_ONLINE_USER";
const REMOVE_OFFLINE_USER = "REMOVE_OFFLINE_USER";
const SET_SEARCHED_USERS = "SET_SEARCHED_USERS";
const CLEAR_SEARCHED_USERS = "CLEAR_SEARCHED_USERS";
const ADD_CONVERSATION = "ADD_CONVERSATION";
const UPDATE_MESSAGE_READ = "UPDATE_MESSAGE_READ";
const INCREASE_UNREAD_COUNT = "INCREASE_UNREAD_COUNT";
const SET_OTHER_USER_TYPING = "SET_OTHER_USER_TYPING";

// ACTION CREATORS

export const gotConversations = (conversations) => {
  return {
    type: GET_CONVERSATIONS,
    conversations,
  };
};

export const setNewMessage = (message, sender) => {
  return {
    type: SET_MESSAGE,
    payload: { message, sender: sender || null },
  };
};

export const addOnlineUser = (id) => {
  return {
    type: ADD_ONLINE_USER,
    id,
  };
};

export const removeOfflineUser = (id) => {
  return {
    type: REMOVE_OFFLINE_USER,
    id,
  };
};

export const setSearchedUsers = (users) => {
  return {
    type: SET_SEARCHED_USERS,
    users,
  };
};

export const clearSearchedUsers = () => {
  return {
    type: CLEAR_SEARCHED_USERS,
  };
};

// add new conversation when sending a new message
export const addConversation = (recipientId, newMessage) => {
  return {
    type: ADD_CONVERSATION,
    payload: { recipientId, newMessage },
  };
};

export const updateMessageRead = (message, fromOtherUser) => {
  return {
    type: UPDATE_MESSAGE_READ,
    payload: {
      message,
      fromOtherUser
    }
  }
}

export const increaseUnreadCount = (message) => {
  return {
    type: INCREASE_UNREAD_COUNT,
    message,
  }
}

export const setOtherUserTyping = (conversationId, isTyping) => {
  return {
    type: SET_OTHER_USER_TYPING,
    payload: {
      conversationId,
      isTyping
    }
  }
}

// REDUCER

const reducer = (state = [], action) => {
  switch (action.type) {
    case GET_CONVERSATIONS:
      return action.conversations;
    case SET_MESSAGE:
      return addMessageToStore(state, action.payload);
    case ADD_ONLINE_USER: {
      return addOnlineUserToStore(state, action.id);
    }
    case REMOVE_OFFLINE_USER: {
      return removeOfflineUserFromStore(state, action.id);
    }
    case SET_SEARCHED_USERS:
      return addSearchedUsersToStore(state, action.users);
    case CLEAR_SEARCHED_USERS:
      return state.filter((convo) => convo.id);
    case ADD_CONVERSATION:
      return addNewConvoToStore(
        state,
        action.payload.recipientId,
        action.payload.newMessage
      );
    case UPDATE_MESSAGE_READ:
      return updateMessageReadToStore(
        state, 
        action.payload.message, 
        action.payload.fromOtherUser
      );
    case INCREASE_UNREAD_COUNT:
      return increaseUnreadCountToStore(state, action.message);
    case SET_OTHER_USER_TYPING:
      return setOtherUserTypingToStore(
        state, 
        action.payload.conversationId, 
        action.payload.isTyping
      );
    default:
      return state;
  }
};

export default reducer;
