const APIS = {
  GET_CODE: {
    url: '/code',
    method: 'GET',
  },
  GET_CODE_CATEGORY: {
    url: '/code_category',
    method: 'GET',
  },
  GET_USER: {
    url: '/user',
    method: 'GET',
  },
  GET_USER_BY_EMAIL: {
    url: '/user/email',
    method: 'GET',
  },
  PUT_USER_BY_PHONE: {
    url: '/user/phone',
    method: 'PUT',
  },
  PUT_USER_BY_EMAIL: {
    url: '/user/email',
    method: 'PUT',
  },
  PUT_USER: {
    url: '/user',
    method: 'PUT',
  },
  POST_USER: {
    url: '/user',
    method: 'POST',
  },
  GET_GYM: {
    url: '/gym',
    method: 'GET',
  },
  GET_USER_EXERCISE_COURSE: {
    url: '/user/exercise_course', //실제 url
    //url: "/exercise_course", //test
    method: 'GET',
  },
  GET_USER_CONTINUOUS_EXERCISE_DAYS: {
    //url: "/continuous_exercise_days",
    url: '/user/continuous_exercise_days', //실제 url
    method: 'GET',
  },
  GET_USER_STATISTICS: {
    //url: "/statistics",
    url: '/user/body_stat', //실제 url
    method: 'GET',
  },
  PUT_USER_EXERCISE_SUCCESS_UPDATE: {
    url: '/user/exercise_course', //실제 url
    //url: "/exercise_course", //test
    method: 'PUT',
  },
  //운동범위 해당하는 운동가져오기
  GET_EXERCISE_INFO: {
    url: '/exercise_info', //test
    method: 'GET',
  },
  GET_USER_EXERCISE_COURSE_SAVED: {
    url: "/exercise_course/user", //실제 url
    //url: "/user_exercise_course", //test
    method: 'GET',
  },
  GET_EXERCISE_INFO_CHEST: {
    url: '/user/exercise_course_saved', //실제 url
    //url: "/exercise_info_chest", //test
    method: 'GET',
  },
  GET_EXERCISE_INFO_SHOULDER: {
    //url: "/user/exercise_course_saved", //실제 url
    url: '/exercise_info_shoulder', //test
    method: 'GET',
  },
  GET_EXERCISE_INFO_ARM: {
    url: '/user/exercise_course_saved', //실제 url
    //url: "/exercise_info_arm", //test
    method: 'GET',
  },
  GET_EXERCISE_COURSE_DETAIL: {
    url: '/exercise_course/detail/', //실제 url
    //url: "posts",
    method: 'GET',
  },
  GET_EXERCISE_COURSE_DETAIL: {
    //url: "/exercise_course/detail/" //실제 url
    url: "posts",
    method: "GET"
  },
  POST_USER_FOOD: {
    url: "/userFood",
    method: "POST"
  },
  POST_USER_INBODY: {
    url: "/user/inbody",
    method: "POST"
  },
  POST_USER_HEALTH: {
    url: "/user/health",
    method: "POST"
  },
  GET_USER_FOOD: {
    url: "/userFood/user",
    method: "GET"
  },  
  GET_USER_HEALTH: {
    url: '/user/health/', //실제 url
    //url: '/user/health/{userId}/{startDt}/{endDt}', //실제 url
    //url: "posts",
    method: 'GET',
  }
};

export default APIS;
