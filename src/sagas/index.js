import {
  CLICK_SQUARE_REQUEST,
  UPDATE_CANDIDATE,
  CLICK_SQUARE_SUCCESS,
  Square,
  COM_SQUARE,
  CLICK_COM_SQUARE_REQUEST,
  COM_TURN,
} from "../reducers/5mokReducer"
import { call, all, fork, takeLatest, put, select } from "redux-saga/effects"
import { Alpha_Beta_Search, iterDeepSearch } from "../alphabeta"

function* disposeMySquare(action) {
  // 돌이 두어졌을 때
  yield put({
    type: CLICK_SQUARE_SUCCESS,
    data: action.data,
  })
  const state = yield select()
  const { check } = state.Omok
  // 33 발생
  if (check === false) {
    yield alert("33입니다")
    return true
  }
  // Candidate 갱신
  yield put({
    type: UPDATE_CANDIDATE,
    data: action.data,
  })
  const state2 = yield select()
  const { candidate, map } = state2.Omok
  // 내가두면 컴퓨터 두는 Action 실행
  yield call(disposeComSquare, map, candidate)
}

function* doComSquare(action) {
  yield call(disposeComSquare, action.map, action.candidate)
}

function* disposeComSquare(map, candidate) {
  const ComResult = yield Alpha_Beta_Search(map, candidate, COM_TURN, 3)
  // const ComResult = yield iterDeepSearch(map, candidate, 3)
  const { BestDecision } = ComResult
  const square = new Square(COM_SQUARE, 0, { ...BestDecision })
  yield put({
    type: CLICK_SQUARE_SUCCESS,
    data: { square },
  })
  yield put({
    type: UPDATE_CANDIDATE,
    data: { square },
  })
}

function* watchClickSquare() {
  yield takeLatest(CLICK_SQUARE_REQUEST, disposeMySquare)
}
function* watchClickComSquare() {
  yield takeLatest(CLICK_COM_SQUARE_REQUEST, doComSquare)
}
export default function* sagas() {
  yield all([fork(watchClickSquare), fork(watchClickComSquare)])
}
