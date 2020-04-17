import React, { useEffect, useCallback } from "react"
import { Layout, Row, Col, Button, Alert, Card } from "antd"
import styled from "styled-components"
import { useSelector, useDispatch } from "react-redux"

import {
  NEU_SQUARE,
  ME_SQUARE,
  COM_SQUARE,
  COM_TURN,
  Square,
  CLICK_SQUARE_REQUEST,
  CLICK_COM_SQUARE_REQUEST,
  COM_START,
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
    dispatch({ type: CLICK_COM_SQUARE_REQUEST, map, candidate })
  }
  const comStart = () => {
    dispatch({ type: COM_START })
  }
  useEffect(() => {
    console.log("main__ candidate => ", candidate)
    console.log("main__ score => ", score)
    if (status === "end ") {
      alert("게임 종료!")
    }
    // console.log(turn)
  }, [candidate, status, score, turn, dispatch, map])

  const onClose = (e) => {
    console.log(e, "alert창 꺼짐")
  }

  return (
    <>
      <Card
        style={{ fontSize: "1rem", width: 150, position: "absolute", top: "40%", right: "10%" }}
      >
        <p style={{ color: "#4cd137" }}>● - 사용자</p>
        <p></p>
        <p style={{ color: "#e84118" }}>● - 컴퓨터</p>
      </Card>
      <Alert
        message='후공 -> 아래 버튼 클릭 후 시작___'
        description='(선공은 그냥 시작하시면 됩니다.)'
        type='info'
        closable
        onClose={onClose}
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "1.5rem",
          zIndex: 1,
        }}
        banner={true}
      />
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
        <div style={{ display: "inline-block" }}>
          <Button onClick={comStart} style={{ margin: "12px 12px" }}>
            컴퓨터 먼저 시작!
          </Button>
          <Button onClick={comDo} style={{ margin: "12px 12px" }}>
            서파고의 신의 한 수
          </Button>
        </div>
      </Layout.Content>
    </>
  )
}

export default GameFeild
