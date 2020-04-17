import {
  Square,
  COM_TURN,
  NEU_SQUARE,
  ME_TURN,
  ME_SQUARE,
  COM_SQUARE,
} from "./reducers/5mokReducer"

const LEFT_DIAG = "LEFT_DIAG"
const RIGHT_DIAG = "RIGHT_DIAG"
const VERTICAL = "VERTICAL"
const HORIZONTAL = "HORIZONTAL"

// 점수 계산하고 판 업데이트
export const updateSquares = (map, turn, score, newSquare) => {
  const {
    location: { row, column },
    state: nowState,
  } = newSquare
  const newScore = getTotalScore(map, turn, score, newSquare)
  if (newScore % 10 !== 0) {
    return {
      newMap_: map,
      status: "playing",
      score: score,
      turn: turn === ME_TURN ? ME_TURN : COM_TURN,
      check: false,
    }
  }
  const newMap = [...map]
  newMap[row][column] = new Square(nowState, 0, { row: row, column: column })

  return {
    newMap_: Object.freeze(newMap),
    status: newScore === Infinity ? "end" : "playing",
    score: newScore,
    turn: turn === ME_TURN ? COM_TURN : ME_TURN,
    check: true,
  }
}

export const getTotalScore = (map, turn, score, newSquare) => {
  const { state: nowState } = newSquare
  const nextState = nowState === ME_SQUARE ? COM_SQUARE : ME_SQUARE // 다음차례 돌

  const countSquare = { ...newSquare, state: nextState }
  // 내가 뒀을 때의 가중치(점수)
  const myScore = getThisScore(map, newSquare, "me")
  // 상대방이 뒀을 때의 가중치(점수)
  const counterScore = getThisScore(map, countSquare, "counter")

  const newScore = myScore + counterScore
  const totalScore = turn === ME_TURN ? score + newScore : score - newScore

  return totalScore
}

// 방금 둔 수의 점수를 반환한다
export const getThisScore = (map, newSquare, who = "me") => {
  const {
    location: { row, column },
    state: nowState,
  } = newSquare

  // 연속되는 돌 정보
  // 0번 인덱스는 개수, 1번 인덱스는 막힌 돌 숫자
  const myNearSequence = {
    LEFT_DIAG: { start: [0, 0], end: [0, 0] },
    RIGHT_DIAG: { start: [0, 0], end: [0, 0] },
    VERTICAL: { start: [0, 0], end: [0, 0] },
    HORIZONTAL: { start: [0, 0], end: [0, 0] },
  }

  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = column - 1; j <= column + 1; j++) {
      if (isValidIndex(i) && isValidIndex(j)) {
        if (i === row && j === column) {
          setBlockedSequence(i, j, myNearSequence, nowState, map)
        } else {
          if (map[i][j].state === nowState) {
            // 같은돌 연달아
            setAllNearSequence(row, column, i, j, myNearSequence, map, nowState)
          }
        }
      }
    }
  }
  const score = getNewScore(myNearSequence, who)

  return score
}

export const isThreeThree = (nearSequence) => {
  let Three = 0
  for (let direction in nearSequence) {
    const seqPerDirection = nearSequence[direction]
    const { start, end } = seqPerDirection
    const sequence = start[0] + end[0]
    const blockedCount = start[1] + end[1]
    if (sequence === 2 && blockedCount === 0) {
      Three += 1
    }
  }
  if (Three >= 2) return true
  return false
}

// 방금 둔 수가 얼마나 좋은지 측정
export const getNewScore = (nearSequence, who) => {
  let Three = 0
  let res = 0
  for (let direction in nearSequence) {
    const seqPerDirection = nearSequence[direction]
    const { start, end } = seqPerDirection
    const sequence = start[0] + end[0]
    const blockedCount = start[1] + end[1]
    if (sequence === 2 && blockedCount === 0) {
      Three += 1
    }
    res += calScore(sequence, blockedCount, who)
  }
  if (Three >= 2) return -10033
  return res
}

