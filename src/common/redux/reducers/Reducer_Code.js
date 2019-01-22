import types from "../actions/Types_Code";

// const codeCategory = [];
// const code = [];
const initialState = {
  code: [],
  codeCategory: [],
  number: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_CODE_CATEGORY:
      return {
        ...state,
        codeCategory: action.payload,
        number: state.number + 1
      };
    case types.SET_CODE:
      return {
        ...state,
        code: action.payload,
        number: state.number + 1
      };
    default:
      return state;
  }
};
