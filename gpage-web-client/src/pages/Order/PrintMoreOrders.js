import React from 'react';
import ReactToPrint from 'react-to-print';
import { connect } from 'react-redux';
import { Button } from 'antd';

import ComponentToPrints from './ComponentToPrint';

type PrintMoreOrdersProps = {
  order: any,
  user: any,
  title?: string,
  disabled: boolean,
  onAfterPrint: void,
  setLoading: void
};

class PrintMoreOrders extends React.Component<PrintMoreOrdersProps> {
  onBeforePrint = () => {
    const { setLoading } = this.props;
    if (setLoading) {
      setLoading(false);
    }
  };

  onAfterPrint = () => {
    const { onAfterPrint, setLoading } = this.props;
    if (setLoading) {
      setLoading(false);
    }

    onAfterPrint();
  };

  render() {
    const { orders, user, title, disabled } = this.props;

    console.log('PrintMoreOrders', this.props);

    const label = title ? (
      <span onClick={this.onAfterPrint} role="presentation">
        {title}
      </span>
    ) : (
      <Button
        type="primary"
        icon="printer"
        disabled={disabled}
        onClick={this.onAfterPrint}
      >
        Lưu và In
      </Button>
    );

    return (
      <>
        <ReactToPrint
          onBeforePrint={this.onBeforePrint}
          onAfterPrint={this.onAfterPrint}
          onPrintError={() => console.log('onPrintError')}
          trigger={() => label}
          content={() => this.componentRef}
        />
        <ComponentToPrints
          ref={el => (this.componentRef = el)}
          orders={orders}
          user={user}
        />
      </>
    );
  }
}

PrintMoreOrders.defaultProps = {
  title: null
};

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }));

export default enhance(PrintMoreOrders);
