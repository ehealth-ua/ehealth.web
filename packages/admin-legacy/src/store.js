import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import multiMiddleware from "redux-multi";
import promiseMiddleware from "redux-promise";
import { apiMiddleware } from "redux-api-middleware";
import { browserHistory } from "react-router";
import { routerMiddleware } from "react-router-redux";
import thunkMiddleware from "redux-thunk";

import rootReducer from "./reducers";

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(
      multiMiddleware,
      promiseMiddleware,
      apiMiddleware,
      routerMiddleware(browserHistory),
      thunkMiddleware
    )
  )
);

export default store;
