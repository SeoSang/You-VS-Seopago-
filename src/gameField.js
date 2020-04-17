import React, { useEffect, useCallback } from "react"
import { Layout, Row, Col, Button } from "antd"
import styled from "styled-components"
import { useSelector, useDispatch } from "react-redux"

import {
  NEU_SQUARE,
  ME_SQUARE,
  COM_SQUARE,
  COM_TURN,
  Square,
  CLICK_SQUARE_REQUEST,
} from "./reducers/5mokReducer"
import { Alpha_Beta_Search } from "./alphabeta"

const SquareDivWrapper = styled(Col)`
  background: transparent;
  border: 0;
`

const SquareDiv = styled.div`
  height: 20px;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 1px 1px 1px 1px gray;
`

const PropsBox = styled.div((props) => ({
  background: props.background,
  height: "50px",
  width: "50px",
}))

const EmptySquare = styled(SquareDiv)`
  background: #e6e6e3;
  text-align: center;
  : hover {
    background-color: #c1c1b7;
  }
`
const MySquare = styled(SquareDiv)`
  background: #4cd137;
  text-align: center;
  : hover {
    background-color: #44bd32;
  }
`
const ComSquare = styled(SquareDiv)`
  background: #e84118;
  text-align: center;
  : hover {
    background-color: #c23616;
  }
`

const GameFeild = () => {
  const { map, status, candidate, score, turn } = useSelector((state) => state.Omok)
  const dispatch = useDispatch()

  const onClickEmptySquare = (square) => {
    if (status === "playing") {
      dispatch({ type: CLICK_SQUARE_REQUEST, data: { square } })
    }
  }
  const comDo = () => {
    if (turn === COM_TURN) {
      const ComResult = Alpha_Beta_Search(map, candidate, turn, 2)
      const { score, BestDecision, newCandidate } = ComResult
      const square = new Square(COM_SQUARE, 0, { ...BestDecision })
      dispatch({ type: CLICK_SQUARE_REQUEST, data: { square }, candidate: { newCandidate } })
    }
  }
  useEffect(() => {
    console.log("main__ candidate => ", candidate)
    console.log(status)
    console.log("main__ score => ", score)
    // console.log(turn)
  }, [candidate, status, score, turn, dispatch, map])
  return (
    <>
      <Layout.Content style={{ textAlign: "center", margin: "auto" }}>
        <div
          style={{
            paddingTop: 30,
            height: "90%",
            paddingLeft: 15,
            paddingRight: 15,
            maxWidth: 800,
            margin: "auto",
          }}
        >
          {map.map((squareArr, rowI) => (
            <Row type='flex' align='middle' gutter={[8, 8]} key={rowI}>
              {squareArr.map((square, colI) => {
                return (
                  <SquareDivWrapper span={1} key={`${rowI}-${colI}`} square={square}>
                    {square.state === NEU_SQUARE && (
                      <EmptySquare
                        onClick={() => {
                          onClickEmptySquare(square)
                        }}
                      ></EmptySquare>
                    )}
                    {square.state === ME_SQUARE && <MySquare />}
                    {square.state === COM_SQUARE && <ComSquare />}
                  </SquareDivWrapper>
                )
              })}
            </Row>
          ))}
        </div>
        <Button onClick={comDo} style={{ marginTop: "10px" }}>
          서파고의 신의 한 수
        </Button>
      </Layout.Content>
    </>
  )
}

export default GameFeild
