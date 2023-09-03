export const initialState = {
  chats: [],
  isSubmitting: false,
  roomInput: "",
  chatName: "",
  error: null,
};

/**
 *
 * @param {Object} state - the current chat state
 * @param {Object} action -The action object containing the type and payload.
 * @returns - the updated state object based on the action type
 * provided
 */

export const chatReducer = (state, action) => {
  switch (action.type) {
    case "ADD_CHAT": {
      return {
        ...state,
        //only add the chat to state if it is not already there.
        chats: state.chats.some(
          (chat) => chat.id === action.payload.id
        )
          ? state.chats
          : [...state.chats, action.payload],
      };
    }
    case "LOAD_CHATS":
      return {
        ...state,
        chats: action.payload,
      };

    case "HANDLE_CHANGE":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case "SET_IS_SUBMITTING":
      return {
        ...state,
        isSubmitting: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
