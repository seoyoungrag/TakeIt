import types from "../actions/Types_Constants";

const isFromLogin = false;
const isFromLoading = false;

export default (
  state = {
    isFromLogin, isFromLoading
  }, action) => {
  switch (action.type) {
    case types.IS_FROM_LOGIN:
      return {
        ...state,
        isFromLogin: action.payload
      };
      case types.IS_FROM_LOADING:
        return {
          ...state,
          isFromLoading: action.payload
        };
    default:
      return state;
  }
};
