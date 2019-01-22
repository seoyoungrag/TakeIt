import diaryTypes from "./Types_Diary";
import userTypes from "./Types_User";
import exerciseTypes from "./Types_Exercise";
import codeTypes from "./Types_Code";

export function setCode(date) {
  return {
    type: codeTypes.SET_CODE,
    payload: date
  };
}

export function setCodeCategory(date) {
  return {
    type: codeTypes.SET_CODE_CATEGORY,
    payload: date
  };
}

export function setDiaryDate(date) {
  return {
    type: diaryTypes.SET_DATE_FOR_DIARY,
    payload: date
  };
}

export function setUserInfo(data) {
  return {
    type: userTypes.SET_USER_INFO,
    payload: data
  };
}

export function setUserContinuousExerciseDays(data) {
  return {
    type: userTypes.SET_USER_CONTINUOUS_EXERCISE_DAYS,
    payload: data
  };
}

export function setUserFatPer(data) {
  return {
    type: userTypes.SET_USER_FAT_PER,
    payload: data
  };
}
export function setUserMusclePer(data) {
  return {
    type: userTypes.SET_USER_MUSCLE_PER,
    payload: data
  };
}
export function setUserBmiPer(data) {
  return {
    type: userTypes.SET_USER_BMI_PER,
    payload: data
  };
}

export function setExerciseInfo(data) {
  return {
    type: exerciseTypes.SET_EXERCISE_RANGE,
    payload: data
  };
}

export function setTodayExerciseList(data) {
  return {
    type: userTypes.SET_TODAY_USER_EXERCISE_LIST,
    payload: data
  };
}

export function setExerciseGoal(data) {
  return {
    type: exerciseTypes.SET_EXERCISE_GOAL,
    payload: data
  };
}