const APIS = {
  GET_USER_FOOD_PHOTO: {
    url: '/photo/food/', //실제 url
    //url: '/user/health/{userId}/{startDt}/{endDt}', //실제 url
    //url: "posts",
    method: 'GET',
  },
  GET_CODE: {
    url: '/code',
    method: 'GET',
  },
  GET_USER_BY_EMAIL: {
    url: '/user/email',
    method: 'GET',
  },
  PUT_USER_BY_EMAIL: {
    url: '/user/email',
    method: 'PUT',
  },
  POST_USER_FOOD: {
    url: "/photo/food",
    method: "POST"
  },
  POST_USER_INBODY: {
    url: "/photo/inbody",
    method: "POST"
  },
  GET_USER_FOOD: {
    url: "/photo/food/user",
    method: "GET"
  },
  GET_MAIN_INTAKESTATUS: {
    url: "/main/intakeStatus",
    method: "GET"
  }
};

export default APIS;
