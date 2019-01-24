import types from "../actions/Types_Exercise";

//운동목표선택데이터 DB랑 동일한 값 유지한다.
const exerciseGoalCd = [];
//운동요일은 코드값을 사용하지 않는다. 0,1,2,3,4,5,6(일월화수목금토)
const exerciseDay = [
  { idx: 1, name: "월" },
  { idx: 2, name: "화" },
  { idx: 3, name: "수" },
  { idx: 4, name: "목" },
  { idx: 5, name: "금" },
  { idx: 6, name: "토" },
  { idx: 0, name: "일" }
];
//운동범위데이터 DB랑 동일한 값 유지한다.
const exerciseRange = [];
const exerciseInfo = [
  {
    id: 11001,
    exerciseRangeCd: 11001,
    exerciseNm: "체스트 프레스",
    exerciseInfoId: 1,
    exerciseVideo: "",
    useYn: "Y",
    cardioYn: "N"
  },
  {
    id: 11001,
    exerciseRangeCd: 11001,
    exerciseNm: "바벨 벤치프레스",
    exerciseInfoId: 2,
    exerciseVideo: "",
    useYn: "Y",
    cardioYn: "N"
  },
  {
    id: 11001,
    exerciseRangeCd: 11001,
    exerciseNm: "벤치 프레스",
    exerciseInfoId: 3,
    exerciseVideo: "",
    useYn: "Y",
    cardioYn: "N"
  },
  {
    id: 11001,
    exerciseRangeCd: 11001,
    exerciseNm: "덤벨 인클라인 프레스",
    exerciseInfoId: 4,
    exerciseVideo: "",
    useYn: "Y",
    cardioYn: "N"
  },
  {
    id: 11001,
    exerciseRangeCd: 11001,
    exerciseNm: "덤벨 인클라인 플라이",
    exerciseInfoId: 5,
    exerciseVideo: "",
    useYn: "Y",
    cardioYn: "N"
  },
  {
    id: 11001,
    exerciseRangeCd: 11001,
    exerciseNm: "딥스",
    exerciseInfoId: 6,
    exerciseVideo: "",
    useYn: "Y",
    cardioYn: "N"
  },
  {
    id: 11001,
    exerciseRangeCd: 11001,
    exerciseNm: "펙덱 플라이",
    exerciseInfoId: 7,
    exerciseVideo: "",
    useYn: "Y",
    cardioYn: "N"
  },
  {
    id: 11001,
    exerciseRangeCd: 11001,
    exerciseNm: "케이블 크로스 오버",
    exerciseInfoId: 8,
    exerciseVideo: "",
    useYn: "Y",
    cardioYn: "N"
  },
  {
    id: 11002,
    exerciseRangeCd: 11002,
    exerciseNm: "밴트 오버 바벨 로우",
    exerciseInfoId: 9,
    exerciseVideo: "",
    useYn: "Y",
    cardioYn: "N"
  },
  {
    id: 11002,
    exerciseRangeCd: 11002,
    exerciseNm: "풀업",
    exerciseInfoId: 10,
    exerciseVideo: "",
    useYn: "Y",
    cardioYn: "N"
  },
  {
    id: 11002,
    exerciseRangeCd: 11002,
    exerciseNm: "비하인드 넥 랫 풀다운",
    exerciseInfoId: 11,
    exerciseVideo: "",
    useYn: "Y",
    cardioYn: "N"
  },
  {
    id: 11002,
    exerciseRangeCd: 11001,
    exerciseNm: "원 암 덤벨 로우",
    exerciseInfoId: 12,
    exerciseVideo: "",
    useYn: "Y",
    cardioYn: "N"
  },
  {
    id: 11002,
    exerciseRangeCd: 11002,
    exerciseNm: "케이블 스트레이트 바 풀 오버",
    exerciseInfoId: 13,
    exerciseVideo: "",
    useYn: "Y",
    cardioYn: "N"
  },
  {
    id: 11003,
    exerciseRangeCd: 11003,
    exerciseNm: "바벨컬",
    exerciseInfoId: 14,
    exerciseVideo: "",
    useYn: "Y",
    cardioYn: "N"
  },
  {
    id: 11003,
    exerciseRangeCd: 11003,
    exerciseNm: "프리쳐컬",
    exerciseInfoId: 15,
    exerciseVideo: "",
    useYn: "Y",
    cardioYn: "N"
  },
  {
    id: 11003,
    exerciseRangeCd: 11003,
    exerciseNm: "덤벨컬",
    exerciseInfoId: 16,
    exerciseVideo: "",
    useYn: "Y",
    cardioYn: "N"
  },
  {
    id: 11003,
    exerciseRangeCd: 11003,
    exerciseNm: "해머컬",
    exerciseInfoId: 17,
    exerciseVideo: "",
    useYn: "Y",
    cardioYn: "N"
  }
];
const wiseSaying = [
  {
    idx: 1,
    text:
      "길은 24시간 열려있다. 나가서 뛰어라"
  },
  {
    idx: 2,
    text:
      "여우처럼 보이려면, 돼지처럼 땀 흘려라"
  },
  {
    idx: 3,
    text:
      "원하는 몸을 만들기 위해 지금의 몸을 부수자"
  },
  {
    idx: 4,
    text:
      "승리는 가장 끈기있는 자에게 돌아간다"
  },
  {
    idx: 5,
    text:
      "맛있게 먹으면 0칼로리"
  }
];
const continousExerciseDays = null;
const bmiPer = null;
export default (
  state = {
    exerciseGoalCd,
    exerciseDay,
    exerciseRange,
    wiseSaying,
    exerciseInfo
  },
  action
) => {
  switch (action.type) {
    case types.SET_EXERCISE_RANGE:
      return {
        ...state,
        exerciseRange: action.payload
      };
      case types.SET_EXERCISE_GOAL:
        return {
          ...state,
          exerciseGoalCd: action.payload
        };
    default:
      return state;
  }
};
