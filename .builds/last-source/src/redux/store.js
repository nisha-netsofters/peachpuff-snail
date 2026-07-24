// ** Redux Imports
import rootReducer from "./rootReducer";
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "@redux-saga/core";
import rootSaga from "./rootSaga";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { composeWithDevTools } from "redux-devtools-extension";
// import { logger } from 'redux-logger'
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore(
  {
    reducer: persistedReducer,
    middleware: [sagaMiddleware],
  },
  (process.env.REACT_APP_ENVIRONMENT === "DEVELOPMENT" ||
    process.env.REACT_APP_ENVIRONMENT === "LOCAL") &&
    composeWithDevTools()
);
sagaMiddleware.run(rootSaga);
export const persistor = persistStore(store);
