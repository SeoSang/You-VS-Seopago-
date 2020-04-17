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
import { Alpha_Beta_Search } from "../alphabeta"

function* disposeMySquare(action) {
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
  yield put({
    type: UPDATE_CANDIDATE,
    data: action.data,
  })
  const state2 = yield select()
  const { candidate, map } = state2.Omok
  console.log("function*disposeMySquare -> candidate", candidate)
  yield call(disoposeComSquare, map, candidate)
}

function* doComSquare(action) {
  yield console.log(action)
  yield call(disoposeComSquare, action.map, action.candidate)
}

function* disoposeComSquare(map, candidate) {
  const ComResult = yield Alpha_Beta_Search(map, candidate, COM_TURN, 4)
  const { BestDecision } = ComResult
  const square = new Square(COM_SQUARE, 0, { ...BestDecision })
  yield console.log(square)
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