export const calScore = (sequence, blockedCount, who) => {
  let resScore = 0
  // ------------------막힌돌 0개------------------
  if (blockedCount === 0) {
    if (who === "me") {
      switch (sequence) {
        case 0: {
          // 연속된거 없을 때
          break
        }
        case 1: {
          // 2개 연속
          resScore += 400
          break
        }
        case 2: {
          resScore += 1000
          break
        }
        case 3: {
          resScore += 10000
          break
        }
        case 4: {
          resScore += 10000000
          break
        }
        default: {
          // 6개 이상 연속일 때 (쓸 데 없는 수)
          resScore -= 1000
          break
        }
      }
    } else {
      // 상대방입장 점수 (막으면서 얻는 점수)
      switch (sequence) {
        case 0: {
          // 연속된거 없을 때
          break
        }
        case 1: {
          // 2개 연속
          resScore += 400
          break
        }
        case 2: {
          resScore += 900
          break
        }
        case 3: {
          resScore += 9500
          break
        }
        case 4: {
          resScore += 9000000
          break
        }
        default: {
          // 6개 이상 연속일 때 (쓸 데 없는 수)
          resScore -= 1000
          break
        }
      }
    }
  }
  // ------------------막힌돌 1개------------------
  else if (blockedCount === 1) {
    if (who === "me") {
      // 막힌돌 0개
      switch (sequence) {
        case 0: {
          // 연속된거 없을 때
          break
        }
        case 1: {
          // 2개 연속
          resScore += 50
          break
        }
        case 2: {
          resScore += 100
          break
        }
        case 3: {
          resScore += 500
          break
        }
        case 4: {
          resScore += 5000000
          break
        }
        default: {
          // 6개 이상 연속일 때 (쓸 데 없는 수)
          resScore -= 2000
          break
        }
      }
    } else {
      // 상대방입장 점수 (막으면서 얻는 점수)
      switch (sequence) {
        case 0: {
          // 연속된거 없을 때
          break
        }
        case 1: {
          // 2개 연속
          resScore += 80
          break
        }
        case 2: {
          resScore += 110
          break
        }
        case 3: {
          resScore += 1100
          break
        }
        case 4: {
          resScore += 5000000
          break
        }
        default: {
          // 6개 이상 연속일 때 (쓸 데 없는 수)
          resScore -= 2000
          break
        }
      }
    }
  }
  // ------------------양쪽 다막힘------------------
  else {
    resScore -= 300
  }

  return resScore
}

// 인덱스 유효한가
export const isValidIndex = (id) => {
  return id >= 0 && id <= 18
}

// 상태 비교
export const isValid_And_isSameState = (map, r, c, state) => {
  return isValidIndex(r) && isValidIndex(c) && map[r][c].state === state
}

// 연속 몇개인지, 막힌돌 몇개인지 세주기
export const setNearSequence = (
  row,
  column,
  x,
  y,
  nearSequence,
  direction, // 방향
  startOrEnd, // start, end
  map,
  nowState,
) => {
  if (nowState === NEU_SQUARE) {
    // 중립돌일때
    return false
  }
  const counterState = nowState === ME_SQUARE ? COM_SQUARE : ME_SQUARE

  let seq = 0
  while (isValid_And_isSameState(map, row, column, nowState)) {
    row += x
    column += y
    seq++
  }
  if (!isValidIndex(row) || !isValidIndex(column)) {
    nearSequence[direction][startOrEnd][1] += 1
  } else if (map[row][column].state === counterState) {
    nearSequence[direction][startOrEnd][1] += 1
  }
  nearSequence[direction][startOrEnd][0] = seq
}

export const setBlockedSequence = (row, column, nearSequence, nowState, map) => {
  const counterState = nowState === ME_SQUARE ? COM_SQUARE : ME_SQUARE
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = column - 1; j <= column + 1; j++) {
      if (i === row && j === column) {
      } else {
        if (isValidIndex(i) && isValidIndex(j) && map[i][j].state === counterState) {
          if (i === row - 1 && j === column - 1) {
            nearSequence[LEFT_DIAG]["start"][1] += 1
          } else if (i === row + 1 && j === column + 1) {
            nearSequence[LEFT_DIAG]["end"][1] += 1
          } else if (i === row - 1 && j === column + 1) {
            nearSequence[RIGHT_DIAG]["start"][1] += 1
          } else if (i === row + 1 && j === column - 1) {
            nearSequence[RIGHT_DIAG]["end"][1] += 1
          } else if (i === row - 1 && j === column) {
            nearSequence[VERTICAL]["start"][1] += 1
          } else if (i === row + 1 && j === column) {
            nearSequence[VERTICAL]["end"][1] += 1
          } else if (i === row && j === column - 1) {
            nearSequence[HORIZONTAL]["start"][1] += 1
          } else if (i === row && j === column + 1) {
            nearSequence[HORIZONTAL]["end"][1] += 1
          }
        }
      }
    }
  }
}

