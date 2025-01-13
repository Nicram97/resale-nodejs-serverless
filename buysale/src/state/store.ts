import {configureStore} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import {***REMOVED***Reducer} from './reducers';

export const store = configureStore({
  reducer: ***REMOVED***Reducer,
  middleware: [thunk, logger],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
