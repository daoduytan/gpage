import React from 'react';
import { Redirect } from '@reach/router';
import { useSelector } from 'react-redux';

import ListPages from './ListPages';
import { Loading, ErrorBoundary, Scrollbars } from '../../components';

const SelectPages = () => {
  const { loading, user } = useSelector(({ authReducer }) => authReducer);

  if (loading) return <Loading />;

  if ((user && typeof user.init === 'undefined') || !user.init) {
    return <Redirect to="/setting-shop" noThrow />;
  }

  const renderContent = () => {
    if (user && user.type === 'customer' && user.role === 'admin') {
      return <ListPages />;
    }

    return <ErrorBoundary />;
  };

  const height = 'calc(100vh - 50px)';

  return <Scrollbars style={{ height }}>{renderContent()}</Scrollbars>;
};

export default SelectPages;
