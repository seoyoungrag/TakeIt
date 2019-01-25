import types from "../actions/Types_Constants";

const isFromLogin = false;
const isFromLoading = false;
const activeFooterBtn = "HOME";

export default (
  state = {
    isFromLogin, isFromLoading, activeFooterBtn:"HOME"
  }, action) => {
  switch (action.type) {
    case types.SET_ACTIVE_FOOTER_BTN:
      return {
        ...state,
        activeFooterBtn: action.payload
      };
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
