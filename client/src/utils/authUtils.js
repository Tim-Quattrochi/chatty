import { APP_NAME } from "../config/constants";

/**
 *
 * Dispatches an action to the provided dispatch function for updating the authentication state.
 * @param {Function} dispatch - the dispatch function from the useReducer hook.
 * @param {string} caseToCall  - the action to dispatch.
 * @param {any} [value ] - the payload data for action (optional)
 * @returns {void}
 *
 */
export const handleDispatch = (dispatch, caseToCall, value) => {
  dispatch({
    type: caseToCall,
    payload: value,
  });
};

/**
 * @description - Helper function to save data to local storage.
 * @param {object} user - the user data to be saved.
 * @param {string} accessToken - the accessToken to be saved.
 * @returns {void}
 */
export const saveToLocal = (user, accessToken) => {
  const dataToStore = { user, accessToken };
  localStorage.setItem(`${APP_NAME}`, JSON.stringify(dataToStore));
};
