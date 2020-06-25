import React from 'react';
import { useSelector } from 'react-redux';
import { navigate } from '@reach/router';

import { Loading, ErrorBoundary } from '../../components';
import Header from '../SelectPages/Header';
import FormSetting from './FormSetting';

const CustomerSetting = () => {
  const { loading, user } = useSelector(({ authReducer }) => authReducer);
  const ref = React.useRef(false);

  React.useEffect(() => {
    ref.current = true;
    if (ref.current) {
      if (user && user.init && user.shop) {
        navigate('/customer/conversation');
      }
    }

    return () => {
      ref.current = false;
    };
  }, [user]);

  if (loading) return <Loading />;

  const renderContent = () => {
    if (user && user.type === 'customer' && user.role === 'admin') {
      return <FormSetting />;
    }

    return <ErrorBoundary />;
  };
  return (
    <div>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 100px' }}>{renderContent()}</div>
    </div>
  );
};

export default CustomerSetting;
