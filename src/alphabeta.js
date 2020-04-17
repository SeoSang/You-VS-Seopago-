import { Square, NEU_SQUARE, ME_TURN, COM_TURN } from "./reducers/5mokReducer"
import { updateCandidate, getTotalScore, decryptCandidate, getNears } from "./squares"

export const Alpha_Beta_Search = (map, candidate, turn, limitDepth) => {
  let min = Infinity
  const BestDecision = {
    row: 0,
    column: 0,
  }
  const originalCand = new Set(candidate)
  const candArr = [...candidate].map(decryptCandidate)
  candArr.some((cand) => {
    const { i, j } = cand
    if (map[i][j].state === NEU_SQUARE) {
      // 둘 수 있는 곳인지
      const alpha = Math.log(0)
      const beta = Infinity
      const square = new Square(turn, 0, { row: i, column: j })
      const emptySquare = new Square(NEU_SQUARE, 0, { row: i, column: j })
      const newScore = getTotalScore(map, turn, 0, square)
      //

      const nextTurn = turn === ME_TURN ? COM_TURN : ME_TURN
      map[i][j] = square
      const newCandidate = updateCandidate(originalCand, square)
      const orgNears = getNears(square)
      const v = Max_Value(map, newCandidate, nextTurn, 0, limitDepth, alpha, beta, newScore)
      if (orgNears) {
        orgNears.forEach((x) => {
          newCandidate.delete(x)
        })
      }
      map[i][j] = emptySquare
      if (v <= min) {
        min = v
        BestDecision.row = i
        BestDecision.column = j
      }
      if (v <= -10000000) return true
    }
  })
  return {
    score: min,
    BestDecision,
  }
}

export const Max_Value = (map, candidate, turn, nowDepth, limitDepth, alpha, beta, score) => {
  // console.log("Max_Value 실행됨")
  // console.log("Max_Value 의 nowDepth : ", nowDepth)

  // Depth 검사와 33검사
  if (nowDepth >= limitDepth || score % 10 !== 0) {
    return score
  }
  let v = Math.log(0)
  const originalCand = new Set(candidate)
  const candArr = [...candidate].map(decryptCandidate)
  // 후보들에 대해서 실행
  candArr.some((cand) => {
    const { i, j } = cand
    if (map[i][j].state === NEU_SQUARE) {
      // 둘 수 있는 곳인지
      const square = new Square(turn, 0, { row: i, column: j })
      const emptySquare = new Square(NEU_SQUARE, 0, { row: i, column: j })
      const newScore = getTotalScore(map, turn, score, square)
      const nextTurn = turn === ME_TURN ? COM_TURN : ME_TURN
      map[i][j] = square
      const orgNears = getNears(square)
      const newCandidate = updateCandidate(originalCand, square)
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
      if (orgNears) {
        orgNears.forEach((x) => {
          newCandidate.delete(x)
        })
      }
      // 33 수는 건너뛰기
      if (nextv % 10 !== 0) {
        return false
      }
      // console.log("In Max_Value: nextv => ", nextv)
      v = Math.max(v, nextv)
      if (v >= 10000000 || v >= beta) return true
      alpha = Math.max(alpha, v)
    }
  })

  return v
}

export const Min_Value = (map, candidate, turn, nowDepth, limitDepth, alpha, beta, score) => {
  // console.log("MIN_Value 실행됨")
  // console.log("Min_Value 의 nowDepth : ", nowDepth)
  // console.log("MIN_Value Depth초과")
  if (nowDepth >= limitDepth || score % 10 !== 0) {
    return score
  }
  let v = Infinity
  const candArr = [...candidate].map(decryptCandidate)
  const originalCand = new Set(candidate)
  candArr.some((cand) => {
    const { i, j } = cand
    if (map[i][j].state === NEU_SQUARE) {
      // 둘 수 있는 곳인지
      const emptySquare = new Square(NEU_SQUARE, 0, { row: i, column: j })
      const square = new Square(turn, 0, { row: i, column: j })
      const newScore = getTotalScore(map, turn, score, square)
      const nextTurn = turn === ME_TURN ? COM_TURN : ME_TURN
      map[i][j] = square
      const orgNears = getNears(square)
      const newCandidate = updateCandidate(originalCand, square)
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
      if (orgNears) {
        orgNears.forEach((x) => {
          newCandidate.delete(x)
        })
      }
      // console.log("In Min_Value: nextv => ", nextv)
      // 33 수는 건너뛰기
      if (nextv % 10 !== 0) {
        return false
      }
      v = Math.min(v, nextv)
      if (v <= alpha || v <= -10000000) {
        return true
      }
      beta = Math.min(beta, v)
    }
  })
  return v
}

// const iterDeepSearch = (map) => {
//   let res = Infinity
//   for (let depth = 0; depth < 5; depth++) {
//     res = Math.min(alphabeta(), res)
//   }
// }
