import React, { type Node } from 'react';

import { refs } from '../../api';

const initialState = {
  customers: [],
  loading: true
};

const types = {
  LOADING: 'customer/loading',
  LOAD_CUSTOMER_DONE: 'customer/load_donr'
};

const customersReducer = (state, action) => {
  switch (action.type) {
    case types.LOADING:
      return { ...state, loading: true };
    case types.LOAD_CUSTOMER_DONE:
      return { ...state, customers: action.payload, loading: false };
    default:
      return state;
  }
};

const CustomerContext = React.createContext();

const ProvicerCustomerContext = ({ children }: { children: Node }) => {
  const [state, dispatch] = React.useReducer(customersReducer, initialState);
  const value = React.useMemo(() => [state, dispatch], [state]);
  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};

const useCustomers = () => {
  const context = React.useContext(CustomerContext);
  const [state, dispatch] = context;

  console.log(state);
  const loadCustomers = async () => {
    dispatch({ type: types.LOADING });
    try {
      const res = await refs.usersRefs
        .where('type', '==', 'customer')
        .where('role', '==', 'admin')
        .get();

      console.log('res', res);

      const arrData = res.docs.map(doc => ({ ...doc.data(), key: doc.id }));
      dispatch({ type: types.LOAD_CUSTOMER_DONE, payload: arrData });
    } catch (error) {
      dispatch({ type: types.LOAD_CUSTOMER_DONE, payload: [] });
    }
  };

  return { state, dispatch, loadCustomers };
};

export { ProvicerCustomerContext, useCustomers };
