import React from 'react';

import ComponentToPrint from '../OrderDetail/ComponentToPrint';

// eslint-disable-next-line react/prefer-stateless-function
class ComponentToPrints extends React.Component {
  render() {
    const { orders, user } = this.props;
    return (
      <div style={{ display: 'flex' }}>
        {orders.map(order => (
          <ComponentToPrint order={order} user={user} />
        ))}
      </div>
    );
  }
}

export default ComponentToPrints;
