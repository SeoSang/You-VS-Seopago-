import React from "react"
import ReactDOM from "react-dom"
import "antd/dist/antd.css"
import "./index.css"
import Omok from "./Omok"
import { Provider } from "react-redux"
import create from "./store"
const store = create()

const ReduxProvider = ({ children, reduxStore }) => (
  <Provider store={reduxStore}>{children}</Provider>
)

ReactDOM.render(
  <ReduxProvider reduxStore={store}>
    <React.StrictMode>
      <Omok />
    </React.StrictMode>
  </ReduxProvider>,
  document.getElementById("root"),
)
