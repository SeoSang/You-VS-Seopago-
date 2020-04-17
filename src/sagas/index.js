import {
  CLICK_SQUARE_REQUEST,
  UPDATE_CANDIDATE,
  CLICK_SQUARE_SUCCESS,
  Square,
  COM_SQUARE,
} from "../reducers/5mokReducer"
import { call, all, fork, takeLatest, put, select } from "redux-saga/effects"
import { MinMax_Decision } from "../alphabeta"
import * as selectors from "../selector"

function* disposeMySquare(action) {
  yield put({
    type: CLICK_SQUARE_SUCCESS,
    data: action.data,
  })
  yield put({
    type: UPDATE_CANDIDATE,
    data: action.data,
  })
  const state = yield select()
  const { candidate, map, turn } = state.Omok
  yield call(disoposeComSquare, map, turn, candidate)
}

function* disoposeComSquare(map, turn, candidate) {
  const ComResult = yield MinMax_Decision(map, candidate, turn, 3)
  const { score, BestDecision } = ComResult
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
export default function* sagas() {
  yield all([fork(watchClickSquare)])
}
