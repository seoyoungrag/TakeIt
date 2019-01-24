//const HOST = "http://13.125.161.158:8080/fitDiary";
//const HOST = "http://192.168.0.3:8080/fitDiary";
//const HOST = "http://14.63.106.109:48080/fitdiaryAppBackend";
//const HOST = "http://172.30.1.25:8080";
const HOST = "http://218.147.200.173:18080";
const headers = new Headers({
  "x-requested-with": "XMLHttpRequest",
  accept: "application/json; charset=utf-8",
  "Content-Type": "application/json; charset=utf-8",
  mode: "same-origin",
  credentials: "same-origin",
  "Content-Type": 'application/json'
});

const timeoutms = 30000;
function timeout(ms, promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject({
        type: "requestTimeout",
        status: "timeout",
        message: "서버 요청 시간을 " + timeoutms / 1000 + "초를 초과했습니다."
      });
    }, ms);
    promise.then(resolve, reject);
  });
}

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}
const cFetch = async (API, params, body, fncs) => {
  let url = API.url;
  let method = API.method;
  for (var i in params) {
    url += "/" + params[i];
  }
  console.log(method + " " + HOST + url + " " + JSON.stringify(body));
  //const response = await timeout(
    //timeoutms,
    const response = await fetch(`${HOST}` + url, {
      method: method,
      headers: headers,
      body: method != "GET" && body != undefined ? body : undefined})
    //}));
    const res = await response.json();
      //response의 ok가 true이고, status가 200인지 체크
      //.then(res => {
        // console.log("responseCheck");
        if (fncs.responseCheck == undefined) {
          if (!response.ok) {
            //throw Error(e); //throw Error대신 throw Object
            if (fncs.responseNotFound == undefined) {
              throw {
                type: "responseCheckError",
                status: res.status,
                message: res.statusText
              };
            } else {
              await fncs.responseNotFound(res);
            }
          } else {
            //return res;
          }
        } else {
          //await fncs.responseCheck(res);
        }
      //})
      //response의 데이터 code가 200인지 체크
      //.then(res => {
        // console.log("responseProc");
        // console.log(res);
        //앞에서는 request가 백엔드서버가기전까지 체크, 지금은 requeset가 백엔드 서버에 도착.  : code, message가 있음.
        if (res.code != undefined && res.message != undefined) {
          if (res.code == 200) {
            if (fncs.responseProc) {
              let ret = res.data;
              if (ret && ret.list) {
                ret = ret.list;
              }
              console.log(JSON.stringify(ret));
              await fncs.responseProc(ret);
            } else {
              return res;
            }
          } else {
            if (fncs.responseNotFound) {
              await fncs.responseNotFound(res);
            } else {
              throw {
                type: "responseProcError",
                status: res.code,
                message: res.message
              };
            }
          }
        } else {
          if (fncs.responseProc && !isEmpty(res)) {
            await fncs.responseProc(res);
          }
        }
      //)
      /*
      .catch(e => {
        if (fncs.responseError == undefined) {
          // console.log(e);
          let message = "에러가 발생했습니다.";
          message += e.type ? "\nTYPE: " + e.type : "";
          message += e.status ? "\nCODE: " + e.status : "";
          message += e.message ? "\nMESSAGE: " + e.message : "";
          message += e.name ? "\nNAME: " + e.name : "";
          alert(message);
        } else {
          return fncs.responseError(e);
        }
      })
      */
  //);
};
export default cFetch;
