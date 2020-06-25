import React, { type Node } from 'react';
import { refs } from '../../api';

const initialState = {
  order: null,
  loading: true
};

const OrderContext = React.createContext(initialState);

const types = {
  LOADING: 'order/loading',
  LOAD_DONE: 'order/load_done'
};
const reducer = (state, action) => {
  switch (action.type) {
    case types.LOADING:
      return { ...state, loading: true };
    case types.LOAD_DONE:
      return { ...state, loading: false, order: action.payload };
    default:
      return state;
  }
};

type ProviderContextProps = { children: Node };

class ProviderContext extends React.Component<ProviderContextProps> {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      order: null,
      order_local: null
    };
  }

  render() {
    return (
      <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
    );
  }
}

const ProviderContext = ({ children }: ProviderContextProps) => {
  const [loading, setLoading] = React.useState(false);
  const [order, setOrder] = React.useState(null);
  const [order_local, setOrderLocal] = React.useState(order);

  const [state, dispatch] = React.useReducer(reducer);

  const value = React.useMemo(() => [state, dispatch], [state]);

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

const useOrder = ({ id }) => {
  const context = React.useContext(OrderContext);

  const [state, dispatch] = context;

  return {
    state,
    dispatch
  };
};

export { OrderContext, ProviderContext, useOrder };
