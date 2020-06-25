import React from 'react';
import ReactToPrint from 'react-to-print';
import { connect } from 'react-redux';
import { Button } from 'antd';

import ComponentToPrint from './ComponentToPrint';

type PrintOrderProps = {
  order: any,
  user: any,
  title?: string,
  disabled: boolean,
  onAfterPrint: void,
  setLoading: void
};

class PrintOrder extends React.Component<PrintOrderProps> {
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
    const { order, user, title, disabled } = this.props;

    console.log('PrintOrder', this.props);

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
        <ComponentToPrint
          ref={el => (this.componentRef = el)}
          order={order}
          user={user}
        />
      </>
    );
  }
}

PrintOrder.defaultProps = {
  title: null
};

const enhance = connect(({ authReducer }) => ({ user: authReducer.user }));

export default enhance(PrintOrder);
