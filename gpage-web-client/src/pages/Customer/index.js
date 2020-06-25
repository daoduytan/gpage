// @flow
import React, { type Node } from 'react';
import { navigate } from '@reach/router';
import { connect } from 'react-redux';
import { Card } from 'antd';

import { refs } from '../../api';
import { CustomerLayout } from '../../layout';
import { Loading } from '../../components';
import * as actions from '../../reducers/authState/authActions';

// import defaultLabels from './defaultLabels';
import { WrapCustomer } from './style';
import { ProviderNotificationContext } from './context';
import ProviderContextLabel from './context_labels';
import ProviderContextStore from './context_store';
import ProviderContextSuppliers from './context_suppliers';

type CustomerProps = {
  children: Node,

  user: {
    shop: any,
    type: string,
    role: string,
    shift: any,
    init: boolean,
    shopId: string,
    facebookPages: any,
    licence: {
      type: string,
      date_active: number,
      time: number,
      start_date: number
    }
  },
  loadUserDone: any
};

type CustomerState = {
  loading: boolean,
  expired: boolean
};

class Customer extends React.Component<CustomerProps, CustomerState> {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      expired: false
    };
  }

  componentDidMount() {
    const { user } = this.props;
    if (user) {
      const { init, facebookPages, licence, shop } = user;

      const { type, time, start_date } = licence;
      const now_time = Date.now();

      // console.log('type, date_active, time', type, date_active, time, start_date);
      if (!type || type === 'premium' || type === 'trial') {
        if (!start_date) {
          const new_licence = { ...user.licence, start_date: now_time };

          refs.usersRefs
            .doc(user.shopId)
            .update({ licence: new_licence })
            .then(() => {
              this.setState({ loading: false });
            });
        } else {
          const time_expired = time ? time * 24 * 60 * 60 * 1000 : 0;

          const time_date = start_date ? start_date + time_expired : 0;

          const number = time_date - now_time;

          if (number <= 0) {
            navigate('/customer/expired');
            this.setState({ expired: true, loading: false });
          } else {
            this.setState({ loading: false });
          }
        }
      } else {
        this.setState({ loading: false });
      }

      // add check exprired

      // end add check exprired

      if (!init || !shop) {
        navigate('/setting-shop');
      } else if (!facebookPages || facebookPages.length === 0) {
        this.setState({ loading: false });
        navigate('/customer/select-pages');
      }
    } else {
      this.setState({ loading: false });
    }
  }

  addNewMessage = () => {
    this.setState(prevState => ({ new_messages: prevState.new_messages + 1 }));
  };

  renderContent = () => {
    const { children, user } = this.props;
    const { expired } = this.state;
    const { init } = user;

    if (!init) {
      return <div>setting shop</div>;
    }

    if (expired)
      return (
        <div style={{ margin: 30 }}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: 30, fontWeight: 700, color: 'red' }}>
                Dịch hết hạn sử dụng
              </h3>
              <p>
                Gói dịch vụ bạn đã hết hạn sử dụng. Vui lòng liên hệ để được tư
                vấn và gia hạn dịch vụ
              </p>
            </div>
          </Card>
        </div>
      );

    if (
      user &&
      user.type === 'customer' &&
      user.role === 'member' &&
      (!user.shifts || user.shifts.length === 0)
    ) {
      return (
        <div style={{ margin: 30 }}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: 30, fontWeight: 700, color: 'red' }}>
                Nhân viên chưa được phân ca.
              </h3>
              <p>
                Bạn chưa được phân ca. Liên hệ với chủ shop để được phân ca
                trực.
              </p>
            </div>
          </Card>
        </div>
      );
    }
    return <WrapCustomer>{children}</WrapCustomer>;
  };

  render() {
    const { loading } = this.state;

    if (loading) return <Loading />;

    return (
      <ProviderNotificationContext>
        <ProviderContextStore>
          <ProviderContextSuppliers>
            <ProviderContextLabel>
              <CustomerLayout>{this.renderContent()}</CustomerLayout>
            </ProviderContextLabel>
          </ProviderContextSuppliers>
        </ProviderContextStore>
      </ProviderNotificationContext>
    );
  }
}

const enhance = connect(
  ({ authReducer }) => ({
    user: authReducer.user,
    loading: authReducer.loading
  }),
  { loadUserDone: actions.loadUserDone }
);

export default enhance(Customer);
