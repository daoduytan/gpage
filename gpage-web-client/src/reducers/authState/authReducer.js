import types from './authTypes';

const initialState = {
  loading: true,
  isAuth: false,
  user: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOADING:
      return { ...state, loading: true };

    case types.LOAD_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        isAuth: true
      };

    case types.LOGOUT:
    case types.LOAD_USER_FAILED:
      return { ...state, user: null, isAuth: false, loading: false };
    default:
      return state;
  }
};

export default authReducer;
