import { createStore, applyMiddleware, compose } from "redux"
import createSagaMiddleware from "redux-saga"
import rootReducer from "./reducers"
import { composeWithDevTools } from "redux-devtools-extension"
import rootSaga from "./sagas"

const create = () => {
  const sagaMiddleware = createSagaMiddleware()
  const middleware = [sagaMiddleware]
  const enhancer = composeWithDevTools(applyMiddleware(...middleware))
  const store = createStore(rootReducer, enhancer)
  sagaMiddleware.run(rootSaga)
  return store
}

export default create
