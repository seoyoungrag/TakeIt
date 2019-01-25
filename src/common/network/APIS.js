const APIS = {
  GET_TEST: {
    url: '/photo/test/', //실제 url
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
    uri: "/userFood",
    method: "POST"
  }
};

export default APIS;
