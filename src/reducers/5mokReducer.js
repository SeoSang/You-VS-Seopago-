import { updateSquares, updateCandidate } from "../squares"
// 누구 돌인지 구분
export const ME_SQUARE = 1
export const COM_SQUARE = -1
export const NEU_SQUARE = 0

// 차례 구분
export const ME_TURN = 1
export const COM_TURN = -1
export const NO_TURN = 0

export const INIT_CANDIDATE = new Set()

// 돌 클래스
export class Square {
  constructor(state, score, location) {
    this.state = state
    this.score = score
    this.location = location
  }
}
export const initMap = Array(19)
  .fill(null)
  .map((v, row) =>
    Array(19)
      .fill(null)
      .map((v2, column) => {
        const sq = new Square(NEU_SQUARE, 0, { row: row, column: column })
        return sq
      }),
  )

const initialState = {
  map: initMap,
  turn: ME_TURN,
  status: "playing",
  candidate: INIT_CANDIDATE,
  maxConnection: 0,
  score: 0,
}

export const CLICK_SQUARE_SUCCESS = "CLICK_SQUARE_SUCCESS"
export const CLICK_SQUARE_REQUEST = "CLICK_SQUARE_REQUEST"
export const UPDATE_CANDIDATE = "UPDATE_CANDIDATE"
export const UPDATE_NOW_SCORE = "UPDATE_NOW_SCORE"
export const COM_DO = "COM_DO"

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CLICK_SQUARE_REQUEST: {
      return {
        ...state,
      }
    }
    case CLICK_SQUARE_SUCCESS: {
      const square = action.data.square
      const newSquare = new Square(state.turn, 0, {
        row: square.location.row,
        column: square.location.column,
      })
      const newMap = updateSquares(state.map, state.turn, state.score, newSquare)
      return {
        ...state,
        map: newMap.newMap_,
        turn: newMap.turn,
        status: newMap.status,
        score: newMap.score,
      }
    }
    case UPDATE_CANDIDATE: {
      const newCandidate = updateCandidate(state.candidate, action.data.square)
      console.log(newCandidate)
      return {
        ...state,
        candidate: newCandidate,
      }
    }
    case UPDATE_NOW_SCORE: {
      const newScore = action.data.score
      return {
        ...state,
        score: newScore,
      }
    }
    // case COM_DO: {
    //   const
    // }
    default:
      return { ...state }
  }
}

export default reducer
