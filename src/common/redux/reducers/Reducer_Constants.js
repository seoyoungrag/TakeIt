import types from "../actions/Types_Constants";

const isFromLogin = false;
const isFromLoading = false;
const activeFooterBtn = "HOME";
const forceRefreshMain = false;
const timestamp = 0;
const adMobRewarded = {};

export default (
  state = {
    isFromLogin, isFromLoading, activeFooterBtn:"HOME", forceRefreshMain, timestamp, adMobRewarded
  }, action) => {
  switch (action.type) {
    case types.SET_ADMOBREWARDED:
      return {
        ...state,
        adMobRewarded: action.payload
      }
    case types.SET_TIMESTAMP:
      return {
        ...state,
        timestamp: action.payload
      }
    case types.FORCE_REFRESH_MAIN:
      return {
        ...state,
        forceRefreshMain: action.payload
      };
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
