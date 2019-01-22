import types from "../actions/Types_User";

const user = {};
const fatPer = 0;
const musclePer = 0;
const bmiPer = 0;
const continousExerciseDays = [];
const toDayUserExerciseList = [];
export default (
  state = {
    user,
    fatPer,
    musclePer,
    bmiPer,
    continousExerciseDays,
    toDayUserExerciseList
  },
  action
) => {
  switch (action.type) {
    case types.SET_USER_INFO:
      return {
        //...state 하지 않으면 state나머지 변수들이 초기화된다.
        ...state,
        user: action.payload
      };
    case types.SET_USER_CONTINUOUS_EXERCISE_DAYS:
      return {
        ...state,
        continousExerciseDays: action.payload
      };
    case types.SET_USER_FAT_PER:
      return {
        ...state,
        fatPer: action.payload
      };
    case types.SET_USER_MUSCLE_PER:
      return {
        ...state,
        musclePer: action.payload
      };
    case types.SET_USER_BMI_PER:
      return {
        ...state,
        bmiPer: action.payload
      };
    case types.SET_TODAY_USER_EXERCISE_LIST:
      return {
        ...state,
        toDayUserExerciseList: action.payload
      };
    default:
      return state;
  }
};
