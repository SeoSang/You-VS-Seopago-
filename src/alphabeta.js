import { Square, NEU_SQUARE, ME_TURN, COM_TURN } from "./reducers/5mokReducer"
import { updateCandidate, getTotalScore, decryptCandidate } from "./squares"

export const MinMax_Decision = (map, candidate, turn, limitDepth) => {
  let min = Infinity
  const candArr = [...candidate].map(decryptCandidate)
  const BestDecision = {
    row: 0,
    column: 0,
  }
  candArr.map((cand) => {
    const { i, j } = cand
    if (map[i][j].state === NEU_SQUARE) {
      // 둘 수 있는 곳인지
      const alpha = Math.log(0)
      const beta = Infinity
      const square = new Square(turn, 0, { row: i, column: j })
      const emptySquare = new Square(NEU_SQUARE, 0, { row: i, column: j })
      const newScore = getTotalScore(map, turn, 0, square)
      const nextTurn = turn === ME_TURN ? COM_TURN : ME_TURN
      map[i][j] = square
      const newCandidate = updateCandidate(candidate, square)
      const v = Max_Value(map, newCandidate, nextTurn, 0, limitDepth, alpha, beta, newScore)
      // console.log("MinMax_Decision -> main v", v)
      map[i][j] = emptySquare
      if (v <= min) {
        min = v
        BestDecision.row = i
        BestDecision.column = j
      }
    }
    return cand
  })
  return {
    score: min,
    BestDecision,
  }
}

export const Max_Value = (map, candidate, turn, nowDepth, limitDepth, alpha, beta, score) => {
  // console.log("Max_Value 실행됨")
  // console.log("Max_Value 의 nowDepth : ", nowDepth)
  if (nowDepth >= limitDepth) {
    // console.log("Max_Value DEPTH 초과")
    return score
  }
  let v = Math.log(0)
  const candArr = [...candidate].map(decryptCandidate)
  // 후보들에 대해서 실행
  candArr.map((cand) => {
    const { i, j } = cand
    if (map[i][j].state === NEU_SQUARE) {
      // 둘 수 있는 곳인지
      const square = new Square(turn, 0, { row: i, column: j })
      const emptySquare = new Square(NEU_SQUARE, 0, { row: i, column: j })
      const newScore = getTotalScore(map, turn, score, square)
      const nextTurn = turn === ME_TURN ? COM_TURN : ME_TURN
      map[i][j] = square
      const newCandidate = updateCandidate(candidate, square)
      const nextv = Min_Value(
        map,
        newCandidate,
        nextTurn,
        nowDepth + 1,
        limitDepth,
        alpha,
        beta,
        newScore,
      )
      map[i][j] = emptySquare
      // console.log("In Max_Value: nextv => ", nextv)
      v = Math.max(v, nextv)
      if (v >= beta) {
        return v
      }
      alpha = Math.max(alpha, v)
    }
    return cand
  })
  return v
}

export const Min_Value = (map, candidate, turn, nowDepth, limitDepth, alpha, beta, score) => {
  // console.log("MIN_Value 실행됨")
  // console.log("Min_Value 의 nowDepth : ", nowDepth)
  if (nowDepth >= limitDepth) {
    // console.log("MIN_Value Depth초과")
    return score
  }
  let v = Infinity
  const candArr = [...candidate].map(decryptCandidate)
  candArr.map((cand) => {
    const { i, j } = cand
    if (map[i][j].state === NEU_SQUARE) {
      // 둘 수 있는 곳인지

      const emptySquare = new Square(NEU_SQUARE, 0, { row: i, column: j })
      const square = new Square(turn, 0, { row: i, column: j })
      const newScore = getTotalScore(map, turn, score, square)
      const nextTurn = turn === ME_TURN ? COM_TURN : ME_TURN
      map[i][j] = square
      const newCandidate = updateCandidate(candidate, square)
      const nextv = Max_Value(
        map,
        newCandidate,
        nextTurn,
        nowDepth + 1,
        limitDepth,
        alpha,
        beta,
        newScore,
      )
      map[i][j] = emptySquare
      // console.log("In Min_Value: nextv => ", nextv)
      v = Math.min(v, nextv)
      if (v <= alpha) {
        return v
      }
      beta = Math.min(beta, v)
    }
    return cand
  })
  return v
}

// const iterDeepSearch = (map) => {
//   let res = Infinity
//   for (let depth = 0; depth < 5; depth++) {
//     res = Math.min(alphabeta(), res)
//   }
// }
