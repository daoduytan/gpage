import React from 'react';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import vi_VN from 'antd/es/locale-provider/vi_VN';
import moment from 'moment';

import store from './store';
import AppRouter from './routes';

import 'moment/locale/vi';
import ErrorBoundary from './components/ErrorBoundary';

moment.locale('vi');

function App() {
  return (
    <ConfigProvider locale={vi_VN}>
      <Provider store={store}>
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </Provider>
    </ConfigProvider>
  );
}

export default App;
