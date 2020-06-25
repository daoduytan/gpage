import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from '@reach/router';

import { Loading } from '../components';

type GuestRouterProps = {
  component: any
};

const GuestRouter = ({ component: Component, ...rest }: GuestRouterProps) => {
  const { user, loading } = useSelector(({ authReducer }) => ({
    user: authReducer.user,
    loading: authReducer.loading
  }));

  if (loading) return <Loading />;

  if (user) return <Redirect to="/" noThrow />;

  return <Component {...rest} />;
};

const UserRouter = ({ component: Component, ...rest }: GuestRouterProps) => {
  const { user, loading } = useSelector(({ authReducer }) => ({
    user: authReducer.user,
    loading: authReducer.loading
  }));

  if (loading) return <Loading />;

  if (!user) return <Redirect to="/" noThrow />;

  return <Component {...rest} />;
};

const CustomerRouter = ({
  component: Component,
  ...rest
}: GuestRouterProps) => {
  const { user, loading } = useSelector(({ authReducer }) => ({
    user: authReducer.user,
    loading: authReducer.loading
  }));

  if (loading) return <Loading />;

  if (!user || (user && user.type !== 'customer'))
    return <Redirect to="/" noThrow />;

  if (typeof user.status === 'boolean' && !user.status) {
    return <Redirect to="/block" noThrow />;
  }

  return <Component {...rest} />;
};

const AdminRouter = ({ component: Component, ...rest }: GuestRouterProps) => {
  const { user, loading } = useSelector(({ authReducer }) => ({
    user: authReducer.user,
    loading: authReducer.loading
  }));

  if (loading) return <Loading />;

  if (!user || (user && user.type !== 'admin'))
    return <Redirect to="/admin-login" noThrow />;

  return <Component {...rest} />;
};

const GuestAdminRouter = ({
  component: Component,
  ...rest
}: GuestRouterProps) => {
  const { user, loading } = useSelector(({ authReducer }) => ({
    user: authReducer.user,
    loading: authReducer.loading
  }));

  if (loading) return <Loading />;

  if (user && user.type === 'admin')
    return <Redirect to="/admin/overview" noThrow />;

  return <Component {...rest} />;
};

export {
  GuestRouter,
  UserRouter,
  AdminRouter,
  GuestAdminRouter,
  CustomerRouter
};
