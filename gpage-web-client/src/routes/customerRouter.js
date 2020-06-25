import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from '@reach/router';

import { Loading } from '../components';

type CustomerAdminRouterProps = {
  component: any
};

const NoAdminRole = () => (
  <div
    style={{
      display: 'flex',
      minHeight: 'calc(100vh - 50px',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <div style={{ textAlign: 'center' }}>
      <h2
        style={{ fontSize: 80, color: 'red', fontWeight: 700, marginBottom: 0 }}
      >
        404
      </h2>
      <p style={{ fontSize: 18 }}>Bạn không được phép truy cập trang này</p>
    </div>
  </div>
);

const CustomerAdminRouter = ({
  component: Component,
  ...rest
}: CustomerAdminRouterProps) => {
  const { user, loading } = useSelector(({ authReducer }) => ({
    user: authReducer.user,
    loading: authReducer.loading
  }));

  if (loading) return <Loading />;

  if (!user) return <Redirect to="/" noThrow />;

  if (user.type === 'customer' && user.role !== 'admin') return <NoAdminRole />;

  return <Component {...rest} />;
};

// eslint-disable-next-line import/prefer-default-export
export { CustomerAdminRouter };
