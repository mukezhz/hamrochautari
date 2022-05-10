import { combineReducers } from '@reduxjs/toolkit';
import messagesReducer from './messages';

const rootReducer = combineReducers({
  messages: messagesReducer,
});

export default rootReducer;