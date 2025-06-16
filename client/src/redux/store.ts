import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./user";
import organisationReducer from "./organisation";
import serviceReducer from "./service";
import memberReducer from "./member";
import incidentReducer from "./incident";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  organisation: organisationReducer,
  service: serviceReducer,
  member: memberReducer,
  incident: incidentReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // THIS IS THE CRUCIAL PART TO IGNORE THE REDUX-PERSIST ACTIONS
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PURGE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
