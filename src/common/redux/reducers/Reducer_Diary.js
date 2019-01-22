import types from "../actions/Types_Diary";

const dateForDiary = {
  startDate: null,
  endDate: null
};
export default (state = dateForDiary, action) => {
  switch (action.type) {
    case types.SET_DATE_FOR_DIARY:
      return {
        ...state,
        endDate: action.payload.endDate,
        startDate: action.payload.startDate
      };
    default:
      return state;
  }
};
