import { combineReducers } from "redux";
import DiaryReducer from "./Reducer_Diary";
import UserReducer from "./Reducer_User";
import ExerciseReducer from "./Reducer_Exercise";
import CodeReducer from "./Reducer_Code";
import ConstantsReducer from "./Reducer_Constants";

export default combineReducers({
  REDUCER_CONSTANTS: ConstantsReducer,
  REDUCER_DIARY: DiaryReducer,
  REDUCER_USER: UserReducer,
  REDUCER_EXERCISE: ExerciseReducer,
  REDUCER_CODE: CodeReducer
});
