import { combineReducers } from 'redux';

import authReducer from '../reducers/authState/authReducer';
import facebookReducer from '../reducers/facebookState/facebookReducer';

export default combineReducers({
  authReducer,
  facebookReducer
});