// 근처돌 이용해서 점수 일괄 계산
export const setAllNearSequence = (row, column, i, j, sequence, map, state) => {
  if ((i === row - 1 && j === column - 1) || (i === row + 1 && j === column + 1)) {
    // 1. '\' 방향
    if (i === row - 1 && j === column - 1) {
      // 왼쪽 위 칸
      setNearSequence(i, j, -1, -1, sequence, LEFT_DIAG, "start", map, state)
    } else {
      // 오른쪽 아래 칸
      setNearSequence(i, j, +1, +1, sequence, LEFT_DIAG, "end", map, state)
    }
  } else if ((i === row - 1 && j === column + 1) || (i === row + 1 && j === column - 1)) {
    // 2. '/' 방향
    if (i === row - 1 && j === column + 1) {
      setNearSequence(i, j, -1, +1, sequence, RIGHT_DIAG, "start", map, state)
    } else {
      setNearSequence(i, j, +1, -1, sequence, RIGHT_DIAG, "end", map, state)
    }
  } else if ((i === row - 1 && j === column) || (i === row + 1 && j === column)) {
    // 3. '-' 방향
    if (i === row - 1 && j === column) {
      setNearSequence(i, j, -1, 0, sequence, HORIZONTAL, "start", map, state)
    } else {
      setNearSequence(i, j, +1, 0, sequence, HORIZONTAL, "end", map, state)
    }
  } else if ((i === row && j === column - 1) || (i === row && j === column + 1)) {
    // 4. '|' 방향
    if (i === row && j === column - 1) {
      setNearSequence(i, j, 0, -1, sequence, VERTICAL, "start", map, state)
    } else {
      setNearSequence(i, j, 0, +1, sequence, VERTICAL, "end", map, state)
    }
  }
}

// 게임 끝났는지 확인
export const isEndGame = (nearSequence) => {
  for (let direction in nearSequence) {
    const { start, end } = nearSequence[direction]
    if (start[0] + end[0] === 4) {
      return true
    }
  }
  return false
}

// 현재 최고 좋은 square
export const getMaxScoreSquare = (map) => {
  let maxScore = 0
  let maxScoreSquare = new Square(NEU_SQUARE, 0, { row: 0, column: 0 })
  for (let x = 0; x < 19; x++) {
    for (let y = 0; y < 19; y++) {
      if (map[x][y].state === NEU_SQUARE && map[x][y].score > maxScore) {
        maxScore = map[x][y].score
        maxScoreSquare = map[x][y]
      }
    }
  }
  return maxScoreSquare
}

export const getMaxConnection = (nearSequence) => {
  let maxConnection = 0
  for (let direction in nearSequence) {
    const sequence = nearSequence[direction]
    const { start, end } = sequence
    const connectionCount = 1 + start[0] + end[0]
    if (maxConnection < connectionCount) {
      maxConnection = connectionCount
    }
  }
  return maxConnection
}

export const isEmptySquare = (Square) => {
  return Square.state === NEU_SQUARE
}

// 현재까지 둔곳의 위 아래로 1 까지만 확인할 것이다.

export const updateCandidate = (candidate, square) => {
  const { row, column } = square.location
  for (let i = Math.max(row - 1, 0); i <= Math.min(row + 1, 18); i++) {
    for (let j = Math.max(column - 1, 0); j <= Math.min(column + 1, 18); j++) {
      if (i === row && j === column) {
        candidate.delete(i * 100 + j)
      } else {
        candidate.add(i * 100 + j)
      }
    }
  }
  return candidate
}

// 특정 돌의 주변 놈들을 Array 형태로 반환.
export const getNears = (square) => {
  const { row, column } = square.location
  const nears = new Set()
  for (let i = Math.max(row - 1, 0); i <= Math.min(row + 1, 18); i++) {
    for (let j = Math.max(column - 1, 0); j <= Math.min(column + 1, 18); j++) {
      if (i === row && j === column) {
      } else {
        nears.add(i * 100 + j)
      }
    }
  }
  return Array.from(nears)
}

// Candidate 를 다시 i, j 형태로 해독한다.
export const decryptCandidate = (n) => {
  const j = n % 100
  const i = (n - j) / 100
  return { i, j }
}
